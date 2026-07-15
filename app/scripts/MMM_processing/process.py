import pandas as pd

# 1. Load the CSV file
df = pd.read_csv('MMM_SCORE.csv')

# 2. Group by postcode and average the raw integer MMM scores first
# We do not round yet to keep the intermediate math perfectly accurate
averaged_df = df.groupby('POSTCODE_2021')['MMM_SCORE'].mean()

# 3. Linearly map the averaged scores from the 1-7 scale to a 0-1 scale
# Formula: (Score - 1) / (7 - 1)
mapped_df = ((averaged_df - 1) / 6).round(2)

# 4. Build the JavaScript object string
js_lines = []
js_lines.append("const POSTCODE_MMM_MAP = {")

for postcode, score in mapped_df.items():
    # If the interpolated score is exactly 0 or 1, convert to int for a cleaner look
    clean_score = int(score) if score in [0.0, 1.0] else score
    js_lines.append(f'  "{postcode}": {clean_score},')

# Remove the trailing comma from the last element for clean JS syntax
if len(js_lines) > 1:
    js_lines[-1] = js_lines[-1].rstrip(',')

js_lines.append("};")

# 5. Save the output to a JavaScript file
output_filename = 'postcode_mmm_map.js'
with open(output_filename, 'w') as f:
    f.write('\n'.join(js_lines))

print(f"Successfully created {output_filename} linear interpolation between 0 and 1!")