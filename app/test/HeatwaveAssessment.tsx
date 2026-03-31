"use client";
/* PROTO HEATWAVE questions
Are you affected by heat test
Post code (that you spent the most time in last week)
A bit about you – gender, age
Do you identify with any of these? over +65, history of kidney/cardiac disease, indigenous, homeless
Are you experiencing any of these symptoms of heat related illness – extreme thirst, dizziness, light headedness, fainting collapsing, feeling confused, muscle twitching or cramping , lack of coordination/difficulty moving, racing heart beat


How are you managing your heat related...
How did you manage your symptoms – stopped or reduced activity , removed clothing, drank more fluids, stayed inside/sought shade, had a shower or bath, went for a swim, sprayed splashed with water, turned on fan, turned on air conditioning , found a cooler location, other
How did you seek to manage symptoms, pharmacy, medical centre of hospital , other
Where you absent from work – how many days 
*/
import React, { useState, useEffect } from "react";
import { Question } from "@/prisma/generated/prisma/client";
import { saveAssessment } from "app/actions/submit-assessment";
import {
  ShieldCheck,
  AlertTriangle,
  ThermometerSun,
  Home,
  Users,
  RefreshCw,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Prisma } from "@/prisma/generated/prisma/client";
type QuestionWithOptions = Prisma.QuestionGetPayload<{
  include: { options: true };
}>;
export default function HeatwaveAssessment({
  questions,
}: {
  questions: QuestionWithOptions[];
}) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  // Track multi-select values or text inputs locally before "Next"
  const [tempInput, setTempInput] = useState<string[]>([]);
  const [userSelections, setUserSelections] = useState<
    { questionId: string; optionLabel: string; points: number }[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);
  const totalSteps = questions.length;
  const currentQuestion = questions[step];
  const getAnswerByQuestionSlug = (
    selections: { questionId: string; optionLabel: string; points: number }[],
    slug: string,
  ) => {
    const question = questions.find((q) => q.slug === slug);
    if (!question) return undefined;
    return selections.find((selection) => selection.questionId === question.id)
      ?.optionLabel;
  };

  const handleNext = async (finalValue?: string, points: number = 0) => {
    if (isSaving) return;

    const valueToSave = finalValue || tempInput.join(", ");
    
    const newSelection = {
      questionId: currentQuestion.id,
      optionLabel: valueToSave,
      points: points,
    };

    const updatedSelections = [...userSelections, newSelection];
    const updatedScore = score + points;

    setUserSelections(updatedSelections);
    setScore(updatedScore);
    setTempInput([]); // Reset for next question

    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      setIsSaving(true);
      setIsFinished(true);

      const risk = getRiskLevelForScore(updatedScore);

      try {
        await saveAssessment({
          postcode: getAnswerByQuestionSlug(updatedSelections, "postcode") ?? "Unknown",
          ageGroup: getAnswerByQuestionSlug(updatedSelections, "age-group") ?? "Unknown",
          gender:
            getAnswerByQuestionSlug(updatedSelections, "gender") ??
            "Prefer not to say",
          totalScore: updatedScore,
          riskLevel: risk.label,
          selections: updatedSelections,
        });
      } catch (err) {
        console.error("Failed to save assessment:", err);
      } finally {
        setIsSaving(false);
      }
    }
  };
const renderInput = () => {
    switch (currentQuestion.type) {
      case "TEXT":
      case "NUMBER":
        return (
          <div className="space-y-4">
            <input 
              type={currentQuestion.type === "NUMBER" ? "number" : "text"}
              className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-orange-500 outline-none text-xl"
              placeholder="Enter details..."
              onChange={(e) => setTempInput([e.target.value])}
            />
            <button 
              onClick={() => handleNext(tempInput[0])}
              className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold"
            >
              Continue
            </button>
          </div>
        );

      case "CHECKBOX":
        return (
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((opt: any) => (
              <label key={opt.id} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border-2 border-transparent has-[:checked]:border-orange-500 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 accent-orange-600"
                  onChange={(e) => {
                    if(e.target.checked) setTempInput([...tempInput, opt.label]);
                    else setTempInput(tempInput.filter(t => t !== opt.label));
                  }}
                />
                <span className="text-3xl">{opt.icon}</span>
                <span className="text-lg font-medium">{opt.label}</span>
              </label>
            ))}
            <button 
              onClick={() => handleNext()}
              className="mt-4 w-full py-4 bg-orange-600 text-white rounded-xl font-bold"
            >
              Next Step
            </button>
          </div>
        );

      default: // RADIO (Your original logic)
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option: any) => (
              <button
                key={option.label}
                onClick={() => handleNext(option.label, option.score)}
                className="flex items-center gap-4 p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl hover:border-orange-500 hover:bg-white transition-all text-left"
              ><span className="text-3xl">{option.icon}</span>
                <span className="text-xl font-bold">{option.label}</span>
              </button>
            ))}
          </div>
        );
    }
  };
  const resetAssessment = () => {
    setStep(0);
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

  if (isFinished) {
    const risk = getRiskLevelForScore(score);
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${risk.bg} ${risk.color}`}
        >
          {risk.icon}
          <span className="font-bold uppercase tracking-wider">
            {risk.label}
          </span>
        </div>

        <h2 className="text-4xl font-black text-slate-900 mb-4">
          Your Assessment Result
        </h2>
        <p className="text-slate-600 text-lg mb-8">
          Your calculated vulnerability score is{" "}
          <span className="font-bold text-slate-900">{score}</span>.
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
          className="flex items-center gap-2 text-slate-500 hover:text-orange-600 font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Retake Assessment
        </button>
      </div>
    );
  }

  return (
    <section className="max-w-3xl mx-auto p-6 md:p-12 bg-white rounded-3xl shadow-2xl border border-slate-100">
      {/* Header & Progress */}
      <div className="mb-10">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-orange-600 font-bold text-sm uppercase tracking-widest">
              Step {step + 1} of {totalSteps}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {currentQuestion.category}
            </h1>
          </div>
          <span className="text-slate-400 font-medium">
            {Math.round((step / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div
        key={step}
        className="animate-in fade-in slide-in-from-right-8 duration-500"
      >
        <h2 className="text-3xl font-bold text-slate-800 mb-8 leading-tight">
          {currentQuestion.text}
        </h2>

        {renderInput()}
      </div>

      <p className="mt-12 text-sm text-slate-400 italic text-center">
        Responses may be stored securely to support heatwave research and
        improve this assessment.
      </p>
    </section>
  );
}
