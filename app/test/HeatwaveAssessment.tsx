"use client";

import React, { useState, useEffect } from "react";
import { Prisma } from "@/prisma/generated/prisma/client";
import { saveAssessment } from "app/actions/submit-assessment";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import {
  ShieldCheck,
  AlertTriangle,
  ThermometerSun,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

// Ensure type definitions align accurately with our database joins
type QuestionWithOptions = Prisma.QuestionGetPayload<{
  include: { options: true };
}>;

type SelectedOptionSummary = {
  id: string;
  label: string;
  score: number;
};

type AnswerState = {
  questionId: string;
  questionSlug: string;
  value: any; // Mapped directly to Json in Prisma
  selectedOptions: SelectedOptionSummary[];
  points: number;
};

export default function HeatwaveAssessment({
  questions,
}: {
  questions: QuestionWithOptions[];
}) {
  // QUEUE & FLOW MANAGEMENT
  const [visibleQueue, setVisibleQueue] = useState<QuestionWithOptions[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionWithOptions | null>(null);
  const [history, setHistory] = useState<QuestionWithOptions[]>([]);
  const [processedCount, setProcessedCount] = useState(0);

  // ASSESSMENT STATES
  const [userAnswers, setUserAnswers] = useState<AnswerState[]>([]);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // INPUT BUFFERS FOR STEP LIFECYCLES
  const [textInput, setTextInput] = useState("");
  const [checkedOptions, setCheckedOptions] = useState<Prisma.OptionGetPayload<{}>[]>([]);

  // INITIALIZE ROOT FLOW
  useEffect(() => {
    if (questions.length > 0) {
      const baseQuestions = questions.filter((q) => !q.isFollowup && q.isActive);
      // Sort base questions cleanly by order sequence
      baseQuestions.sort((a, b) => a.order - b.order);
      
      setVisibleQueue(baseQuestions);
      setCurrentQuestion(baseQuestions[0] || null);
    }
  }, [questions]);

  // HELPER FOR POST-SUBMIT EXTRACTIONS
  const getAnswerValueBySlug = (answers: AnswerState[], slug: string): string => {
    const matched = answers.find((ans) => ans.questionSlug === slug);
    if (!matched) return "Unknown";
    if (typeof matched.value === "object" && Array.isArray(matched.value)) {
      return matched.value.join(", ");
    }
    return String(matched.value);
  };

  const handleNext = async (
    type: "RADIO" | "CHECKBOX" | "TEXT" | "NUMBER",
    payload?: { option?: any; selectedList?: any[]; primitiveValue?: string | number }
  ) => {
    if (isSaving || !currentQuestion) return;

    let finalValue: any = null;
    let selectedOptionsToSave: SelectedOptionSummary[] = [];
    let questionPoints = 0;
    let followUpSlugsToInject: string[] = [];

    // 1. CONDITIONAL EVALUATION BASED ON CURRENT INPUT TYPE
    if (type === "RADIO" && payload?.option) {
      const opt = payload.option;
      finalValue = opt.label;
      selectedOptionsToSave = [{ id: opt.id, label: opt.label, score: opt.score }];
      questionPoints = opt.score * currentQuestion.weight;
      if (opt.followup && opt.followup.length > 0) {
        followUpSlugsToInject = opt.followup;
      }
    } 
    else if (type === "CHECKBOX") {
      if (checkedOptions.length === 0) return; // Prevent empty progressions on required options
      finalValue = checkedOptions.map((o) => o.label);
      selectedOptionsToSave = checkedOptions.map((o) => ({
        id: o.id,
        label: o.label,
        score: o.score,
      }));
      questionPoints = checkedOptions.reduce((acc, curr) => acc + curr.score, 0) * currentQuestion.weight;
      
      // Collect collective follow-up dependencies across multiple checks
      checkedOptions.forEach((opt) => {
        if (opt.followup) followUpSlugsToInject.push(...opt.followup);
      });
    } 
    else if (type === "TEXT" || type === "NUMBER") {
      const entry = payload?.primitiveValue ?? textInput;
      if (!entry.trim()) return;
      finalValue = type === "NUMBER" ? Number(entry) : entry;
      // Plain textual responses don't yield predefined relation point mappings
      selectedOptionsToSave = [];
      questionPoints = 0; 
    }

    // 2. CONSTRUCT NEW HISTORICAL ANSWER STATE
    const newAnswer: AnswerState = {
      questionId: currentQuestion.id,
      questionSlug: currentQuestion.slug,
      value: finalValue,
      selectedOptions: selectedOptionsToSave,
      points: questionPoints,
    };

    const updatedAnswers = [...userAnswers, newAnswer];
    const updatedScore = score + questionPoints;

    setScore(updatedScore);
    setUserAnswers(updatedAnswers);

    // 3. FLUSH TEMPORARY BUFFERS
    setTextInput("");
    setCheckedOptions([]);

    // 4. QUEUE PROGRESSION & DYNAMIC FOLLOW-UP INJECTIONS
    let updatedQueue = [...visibleQueue];
    // Remove the current node we just resolved
    updatedQueue.shift();

    if (followUpSlugsToInject.length > 0) {
      // Fetch entire target records matching target relational conditional slugs
      const followUpQuestions = questions.filter(
        (q) => followUpSlugsToInject.includes(q.slug) && q.isActive
      );
      
      // Avoid injecting duplicate tasks if they are currently inside active structures
      const filteredFollowUps = followUpQuestions.filter(
        (fq) => !updatedQueue.some((q) => q.id === fq.id)
      );

      // Prepend dependencies immediately into our processing line
      updatedQueue = [...filteredFollowUps, ...updatedQueue];
    }

    setHistory([...history, currentQuestion]);
    setProcessedCount((prev) => prev + 1);
    setVisibleQueue(updatedQueue);

    if (updatedQueue.length > 0) {
      setCurrentQuestion(updatedQueue[0]);
    } else {
      // 5. FINALIZE & SYNC DATA CONTEXTS OVER DATABASE ACTIONS
      setIsSaving(true);
      setIsFinished(true);
      const risk = getRiskLevelForScore(updatedScore);

      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const visitorId = result.visitorId;

        await saveAssessment({
          postcode: getAnswerValueBySlug(updatedAnswers, "postcode"),
          ageGroup: getAnswerValueBySlug(updatedAnswers, "age-group"),
          gender: getAnswerValueBySlug(updatedAnswers, "gender") || "Prefer not to say",
          totalScore: updatedScore,
          riskLevel: risk.label,
          fingerprint: visitorId,
          // Re-mapped structural answers perfectly nested for your save actions
          selections: updatedAnswers, 
        });
      } catch (err) {
        console.error("Failed to securely save submission summary:", err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const renderInput = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case "TEXT":
      case "NUMBER":
        return (
          <div className="space-y-4">
            <input
              type={currentQuestion.type === "NUMBER" ? "number" : "text"}
              className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-orange-500 outline-none text-xl text-slate-800"
              placeholder="Enter details..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleNext(currentQuestion.type as "TEXT" | "NUMBER", { primitiveValue: textInput });
                }
              }}
            />
            <button
              onClick={() => handleNext(currentQuestion.type as "TEXT" | "NUMBER", { primitiveValue: textInput })}
              disabled={!textInput.trim()}
              className="w-full martial-gradient py-4 bg-orange-600 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all"
            >
              Continue
            </button>
          </div>
        );

      case "CHECKBOX":
        return (
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((opt) => {
              const isChecked = checkedOptions.some((o) => o.id === opt.id);
              return (
                <label
                  key={opt.id}
                  className={`flex items-center gap-3 p-4 bg-slate-50 rounded-xl border-2 transition-all cursor-pointer ${
                    isChecked ? "border-orange-500 bg-orange-50/30" : "border-transparent"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-orange-600 rounded"
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCheckedOptions([...checkedOptions, opt]);
                      } else {
                        setCheckedOptions(checkedOptions.filter((o) => o.id !== opt.id));
                      }
                    }}
                  />
                  {opt.icon && <span className="text-3xl">{opt.icon}</span>}
                  <span className="text-lg font-medium text-slate-700">{opt.label}</span>
                </label>
              );
            })}
            <button
              onClick={() => handleNext("CHECKBOX")}
              disabled={checkedOptions.length === 0}
              className="mt-4 w-full py-4 bg-orange-600 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all"
            >
              Next Step
            </button>
          </div>
        );

      default: // "RADIO"
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleNext("RADIO", { option })}
                className="flex items-center gap-4 p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl hover:border-orange-500 hover:bg-white transition-all text-left group"
              >
                {option.icon && <span className="text-3xl group-hover:scale-110 transition-transform">{option.icon}</span>}
                <span className="text-xl font-bold text-slate-800">{option.label}</span>
              </button>
            ))}
          </div>
        );
    }
  };

  const resetAssessment = () => {
    const baseQuestions = questions.filter((q) => !q.isFollowup && q.isActive);
    baseQuestions.sort((a, b) => a.order - b.order);

    setVisibleQueue(baseQuestions);
    setCurrentQuestion(baseQuestions[0] || null);
    setHistory([]);
    setProcessedCount(0);
    setUserAnswers([]);
    setScore(0);
    setIsFinished(false);
    setIsSaving(false);
  };

  const getRiskLevelForScore = (currentScore: number) => {
    if (currentScore >= 60)
      return {
        label: "High Risk",
        color: "text-red-600",
        bg: "bg-red-50",
        icon: <AlertTriangle className="w-8 h-8" />,
      };
    if (currentScore >= 30)
      return {
        label: "Moderate Risk",
        color: "text-orange-600",
        bg: "bg-orange-50",
        icon: <ThermometerSun className="w-8 h-8" />,
      };
    return {
      label: "Low Risk",
      color: "text-green-600",
      bg: "bg-green-50",
      icon: <ShieldCheck className="w-8 h-8" />,
    };
  };

  // ESTIMATED PROGRESSION RATE METRICS
  const totalEstimatedSteps = Math.max(questions.filter(q => !q.isFollowup).length, processedCount + visibleQueue.length);
  const percentComplete = Math.min(Math.round((processedCount / totalEstimatedSteps) * 100), 100);

  if (isFinished) {
    const risk = getRiskLevelForScore(score);
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${risk.bg} ${risk.color}`}>
          {risk.icon}
          <span className="font-bold uppercase tracking-wider">{risk.label}</span>
        </div>

        <h2 className="text-4xl font-black text-slate-900 mb-4">Your Assessment Result</h2>
        <p className="text-slate-600 text-lg mb-8">
          Your calculated vulnerability score is <span className="font-bold text-slate-900">{score}</span>.
          {score > 50
            ? " We strongly recommend reviewing your heatwave plan with a medical professional."
            : " You have a good foundation, but staying informed is key."}
        </p>

        <div className="space-y-4 mb-8">
          <h3 className="font-bold text-slate-800">Recommended Actions:</h3>
          <ul className="space-y-3">
            {[
              "Identify your nearest Cooling Centre on our map.",
              "Prepare an emergency kit with hydration salts and battery-powered fans.",
              "Set up a 'Heat-Buddy' check-in system with a neighbor.",
            ].map((action, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                {action}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={resetAssessment}
          disabled={isSaving}
          className="flex items-center gap-2 text-slate-500 hover:text-orange-600 font-medium transition-colors disabled:opacity-55"
        >
          <RefreshCw className="w-4 h-4" /> Retake Assessment
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <section className="max-w-3xl mx-auto p-6 md:p-12 bg-white rounded-3xl shadow-2xl border border-slate-100">
      {/* Header & Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-orange-600 font-bold text-sm uppercase tracking-widest">
              Question {processedCount + 1}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">{currentQuestion.category}</h1>
          </div>
          <span className="text-slate-400 font-medium">{percentComplete}% Complete</span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500 ease-out"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {/* Active Question Card View */}
      <div key={currentQuestion.id} className="animate-in fade-in slide-in-from-right-8 duration-500">
        <h2 className="text-3xl font-bold text-slate-800 mb-8 leading-tight">{currentQuestion.text}</h2>
        {renderInput()}
      </div>

      <p className="mt-12 text-sm text-slate-400 italic text-center">
        Responses may be stored securely to support heatwave research and improve public vulnerability systems.
      </p>
    </section>
  );
}