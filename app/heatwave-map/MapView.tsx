"use client";
import Map, { Source, Layer } from "react-map-gl/maplibre";
import React, { useMemo, useEffect, useState } from "react";
import DynamicLegend from "./MapLegend";
import "maplibre-gl/dist/maplibre-gl.css";
//import { heatwaveData, HeatwaveData } from "./data/heatwaveData";
import Papa from "papaparse"; // 1. Import PapaParse
import MapContextSwitcher from "./MapContextSwitcher";
const VIC_BOUNDS: [[number, number], [number, number]] = [
  [139.21, -38.31], // Southwest
  [161.13, -26.74], // Northeast
];

//type HeatwaveMetric = keyof HeatwaveData;

/*
TODO: - Add Legend Component
- Add Accessibility Features
- Optimize Performance / Memory Usage (Merge heatwaveData and GeoJSON manually to prevent re-merging on each render)
*/
// const METRIC_LABELS: Partial<Record<HeatwaveMetric, string>> = {
//   vulnerability_score: "Social Vulnerability",
//   cat_hist_1951_2023: "Historical Records (1951-2023)",
//   cat_recent_2002_2023: "Recent Records (2002-2023)",
//   cat_2030_SSP2: "Moderate Scenario (2030)",
//   cat_2050_SSP2: "Moderate Scenario (2050)",
//   cat_2070_SSP2: "Moderate Scenario (2070)",
//   cat_2090_SSP2: "Moderate Scenario (2090)",
//   cat_2030_SSP3: "Worst-Case Scenario (2030)",
//   cat_2050_SSP3: "Worst-Case Scenario (2050)",
//   cat_2070_SSP3: "Worst-Case Scenario (2070)",
//   cat_2090_SSP3: "Worst-Case Scenario (2090)",
// };
type Scenario = "vulnerability" | "exposure" | "SSP2" | "SSP3";
type Year = "2030" | "2050" | "2070" | "2090";
export default function MapView() {
  const [scenario, setScenario] = useState<Scenario>("vulnerability");
  const [year, setYear] = useState<Year>("2030");
  const [geoData, setGeoData] = useState(null);
  const activeMetric = useMemo(() => {
    if (scenario === "vulnerability") {
      // This matches the exact multiline header in your CSV
      return "vulnerability_group";
    } else if (scenario === "exposure") {
      return "exposure_group";
    }
    // Matches: 2030_risk_equal_SSP2_group
    return `${year}_risk_equal_${scenario}_group`;
  }, [scenario, year]);

  const years: Year[] = ["2030", "2050", "2070", "2090"];
  useEffect(() => {
    const loadData = async () => {
      // 3. Fetch both GeoJSON and CSV concurrently
      // Inside your useEffect loadData function
      const [geoRes, heatwaveRes, conversionRes] = await Promise.all([
        fetch("/data/nsw_lga.json"),
        fetch("/data/heatwaveData.csv"),
        fetch("/data/LGACODE_CONVERSION_2019_TO_2021.csv"),
      ]);

      const topoJson = await geoRes.json(); // GeoJSON data for NSW LGAs - this is the base map layer
      const heatwaveText = await heatwaveRes.text(); // Data provided by team containing LGA classifications
      const conversionText = await conversionRes.text(); // A conversion file from 2019 LGA codes to 2021 LGA codes. This is due to the LGA map data being published in 2019 leading to mismatch codes.
      const codeConversions = Papa.parse(conversionText, {
        header: true,
        skipEmptyLines: true,
      }).data;

      const conversionLookup: Record<string, string> = {}; // A lookup table to convert 2021 codes to 2019 codes
      codeConversions.forEach((row: any) => {
        conversionLookup[row.LGA_CODE_2021] = row.LGA_CODE_2019;
      });

      // 1. Create the Heatwave Data Lookup
      const heatwaveRaw = Papa.parse(heatwaveText, {
        header: true,
        skipEmptyLines: true,
      }).data;
      const heatwaveLookup: Record<string, any> = {};

      heatwaveRaw.forEach((row: any) => {
        if (row.LGA_CODE_2021) {
          // Transform "LGA10500" -> "500"
          const cleanedCode = Number(row.LGA_CODE_2021.replace("LGA", "")); // Converts "LGA10500" to 10500
          const code2019 = conversionLookup[cleanedCode]; // Looks up the corresponding 2019 code (e.g., "10500")
          if (code2019) {
            // If a valid 2019 code is found
            // The code must be parsed again as the map JSON data has numeric codes ignoring the first digit as it is local to a single state.
            // To account for this:
            const withoutFirstDigit = code2019.toString().slice(1); // 1. Remove the first digit (e.g., "10500" -> "0500")
            const cleaned2019 = Number(withoutFirstDigit).toString(); // 2. Convert to number and back to string to remove leading zeros (e.g., "0500" -> "500")
            heatwaveLookup[cleaned2019] = row; // Now we can use "500" as the key to look up heatwave stats for the corresponding LGA in the GeoJSON data.
          }
        }
      });

      // 2. Merge into GeoJSON
      const mergedFeatures = topoJson.features.map((feature: any) => {
        // Get code from GeoJSON (e.g., "10500" or "0500")
        const geoCode = Number(feature.properties.abscode).toString();
        console.log("GeoJSON code:", geoCode);
        // Find the heatwave stats using the cleaned numeric code
        const csvStats = heatwaveLookup[geoCode] || {};

        return {
          ...feature,
          properties: {
            ...feature.properties,
            ...csvStats,
          },
        };
      });
      setGeoData({ ...topoJson, features: mergedFeatures });
    }; // End of loadData()

    loadData();
  }, []);
  return (
    <div className="flex flex-col gap-4">
      {/* 2. The Switcher UI */}
      <div className="h-[600px] w-full">
        <Map
          initialViewState={{
            longitude: 144.9,
            latitude: -37.8,
            zoom: 0,
          }}
          maxBounds={VIC_BOUNDS}
          // NO API KEY REQUIRED. NO ACCOUNT REQUIRED.
          mapStyle="https://tiles.openfreemap.org/styles/liberty"
        >
          <MapContextSwitcher
            scenario={scenario}
            setScenario={setScenario}
            year={year}
            setYear={setYear}
            years={years}
          />
          <DynamicLegend scenario={scenario} />
          {geoData && (
            <Source id="nsw-lga-data" type="geojson" data={geoData}>
              {/* 2. Style the fill-color based on the vulnerability_score */}
              <Layer
                id="lga-fill"
                type="fill"
                paint={{
                  "fill-color": [
                    "interpolate",
                    ["linear"],
                    // Convert the string from the CSV into a number for the map
                    ["to-number", ["get", activeMetric], 0],
                    0,
                    "#444444ff",
                    1,
                    "#fee0d2",
                    2,
                    "#fc9272",
                    3,
                    "#de2d26",
                    // Note: Your CSV has values up to 11.
                    // You should probably add more steps here:
                    11,
                    "#67000d",
                  ],
                  "fill-opacity": 0.6,
                  "fill-outline-color": "#ffffff",
                }}
              />

              {/* 3. Add a Line Layer for Boundaries */}
              <Layer
                id="lga-border"
                type="line"
                paint={{
                  "line-color": "#ffffff",
                  "line-width": 1,
                }}
              />
              <Layer
                id="lga-labels"
                type="symbol"
                layout={{
                  "text-field": ["get", "lganame"],
                  "text-size": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    5,
                    ["/", ["get", "AREASQKM"], 500], // Small at zoom 5, proportional to area
                    12,
                    ["/", ["get", "AREASQKM"], 100], // Much larger at zoom 12
                  ],
                  "text-allow-overlap": false, // Hides labels if they crash into each other
                }}
                paint={{
                  "text-color": "#ffffff",
                  "text-halo-color": "#000000",
                  "text-halo-width": 1,
                }}
              />
            </Source>
          )}
        </Map>
      </div>
    </div>
  );
}
