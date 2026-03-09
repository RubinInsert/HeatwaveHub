import fs from "fs/promises";
import path from "path";
import Papa from "papaparse";
const DATA_DIR = path.join(process.cwd(), "./data");
const OUTPUT_FILE = path.join("../../public/data/", "nsw_lga.json");
const parseCensusFiles = async (fileConfig) => {
  const censusLookup = {};
  for (const [fileName, prefix] of fileConfig) {
    const filePath = path.join(DATA_DIR, fileName);
    const fileContent = await fs.readFile(filePath, "utf8");
    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    }).data;
    parsed.forEach((row) => {
      if (row.LGA_CODE_2021) {
        const LGA_CODE = Number(row.LGA_CODE_2021.replace("LGA", "")); // Converts "LGA10500" to 10500
        censusLookup[LGA_CODE] ??= {};
        censusLookup[LGA_CODE][prefix] ??= {};
        Object.keys(row).forEach((key) => {
          if (key !== "LGA_CODE_2021") {
            const flatKey = `${prefix}_${key}`; // MapLibre automatically flattens nested JSON, so we need to create a flat hierachy like "housing_Total_Total" instead of "housing": { "Total_Total": value }
            censusLookup[LGA_CODE][flatKey] = row[key];
          }
        });
      }
    });
  }
  return censusLookup;
};
export default async function loadData() {
  // 3. Fetch both GeoJSON and CSV concurrently
  // Inside your useEffect loadData function
  const geoJSON = JSON.parse(
    await fs.readFile(path.join(DATA_DIR, "nsw_lga.json"), "utf8"),
  );
  const heatwaveText = await fs.readFile(
    path.join(DATA_DIR, "heatwaveData.csv"),
    "utf8",
  );

  const censusLookup = await parseCensusFiles([
    ["2021_ABS_Census_G1.csv", "general"], // These id's will be prefixed to all census metrics keys. E.g. "general_Tot_P_P".
    ["2021_ABS_Census_G11D.csv", "literacy"],
    ["2021_ABS_Census_G17B.csv", "income"],
    ["2021_ABS_Census_G18.csv", "assistance"],
    ["2021_ABS_Census_G19B.csv", "health"],
    ["2021_ABS_Census_G27B.csv", "housing"],
    ["ndvi.csv", "ndvi"],
  ]);
  // 1. Create the Heatwave Data Lookup
  const heatwaveRaw = Papa.parse(heatwaveText, {
    header: true,
    skipEmptyLines: true,
  }).data;
  const heatwaveLookup = {};

  heatwaveRaw.forEach((row) => {
    if (row.LGA_CODE_2021) {
      const cleanedCode = Number(row.LGA_CODE_2021.replace("LGA", "")); // Converts "LGA10500" to 10500
      heatwaveLookup[cleanedCode] = row; // Now we can use the key to look up heatwave stats for the corresponding LGA in the GeoJSON data.
    }
  });

  // 2. Merge into GeoJSON
  const mergedFeatures = geoJSON.features.map((feature) => {
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
  const finalGeoJSON = { ...geoJSON, features: mergedFeatures };
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(finalGeoJSON));
} // End of loadData()

loadData().catch(console.error);
