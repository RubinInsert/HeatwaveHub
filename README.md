# Heatwave Hub

The Heatwave Hub is a centralised website which provides important information regarding heatwaves to LGAs and individuals. The website includes a personalized questionaire for a personal score, a mapping tool to analyze past, present, and projected vulnerability of NSW LGAs.

This file documents the setup and maintanance steps for the Heatwave hub.

## Setup & Installation

### With Docker

Ensure you uncomment `output: "standalone"` in the `next.config.ts` file

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
6. Place the `nsw_lga.json` file in the `app/scripts/census-processing/` directory.
7. Proceed with the [Data Merging Section](#data-merging)

### Heatwave Data

The expected format of the `heatwaveData.csv` file is outlined below:
| LGA_CODE21 | exposure_group | vulnerability_group | AGCD_hist_score_n_group | AGCD_recent_score_n_group | 2020_2039_SSP2_score_n_group | 2040_2059_SSP2_score_n_group | 2060_2079_SSP2_score_n_group | 2080_2099_SSP2_score_n_group | 2020_2039_SSP3_score_n_group | 2040_2059_SSP3_score_n_group | 2060_2079_SSP3_score_n_group | 2080_2099_SSP3_score_n_group | recent_risk_equal_group | 2030_risk_equal_SSP2_group | 2050_risk_equal_SSP2_group | 2070_risk_equal_SSP2_group | 2090_risk_equal_SSP2_group | 2030_risk_equal_SSP3_group | 2050_risk_equal_SSP3_group | 2090_risk_equal_SSP3_group |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
10050 | 3 | 5 | 3 | 4 | 5 | 7 | 8 | 9 | 5 | 8 | 9 | 10 | 5 | 6 | 7 | 8 | 8 | 6 | 8 | 9 | 10 |
|...|...|...|...|...|...|...|...|...|...|...|...|...|...|...|...|...|...|...|...|...|

1. Place the new ndvi.csv file into the `app/scripts/census-processing` directory
2. Proceed with the steps in the [Data Merging Section](#data-merging)

### NDVI Data

The expected format of the `ndvi.csv` format is outlined below:
| LGA_CODE21 | MEDIAN_NDVI |
|---| ---|
| 10050 | 0.602859914 |
|...|...|

To update these metrics follow the steps below:

1. Place the new ndvi.csv file into the `app/scripts/census-processing` directory
2. Proceed with the steps in the [Data Merging Section](#data-merging)

### Census Data

At the time of development, the Australian Bureau of Statistics is undergoing changes regarding their general community profiles and are likely to entirely overhaul how their census data is accessed.

The code within [loadData.py](/app/scripts/census-processing/loadData.py) may require tweaking to accomodate the changes made for the 2026 census.

If the general structure remains the same, updating to the newest census will follow these steps:

1. Update the `YEAR_PREFIX`, `GEO_LABEL`, and `TIME_VAL` to correspond to the correct year.
2. Ensure correctness of `METRIC_CONFIG` to account for any drift in ID numbers.
   - Visit [ABS Data Explorer](https://dataexplorer.abs.gov.au/)
   - Find a data pack containing the specific metric
   - Set the labels to `Both` to show both the metric name and identifiers.
   - Ensure the datapack identifier is matching the first entry in the config.
   - Ensure the selected characteristic identifier is matching the second entry in the config.
   - Ensure the selected metric identifier is matching the third entry in the config
     ![Metric Config Data Explorer Explanation](/docs/metric_config.png)

## Data Merging

Merging new data can proceed once the following files are present in the `app/scripts/census-processing/` directory:

- `heatwaveData.csv`
- `ndvi.csv`
- `nsw_lga.json`

### Merging into a single GeoJSON file

Ensure python 3.12 is installed

```bash
# Move into the script's directory
cd app/scripts/census-processing

# Create a virtual enviroment for python
python -m venv venv

venv\Scripts\activate # or "source venv/bin/activate" on Mac/Linux

# Install requirements
pip install -r requirements.txt

# Run the script
python loadData.py
```
