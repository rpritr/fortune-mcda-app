from flask import Blueprint, jsonify
import json
import os
from flask import jsonify
from models.db_config import db

company_routes = Blueprint('company_routes', __name__)
companies_collection = db.companies


# Read the content from json and load it into a json object, return the object of the read data
def import_companies_from_json():
    json_file_path = os.path.join(os.path.dirname(__file__), '..', 'companies.json')
    with open(json_file_path, 'r') as file:
        companies = json.load(file)
    return jsonify(companies)


def import_companies():
    try:
        # path
        json_file_path = os.path.join(os.path.dirname(__file__), 'companies.json')
        
        # open file
        with open(json_file_path, 'r') as file:
            companies = json.load(file)
        
        # import data
        companies_collection.insert_many(companies)
        return jsonify({"message": "Companies successfully imported!"}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500