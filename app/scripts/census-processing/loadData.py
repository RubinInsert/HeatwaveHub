import sdmx
import pandas as pd
# CONFIG
YEAR_PREFIX = '16'    # Change to '21' for 2021
GEO_LABEL = 'LGA2016' # Change to 'LGA2021' for 2021
TIME_VAL = '2016'

# 1. Use Client instead of Request (fixes the v3.0 warning)
abs_client = sdmx.Client('ABS_XML')
G01 = abs_client.data(
    resource_id=f'C{YEAR_PREFIX}_G01_LGA',
    key={
        'STATE': '1',
        'SEXP': '3',
        'PCHAR': ['P_1', '0_4', '65_74', '75_84', 'GE85'],
        }
)
G11 = abs_client.data(
    resource_id=f'C{YEAR_PREFIX}_G11_LGA',
    key={
        'STATE': '1',
        'AGEP': '_T',
        'ENGLP': '3',
        'YARP': '_T'
        }
)
G17 = abs_client.data(
    resource_id=f'C{YEAR_PREFIX}_G17_LGA',
    key={
        'STATE': '1',
        'SEXP': '3',
        'AGEP': '_T',
        'INCP': ['1', '2', '3', '4', '5', '6']
        }
)
G18 = abs_client.data(
    resource_id=f'C{YEAR_PREFIX}_G18_LGA',
    key={
        'STATE': '1',
        'SEXP': '3',
        'AGEP': '_T',
        'ASSNP': '1'
        }
)
G19 = abs_client.data(
    resource_id=f'C{YEAR_PREFIX}_G19_LGA',
    key={
        'STATE': '1',
        'SEXP': '3',
        'AGEP': '_T',
        'LTHP': ['61', '71', '81', '91']
        }
)
G27 = abs_client.data(
    resource_id=f'C{YEAR_PREFIX}_G27_LGA',
    key={
        'STATE': '1',
        'SEXP': '3',
        'AGEP': '_T',
        'RLHP': '10'
        }
)
G01_DF = sdmx.to_pandas(G01)
G11_DF = sdmx.to_pandas(G11)
G17_DF = sdmx.to_pandas(G17)
G18_DF = sdmx.to_pandas(G18)
G19_DF = sdmx.to_pandas(G19)
G27_DF = sdmx.to_pandas(G27)
dsd_msg = abs_client.datastructure(resource_id='C21_G19_LGA')
dsd = dsd_msg.structure['C21_G19_LGA']

# 2. Print all Dimension IDs
print("--- Dimensions for G19 ---")
for dim in dsd.dimensions:
    print(dim.id)

# G11 = abs_client.data(
#     resource_id='C21_G11_LGA',
#     key={'REGION': '15900'}
# )
# 2. Fetch data from ABS
# Note: This currently keeps your existing REGION filter. Remove the key to pull all LGAs.

# # 3. Convert to Pandas
#df = sdmx.to_pandas(G01)

## -- PRINTING
# 2. Access the PCHAR Codelist directly
# Dimensions in SDMX point to a 'codelist' which contains the IDs and Names
pchar_codelist = dsd.dimensions.get('LTHP').local_representation.enumerated

print(f"{'ID':<15} | {'Description'}")
print("-" * 60)

# 3. Loop through and print
for code in pchar_codelist:
    print(f"{code.id:<15} | {code.name}")

