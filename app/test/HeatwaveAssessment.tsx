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

type AnswersMap = Record<string, any>;

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
    payload?: { 
      option?: any; 
      specifyText?: string;
      selectedList?: any[]; 
      primitiveValue?: string | number 
    }
  ) => {
    if (isSaving || !currentQuestion) return;

    let finalValue: any = null;
    let questionPoints = 0;
    let followUpSlugsToInject: string[] = [];

    // 1. CONDITIONAL EVALUATION
    if (type === "RADIO" && payload?.option) {
      const opt = payload.option;
      finalValue = {
        selected: [opt.slug], // Wrap as an array to indicate pre-defined selection.
        specifiedText: payload.specifyText || null,
      }; 
      questionPoints = opt.score * currentQuestion.weight;
      if (opt.followup?.length) followUpSlugsToInject = opt.followup;
    } 
    else if (type === "CHECKBOX") {
      // Extract the list directly from the incoming payload parameters
      const selectedList = payload?.selectedList;
      
      // Guard clause against empty lists using the payload data
      if (!selectedList || selectedList.length === 0) return; 
      
      finalValue = {
        selected: selectedList.map((o) => o.slug),
        specifiedText: payload.specifyText || null,
      };
      questionPoints = selectedList.reduce((acc, curr) => acc + curr.score, 0) * currentQuestion.weight;
      
      selectedList.forEach((opt) => {
        if (opt.followup) followUpSlugsToInject.push(...opt.followup);
      });
    } 
    else if (type === "TEXT" || type === "NUMBER") {
          const entry = payload?.primitiveValue ?? textInput;
          if (!entry.toString().trim()) return;
          finalValue = { selected: [], specifiedText: String(entry) };
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

                // Helper to extract a string value from any answer format
                const extractString = (val: any): string => {
                                  if (typeof val === "string") return val;
                                  if (Array.isArray(val) && val.length > 0) return val[0];
                                  if (typeof val === "object" && val !== null && "selected" in val) return val.selected[0] || val.specifiedText || "";
                                  return "";
                                };

                const { success, id, error, score  } = await saveAssessment({
                  postcode: extractString(rawPostcode),
                  ageGroup: extractString(rawAgeGroup),
                  gender: (extractString(rawGender) || "PREFER_NOT_TO_SAY") as GenderType,
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
          onSubmit={(selectedList, specifyText) => handleNext("CHECKBOX", { selectedList, specifyText })}
        />
      );

    default: // "RADIO"
      return (
                <RadioGroupQuestion
          options={currentQuestion.options}
          onSelect={(option, specifyText) => handleNext("RADIO", { option, specifyText })}
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
        label: "High risk",
        color: "text-brand-midnight",
        bg: "bg-brand-coral/25",
        icon: <AlertTriangle className="w-8 h-8" />,
      };
    if (currentScore >= 30)
      return {
        label: "Moderate risk",
        color: "text-brand-midnight",
        bg: "bg-brand-golden/40",
        icon: <ThermometerSun className="w-8 h-8" />,
      };
    return {
      label: "Low risk",
      color: "text-brand-midnight",
      bg: "bg-brand-turquoise/30",
      icon: <ShieldCheck className="w-8 h-8" />,
    };
  };

  // ESTIMATED PROGRESSION RATE METRICS
  const totalEstimatedSteps = Math.max(questions.filter(q => !q.isFollowup).length, processedCount + visibleQueue.length);
  const percentComplete = Math.min(Math.round((processedCount / totalEstimatedSteps) * 100), 100);

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-brand-midnight/10 animate-in fade-in zoom-in duration-500">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6`}>
          <span className="font-bold tracking-wider"> Risk label </span>
        </div>

        <h2 className="text-heading text-brand-midnight mb-4">Your assessment result</h2>
        <p className="text-brand-midnight/80 text-lg mb-8">
          Your calculated vulnerability score is <span className="font-bold text-brand-midnight">{calculatedScore ?? "LOADING"}</span>.
          {calculatedScore !== null && calculatedScore > 50
            ? " We strongly recommend reviewing your heatwave plan with a medical professional."
            : " You have a good foundation, but staying informed is key."}
        </p>

        <div className="space-y-4 mb-8">
          <h3 className="font-bold text-brand-midnight">Recommended actions:</h3>
          <ul className="space-y-3">
            {[
              "Identify your nearest cooling centre on our map.",
              "Prepare an emergency kit with hydration salts and battery-powered fans.",
              "Set up a 'Heat-Buddy' check-in system with a neighbour.",
            ].map((action, i) => (
              <li key={i} className="flex items-start gap-3 text-brand-midnight/80">
                <CheckCircle2 className="w-5 h-5 text-brand-denim mt-1 flex-shrink-0" />
                {action}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={resetAssessment}
          disabled={isSaving}
          className="flex items-center gap-2 text-brand-midnight/70 hover:text-brand-coral font-medium transition-colors disabled:opacity-55"
        >
          <RefreshCw className="w-4 h-4" /> Retake assessment
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <section className="max-w-3xl mx-auto p-6 md:p-12 bg-white rounded-3xl shadow-2xl border border-brand-midnight/10">
      {/* Header & Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-label font-bold tracking-widest text-brand-coral">
              Question {processedCount + 1}
            </span>
            <h1 className="text-2xl font-bold text-brand-midnight">{currentQuestion.category}</h1>
          </div>
          <span className="text-brand-midnight/60 font-bold">{percentComplete}% complete</span>
        </div>
        <div className="h-3 w-full bg-brand-midnight/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-golden to-brand-coral transition-all duration-500 ease-out"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {/* Active Question Card View */}
      <div key={currentQuestion.id} className="animate-in fade-in slide-in-from-right-8 duration-500">
        <h2 className="text-3xl font-bold text-brand-midnight mb-8 leading-tight">{currentQuestion.text}</h2>
        {renderInput()}
      </div>

      <p className="mt-12 text-sm text-brand-midnight/60 italic text-center">
        Responses may be stored securely to support heatwave research and improve public vulnerability systems.
      </p>
    </section>
  );
}