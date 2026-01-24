"use client";
import React, { useState } from "react";

export type Scenario = "vulnerability" | "SSP2" | "SSP3";
export type Year = "2030" | "2050" | "2070" | "2090";

interface SwitcherProps {
  scenario: Scenario;
  setScenario: (s: Scenario) => void;
  year: Year;
  setYear: (y: Year) => void;
  years: Year[];
}

export default function MapContextSwitcher({
  scenario,
  setScenario,
  year,
  setYear,
  years,
}: SwitcherProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className={`absolute bottom-4 right-4 z-10 flex flex-col bg-white/90 backdrop-blur-sm shadow-xl rounded-xl border border-gray-200 transition-all duration-300 ease-in-out ${
        isExpanded ? "w-72 p-4" : "w-auto p-2"
      }`}
    >
      {/* HEADER ROW - Always Visible */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600 rounded-lg text-white"></div>
          {isExpanded && (
            <span className="font-bold text-sm text-gray-800 tracking-tight">
              Map Controls
            </span>
          )}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-200 rounded-md transition-colors text-gray-500"
          title={isExpanded ? "Hide Controls" : "Show Controls"}
        >
          {isExpanded ? "Hide Controls" : "Show Controls"}
        </button>
      </div>

      {/* COLLAPSIBLE CONTENT */}
      {isExpanded && (
        <div className="flex flex-col gap-4 mt-4 animate-in fade-in zoom-in-95 duration-200">
          {/* A) Dropdown Box */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Data View
            </label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value as Scenario)}
              className="w-full p-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-black text-sm"
            >
              <option value="vulnerability">Social Vulnerability</option>
              <option value="SSP2">Moderate Scenario (SSP2)</option>
              <option value="SSP3">Extreme Scenario (SSP3)</option>
            </select>
          </div>

          {/* B) Timeline Slider (Conditional) */}
          {scenario !== "vulnerability" && (
            <div className="animate-in slide-in-from-top-1 duration-300">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Timeline
                </label>
                <span className="text-blue-600 font-bold px-2 py-0.5 bg-blue-50 rounded text-sm">
                  {year}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max={years.length - 1}
                step="1"
                value={years.indexOf(year)}
                onChange={(e) => setYear(years[parseInt(e.target.value)])}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />

              <div className="flex justify-between mt-2 px-1">
                {years.map((y) => (
                  <span
                    key={y}
                    className="text-[10px] text-gray-400 font-medium"
                  >
                    {y}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-gray-100">
            <p className="text-[11px] text-gray-500 italic leading-tight">
              {scenario === "vulnerability"
                ? "Showing baseline community sensitivity."
                : `Projected heatwave risk by ${year} under ${scenario} conditions.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
