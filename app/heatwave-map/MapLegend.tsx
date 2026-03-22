import type { Scenario } from "./MapContextSwitcher";
import { useState, useEffect } from "react";
export type LegendType = "exposure" | "vulnerability" | "risk";
export const LEGEND_CONFIG: Record<string, { label: string; color: string }[]> =
  {
    exposure: [
      { label: "Low Exposure", color: "#BFD3E6" },
      { label: "Moderate Exposure", color: "#8C6BB1" },
      { label: "High Exposure", color: "#810F7C" },
    ],
    vulnerability: [
      { label: "Very Low Vulnerability", color: "#F7FCF0" },
      { label: "Low Vulnerability", color: "#E0F3DB" },
      { label: "Limited Vulnerability", color: "#CCEBC5" },
      { label: "Moderate Vulnerability", color: "#A8DDB5" },
      { label: "High Vulnerability", color: "#4EB3D3" },
      { label: "Very High Vulnerability", color: "#2B8CBE" },
      { label: "Severe Vulnerability", color: "#0868AC" },
      { label: "Extreme Vulnerability", color: "#084081" },
    ],
    // Use a generic "Risk" legend for SSP2 and SSP3
    risk: [
      { label: "Very Low Risk", color: "#3DA1D1" },
      { label: "Low Risk", color: "#75B3C3" },
      { label: "Limited Risk", color: "#9AC5B4" },
      { label: "Mild Risk", color: "#B9D6A2" },
      { label: "Median Risk", color: "#D7EA90" },
      { label: "Moderate Risk", color: "#F1FB7B" },
      { label: "High Risk", color: "#F6D865" },
      { label: "Very High Risk", color: "#F9B552" },
      { label: "Severe Risk", color: "#F88F3E" },
      { label: "Very Severe Risk", color: "#FF0000" },
      { label: "Extreme Risk", color: "#CA181D" },
    ],
  };
export default function DynamicLegend({ scenario }: { scenario: Scenario }) {
  const [isExpanded, setIsExpanded] = useState(false); // Default to collapsed

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    setIsExpanded(isDesktop); // Start expanded on desktop, collapsed on mobile
  }, []);
  // Group SSP2 and SSP3 under "risk" scale
  const activeScale =
    scenario === "exposure"
      ? LEGEND_CONFIG.exposure
      : scenario === "vulnerability"
        ? LEGEND_CONFIG.vulnerability
        : LEGEND_CONFIG.risk;

  return (
    <div className="absolute top-3 left-3 z-10">
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-md border border-white/50 text-xs font-bold text-slate-700"
        >
          Show Legend
        </button>
      )}

      {isExpanded && (
        <div className="bg-white/80 backdrop-blur-md p-3 rounded-lg shadow-md border border-white/50 w-44 sm:w-48 max-h-[45vh] overflow-y-auto">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">
              Legend: {scenario}
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-[11px] text-slate-500 hover:text-slate-700"
            >
              Hide
            </button>
          </div>

          <div className="flex flex-col gap-2 mt-3">
            {activeScale.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-600 text-[10px] font-bold">
                <div className="h-2 w-8 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
