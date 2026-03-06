import React from "react";

const VulnerabilityTable = ({ hoverContext }: any) => {
  if (!hoverContext || !hoverContext.properties) return null;

  const props = hoverContext.properties;

  // Safe calculation helper
  const calcProp = (numerator: any, denominator: any) => {
    const num = Number(numerator) || 0;
    const den = Number(denominator) || 0;
    return den > 0 ? num / den : 0;
  };

  const metrics = [
    {
      label: "Young Children (0-4)",
      value: calcProp(props.general_Age_0_4_yr_P, props.general_Tot_P_P),
    },
    {
      label: "Elderly (65+)",
      value: calcProp(
        Number(props.general_Age_65_74_yr_P) +
          Number(props.general_Age_75_84_yr_P) +
          Number(props.general_Age_85ov_P),
        props.general_Tot_P_P,
      ),
    },
    {
      label: "Indigenous Population",
      value: calcProp(props.general_Indigenous_P_Tot_P, props.general_Tot_P_P),
    },
    {
      label: "Low English Literacy",
      value: calcProp(props.literacy_T_UOLSE_NWNAA_T, props.general_Tot_P_P),
    },
    {
      label: "Low Income (<$650/wk)",
      value: calcProp(
        Number(props.income_P_Neg_Nil_income_Tot) + // NEW
          Number(props.income_P_1_149_Tot) +
          Number(props.income_P_150_299_Tot) +
          Number(props.income_P_300_399_Tot) +
          Number(props.income_P_400_499_Tot) +
          Number(props.income_P_500_649_Tot),
        props.general_Tot_P_P,
      ),
    },
    {
      label: "Living Alone",
      value: calcProp(
        props.housing_Num_Psns_UR_1_Total, // P_LonePsn_Tot
        props.housing_Total_Total, // P_Tot_Tot
      ),
    },
    {
      label: "Needing Assistance",
      value: calcProp(
        props.assistance_P_Tot_Need_for_assistance,
        props.assistance_P_Tot_Tot,
      ),
    },
    {
      label: "Long-term Health Conditions",
      value: calcProp(props.health_P_1m_cond_Tot_Tot, props.general_Tot_P_P), // P_Heart_disease_Tot + P_Kidney_disease_Tot + P_Lung_cond_Tot
    },
    // Include Mental Health Condtitions - P_Mental_health_cond_Tot
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 mt-4">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-gray-900">
              Vulnerability Metric
            </th>
            <th className="px-4 py-2 text-right font-semibold text-gray-900">
              Proportion (%)
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {metrics.map((metric, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-2 text-gray-700">{metric.label}</td>
              <td className="px-4 py-2 text-right font-mono text-blue-600">
                {(metric.value * 100).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VulnerabilityTable;
