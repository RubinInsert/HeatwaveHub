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

type Scenario = "vulnerability" | "exposure" | "SSP2" | "SSP3";
type Year = "2030" | "2050" | "2070" | "2090";

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

    expression.push("#ff0000");

    return expression;
  }, [scenario, activeMetric]);
  const years: Year[] = ["2030", "2050", "2070", "2090"];
  useEffect(() => {
    (async () => {
      const mergedGeoJSON = await fetch("/data/nsw_lga.geojson").then((res) =>
        res.json(),
      );
      setGeoData(mergedGeoJSON);
    })();
  }, []);
  return (
    <div className="flex h-full flex-col gap-4">
      {/* 2. The Switcher UI */}
      <div className="h-full w-full">
        <Map
        style={{ width: "100%", height: "100%" }}
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
                  "text-field": ["get", "LGA_NAME"],
                  "text-size": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    5,
                    10,
                    10,
                    14,
                    14,
                    20,
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
                  {hoverInfo.properties.LGA_NAME25 || "LGA Details"}
                </h3>
                {/* Displays warnings based on census data. E.g. "Vulnerability Warning: High Proportion of Low Income people" */}
                <CensusWarnings hoverContext={hoverInfo} />{" "}
                <p className="text-xs text-gray-500 mt-2">
                  LGA Code: {hoverInfo.properties.LGA_CODE}
                </p>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
}
