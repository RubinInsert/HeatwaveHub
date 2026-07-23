"use client";

import React, { useState } from "react";
import { Prisma } from "@/prisma/generated/prisma/client";

type Option = Prisma.OptionGetPayload<{}>;

interface RadioGroupQuestionProps {
  options: Option[];
  // Update signature to accept specifyText
  onSelect: (option: Option, specifyText?: string) => void;
}

export default function RadioQuestion({ options, onSelect }: RadioGroupQuestionProps) {
  // Local state to handle the "Specify" flow
  const [pendingOption, setPendingOption] = useState<Option | null>(null);
  const [specifyText, setSpecifyText] = useState("");

  const handleOptionClick = (option: Option) => {
    if (option.isSpecify) {
      // Reveal the input field
      setPendingOption(option);
      setSpecifyText(""); 
    } else {
      // Clear pending and submit immediately
      setPendingOption(null);
      onSelect(option);
    }
  };

  const handleSpecifySubmit = () => {
    if (pendingOption && specifyText.trim()) {
      onSelect(pendingOption, specifyText.trim());
    }
  };

  return (
<div className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {options.map((option) => {
      const isSelectedPending = pendingOption?.id === option.id;
      
      return (
        <button
          key={option.id}
          type="button"
          onClick={() => handleOptionClick(option)}
          className={`flex items-center gap-4 p-6 border-2 rounded-2xl transition-all text-left group
            ${isSelectedPending 
              ? "border-orange-500 bg-orange-50" 
              : "border-slate-100 bg-slate-50 hover:border-orange-500 hover:bg-white"
            }`}
        >
          {option.icon && (
            <span className="text-3xl group-hover:scale-110 transition-transform">
              {option.icon}
            </span>
          )}
          <span className="text-xl font-bold text-slate-800">{option.label}</span>
        </button>
      );
    })}
  </div>

  {/* Render the text input conditionally below the buttons */}
  {pendingOption?.isSpecify && (
    <div className="animate-in fade-in slide-in-from-top-2 p-6 bg-orange-50 rounded-2xl border border-orange-200 flex flex-col sm:flex-row gap-4">
      <input
        type="text"
        placeholder="Please specify..."
        value={specifyText}
        onChange={(e) => setSpecifyText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSpecifySubmit();
        }}
        className="flex-1 p-4 rounded-xl border border-slate-200 outline-none focus:border-orange-500 text-lg"
        autoFocus
      />
      <button
        onClick={handleSpecifySubmit}
        disabled={!specifyText.trim()}
        className="px-8 py-4 bg-orange-600 text-white font-bold rounded-xl disabled:opacity-50 transition-opacity"
      >
        Confirm
      </button>
    </div>
  )}
    </div>
  );
}