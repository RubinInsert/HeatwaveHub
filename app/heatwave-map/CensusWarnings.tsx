"use client";
import React from "react";
import { AlertTriangleIcon } from "lucide-react";
import VULNERABILITY_THRESHOLDS from "./VulnerabilityThresholds";
function Warning({ warningText }: { warningText: string }) {
  return (
    <li className="p-1 bg-red-200 flex gap-3 justify-between items-center rounded">
      <AlertTriangleIcon
        name="alert-triangle"
        className="inline-block min-w-10 min-h-10 text-red-600"
      />
      <span className="font-bold">{warningText}</span>
    </li>
  );
}
export default function CensusWarnings({ hoverContext }: any) {
  return (
    <ul className="text-xs text-red-600 flex flex-col gap-2">
      {/* If the LGA has a young population with a proportion of more than 18% of the general population */}
      {Number(hoverContext.properties.general_Age_0_4_yr_P) /
        Number(hoverContext.properties.general_Tot_P_P) >
        VULNERABILITY_THRESHOLDS.Young_Pop && (
        <Warning warningText="High Proportion of Young Children" />
      )}
      {/* If the LGA has a high proportion of elderly with more than 15% of the general population being over 65 */}
      {(Number(hoverContext.properties.general_Age_65_74_yr_P) +
        Number(hoverContext.properties.general_Age_75_84_yr_P) +
        Number(hoverContext.properties.general_Age_85ov_P)) /
        Number(hoverContext.properties.general_Tot_P_P) >
        VULNERABILITY_THRESHOLDS.Elder_Pop && (
        <Warning warningText="High Proportion of Elderly" />
      )}
      {/* If the LGA has a high proportion of Indigenous population with more than 3% of the general population identifying as indigenous */}
      {Number(hoverContext.properties.general_Indigenous_P_Tot_P) /
        Number(hoverContext.properties.general_Tot_P_P) >
        VULNERABILITY_THRESHOLDS.Indigenous_Pop && (
        <Warning warningText="High Proportion of Indigenous Population" />
      )}
      {/* If the LGA has a high proportion of people with low english literacy
                    T_UOLSE_NWNAA_T - TOTAL_Uses_other_language_and_speaks_English_Not_well_or_not_at_all_Total */}
      {Number(hoverContext.properties.literacy_T_UOLSE_NWNAA_T) /
        Number(hoverContext.properties.general_Tot_P_P) >
        VULNERABILITY_THRESHOLDS.LowLit_Pop && (
        <Warning warningText="High Proportion of Low English Literacy" />
      )}

      {/* If the LGA has a high proportion of people with low income (<$650/week)*/}
      {(Number(hoverContext.properties.income_P_1_149_Tot) +
        Number(hoverContext.properties.income_P_150_299_Tot) +
        Number(hoverContext.properties.income_P_300_399_Tot) +
        Number(hoverContext.properties.income_P_400_499_Tot) +
        Number(hoverContext.properties.income_P_500_649_Tot)) /
        Number(hoverContext.properties.general_Tot_P_P) >
        VULNERABILITY_THRESHOLDS.LowIncome_Pop && (
        <Warning warningText="High Proportion of People with Low Income" />
      )}
      {/* If the LGA has a high proportion of people living alone with more than 15% of the general population living alone */}
      {Number(hoverContext.properties.housing_Num_Psns_UR_1_Total) /
        Number(hoverContext.properties.housing_Total_Total) >
        VULNERABILITY_THRESHOLDS.LivingAlone_Pop && (
        <Warning warningText="High Proportion of People Living Alone" />
      )}

      {/* If the LGA has a high proportion of people who need assistance */}
      {Number(hoverContext.properties.assistance_P_Tot_Need_for_assistance) /
        Number(hoverContext.properties.assistance_P_Tot_Tot) >
        VULNERABILITY_THRESHOLDS.NeedingAssistance_Pop && (
        <Warning warningText="High Proportion of People Needing Assistance" />
      )}
      {/* If the LGA has a high proportion of people with long term cardiovascular, respiratory, or mental health conditions */}
      {Number(hoverContext.properties.health_P_1m_cond_Tot_Tot) /
        Number(hoverContext.properties.general_Tot_P_P) >
        VULNERABILITY_THRESHOLDS.HealthConditions_Pop && (
        <Warning warningText="High Proportion of People with Long Term Health Conditions" />
      )}
    </ul>
  );
}

// QUESTIONS FOR TEAM:
// Does low income account for personal income, or household income?
// In your presentation it mentions
// What quantiles should we use for the thresholds of each warning?
// Bring up Nambucca Valley. The area has extremely high vulnerability metrics but is measured as low vulnerability on the map. Should location have such a drastic impact?
