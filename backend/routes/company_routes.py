from flask import Blueprint, jsonify, request
from models.db_config import db
from services.data_import import import_companies_from_json

company_routes = Blueprint('company_routes', __name__)
companies_collection = db.companies

# testni endpoint za preverjanje API
@company_routes.route('/', methods=['GET'])
def home():
    return "Flask server is running", 200

# GET zahtevek, vrne seznam podjetij
@company_routes.route('', methods=['GET'])
def get_companies():
    companies = list(companies_collection.find({}, {'_id': 0}))
    return jsonify(companies), 200

# GET zahtevek, uvoz podatkov iz json datoteke v DB
# ni inicializiran se poklice rocno
# TODO: avtomatsko ob prvem zagonu
@company_routes.route('/json', methods=['GET'])
def get_companies_from_json():
    return import_companies_from_json()

# POST zahtevek za dodajanje zapisa o dodanem podjetju
@company_routes.route('', methods=['POST'])
def add_company():
    data = request.json
    companies_collection.insert_one(data)
    return jsonify({"message": "Company added successfully"}), 201