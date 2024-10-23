# fortune-mcda-app

Investment Decision Support System

This project is a web application designed to support investment decision-making using Multi-Criteria Decision Analysis (MCDA). The application pulls data from Fortune 500 companies and allows users to analyze selected companies based on different MCDA methods.

Technologies Used

	•	Backend: Python, Flask
	•	Frontend: React, Webpack
	•	Data Source: Fortune 500

Features

	•	Fetch data from Fortune 500 companies.
	•	Select multiple companies for analysis.
	•	Choose from various MCDA methods (e.g., AHP, TOPSIS, PROMETHEE, WSM).
	•	Display analysis results visually.

Requirements

	•	Node.js (v12.x or higher)
	•	Python 3.x
	•	Pip (for managing Python dependencies)

Installation Instructions

1. Clone the Repository

git clone https://github.com/rpritr/fortune-mcda-app.git
cd fortune-mcda-app

2.	Create and activate a virtual environment:

python3 -m venv venv
source venv/bin/activate

3.	Install dependencies:

pip install -r requirements.txt

4.	Start the Flask server:

python3 backend/app.py

5. Install React Dependencies

npm install

6.	Start the React development server:

npm start

Project Structure

/backend         # Flask API for fetching companies and performing MCDA analysis
  ├── app.py     # Main Flask application
  ├── get_fortune500.py  # Function to fetch companies from Fortune 500
  ├── requirements.txt   # Backend dependencies
  └── venv/      # Virtual environment (excluded from Git repo)

  
/frontend        # React application for the user interface
  ├── src        # Contains React components and app logic
  ├── public     # Public resources, including index.html
  ├── package.json  # Frontend dependencies
  └── node_modules/ # Installed dependencies (excluded from Git repo)