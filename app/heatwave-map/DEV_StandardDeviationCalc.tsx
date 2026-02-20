"use client";
import React, { useEffect } from "react";
import { AlertTriangleIcon } from "lucide-react";

// ==========================================
// 1. DEVELOPMENT CALCULATOR
// ==========================================
export function DEV_StandardDeviationCalc({ geoData }: { geoData: any }) {
  useEffect(() => {
    if (!geoData || !geoData.features) return;

    console.group("📊 HEATWAVE HUB - Advanced Vulnerability Analysis");

    const features = geoData.features;

    // Helper to safely get numbers from properties
    const n = (props: any, key: string) => Number(props[key] || 0);

    // 1:1 Mapping with the CensusWarnings component
    const metrics = [
      {
        label: "Young Children (0-4)",
        calc: (p: any) =>
          n(p, "general_Age_0_4_yr_P") / n(p, "general_Tot_P_P"),
      },
      {
        label: "Elderly (65+)",
        calc: (p: any) =>
          (n(p, "general_Age_65_74_yr_P") +
            n(p, "general_Age_75_84_yr_P") +
            n(p, "general_Age_85ov_P")) /
          n(p, "general_Tot_P_P"),
      },
      {
        label: "Indigenous Population",
        calc: (p: any) =>
          n(p, "general_Indigenous_P_Tot_P") / n(p, "general_Tot_P_P"),
      },
      {
        label: "Low English Literacy",
        calc: (p: any) =>
          n(p, "literacy_T_UOLSE_NWNAA_T") / n(p, "general_Tot_P_P"),
      },
      {
        label: "Low Income (<$650/wk)",
        calc: (p: any) =>
          (n(p, "income_P_1_149_Tot") +
            n(p, "income_P_150_299_Tot") +
            n(p, "income_P_300_399_Tot") +
            n(p, "income_P_400_499_Tot") +
            n(p, "income_P_500_649_Tot")) /
          n(p, "general_Tot_P_P"),
      },
      {
        label: "Living Alone",
        calc: (p: any) =>
          n(p, "housing_Num_Psns_UR_1_Total") / n(p, "housing_Total_Total"),
      },
      {
        label: "Needing Assistance",
        calc: (p: any) =>
          n(p, "assistance_P_Tot_Need_for_assistance") /
          n(p, "assistance_P_Tot_Tot"),
      },
      {
        label: "Long Term Health Conditions",
        calc: (p: any) =>
          n(p, "health_P_1m_cond_Tot_Tot") / n(p, "general_Tot_P_P"),
      },
    ];

    metrics.forEach(({ label, calc }) => {
      const proportions = features
        .map((f: any) => {
          const res = calc(f.properties);
          return isFinite(res) && !isNaN(res) ? res : null;
        })
        .filter((val: any) => val !== null);

      if (proportions.length === 0) return;

      const mean =
        proportions.reduce((a: number, b: number) => a + b, 0) /
        proportions.length;
      const stdDev = Math.sqrt(
        proportions.reduce(
          (sq: number, n: number) => sq + Math.pow(n - mean, 2),
          0,
        ) / proportions.length,
      );

      console.log(`--- ${label} ---`);
      console.table({
        "Mean (NSW Avg)": (mean * 100).toFixed(2) + "%",
        "Std Deviation": (stdDev * 100).toFixed(2) + "%",
        "Warning (+1σ)": ((mean + stdDev) * 100).toFixed(2) + "%",
        "Extreme (+2σ)": ((mean + 2 * stdDev) * 100).toFixed(2) + "%",
      });
    });

    console.groupEnd();
  }, [geoData]);

  return null;
}
