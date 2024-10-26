from flask import Flask
from flask_cors import CORS
from models.db_config import db
from routes.company_routes import company_routes
from routes.mcda_routes import mcda_routes

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

app.register_blueprint(company_routes, url_prefix='/api/companies')
app.register_blueprint(mcda_routes, url_prefix='/api/mcda')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)