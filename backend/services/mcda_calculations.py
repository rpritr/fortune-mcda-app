import numpy as np
from utils.helpers import clean_value

#  Algoritem očisti vrednosti in jih pomnoži z utežmi
# Rezultat je urejen seznam doseženih točk.
def wsm(companies, weights):
    normalized_weights = {key: weight / 100 for key, weight in weights.items()}
    results = []
    # za vsako podjetje se očisti vrednost in pomnoži z utežjo
    for company in companies:
        score = 0
        for key, weight in normalized_weights.items():
            score += clean_value(company.get(key, 0)) * weight
        results.append({'name': company['name'], 'score': score})
    return sorted(results, key=lambda x: x['score'], reverse=True)

def topsis(matrix, weights, is_benefit):
    # Prvi korak je normalizacija matrike, 
    normalized_matrix = matrix / np.sqrt((matrix ** 2).sum(axis=0))
    weighted_matrix = normalized_matrix * weights

    # Določimo pozitivni in negativni vektor.
    positive_ideal = np.max(weighted_matrix, axis=0) if is_benefit else np.min(weighted_matrix, axis=0)
    negative_ideal = np.min(weighted_matrix, axis=0) if is_benefit else np.max(weighted_matrix, axis=0)
    # Algoritem izračuna razdalje do obeh vektorjev 
    # Določimo relativno bližino pozitivnemu idealu.
    positive_distance = np.sqrt(((weighted_matrix - positive_ideal) ** 2).sum(axis=1))
    negative_distance = np.sqrt(((weighted_matrix - negative_ideal) ** 2).sum(axis=1))
    return negative_distance / (positive_distance + negative_distance)

def normalize_matrix(matrix):
    """Normalizira matriko parnih primerjav."""
    column_sums = matrix.sum(axis=0)
    normalized_matrix = matrix / column_sums
    print("Originalna matrika:", matrix)
    print("Vsote stolpcev:", column_sums)
    print("Normalizirana matrika:", normalized_matrix)
    return normalized_matrix

def calculate_weights(normalized_matrix):
    """Izračuna povprečne vrednosti vrstic, ki predstavljajo uteži kriterijev."""
    return normalized_matrix.mean(axis=1)

def calculate_consistency_ratio(matrix, weights):
    """Izračuna indeks konsistence in konsistenčno razmerje."""
    n = matrix.shape[0]
    lambda_max = (np.dot(matrix, weights) / weights).mean()
    consistency_index = (lambda_max - n) / (n - 1)

    # Naključni indeksi za različne velikosti matrik (1-10)
    random_index_dict = {1: 0.0, 2: 0.0, 3: 0.58, 4: 0.9, 5: 1.12, 6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49}
    random_index = random_index_dict.get(n, 1.49)  # privzeta vrednost za velike matrike

    consistency_ratio = consistency_index / random_index
    return consistency_ratio

def ahp(matrix):
    """Izvede AHP analizo na podlagi matrike parnih primerjav."""
    normalized_matrix = normalize_matrix(matrix)
    weights = calculate_weights(normalized_matrix)
    consistency_ratio = calculate_consistency_ratio(matrix, weights)
    consistency_message = 'test'


    if consistency_ratio < 0.1:
        print("Konsistenca je ustrezna.")
    else:
        print("Pozor: Konsistenca ni ustrezna! Razmislite o ponovni oceni parnih primerjav.")
    
    return weights, consistency_ratio, consistency_message