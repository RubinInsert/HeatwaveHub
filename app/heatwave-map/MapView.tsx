"use client";
import Map, { Source, Layer } from "react-map-gl/maplibre";

import "maplibre-gl/dist/maplibre-gl.css";

// Australia - Victoria (VIC) Bounding Box as an example
const VIC_BOUNDS: [[number, number], [number, number]] = [
  [139.21, -38.31], // Southwest
  [161.13, -26.74], // Northeast
];

export default function MapView() {
  return (
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
        <Source id="nsw-lga-data" type="geojson" data="/data/nsw_lga.json">
          {/* 2. Add a Fill Layer for the Heatwave Regions */}
          <Layer
            id="lga-fill"
            type="fill"
            paint={{
              "fill-color": "#ff0000ff", // Heatwave orange
              "fill-opacity": 0.4,
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
      </Map>
    </div>
  );
}
