// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CompanySelector from './components/CompanySelector';
import MethodSelector from './components/MethodSelector';
import WeightSelector from './components/WeightSelector';  // Uvozi komponento
import CriteriaSelector from './components/CriteriaSelector';
import PairwiseComparison from './components/PairwiseComparison';

const App = () => {
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('AHP');
  const [companies, setCompanies] = useState([]);
  const [weights, setWeights] = useState({
    revenue: 0,
    profit: 0,
    revenueGrowth: 0,
    employees: 0,
  });
  const [selectedCriteria, setSelectedCriteria] = useState([]);
  const [wsmResults, setWsmResults] = useState([]);  // Novo stanje za WSM rezultate
  const [ahpResults, setAHPResults] = useState([]);  // Novo stanje za WSM rezultate
  const [userInputs, setUserInputs] = useState({});

  const [error, setError] = useState(null);
  const [isBenefit, setIsBenefit] = useState({});  // Initialize isBenefit as an object
  const [companyScores, setCompanyScores] = useState([]); // Dodano stanje za rezultate podjetij

  useEffect(() => {
    // Pridobi podjetja iz našega Flask API-ja
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/companies');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

    // Izračunaj in shrani rezultate podjetij po pridobitvi rezultatov AHP
    useEffect(() => {
      if (ahpResults.weights && selectedCriteria.length > 0) {
        const calculatedScores = calculateCompanyScores(selectedCompanies, ahpResults.weights);
        const sortedScores = calculatedScores.sort((a, b) => b.score - a.score); // Razvrsti po padajočem vrstnem redu
        setCompanyScores(sortedScores);
      }
    }, [ahpResults, companies, selectedCriteria]);

  const generateEqualMatrix = (criteria) => {
    const size = criteria.length;
    const matrix = Array.from({ length: size }, (_, i) =>
      Array.from({ length: size }, (_, j) => {
        if (i === j) return 1; // Diagonalne vrednosti (kriterij v primerjavi sam s seboj)
        return 1;              // Vse druge vrednosti nastavimo na 1
      })
    );
    return matrix;
  };

  const generateUserDefinedMatrix = (criteria, userInputs) => {
    const size = criteria.length;
    const matrix = Array.from({ length: size }, (_, i) =>
      Array.from({ length: size }, (_, j) => {
        if (i === j) return 1; // Diagonalna vrednost je vedno 1
        if (i < j) return userInputs[`${criteria[i]}-${criteria[j]}`] || 1;
        return 1 / (userInputs[`${criteria[j]}-${criteria[i]}`] || 1); // Inverz
      })
    );
    return matrix;
  };

  const calculateCompanyScores = (companies, ahpWeights) => {
    return companies.map((company) => {
      let score = 0;
      ahpWeights.forEach((weight, index) => {
        const criterion = selectedCriteria[index];
        const criterionValue = parseFloat(company[criterion]) || 0;
        score += criterionValue * weight;
      });
      return { name: company.name, score: score.toFixed(2) };
    });
  };

  
  const handleSubmit = async () => {

    if (selectedCompanies.length === 0 || Object.values(weights).reduce((a, b) => a + b, 0) !== 100) {
      alert("Please select companies and ensure weights total 100%");
      return;
    }
    let payload = {
      companies: selectedCompanies,
      weights: weights,
      is_benefit: {
        revenue: true,  // Primer: prihodki so benefit (več je bolje)
        profit: true,   // Dobiček je benefit
        revenueGrowth: true,
        employees: false  // Število zaposlenih bi lahko bil cost kriterij (manjše je bolje)
      },
      criteriaMatrix: generateUserDefinedMatrix(selectedCriteria,userInputs)
    };

    console.log('Selected Companies:', selectedCompanies);
    console.log('Selected Method:', selectedMethod);
    console.log('Selected Criteria:', selectedCriteria);
    console.log('Selected weights:', weights);

    let apiUrl = '';

    // Odvisno od izbrane metode določimo pravi API URL
    switch (selectedMethod) {
      case 'WSM':
        apiUrl = 'http://localhost:8000/api/mcda/wsm';
        break;
      case 'TOPSIS':
        apiUrl = 'http://localhost:8000/api/mcda/topsis';
        break;
      case 'AHP':
        apiUrl = 'http://localhost:8000/api/mcda/ahp';
       // payload.criteriaMatrix = generateEqualMatrix(selectedCriteria);
        break;
      default:
        alert("Please select a valid MCDA method.");
        return;
    }
  
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

    if (totalWeight !== 100) {
      alert('Total weights must equal 100%.');
    } else {
      console.log('Selected Criteria:', selectedCriteria);
      console.log('Selected Weights:', weights);
      // Dodaj logiko za MCDA analizo
    }


    // Tukaj boš kasneje dodal logiko za izračun MCDA
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Analysis Results:', data);

      if (selectedMethod === 'AHP') {
        setAHPResults(data);  // Nastavi rezultate AHP metode
        console.log(data)
        console.log(wsmResults)
      } else {
        setWsmResults(data);  // Nastavi rezultate za WSM in TOPSIS metode
        
      }
    } catch (error) {
      console.error('Error fetching WSM results:', error);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Investment Decision Support System - MDSAs</h1>
          <CompanySelector
            selectedCompanies={selectedCompanies}
            setSelectedCompanies={setSelectedCompanies}
            companies={companies}
          />     
          <CriteriaSelector
            selectedCriteria={selectedCriteria}
            setSelectedCriteria={setSelectedCriteria}
            setIsBenefit={setIsBenefit} 
          />
          <PairwiseComparison
        selectedCriteria={selectedCriteria}
        userInputs={userInputs}
        setUserInputs={setUserInputs}
      />
      {/* Vnos uteži za izbrane kriterije */}
      {selectedCriteria.length > 0 && (
        
            <WeightSelector
              selectedCriteria={selectedCriteria}
              weights={weights}
              setWeights={setWeights}
            />
      
      )}

      {/* Izbor MCDA metode */}
      <div className="card mb-4">
        <div className="card-header">
          <h2>Select MCDA Method</h2>
        </div>
        <div className="card-body">
          <MethodSelector
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
          />
        </div>
      </div>

     {/* Gumb za pošiljanje */}
     <div className="text-center">
        <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
          Run
        </button>
      </div>
      <div className="results mt-5">
      
        {error && <p className="text-danger">{error}</p>}
        {(selectedMethod === 'WSM' || selectedMethod === 'TOPSIS') && wsmResults.length > 0 && (
          <div>
            <h2>{selectedMethod} Results</h2>
            <ul className="list-group">
              {wsmResults.map((result, index) => (
                <li key={index} className="list-group-item">
                  <strong>{result.name}</strong>: {result.score.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}
        {selectedMethod === 'AHP' && ahpResults.consistency_ratio && (
        <div>
          <h2>AHP Results</h2>
          <p>Consistency Ratio: {ahpResults.consistency_ratio}</p>
          <ul className="list-group">
            {ahpResults.weights.map((weight, index) => (
              <li key={index} className="list-group-item">
                Criterion {index + 1}: {weight.toFixed(2)}
              </li>
            ))}
          </ul>
                  
          {companyScores.length > 0 && (
          <div>
            <h2>Company Scores Based on AHP</h2>
            <ul className="list-group">
              {companyScores.map((company, index) => (
                <li key={index} className="list-group-item">
                  <strong>{company.name}</strong>: {company.score}
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
      )}
      </div>
    </div>
    
  );
};

export default App;