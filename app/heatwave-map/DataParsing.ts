import Papa from "papaparse";
interface CensusTable {
  [metricName: string]: string | number;
}
interface LgaCensusData {
  LGA_CODE_2021?: string;
  [tableId: string]: CensusTable | string | undefined;
}

const parseCensusFiles = async (fileConfigs: Array<[string, string]>) => {
  const censusLookup: Record<string, LgaCensusData> = {};
  const allCensusText = await Promise.all(
    fileConfigs.map((fileConfig) =>
      fetch(fileConfig[0]).then((res) => res.text()),
    ),
  );
  allCensusText.forEach((text, index) => {
    const prefix = fileConfigs[index][1]; // e.g., "housing"
    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    }).data;
    parsed.forEach((row: any) => {
      if (row.LGA_CODE_2021) {
        const LGA_CODE = Number(row.LGA_CODE_2021.replace("LGA", "")); // Converts "LGA10500" to 10500
        if (!censusLookup[LGA_CODE]) {
          censusLookup[LGA_CODE] = { LGA_CODE_2021: row.LGA_CODE_2021 };
        }
        if (!censusLookup[LGA_CODE][prefix]) {
          censusLookup[LGA_CODE][prefix] = {};
        }
        Object.keys(row).forEach((key) => {
          if (key !== "LGA_CODE_2021") {
            const flatKey = `${prefix}_${key}`; // MapLibre automatically flattens nested JSON, so we need to create a flat hierachy like "housing_Total_Total" instead of "housing": { "Total_Total": value }
            censusLookup[LGA_CODE][flatKey] = row[key];
          }
        });
      }
    });
  });
  return censusLookup;
};
export default async function loadData() {
  // 3. Fetch both GeoJSON and CSV concurrently
  // Inside your useEffect loadData function
  const [geoRes, heatwaveRes] = await Promise.all([
    fetch("/data/nsw_lga.json"), // GeoJSON data for NSW LGAs (i.e. LGA map boundaries)
    fetch("/data/heatwaveData.csv"), // Heatwave vulnerability data provided by team
  ]);

  const topoJson = await geoRes.json(); // GeoJSON data for NSW LGAs - this is the base map layer
  const heatwaveText = await heatwaveRes.text(); // Data provided by team containing LGA classifications

  const censusLookup = await parseCensusFiles([
    ["/data/2021_ABS_Census_G1.csv", "general"], // These id's will be prefixed to all census metrics keys. E.g. "general_Tot_P_P".
    ["/data/2021_ABS_Census_G11D.csv", "literacy"],
    ["/data/2021_ABS_Census_G17B.csv", "income"],
    ["/data/2021_ABS_Census_G18.csv", "assistance"],
    ["/data/2021_ABS_Census_G19B.csv", "health"],
    ["/data/2021_ABS_Census_G27B.csv", "housing"],
    ["/data/ndvi.csv", "ndvi"],
  ]);
  // 1. Create the Heatwave Data Lookup
  const heatwaveRaw = Papa.parse(heatwaveText, {
    header: true,
    skipEmptyLines: true,
  }).data;
  const heatwaveLookup: Record<string, any> = {};

  heatwaveRaw.forEach((row: any) => {
    if (row.LGA_CODE_2021) {
      const cleanedCode = Number(row.LGA_CODE_2021.replace("LGA", "")); // Converts "LGA10500" to 10500
      heatwaveLookup[cleanedCode] = row; // Now we can use the key to look up heatwave stats for the corresponding LGA in the GeoJSON data.
    }
  });

  // 2. Merge into GeoJSON
  const mergedFeatures = topoJson.features.map((feature: any) => {
    // Get code from GeoJSON (e.g., "10500" or "0500")
    const geoCode = Number(feature.properties.LGA_CODE25).toString();
    // Find the heatwave stats using the cleaned numeric code
    const heatStats = heatwaveLookup[geoCode] || {};
    const censusStats = censusLookup[geoCode] || {};

    return {
      ...feature,
      properties: {
        ...feature.properties,
        ...heatStats,
        ...censusStats, // Merges census data for popup display
      },
    };
  });
  return { ...topoJson, features: mergedFeatures };
} // End of loadData()
