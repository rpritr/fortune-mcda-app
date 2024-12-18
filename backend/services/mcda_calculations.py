import numpy as np
from utils.helpers import clean_value
from services.helpers import preference_function

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


def promethee(matrix, weights, is_benefit, p=0.5, q=0.1):
    import logging
    logging.basicConfig(level=logging.DEBUG)
    
    n_alternatives, n_criteria = matrix.shape

    if isinstance(weights, np.ndarray):
        weights = weights.item()  # Pretvori numpy.ndarray v slovar    
    criteria = list(weights.keys())

    max_values = matrix.max(axis=0)
    logging.debug(f"Max values for each column: {max_values}")
  
    # Normalizacija matrike
    normalized_matrix = np.divide(matrix,matrix.max(axis=0, keepdims=True),where=(matrix.max(axis=0, keepdims=True) != 0))
    #normalized_matrix = matrix / matrix.max(axis=0)

    preference_matrix = np.zeros((n_alternatives, n_alternatives))

    # Izračun preferenčne matrike
    for i in range(n_alternatives):
        for j in range(n_alternatives):
            if i != j:
                for k in range(n_criteria):
                    diff = normalized_matrix[i, k] - normalized_matrix[j, k]
                    # Preverimo, če je kriterij "benefit" ali "cost"
                    key = criteria[k]

                    is_benefit_value = is_benefit.get(key, True)
                    if not is_benefit_value:  # Obrni razliko za "cost" kriterij
                        diff = -diff
                #    logging.debug(f"Key: {key}, Weight: {weights.get(key)}, Preference Function: {preference_function(diff, p, q)}")
                #    logging.debug(f"Key: {key}, Diff: {diff}, P: {p}, Q: {q}")
                #    logging.debug(f"Normalized Matrix for Key {key}: {normalized_matrix[:, k]}")
                    preference_matrix[i, j] += weights[key] * preference_function(diff, p, q)

    # Izračun pretokov
    phi_plus = preference_matrix.sum(axis=1) / (n_alternatives - 1)
    phi_minus = preference_matrix.sum(axis=0) / (n_alternatives - 1)
    #phi_plus = 1
    #phi_minus = 0.5
    score = phi_plus - phi_minus

    logging.debug(f"Matrix: {matrix}")
    logging.debug(f"Weights: {weights}")
    logging.debug(f"is_benefit: {is_benefit}")
    logging.debug(f"Preference Matrix: {preference_matrix}")
    logging.debug(f"Normalized Matrix: {normalized_matrix}")
    logging.debug(f"Diff (i={i}, j={j}, k={k}): {diff}")
    logging.debug(f"Preference Value (i={i}, j={j}, k={k}): {preference_function(diff, p, q)}")
    logging.debug(f"Phi Plus: {phi_plus}")
    logging.debug(f"Phi Minus: {phi_minus}")
    return phi_plus, phi_minus, score


def aras(matrix, weights, is_benefit):
    """
    ARAS Method Implementation
    """
    n_alternatives, n_criteria = matrix.shape
    
    # Step 1: Normalize the decision matrix
    normalized_matrix = np.zeros((n_alternatives, n_criteria))
    for j in range(n_criteria):
        if is_benefit[j]:
            normalized_matrix[:, j] = matrix[:, j] / np.max(matrix[:, j])
        else:
            normalized_matrix[:, j] = np.min(matrix[:, j]) / matrix[:, j]
    
    # Step 2: Calculate the weighted normalized scores
    weighted_matrix = normalized_matrix * weights

    # Step 3: Compute total scores for each alternative
    scores = np.sum(weighted_matrix, axis=1)

    # Step 4: Calculate relative scores
    best_score = np.max(scores)
    relative_scores = scores / best_score

    # Return results
    return relative_scores, scores