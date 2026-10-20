import type { Scenario } from "./MapContextSwitcher";
import { useState, useEffect } from "react";
export type LegendType = "exposure" | "vulnerability" | "risk";
export const LEGEND_CONFIG: Record<string, { label: string; color: string }[]> =
  {
    exposure: [
      { label: "Low exposure", color: "#BFD3E6" },
      { label: "Moderate exposure", color: "#8C6BB1" },
      { label: "High exposure", color: "#810F7C" },
    ],
    vulnerability: [
      { label: "Very low vulnerability", color: "#F7FCF0" },
      { label: "Low vulnerability", color: "#E0F3DB" },
      { label: "Limited vulnerability", color: "#CCEBC5" },
      { label: "Moderate vulnerability", color: "#A8DDB5" },
      { label: "High vulnerability", color: "#4EB3D3" },
      { label: "Very high vulnerability", color: "#2B8CBE" },
      { label: "Severe vulnerability", color: "#0868AC" },
      { label: "Extreme vulnerability", color: "#084081" },
    ],
    // Use a generic "Risk" legend for SSP2 and SSP3
    risk: [
      { label: "Very low risk", color: "#3DA1D1" },
      { label: "Low risk", color: "#75B3C3" },
      { label: "Limited risk", color: "#9AC5B4" },
      { label: "Mild risk", color: "#B9D6A2" },
      { label: "Median risk", color: "#D7EA90" },
      { label: "Moderate risk", color: "#F1FB7B" },
      { label: "High risk", color: "#F6D865" },
      { label: "Very high risk", color: "#F9B552" },
      { label: "Severe risk", color: "#F88F3E" },
      { label: "Very severe risk", color: "#FF0000" },
      { label: "Extreme risk", color: "#CA181D" },
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
          className="bg-brand-cream/95 backdrop-blur-md px-3 py-2 rounded-lg shadow-md border border-brand-midnight/10 text-xs font-bold text-brand-midnight/80"
        >
          Show legend
        </button>
      )}

      {isExpanded && (
        <div className="bg-brand-cream/95 backdrop-blur-md p-3 rounded-lg shadow-md border border-brand-midnight/10 w-44 sm:w-48 max-h-[45vh] overflow-y-auto">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-label font-bold text-brand-midnight/70 tracking-wider">
              Legend: {scenario}
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-[11px] text-brand-midnight/70 hover:text-brand-midnight/80"
            >
              Hide
            </button>
          </div>

          <div className="flex flex-col gap-2 mt-3">
            {activeScale.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-brand-midnight/80 text-[10px] font-bold">
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
