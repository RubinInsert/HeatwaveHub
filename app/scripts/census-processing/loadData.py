import sdmx
import pandas as pd

# CONFIG
YEAR_PREFIX, GEO_LABEL, TIME_VAL = '16', 'LGA2016', '2016'
abs_client = sdmx.Client('ABS_XML')

# 1. DEFINE YOUR METRICS (Label: [Table, Dimension, Search Phrase])
# Add every single metric you need here. 
METRIC_CONFIG = {
    'total_population':        ['G01', 'PCHAR', 'Total persons'],
    'age_0_4':                 ['G01', 'PCHAR', '0-4 years'],
    'age_65_74':               ['G01', 'PCHAR', '65-74 years'],
    'age_75_84':               ['G01', 'PCHAR', '75-84 years'],
    'age_86ov':                ['G01', 'PCHAR', '85 years and over'],
    'low_literacy':            ['G11', 'ENGLP', 'Not well or not at all'],
    'income_nil':              ['G17', 'INCP',  'Nil income'],
    'income_1_149':            ['G17', 'INCP',  '$1-$149'],
    'income_150_299':            ['G17', 'INCP',  '$150-299'],
    'income_300_399':            ['G17', 'INCP',  '$300-399'],
    'income_400_499':            ['G17', 'INCP',  '$400-499'],
    'income_500_650':            ['G17', 'INCP',  '$500-650'],
    'needs_assistance':        ['G18', 'ASSNP', 'Has need for assistance'],
    'heart_disease':           ['G19', 'LTHP',  'Heart disease'],
    'kidney_disease':          ['G19', 'LTHP',  'Kidney disease'],
    'lung_condition':          ['G19', 'LTHP',  'Lung condition'],
    'mental_health_condition': ['G19', 'LTHP',  'Mental health'],
    'lone_person':             ['G27', 'RLHP',  'Lone person']
}

# 2. RESOLVE ALL IDs IN A LOOP
print(f"--- Resolving IDs for Census 20{YEAR_PREFIX} ---")
resolved_ids = {}
for label, (res_id, dim_id, search_text) in METRIC_CONFIG.items():
    flow_id = f'C{YEAR_PREFIX}_{res_id}_LGA'
    try:
        dsd = abs_client.datastructure(resource_id=flow_id).structure[flow_id]
        codelist = dsd.dimensions.get(dim_id).local_representation.enumerated
        # Find the ID
        found_id = next((c.id for c in codelist if search_text.lower() in str(c.name).lower()), None)
        resolved_ids[label] = found_id
        if found_id:
            print(f"Matched: {label:<25} -> {found_id}")
    except Exception as e:
        print(f"Error resolving {label}: {e}")

# 3. FETCH AND EXTRACT
# We group the resolved IDs by their Table (G01, G11, etc.) to minimize API calls
tables_to_pull = list(set([v[0] for v in METRIC_CONFIG.values()]))
dfs = {}

for res_id in tables_to_pull:
    # Get all IDs needed for this specific table
    ids_for_table = [resolved_ids[k] for k, v in METRIC_CONFIG.items() if v[0] == res_id and resolved_ids[k]]
    
    # Simple logic to handle different dimension names per table
    dim_name = next(v[1] for v in METRIC_CONFIG.values() if v[0] == res_id)
    
    msg = abs_client.data(resource_id=f'C{YEAR_PREFIX}_{res_id}_LGA', 
                          key={'STATE': '1', dim_name: ids_for_table})
    dfs[res_id] = sdmx.to_pandas(msg)

# 4. DYNAMIC .XS() MAPPING (With Duplicate Prevention)
extracted = {}
for label, (res_id, dim_id, _) in METRIC_CONFIG.items():
    target_id = resolved_ids.get(label)
    if target_id is None: continue
        
    try:
        df = dfs[res_id]
        
        # --- NEW: Aggressive Index Cleaning ---
        # 1. Filter the main target (e.g., Heart Disease)
        temp_df = df.xs(target_id, level=dim_id)
        
        # 2. Pin common "baggage" dimensions to 'Total' if they still exist
        # '3' is usually Total for SEXP; '_T' is usually Total for AGEP/YARP
        for baggage_dim, total_val in [('SEXP', '3'), ('AGEP', '_T'), ('YARP', '_T')]:
            if baggage_dim in temp_df.index.names and baggage_dim != dim_id:
                try:
                    temp_df = temp_df.xs(total_val, level=baggage_dim)
                except KeyError:
                    pass # Dimension exists but total_val doesn't match; skip
        
        # 3. Filter the Standard Metadata levels
        series = temp_df.xs((GEO_LABEL, '1', TIME_VAL), 
                           level=('REGION_TYPE', 'STATE', 'TIME_PERIOD'))
        
        # 4. Final safety check: if we STILL have duplicates, take the first one
        if series.index.duplicated().any():
            print(f"⚠️ Removing residual duplicates in {label}")
            series = series[~series.index.duplicated(keep='first')]

        # Standardize the index to the LGA code (REGION)
        series.index = series.index.get_level_values('REGION')
        extracted[label] = series
        
    except Exception as e:
        print(f"⚠️ Error processing {label}: {e}")

# 5. ASSEMBLE TABLE
final_table = pd.DataFrame(extracted)
final_table.index.name = 'LGA_CODE'
print(final_table.head())