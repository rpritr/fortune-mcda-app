# I use it to remove the $ sign in financial data
# Removes the $ sign and returns a float value
def clean_value(value):
    if isinstance(value, str):
        value = value.replace('$', '').replace(',', '').replace('%', '').strip()
    try:
        return float(value)
    except ValueError:
        return 0