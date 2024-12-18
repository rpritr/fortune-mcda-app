from flask import Flask
from flask_cors import CORS
from models.db_config import db
from routes.company_routes import company_routes
from routes.mcda_routes import mcda_routes
import debugpy
import os

app = Flask(__name__)

# cors podpora zaradi GET zahtevkov
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# endpoint za pridobivanje podatkov
app.register_blueprint(company_routes, url_prefix='/api/companies')

# endpoint za obdelavo analize
app.register_blueprint(mcda_routes, url_prefix='/api/mcda')

# Vklopi debugpy za VS Code
#if os.getenv("FLASK_ENV") == "development":
#    print("Starting debugpy...")
#    debugpy.listen(("0.0.0.0", 5679))  # Port za debug
#    print("debugpy is listening on port 5679")

# app tece na vratih 5000 na localhost
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
