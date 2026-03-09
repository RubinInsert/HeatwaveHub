# Heatwave Hub

The Heatwave Hub is a centralized website which provides important information regarding heatwaves to LGAs and individuals. The website includes a personalized questionaire for a personal score, a mapping tool to analyze past, present, and projected vulnerability of NSW LGAs.

This file documents the setup and maintanance steps for the Heatwave hub.

## Setup & Installation

### With Docker

```
docker compose up --build
```

### Without Docker

```
npm install -g pnpm

pnpm install

pnpm build

pnpm start
```

## Maintainance and Updating Resources

### GeoJSON: LGA Map boundaries

1. Visit: [Digital boundary files - ABS](https://www.abs.gov.au/statistics/standards/australian-statistical-geography-standard-asgs-edition-3/jul2021-jun2026/access-and-downloads/digital-boundary-files) to download the latest **GDA94** dataset under **Non ABS Structures**. This ShapeFiles contains the LGA boundaries for all of Australia.
2. Pass the downloaded file into [MapShaper](https://mapshaper.org)
3. Enter into the console `filter 'STE_NAME21 == "New South Wales"'` to ensure only the NSW boundaries are kept.
4. Use the **Simplify** Tool with `prevent shape removal` **on**, and the method as `weighted area` to reduce the map to 10%
5. Export as **GeoJSON** with `nsw_lga` as the layer name.
6. Place the `nsw_lga.json` file in the `app/public/data/` directory.
