# backend/app.py
from flask import Flask, jsonify
from flask_cors import CORS
from get_fortune500 import get_fortune500_companies

app = Flask(__name__)
CORS(app)  # Omogoči CORS za vse zahteve

# API za pridobivanje Fortune 500 podjetij
@app.route('/', methods=['GET'])
def home():
    return "Flask server is running", 200

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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)