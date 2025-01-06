from flask import Blueprint, jsonify, request
from models.db_config import db
from services.mcda_calculations import wsm, topsis, ahp, promethee, aras
import numpy as np

mcda_routes = Blueprint('mcda_routes', __name__)
calculations_collection = db.calculations

# post for WSM, use data and insert record to DB, return WSM result
@mcda_routes.route('/wsm', methods=['POST'])
def wsm_api():
    data = request.json
    companies = data['companies']
    weights = data['weights']
    results = wsm(companies, weights)
    calculations_collection.insert_one({'method': 'WSM', 'companies': companies, 'weights': weights, 'results': results})
    return jsonify(results), 200

# post for TOPSIS, use data and insert record to DB, return TOPSIS result
@mcda_routes.route('/topsis', methods=['POST'])
def topsis_api():
    try:
        data = request.json
        companies = data['companies']
        weights = data['weights']
        is_benefit = data['is_benefit']

        # Extract criteria dynamically from the weights
        selected_criteria = list(weights.keys())
        print("Selected Criteria:", selected_criteria)

        # Build the matrix dynamically based on selected criteria
        matrix = np.array([
            [
                float(company.get(criterion, "0").replace(",", "").replace("$", "").replace("%", ""))
                for criterion in selected_criteria
            ]
            for company in companies
        ])

        # Build the weights array dynamically
        weights_array = np.array([weights[criterion] for criterion in selected_criteria])

        # Build the is_benefit list dynamically
        is_benefit_array = [is_benefit.get(criterion, True) for criterion in selected_criteria]

        print("Matrix:", matrix)
        print("Weights Array:", weights_array)
        print("Is Benefit Array:", is_benefit_array)

        # Perform TOPSIS calculation
        results = topsis(matrix, weights_array, is_benefit_array)

        # Prepare response data
        response_data = [{"name": company['name'], "score": results[i]} for i, company in enumerate(companies)]

        # Insert results into the database
        calculations_collection.insert_one({
            'method': 'TOPSIS',
            'companies': companies,
            'weights': weights,
            'results': response_data
        })

        return jsonify(response_data), 200

    except KeyError as e:
        return jsonify({"error": f"Missing key: {e}"}), 400
    except Exception as e:
        print("Error in TOPSIS API:", e)
        return jsonify({"error": str(e)}), 500

# post for AHP, use data and insert record to DB, return AHP result
@mcda_routes.route('/ahp', methods=['POST'])
def ahp_api():
    try:
        data = request.json
        matrix = np.array(data['criteriaMatrix'])  # Expect a square pairwise comparison matrix

        # Step 1: Validate that the matrix is square
        if matrix.shape[0] != matrix.shape[1]:
            return jsonify({"error": "AHP matrix must be square (n x n)."}), 400

        # Step 2: Normalize the matrix
        normalized_matrix = matrix / matrix.sum(axis=0)

        # Step 3: Compute weights as the mean of each row
        weights = normalized_matrix.mean(axis=1)
        weights /= weights.sum()  # Normalize weights to sum to 1

        # Step 4: Placeholder consistency ratio calculation (real CR can be added)
        consistency_ratio = 0.1  # Example fixed CR, replace with actual calculation

        # Step 5: Save the results into the database
        calculation_record = {
            'method': 'AHP',
            'matrix': matrix.tolist(),
            'weights': weights.tolist(),
            'consistency_ratio': consistency_ratio,
            'message': "AHP calculation completed successfully."
        }
        calculations_collection.insert_one(calculation_record)

        # Step 6: Prepare response
        response_data = {
            "weights": weights.tolist(),
            "consistency_ratio": consistency_ratio,
            "message": "AHP calculation completed successfully."
        }
        return jsonify(response_data), 200

    except Exception as e:
        print("Error in AHP API:", e)
        return jsonify({'error': str(e)}), 500
    
# post for PROMETHEE, use data and insert record to DB, return PROMETHEE result
@mcda_routes.route('/promethee', methods=['POST'])
def promethee_api():
    try:
        data = request.json
        print("Data:", data)  # Izpis napake
        matrix = np.array(data['criteriaMatrix'])  # Pričakujemo matriko parnih primerjav
        weights = np.array(data['weights'])
        is_benefit = data['is_benefit']
        p = data.get('p', 0.5)
        q = data.get('q', 0.1)

        phi_plus, phi_minus, score = promethee(matrix, weights, is_benefit, p, q)

       # Pripravimo odziv z rezultati
        response_data =  [
                {
                    "name": data["companies"][i]["name"],  # Podjetje iz vhodnih podatkov
                    "phi_plus": phi_plus[i],
                    "phi_minus": phi_minus[i],
                    "score": score[i]
                }
                for i in range(len(score))
            ]
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# post for ARAS, use data and insert record to DB, return ARAS result    
@mcda_routes.route('/aras', methods=['POST'])
def aras_api():
    try:
        data = request.json
        matrix = np.array(data['criteriaMatrix'])
        weights = np.array(list(data['weights'].values()))
        is_benefit = [data['is_benefit'][key] for key in data['weights'].keys()]
        
        relative_scores, scores = aras(matrix, weights, is_benefit)

        response_data = [
            {
                "name": data["companies"][i]["name"],
                "score": scores[i],
                "relative_score": relative_scores[i]
            }
            for i in range(len(scores))
        ]
        
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500