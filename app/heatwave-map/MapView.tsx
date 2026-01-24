"use client";
import Map, { Source, Layer } from "react-map-gl/maplibre";
import React, { useMemo, useEffect, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { heatwaveData, HeatwaveData } from "./data/heatwaveData";
const VIC_BOUNDS: [[number, number], [number, number]] = [
  [139.21, -38.31], // Southwest
  [161.13, -26.74], // Northeast
];
type HeatwaveMetric = keyof HeatwaveData;
const METRIC_LABELS: Partial<Record<HeatwaveMetric, string>> = {
  vulnerability_score: "Social Vulnerability",
  cat_hist_1951_2023: "Historical Records (1951-2023)",
  cat_recent_2002_2023: "Recent Records (2002-2023)",
  cat_2030_SSP2: "Moderate Scenario (2030)",
  cat_2050_SSP2: "Moderate Scenario (2050)",
  cat_2070_SSP2: "Moderate Scenario (2070)",
  cat_2090_SSP2: "Moderate Scenario (2090)",
  cat_2030_SSP3: "Worst-Case Scenario (2030)",
  cat_2050_SSP3: "Worst-Case Scenario (2050)",
  cat_2070_SSP3: "Worst-Case Scenario (2070)",
  cat_2090_SSP3: "Worst-Case Scenario (2090)",
};

export default function MapView() {
  const [geoData, setGeoData] = useState(null);
  const [activeMetric, setActiveMetric] = useState<HeatwaveMetric>(
    "vulnerability_score"
  );
  useEffect(() => {
    fetch("/data/nsw_lga.json")
      .then((res) => res.json())
      .then((data) => {
        const mergedFeatures = data.features.map((feature: any) => {
          // Identify the key used in heatwaveData (e.g., "5700")
          const lgaCode = feature.properties.abscode;
          const heatwaveStats = heatwaveData[lgaCode];

          return {
            ...feature,
            properties: {
              ...feature.properties,
              // Add the score to properties so the Layer can see it
              ...heatwaveStats,
            },
          };
        });
        setGeoData({ ...data, features: mergedFeatures });
      });
  }, []);
  return (
    <div className="flex flex-col gap-4">
      {/* 2. The Switcher UI */}
      <div className="flex flex-wrap gap-2 p-4 bg-white shadow-sm rounded-lg">
        {Object.entries(METRIC_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveMetric(key as HeatwaveMetric)}
            className={`px-4 py-2 rounded transition-colors ${
              activeMetric === key
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
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
                    ["get", activeMetric],
                    0,
                    "#444444ff", // No score
                    1,
                    "#fee0d2", // Low
                    2,
                    "#fc9272", // Medium
                    3,
                    "#de2d26", // High
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
