from flask import Blueprint, jsonify, request
from models.db_config import db
from services.mcda_calculations import wsm, topsis, ahp
import numpy as np

mcda_routes = Blueprint('mcda_routes', __name__)
calculations_collection = db.calculations

@mcda_routes.route('/wsm', methods=['POST'])
def wsm_api():
    data = request.json
    companies = data['companies']
    weights = data['weights']
    results = wsm(companies, weights)
    calculations_collection.insert_one({'method': 'WSM', 'companies': companies, 'weights': weights, 'results': results})
    return jsonify(results), 200

@mcda_routes.route('/topsis', methods=['POST'])
def topsis_api():
    data = request.json
    companies = data['companies']
    weights = data['weights']
    is_benefit = data['is_benefit']
    matrix = np.array([[float(company['revenue'].replace(",", "").replace("$", "")),
                        float(company['profit'].replace(",", "").replace("$", "")),
                        float(company['revenue_change'].replace("%", "")),
                        float(company['employees'].replace(",", ""))] for company in companies])
    weights_array = np.array([weights['revenue'], weights['profit'], weights['revenueGrowth'], weights['employees']])
    results = topsis(matrix, weights_array, is_benefit)
    response_data = [{"name": companies[i]['name'], "score": results[i]} for i in range(len(companies))]
    calculations_collection.insert_one({'method': 'TOPSIS', 'companies': companies, 'weights': weights, 'results': response_data})
    return jsonify(response_data), 200

@mcda_routes.route('/ahp', methods=['POST'])
def ahp_api():
    try:
        data = request.json
        matrix = np.array(data['criteriaMatrix'])  # Pričakujemo matriko parnih primerjav

        # Izvedemo AHP analizo
        weights, consistency_ratio, consistency_message = ahp(matrix)

        # Shranimo rezultate v zbirko
        calculation_record = {
            'method': 'AHP',
            'matrix': matrix.tolist(),
            'weights': weights.tolist(),
            'consistency_ratio': consistency_ratio,
            'message': consistency_message
        }
        calculations_collection.insert_one(calculation_record)

        # Pripravimo odziv
        response_data = {
            "weights": weights.tolist(),
            "consistency_ratio": consistency_ratio,
            "message": consistency_message
        }
        return jsonify(response_data), 200
    except Exception as e:
        print("Error in AHP API:", e)
        return jsonify({'error': str(e)}), 500