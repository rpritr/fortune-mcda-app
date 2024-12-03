import numpy as np

def preference_function(difference, p=0.5, q=0.1):
    """Linearna preferenčna funkcija."""
    #if difference == 0:
    #    return 0.5  # Enake alternative dobijo nevtralno preferenco
    if difference <= q:
        return 0
    elif q < difference <= p:
        return (difference - q) / (p - q)
    else:
        return 1

