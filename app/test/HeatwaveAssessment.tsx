"use client";
/* PROTO HEATWAVE QUESTIONS
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
const mockSubmissions = [
  {
    postcode: "2300", // Newcastle CBD
    ageGroup: "65+",
    hasChronicIllness: true,
    score: 85,
    riskLevel: "High",
    symptoms: ["dizziness", "racing heart beat", "extreme thirst"],
    managementActions: ["stayed inside", "turned on air conditioning"],
    isIndigenous: false,
    isHomeless: false,
    workAbsenceDays: 0,
    soughtMedicalHelp: true,
  },
  {
    postcode: "2287", // Wallsend
    ageGroup: "35-44",
    hasChronicIllness: false,
    score: 20,
    riskLevel: "Low",
    symptoms: ["muscle twitching"],
    managementActions: ["drank more fluids", "turned on fan"],
    isIndigenous: true,
    isHomeless: false,
    workAbsenceDays: 1,
    soughtMedicalHelp: false,
  },
  {
    postcode: "2290", // Charlestown
    ageGroup: "55-64",
    hasChronicIllness: true,
    score: 55,
    riskLevel: "Moderate",
    symptoms: ["light headedness", "fainting"],
    managementActions: ["sought shade", "had a shower"],
    isIndigenous: false,
    isHomeless: false,
    workAbsenceDays: 2,
    soughtMedicalHelp: true,
  },
  {
    postcode: "2304", // Mayfield
    ageGroup: "Younger than 34",
    hasChronicIllness: false,
    score: 10,
    riskLevel: "Low",
    symptoms: [],
    managementActions: ["went for a swim"],
    isIndigenous: false,
    isHomeless: false,
    workAbsenceDays: 0,
    soughtMedicalHelp: false,
  },
];
const QUESTIONS = [
  {
    id: 1,
    category: "Vulnerability",
    question: "How old are you?",
    options: [
      { label: "65+", score: 14, icon: "👴" },
      { label: "55-64", score: 14, icon: "👴" },
      { label: "45-54", score: 14, icon: "👴" },
      { label: "35-44", score: 14, icon: "👴" },
      { label: "Younger than 34", score: 0, icon: "👤" },
    ],
  },
  {
    id: 1,
    category: "Vulnerability",
    question: "Do you care for someone under 5 years old?",
    options: [
      { label: "Yes", score: 14, icon: "👴" },
      { label: "No", score: 0, icon: "👤" },
    ],
  },
  {
    id: 1,
    category: "Vulnerability",
    question: "Are you Aboriginal or Torres Strait Islander?",
    options: [
      { label: "Yes", score: 14, icon: "👴" },
      { label: "No", score: 0, icon: "👤" },
    ],
  },
  {
    id: 1,
    category: "Vulnerability",
    question: "How much do you make weekly?",
    options: [
      { label: "Less than $650", score: 14, icon: "👴" },
      { label: "More than $650", score: 0, icon: "👤" },
    ],
  },
  {
    id: 1,
    category: "Vulnerability",
    question: "Do you live alone?",
    options: [
      { label: "Yes", score: 14, icon: "👴" },
      {
        label: "No, I live with one or more other people",
        score: 0,
        icon: "👤",
      },
    ],
  },
  {
    id: 1,
    category: "Vulnerability",
    question: "Do you need assistance with daily activities?",
    options: [
      { label: "Yes, I am assisted daily", score: 14, icon: "👴" },
      { label: "No", score: 0, icon: "👤" },
    ],
  },
  {
    id: 2,
    category: "Vulnerability",
    question:
      "Do you have any chronic health conditions? (Heart, Lung, or Kidney disease)",
    options: [
      { label: "Yes", score: 14, icon: "🩺" },
      { label: "No", score: 0, icon: "✅" },
    ],
  },
];

export default function HeatwaveAssessment() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  useEffect(() => {
    if (isFinished) {
      const runTest = async () => {
        console.log("Finished screen detected. Saving test data...");
        await saveAssessment(mockSubmissions[0]);
      };
      runTest();
    }
  }, [isFinished]);
  const totalSteps = QUESTIONS.length;
  const currentQuestion = QUESTIONS[step];

  const handleOptionClick = (points: number) => {
    const newScore = score + points;
    if (step + 1 < totalSteps) {
      setScore(newScore);
      setStep(step + 1);
    } else {
      setScore(newScore);
      setIsFinished(true);
    }
  };

  const resetAssessment = () => {
    setStep(0);
    setScore(0);
    setIsFinished(false);
  };

  const getRiskLevel = () => {
    if (score >= 60)
      return {
        label: "High Risk",
        color: "text-red-600",
        bg: "bg-red-50",
        icon: <AlertTriangle className="w-8 h-8" />,
      };
    if (score >= 30)
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
    const risk = getRiskLevel();
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
          {currentQuestion.question}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option) => (
            <button
              key={option.label}
              onClick={() => handleOptionClick(option.score)}
              className="group relative flex items-center justify-between p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl hover:border-orange-500 hover:bg-white hover:shadow-lg transition-all duration-200 text-left"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{option.icon}</span>
                <span className="text-xl font-bold text-slate-700 group-hover:text-slate-900">
                  {option.label}
                </span>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-orange-500 transform group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>

      <p className="mt-12 text-sm text-slate-400 italic text-center">
        Your data is not stored. This assessment is for educational purposes
        only.
      </p>
    </section>
  );
}
