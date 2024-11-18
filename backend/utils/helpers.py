# Uporabljam za odstanjevanje $ znaka v financnih podatkih
# Odstrani $ znak in vrne vrednost tip float
def clean_value(value):
    if isinstance(value, str):
        value = value.replace('$', '').replace(',', '').replace('%', '').strip()
    try:
        return float(value)
    except ValueError:
        return 0