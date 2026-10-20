"use client";

import React, { useState } from "react";

interface TextInputQuestionProps {
  type: "TEXT" | "NUMBER";
  onSubmit: (value: string) => void;
}

export default function TextInputQuestion({ type, onSubmit }: TextInputQuestionProps) {
  const [inputValue, setInputValue] = useState("");

  // NOTE: The useEffect has been removed. 
  // The `key={currentQuestion.id}` prop on the parent handles resetting this state perfectly.

  const handleSubmit = () => {
    // Number inputs can result in a blank string if a space or invalid character is typed,
    // so we cast it to a string and handle it safely.
    const normalizedValue = String(inputValue).trim();
    
    if (!normalizedValue) return;
    
    onSubmit(normalizedValue);
  };

  // Safe check for the disabled state that works nicely for both text and numbers
  const isDisabled = String(inputValue).trim() === "";

  return (
    <div className="space-y-4">
      <input
        type={type === "NUMBER" ? "number" : "text"}
        className="w-full p-4 border-2 border-brand-midnight/10 rounded-xl focus:border-brand-coral outline-none text-xl text-brand-midnight"
        placeholder="Enter details..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
      />
      <button
        onClick={handleSubmit}
        disabled={isDisabled}
        className="w-full martial-gradient py-4 bg-brand-coral disabled:bg-brand-midnight/20 text-brand-midnight rounded-xl font-bold transition-all hover:brightness-95"
      >
        Continue
      </button>
    </div>
  );
}