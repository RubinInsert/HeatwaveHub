"use client";
import Map, { Source, Layer, Popup } from "react-map-gl/maplibre";
import type { Expression } from "maplibre-gl";
import React, { useMemo, useEffect, useState } from "react";
import DynamicLegend, { LEGEND_CONFIG } from "./MapLegend";
import "maplibre-gl/dist/maplibre-gl.css";
//import { heatwaveData, HeatwaveData } from "./data/heatwaveData";
import Papa from "papaparse"; // 1. Import PapaParse
import MapContextSwitcher from "./MapContextSwitcher";
import { AlertTriangleIcon, Icon } from "lucide-react";
import CensusWarnings from "./CensusWarnings";
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
const getGeoJSONCode = (code2021: string, conversionLookup: any) => {
  const cleanedCode = Number(code2021.replace("LGA", "")); // Converts "LGA10500" to 10500
  const code2019 = conversionLookup[cleanedCode]; // Looks up the corresponding 2019 code (e.g., "10500")
  if (code2019) {
    // If a valid 2019 code is found
    // The code must be parsed again as the map JSON data has numeric codes ignoring the first digit as it is local to a single state.
    // To account for this:
    const withoutFirstDigit = code2019.toString().slice(1); // 1. Remove the first digit (e.g., "10500" -> "0500")
    const cleaned2019 = Number(withoutFirstDigit).toString(); // 2. Convert to number and back to string to remove leading zeros (e.g., "0500" -> "500")
    return cleaned2019;
  }
  return "";
};
interface CensusTable {
  [metricName: string]: string | number;
}

// Define the structure of an LGA entry which contains multiple tables
interface LgaCensusData {
  LGA_CODE_2021?: string;
  [tableId: string]: CensusTable | string | undefined;
}

const parseCensusFiles = async (
  fileConfigs: Array<[string, string]>,
  conversionLookup: any,
) => {
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
        const cleaned2019 = getGeoJSONCode(row.LGA_CODE_2021, conversionLookup);
        if (!censusLookup[cleaned2019]) {
          censusLookup[cleaned2019] = { LGA_CODE_2021: row.LGA_CODE_2021 };
        }
        if (!censusLookup[cleaned2019][prefix]) {
          censusLookup[cleaned2019][prefix] = {};
        }
        Object.keys(row).forEach((key) => {
          if (key !== "LGA_CODE_2021") {
            const flatKey = `${prefix}_${key}`; // MapLibre automatically flattens nested JSON, so we need to create a flat hierachy like "housing_Total_Total" instead of "housing": { "Total_Total": value }
            censusLookup[cleaned2019][flatKey] = row[key];
          }
        });
      }
    });
  });
  return censusLookup;
};
export default function MapView() {
  const [scenario, setScenario] = useState<Scenario>("vulnerability");
  const [year, setYear] = useState<Year>("2030");
  const [geoData, setGeoData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState<{
    // Used to track click information within the map to enable LGA info popups
    longitude: number;
    latitude: number;
    properties: any;
  } | null>(null);
  const onClick = (event: any) => {
    // When the user clicks on the map
    const feature = event.features && event.features[0];

    if (feature) {
      setHoverInfo({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        properties: feature.properties,
      });
    } else {
      setHoverInfo(null);
    }
  };
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
  const fillColor = useMemo((): any => {
    // Use 'any' or 'Expression' as the return type
    const legendKey =
      scenario === "SSP2" || scenario === "SSP3" ? "risk" : scenario;
    const config = (
      LEGEND_CONFIG as Record<string, { label: string; color: string }[]>
    )[legendKey];

    if (!config) return "#ccc";

    // Define the expression and explicitly cast the starting array
    const expression: any[] = [
      "match",
      ["to-number", ["get", activeMetric], 0],
    ];

    config.forEach((item, index) => {
      expression.push(index + 1);
      expression.push(item.color);
    });

    expression.push("#eeeeee");

    return expression;
  }, [scenario, activeMetric]);
  const years: Year[] = ["2030", "2050", "2070", "2090"];
  useEffect(() => {
    const loadData = async () => {
      // 3. Fetch both GeoJSON and CSV concurrently
      // Inside your useEffect loadData function
      const [geoRes, heatwaveRes, conversionRes] = await Promise.all([
        fetch("/data/nsw_lga.json"), // GeoJSON data for NSW LGAs (i.e. LGA map boundaries)
        fetch("/data/heatwaveData.csv"), // Heatwave vulnerability data provided by team
        fetch("/data/LGACODE_CONVERSION_2019_TO_2021.csv"), // Conversion file to match GeoJSON abs codes to 2021 LGA codes (To be merged with GeoJSON prior to launch)
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
      const censusLookup = await parseCensusFiles(
        [
          ["/data/2021_ABS_Census_G1.csv", "general"], // These id's will be prefixed to all census metrics keys. E.g. "general_Tot_P_P".
          ["/data/2021_ABS_Census_G11D.csv", "literacy"],
          ["/data/2021_ABS_Census_G17B.csv", "income"],
          ["/data/2021_ABS_Census_G35.csv", "housing"],
        ],
        conversionLookup,
      );
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
          onClick={onClick}
          interactiveLayerIds={["lga-fill"]} // Makes only the LGA polygons clickable
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
                  "fill-color": fillColor,
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
          {hoverInfo && (
            <Popup
              longitude={hoverInfo.longitude}
              latitude={hoverInfo.latitude}
              anchor="bottom"
              onClose={() => setHoverInfo(null)}
              closeOnClick={false}
              className="z-50"
            >
              <div className="p-2 text-black">
                <h3 className="font-bold border-b mb-1">
                  {hoverInfo.properties.lganame || "LGA Details"}
                </h3>
                {/* Displays warnings based on census data. E.g. "Vulnerability Warning: High Proportion of Low Income people" */}
                <CensusWarnings hoverContext={hoverInfo} />{" "}
                <p className="text-xs text-gray-500 mt-2">
                  LGA Code: {hoverInfo.properties.abscode}
                </p>
                <p className="text-xs text-gray-500 mt-2">statistic: {}</p>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
}
