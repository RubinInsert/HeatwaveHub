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
      {Number(hoverContext.properties.age_0_4) /
        Number(hoverContext.properties.total_population) >
        VULNERABILITY_THRESHOLDS.Young_Pop && (
        <Warning warningText="High Proportion of Young Children" />
      )}
      {/* If the LGA has a high proportion of elderly with more than 15% of the general population being over 65 */}
      {(Number(hoverContext.properties.age_65_74) +
        Number(hoverContext.properties.age_75_84) +
        Number(hoverContext.properties.age_86ov)) /
        Number(hoverContext.properties.total_population) >
        VULNERABILITY_THRESHOLDS.Elder_Pop && (
        <Warning warningText="High Proportion of Elderly" />
      )}
      {/* If the LGA has a high proportion of Indigenous population with more than 3% of the general population identifying as indigenous */}
      {Number(hoverContext.properties.indigenous) /
        Number(hoverContext.properties.total_population) >
        VULNERABILITY_THRESHOLDS.Indigenous_Pop && (
        <Warning warningText="High Proportion of Indigenous Population" />
      )}
      {/* If the LGA has a high proportion of people with low english literacy
                    T_UOLSE_NWNAA_T - TOTAL_Uses_other_language_and_speaks_English_Not_well_or_not_at_all_Total */}
      {Number(hoverContext.properties.low_literacy) /
        Number(hoverContext.properties.total_population) >
        VULNERABILITY_THRESHOLDS.LowLit_Pop && (
        <Warning warningText="High Proportion of Low English Literacy" />
      )}
      {/* If the LGA has a high proportion of people with low income (<$650/week)*/}
      {(Number(hoverContext.properties.income_nil) +
        Number(hoverContext.properties.income_1_149) +
        Number(hoverContext.properties.income_150_299) +
        Number(hoverContext.properties.income_300_399) +
        Number(hoverContext.properties.income_400_499) +
        Number(hoverContext.properties.income_500_650)) /
        Number(hoverContext.properties.total_population) >
        VULNERABILITY_THRESHOLDS.LowIncome_Pop && (
        <Warning warningText="High Proportion of People with Low Income" />
      )}
      {/* If the LGA has a high proportion of people living alone with more than 15% of the general population living alone */}
      {Number(hoverContext.properties.lone_person) /
        Number(hoverContext.properties.total_population) >
        VULNERABILITY_THRESHOLDS.LivingAlone_Pop && (
        <Warning warningText="High Proportion of People Living Alone" />
      )}
      {/* If the LGA has a high proportion of people who need assistance */}
      {Number(hoverContext.properties.needs_assistance) /
        Number(hoverContext.properties.total_population) >
        VULNERABILITY_THRESHOLDS.NeedingAssistance_Pop && (
        <Warning warningText="High Proportion of People Needing Assistance" />
      )}
      {/* If the LGA has a high proportion of people with long term cardiovascular, respiratory, or mental health conditions */}
      {(Number(hoverContext.properties.heart_disease) +
        Number(hoverContext.properties.kidney_disease) +
        Number(hoverContext.properties.lung_condition)) /
        Number(hoverContext.properties.total_population) >
        VULNERABILITY_THRESHOLDS.HealthConditions_Pop && (
        <Warning warningText="High Proportion of People with Long Term Health Conditions" />
      )}
      {/* If the LGA has a high proportion of people who suffer from mental health issues*/}
      {Number(hoverContext.properties.mental_health_condition) /
        Number(hoverContext.properties.total_population) >
        VULNERABILITY_THRESHOLDS.MentalHealth_Pop && (
        <Warning warningText="High Proportion of People with Mental Health Issues" />
      )}
      {Number(hoverContext.properties.ndvi_MEDIAN_NDVI) <
        VULNERABILITY_THRESHOLDS.NDVI && (
        <Warning warningText="Low Proportion of Vegetation" />
      )}
    </ul>
  );
}

// QUESTIONS FOR TEAM:
// Does low income account for personal income, or household income?
// In your presentation it mentions
// What quantiles should we use for the thresholds of each warning?
// Bring up Nambucca Valley. The area has extremely high vulnerability metrics but is measured as low vulnerability on the map. Should location have such a drastic impact?
