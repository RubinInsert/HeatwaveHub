"use client";

import React, { useState, useEffect } from "react";
import { Prisma } from "@/prisma/generated/prisma/client";

type Option = Prisma.OptionGetPayload<{}>;

interface CheckboxGroupQuestionProps {
  questionId: string;
  options: Option[];
  onSubmit: (selectedOptions: Option[]) => void;
}

export default function CheckboxQuestion({
  questionId,
  options,
  onSubmit,
}: CheckboxGroupQuestionProps) {
  const [checkedOptions, setCheckedOptions] = useState<Option[]>([]);

  // Flush selections entirely if a new checkbox step arrives
  useEffect(() => {
    setCheckedOptions([]);
  }, [questionId]);
const handleToggle = (opt: Option, isChecking: boolean) => {
    if (!isChecking) {
      // Unchecking an option is always simple: just remove it from the array
      setCheckedOptions(checkedOptions.filter((o) => o.id !== opt.id));
      return;
    }

    if (opt.isNone) {
      // Rule 1: User checked a "None of the above" option. Wipes out everything else.
      setCheckedOptions([opt]);
    } else {
      // Rule 2: User checked a normal option. Strip out any existing "None" selection.
      const filteredOptions = checkedOptions.filter((o) => !o.isNone);
      setCheckedOptions([...filteredOptions, opt]);
    }
  };
  const handleSubmit = () => {
    if (checkedOptions.length === 0) return;
    onSubmit(checkedOptions);
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {options.map((opt) => {
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
              onChange={(e) => handleToggle(opt, e.target.checked)}
            />
            {opt.icon && <span className="text-3xl">{opt.icon}</span>}
            <span className="text-lg font-medium text-slate-700">{opt.label}</span>
          </label>
        );
      })}
      <button
        onClick={handleSubmit}
        disabled={checkedOptions.length === 0}
        className="mt-4 w-full py-4 bg-orange-600 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all"
      >
        Next Step
      </button>
    </div>
  );
}