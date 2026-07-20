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
import TextInputQuestion from "./TextInputQuestion";
import CheckboxGroupQuestion from "./CheckboxQuestion";
import RadioGroupQuestion from "./RadioQuestion";

// Ensure type definitions align accurately with our database joins
type QuestionWithOptions = Prisma.QuestionGetPayload<{
  include: { options: true };
}>;

type SelectedOptionSummary = {
  id: string;
  label: string;
  score: number;
};

type AnswersMap = Record<string, string | string[]>

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
  const [answersMap, setAnswersMap] = useState<AnswersMap>({});
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);
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

  const handleNext = async (
    type: "RADIO" | "CHECKBOX" | "TEXT" | "NUMBER",
    payload?: { option?: any; selectedList?: any[]; primitiveValue?: string | number }
  ) => {
    if (isSaving || !currentQuestion) return;

    // ✅ Change type to only string | string[]
    let finalValue: string | string[] = "";
    let questionPoints = 0;
    let followUpSlugsToInject: string[] = [];

    // 1. CONDITIONAL EVALUATION
    if (type === "RADIO" && payload?.option) {
      const opt = payload.option;
      finalValue = [opt.slug]; // Wrap as an array to indicate pre-defined selection.
      questionPoints = opt.score * currentQuestion.weight;
      if (opt.followup?.length) followUpSlugsToInject = opt.followup;
    } 
    else if (type === "CHECKBOX") {
      // Extract the list directly from the incoming payload parameters
      const selectedList = payload?.selectedList;
      
      // Guard clause against empty lists using the payload data
      if (!selectedList || selectedList.length === 0) return; 
      
      finalValue = selectedList.map((o) => o.slug);
      questionPoints = selectedList.reduce((acc, curr) => acc + curr.score, 0) * currentQuestion.weight;
      
      selectedList.forEach((opt) => {
        if (opt.followup) followUpSlugsToInject.push(...opt.followup);
      });
    } 
    else if (type === "TEXT" || type === "NUMBER") {
      const entry = payload?.primitiveValue ?? textInput;
      if (!entry.toString().trim()) return;
      finalValue = String(entry); // ✅ Always string
      questionPoints = 0;
    }

    // 2. UPDATE ANSWERS MAP
    const newAnswerEntry = { [currentQuestion.slug]: finalValue };
    const updatedAnswersMap = { ...answersMap, ...newAnswerEntry };

    setAnswersMap(updatedAnswersMap);

    // 3. FLUSH BUFFERS
    setTextInput("");
    setCheckedOptions([]);

    // 4. QUEUE PROGRESSION
    let updatedQueue = [...visibleQueue];
    updatedQueue.shift();

    if (followUpSlugsToInject.length > 0) {
      const followUpQuestions = questions.filter(
        (q) => followUpSlugsToInject.includes(q.slug) && q.isActive
      );
      const filteredFollowUps = followUpQuestions.filter(
        (fq) => !updatedQueue.some((q) => q.id === fq.id)
      );
      updatedQueue = [...filteredFollowUps, ...updatedQueue];
    }

    setHistory([...history, currentQuestion]);
    setProcessedCount((prev) => prev + 1);
    setVisibleQueue(updatedQueue);

    if (updatedQueue.length > 0) {
      setCurrentQuestion(updatedQueue[0]);
    } else {
      setIsSaving(true);
      setIsFinished(true);

      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const visitorId = result.visitorId;
        type GenderType = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
        const rawPostcode = updatedAnswersMap["postcode"];
        const rawAgeGroup = updatedAnswersMap["age-group"];
        const rawGender = updatedAnswersMap["gender"];
        const { success, id, error, score  } = await saveAssessment({
          postcode: Array.isArray(rawPostcode) ? rawPostcode[0] : (rawPostcode || ""),
          ageGroup: Array.isArray(rawAgeGroup) ? rawAgeGroup[0] : (rawAgeGroup || ""),
          gender: (Array.isArray(rawGender) ? rawGender[0] : rawGender) as GenderType || "PREFER_NOT_TO_SAY",
          fingerprint: visitorId,
          answers: updatedAnswersMap,
        });
        setCalculatedScore(score ? parseFloat(score) : null);
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
        <TextInputQuestion
          key={currentQuestion.id}
          type={currentQuestion.type as "TEXT" | "NUMBER"}
          onSubmit={(val) =>
            handleNext(currentQuestion.type as "TEXT" | "NUMBER", { primitiveValue: val })
          }
        />
      );

    case "CHECKBOX":
      return (
        <CheckboxGroupQuestion
          questionId={currentQuestion.id}
          options={currentQuestion.options}
          onSubmit={(selectedList) => handleNext("CHECKBOX", { selectedList })}
        />
      );

    default: // "RADIO"
      return (
        <RadioGroupQuestion
          options={currentQuestion.options}
          onSelect={(option) => handleNext("RADIO", { option })}
        />
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
    setAnswersMap({});
    setCalculatedScore(null);
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
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6`}>
          <span className="font-bold uppercase tracking-wider"> RISK LABEL </span>
        </div>

        <h2 className="text-4xl font-black text-slate-900 mb-4">Your Assessment Result</h2>
        <p className="text-slate-600 text-lg mb-8">
          Your calculated vulnerability score is <span className="font-bold text-slate-900">{calculatedScore}</span>.
          {calculatedScore !== null && calculatedScore > 50
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