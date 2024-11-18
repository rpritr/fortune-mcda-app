import json
import os
from flask import jsonify

# Iz json preberem vsebno in nalozim v json objekt, vrnem objekt prebranih podatov
def import_companies_from_json():
    json_file_path = os.path.join(os.path.dirname(__file__), '..', 'companies.json')
    with open(json_file_path, 'r') as file:
        companies = json.load(file)
    return jsonify(companies)