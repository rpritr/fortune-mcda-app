import numpy as np
from utils.helpers import clean_value

def wsm(companies, weights):
    normalized_weights = {key: weight / 100 for key, weight in weights.items()}
    results = []
    for company in companies:
        score = 0
        for key, weight in normalized_weights.items():
            score += clean_value(company.get(key, 0)) * weight
        results.append({'name': company['name'], 'score': score})
    return sorted(results, key=lambda x: x['score'], reverse=True)

def topsis(matrix, weights, is_benefit):
    normalized_matrix = matrix / np.sqrt((matrix ** 2).sum(axis=0))
    weighted_matrix = normalized_matrix * weights
    positive_ideal = np.max(weighted_matrix, axis=0) if is_benefit else np.min(weighted_matrix, axis=0)
    negative_ideal = np.min(weighted_matrix, axis=0) if is_benefit else np.max(weighted_matrix, axis=0)
    positive_distance = np.sqrt(((weighted_matrix - positive_ideal) ** 2).sum(axis=1))
    negative_distance = np.sqrt(((weighted_matrix - negative_ideal) ** 2).sum(axis=1))
    return negative_distance / (positive_distance + negative_distance)