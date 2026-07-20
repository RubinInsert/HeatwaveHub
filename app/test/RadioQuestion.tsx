"use client";

import React from "react";
import { Prisma } from "@/prisma/generated/prisma/client";

type Option = Prisma.OptionGetPayload<{}>;

interface RadioGroupQuestionProps {
  options: Option[];
  onSelect: (option: Option) => void;
}

export default function RadioQuestion({ options, onSelect }: RadioGroupQuestionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onSelect(option)}
          className="flex items-center gap-4 p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl hover:border-orange-500 hover:bg-white transition-all text-left group"
        >
          {option.icon && (
            <span className="text-3xl group-hover:scale-110 transition-transform">
              {option.icon}
            </span>
          )}
          <span className="text-xl font-bold text-slate-800">{option.label}</span>
        </button>
      ))}
    </div>
  );
}