import sdmx
import pandas as pd

# CONFIG
YEAR_PREFIX, GEO_LABEL, TIME_VAL = '21', 'LGA2021', '2021'
abs_client = sdmx.Client('ABS_XML')

# 1. DEFINE YOUR METRICS (Label: [Table, Dimension, Search Phrase])
# Add every single metric you need here. 
METRIC_CONFIG = {
    'total_population':        ['G01', 'PCHAR', 'P_1'],
    'indigenous':        ['G01', 'PCHAR', 'A_T'],
    'age_0_4':                 ['G01', 'PCHAR', '0_4'],
    'age_65_74':               ['G01', 'PCHAR', '65_74'],
    'age_75_84':               ['G01', 'PCHAR', '75_84'],
    'age_86ov':                ['G01', 'PCHAR', 'GE85'],
    'low_literacy':            ['G11', 'ENGLP', '3'],
    'income_nil':              ['G17', 'INCP',  '1'],
    'income_1_149':            ['G17', 'INCP',  '2'],
    'income_150_299':            ['G17', 'INCP',  '3'],
    'income_300_399':            ['G17', 'INCP',  '4'],
    'income_400_499':            ['G17', 'INCP',  '5'],
    'income_500_649':            ['G17', 'INCP',  '6'],
    'needs_assistance':        ['G18', 'ASSNP', '1'],
    'heart_disease':           ['G19', 'LTHP',  '61'],
    'kidney_disease':          ['G19', 'LTHP',  '71'],
    'lung_condition':          ['G19', 'LTHP',  '81'],
    'mental_health_condition': ['G19', 'LTHP',  '91'],
    'lone_person':             ['G27', 'RLHP',  '10']
}

tables_to_pull = list(set([v[0] for v in METRIC_CONFIG.values()]))
dfs = {}

print(f"--- Fetching Data for Census 20{YEAR_PREFIX} ---")
for res_id in tables_to_pull:
    # Get all IDs for this table
    ids_for_table = [v[2] for k, v in METRIC_CONFIG.items() if v[0] == res_id]
    dim_name = next(v[1] for v in METRIC_CONFIG.values() if v[0] == res_id)
    
    msg = abs_client.data(resource_id=f'C{YEAR_PREFIX}_{res_id}_LGA', 
                          key={'STATE': '1', dim_name: ids_for_table})
    dfs[res_id] = sdmx.to_pandas(msg)

# 3. DYNAMIC .XS() MAPPING
extracted = {}
for label, (res_id, dim_id, target_id) in METRIC_CONFIG.items():
    try:
        df = dfs[res_id]
        temp_df = df.xs(target_id, level=dim_id)
        
        # Pin common "baggage" dimensions to Total
        # 2021 often uses '3' for SEXP and '_T' for others
        for baggage_dim, total_val in [('SEXP', '3'), ('AGEP', '_T'), ('YARP', '_T')]:
            if baggage_dim in temp_df.index.names and baggage_dim != dim_id:
                try: temp_df = temp_df.xs(total_val, level=baggage_dim)
                except KeyError: pass
        
        series = temp_df.xs((GEO_LABEL, '1', TIME_VAL), 
                           level=('REGION_TYPE', 'STATE', 'TIME_PERIOD'))
        
        if series.index.duplicated().any():
            series = series[~series.index.duplicated(keep='first')]

        series.index = series.index.get_level_values('REGION')
        extracted[label] = series
    except Exception as e:
        print(f"⚠️ Error processing {label}: {e}")

# 4. ASSEMBLE TABLE
final_table = pd.DataFrame(extracted)
final_table.index.name = 'LGA_CODE'

import geopandas as gpd
# 5. JOIN WITH GEOJSON
gdf = gpd.read_file('nsw_lga.json')
gdf['LGA_CODE25'] = gdf['LGA_CODE25'].astype(str)
final_table.index = final_table.index.astype(str)

merged_gdf = gdf.merge(final_table, left_on='LGA_CODE25', right_index=True, how='left')

# Fill only the data columns with 0 to avoid the Geometry TypeError
merged_gdf[list(METRIC_CONFIG.keys())] = merged_gdf[list(METRIC_CONFIG.keys())].fillna(0)

# 1. Load CSVs
heatwave_df = pd.read_csv('heatwaveData.csv')
ndvi_df = pd.read_csv('ndvi.csv')

# 2. Merge CSVs first on LGA_CODE21
# We do this first to create one "Supplementary Data" block
csv_combined = pd.merge(heatwave_df, ndvi_df, on='LGA_CODE21', how='outer')

# 3. Standardize types for the Census Table (final_table)
# Your final_table index is the REGION (LGA_CODE21)
final_table.index = final_table.index.astype(str)
csv_combined['LGA_CODE21'] = csv_combined['LGA_CODE21'].astype(str)

# 4. Join Census data and CSV data into one master dataframe
master_data = final_table.merge(
    csv_combined, 
    left_index=True, 
    right_on='LGA_CODE21', 
    how='left'
)

# 5. Join with the 2025 GeoJSON
gdf = gpd.read_file('nsw_lga.json')
gdf['LGA_CODE25'] = gdf['LGA_CODE25'].astype(str)

# We map the 2021 data onto the 2025 geometries
# If the codes are different (e.g., 21550 vs 21551), this will result in NaNs
merged_gdf = gdf.merge(
    master_data, 
    left_on='LGA_CODE25', 
    right_on='LGA_CODE21', 
    how='left'
)

# 6. Final Clean up
# Identify numeric columns to fill with 0, ignoring the 'geometry'
numeric_cols = merged_gdf.select_dtypes(include=['number']).columns
merged_gdf[numeric_cols] = merged_gdf[numeric_cols].fillna(0)

# Save the final file
merged_gdf.to_file("nsw_lga_2025_integrated.geojson", driver='GeoJSON')

print(f"Merged {len(merged_gdf)} rows.")