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

def normalize_matrix(matrix):
    # Normalizira matriko parnih primerjav
    column_sums = matrix.sum(axis=0)
    normalized_matrix = matrix / column_sums
    print("Originalna matrika:", matrix)
    print("Vsote stolpcev:", column_sums)
    print("Normalizirana matrika:", normalized_matrix)
    return normalized_matrix

def calculate_weights(normalized_matrix):
    # Vrne povprečne vrednosti vrstic, ki predstavljajo uteži kriterijev
    return normalized_matrix.mean(axis=1)

def calculate_consistency_ratio(matrix, weights):
    # Indeks konsistence in CR
    n = matrix.shape[0]
    lambda_max = (np.dot(matrix, weights) / weights).mean()
    consistency_index = (lambda_max - n) / (n - 1)

    # Naključni indeksi za različne velikosti matrik (1-10)
    random_index_dict = {1: 0.0, 2: 0.0, 3: 0.58, 4: 0.9, 5: 1.12, 6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49}
    random_index = random_index_dict.get(n, 1.49)  # privzeta vrednost za velike matrike

    consistency_ratio = consistency_index / random_index
    return consistency_ratio