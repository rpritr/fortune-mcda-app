from flask import Blueprint, jsonify
import json
import os
from flask import jsonify
from models.db_config import db

company_routes = Blueprint('company_routes', __name__)
companies_collection = db.companies


# Iz json preberem vsebno in nalozim v json objekt, vrnem objekt prebranih podatov
def import_companies_from_json():
    json_file_path = os.path.join(os.path.dirname(__file__), '..', 'companies.json')
    with open(json_file_path, 'r') as file:
        companies = json.load(file)
    return jsonify(companies)


def import_companies():
    try:
        # Pot do datoteke
        json_file_path = os.path.join(os.path.dirname(__file__), 'companies.json')
        
        # Odpremo in preberemo datoteko
        with open(json_file_path, 'r') as file:
            companies = json.load(file)
        
        # Uvozimo podatke v zbirko companies
        companies_collection.insert_many(companies)
        return jsonify({"message": "Companies successfully imported!"}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500