# backend/app.py
from flask import Flask, jsonify, request  # Dodaj request
from flask_cors import CORS
from get_fortune500 import get_fortune500_companies
import json
import os

app = Flask(__name__)
CORS(app)  # Omogoči CORS za vse zahteve

# API za pridobivanje Fortune 500 podjetij
@app.route('/', methods=['GET'])
def home():
    return "Flask server is running", 200

@app.route('/api/companies/json', methods=['GET'])
def get_companies_from_json():
    json_file_path = os.path.join(os.path.dirname(__file__), 'companies.json')
    with open(json_file_path) as f:
        companies = json.load(f)
    return companies


@app.route('/api/companies', methods=['GET'])
def get_companies():
    try:
        companies = get_fortune500_companies()
        return jsonify(companies), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/test', methods=['GET'])
def test_companies():
    companies = get_fortune500_companies()
    return jsonify(companies), 200


@app.route('/api/mcda/wsm', methods=['POST'])
def wsm_api():
    try:
        data = request.json
       # print("Received data:", data)  # Izpiši podatke za lažje diagnosticiranje

        # Preveri, če sta prisotna oba ključna podatka
        if 'companies' not in data or 'weights' not in data:
            return jsonify({'error': 'Missing companies or weights data'}), 400

        companies = data['companies']
        weights = data['weights']

        # Izračunaj WSM rezultat
        results = wsm(companies, weights)

        return jsonify(results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def clean_value(value):
    if isinstance(value, str):
        value = value.replace('$', '').replace(',', '').replace('%', '').strip()
    try:
        return float(value)
    except ValueError:
        return 0  # Če vrednost ni številka, vrni 0


# Tvoja funkcija wsm
def wsm(companies, weights):
    normalized_weights = {key: weight / 100 for key, weight in weights.items()}

    results = []
    
    for company in companies:
        score = 0  # Inicializiraj oceno za podjetje

        # Očisti podatke podjetij in jih pretvori v številke
         # Preveri, ali je 'revenue' izbran in ga vključite v izračun
        if 'assets' in normalized_weights:
            assets = clean_value(company.get('assets', 0))
            score += assets * normalized_weights['assets']

        if 'employees' in normalized_weights:
            employees = clean_value(company.get('employees', 0))
            score += employees * normalized_weights['employees']
        
        # Preveri, ali je 'profit' izbran in ga vključite v izračun
        if 'profit' in normalized_weights:
            profit = clean_value(company.get('profit', 0))
            score += profit * normalized_weights['profit']

        # Preveri, ali je 'revenueGrowth' izbran in ga vključite v izračun
        if 'profit_change' in normalized_weights:
            profit_change = clean_value(company.get('profit_change', 0))
            score += profit_change * normalized_weights['profit_change']
        
        if 'revenue' in normalized_weights:
            revenue = clean_value(company.get('revenue', 0))
            score += revenue * normalized_weights['revenue']

        if 'revenue_change' in normalized_weights:
            revenue_change = clean_value(company.get('revenue_change', 0))
            score += revenue_change * normalized_weights['revenue_change']

        if 'rank' in normalized_weights:
            rank = clean_value(company.get('rank', 0))
            score += rank * normalized_weights['rank']

        if 'years_in_rank' in normalized_weights:
            years_in_rank = clean_value(company.get('years_in_rank', 0))
            score += years_in_rank * normalized_weights['years_in_rank']


        # Preveri, ali je 'employees' izbran in ga vključite v izračun
        if 'employees' in normalized_weights:
            employees = clean_value(company.get('employees', 0))
            score += employees * normalized_weights['employees']

        results.append({
            'name': company['name'],
            'score': score
        })

    return sorted(results, key=lambda x: x['score'], reverse=True)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)