## --- PRINTING
try:
    # 4. Filter to total population records:
    # SEXP='3' (Persons), PCHAR='P_1' (Total persons), REGION_TYPE='LGA2021', STATE='1', TIME_PERIOD='2021'
    total_pop = G01_DF.xs(
        ('3', # Persons
        'P_1', # Total persons
        GEO_LABEL, # Extra safety check to ensure sorted by LGAs
        '1', # NSW LGA Code
        TIME_VAL),
        level=('SEXP', 'PCHAR', 'REGION_TYPE', 'STATE', 'TIME_PERIOD')
    )
    age_0_4 =  G01_DF.xs(
        ('3', # Persons
        '0_4', # Age groups: 0-4 years
        GEO_LABEL, # Extra safety check to ensure sorted by LGAs
        '1', # NSW LGA Code
        TIME_VAL),
        level=('SEXP', 'PCHAR', 'REGION_TYPE', 'STATE', 'TIME_PERIOD')
    )
    age_65_74 =  G01_DF.xs(
        ('3', # Persons
        '65_74', # Age groups: 65-74 years
        GEO_LABEL, # Extra safety check to ensure sorted by LGAs
        '1', # NSW LGA Code
        TIME_VAL),
        level=('SEXP', 'PCHAR', 'REGION_TYPE', 'STATE', 'TIME_PERIOD')
    )
    age_75_84 =  G01_DF.xs(
        ('3', # Persons
        '75_84', # Age groups: 75-84 years
        GEO_LABEL, # Extra safety check to ensure sorted by LGAs
        '1', # NSW LGA Code
        TIME_VAL),
        level=('SEXP', 'PCHAR', 'REGION_TYPE', 'STATE', 'TIME_PERIOD')
    )
    age_85ov =  G01_DF.xs(
        ('3', # Persons
        'GE85', # Age groups: 85 years and over
        GEO_LABEL, # Extra safety check to ensure sorted by LGAs
        '1', # NSW LGA Code
        TIME_VAL),
        level=('SEXP', 'PCHAR', 'REGION_TYPE', 'STATE', 'TIME_PERIOD')
    )
    low_literacy =  G11_DF.xs(
        ('_T', # Age: Total
        '3', # Uses other language and speaks English: Not well or not at all
        '_T', # Arrived: Total
        GEO_LABEL, # Extra safety check to ensure sorted by LGAs
        '1', # NSW LGA Code
        TIME_VAL),
        level=('AGEP', 'ENGLP', 'YARP', 'REGION_TYPE', 'STATE', 'TIME_PERIOD')
    )
    income_nil = G17_DF.xs(
        ('3', # Persons
         '1', # Negative/Nil income
         '_T', # Total Age
         GEO_LABEL, # Extra safety check to ensure sorted by LGAs
         '1', # NSW LGA Code
         TIME_VAL),
        level=('SEXP', 'INCP', 'AGEP', 'REGION_TYPE', 'STATE', 'TIME_PERIOD')
    )
    income_1_149 = G17_DF.xs(
        ('3', # Persons
         '2', # $1-149
         '_T', # Total Age
         GEO_LABEL, # Extra safety check to ensure sorted by LGAs
         '1', # NSW LGA Code
         TIME_VAL),
        level=('SEXP', 'INCP', 'AGEP', 'REGION_TYPE', 'STATE', 'TIME_PERIOD')
    )
    income_150_299 = G17_DF.xs(
        ('3', # Persons
         '3', # $150-$299
         '_T', # Total Age
         GEO_LABEL, # Extra safety check to ensure sorted by LGAs
         '1', # NSW LGA Code
         TIME_VAL),
        level=('SEXP', 'INCP', 'AGEP', 'REGION_TYPE', 'STATE', 'TIME_PERIOD')
    )
    income_300_399 = G17_DF.xs(
        ('3', # Persons
         '4', # $150-$299
         '_T', # Total Age
         GEO_LABEL, # Extra safety check to ensure sorted by LGAs
         '1', # NSW LGA Code
         TIME_VAL),
        level=('SEXP', 'INCP', 'AGEP', 'REGION_TYPE', 'STATE', 'TIME_PERIOD')
    )
    income_400_499 = G17_DF.xs(
        ('3', # Persons
         '5', # $150-$299
         '_T', # Total Age
         GEO_LABEL, # Extra safety check to ensure sorted by LGAs
         '1', # NSW LGA Code
         TIME_VAL),
        level=('SEXP', 'INCP', 'AGEP', 'REGION_TYPE', 'STATE', 'TIME_PERIOD')
    )
    income_500_650 = G17_DF.xs(
        ('3', # Persons
         '6', # $150-$299
         '_T', # Total Age
         GEO_LABEL, # Extra safety check to ensure sorted by LGAs
         '1', # NSW LGA Code
         TIME_VAL),
        level=('SEXP', 'INCP', 'AGEP', 'REGION_TYPE', 'STATE', 'TIME_PERIOD')
    )
    needs_assistance = G18_DF.xs(
        ('3', # Persons
         '_T', # Total Age
         '1', # Needs Assistance
         GEO_LABEL, # Extra safety check to ensure sorted by LGAs
         '1', # NSW LGA Code
         TIME_VAL),
        level=('SEXP', 'AGEP', 'ASSNP', 'REGION_TYPE', 'STATE', 'TIME_PERIOD')
    )
    heart_disease = G19_DF.xs(
        ('3', # Persons
         '61', # Heart disease (including heart attack or angina)
         '_T', # Total Age
         GEO_LABEL, # Extra safety check to ensure sorted by LGAs
         '1', # NSW LGA Code
         TIME_VAL),
        level=('SEXP', 'LTHP', 'AGEP', 'REGION_TYPE', 'STATE', 'TIME_PERIOD')
    )
    kidney_disease = G19_DF.xs(
        ('3', # Persons
         '71', # Kidney disease
         '_T', # Total Age
         GEO_LABEL, # Extra safety check to ensure sorted by LGAs
         '1', # NSW LGA Code
         TIME_VAL),
        level=('SEXP', 'LTHP', 'AGEP', 'REGION_TYPE', 'STATE', 'TIME_PERIOD')
    )
    lung_condition = G19_DF.xs(
        ('3', # Persons
         '81', # Lung condition (including COPD or emphysema)
         '_T', # Total Age
         GEO_LABEL, # Extra safety check to ensure sorted by LGAs
         '1', # NSW LGA Code
         TIME_VAL),
        level=('SEXP', 'LTHP', 'AGEP', 'REGION_TYPE', 'STATE', 'TIME_PERIOD')
    )
    mental_health_condition = G19_DF.xs(
        ('3', # Persons
         '91', # Mental health condition (including depression or anxiety)
         '_T', # Total Age
         GEO_LABEL, # Extra safety check to ensure sorted by LGAs
         '1', # NSW LGA Code
         TIME_VAL),
        level=('SEXP', 'LTHP', 'AGEP', 'REGION_TYPE', 'STATE', 'TIME_PERIOD')
    )
    lone_person = G27_DF.xs(
        ('3', # Persons
         '10', # Lone person
         '_T', # Total Age
         GEO_LABEL, # Extra safety check to ensure sorted by LGAs
         '1', # NSW LGA Code
         TIME_VAL),
        level=('SEXP', 'RLHP', 'AGEP', 'REGION_TYPE', 'STATE', 'TIME_PERIOD')
    )
    # 5. Build a one-row table where each column is an LGA code.
    # If REGION values include labels, keep only the numeric code prefix when possible.
    combined_table = pd.concat({
        'total_population': total_pop,
        'age_0_4': age_0_4,
        'age_65_74': age_65_74,
        'age_75_84': age_75_84,
        'age_86ov': age_85ov,
        'low_literacy': low_literacy,
        'income_nil': income_nil,
        'income_150_299': income_150_299,
        'income_300_399': income_300_399,
        'income_400_499': income_400_499,
        'income_500_650': income_500_650,
        'needs_assistance': needs_assistance,
        'heart_disease': heart_disease,
        'kidney_disease': kidney_disease,
        'lung_condition': lung_condition,
        'mental_health_condition': mental_health_condition,
        'lone_person': lone_person
    }, axis=0)
    table = combined_table.unstack(level=0)
    table.index.name = 'LGA_CODE'
    #table.columns = [str(col).split(':')[0].strip() for col in table.columns]
    #table.to_json('lga_total_population_table.json', orient='index')
    print("\n--- NSW LGA Vulnerability Table (First 5 LGAs) ---")
    print(table.head())
except Exception as e:
    print(f"Extraction failed: {e}")