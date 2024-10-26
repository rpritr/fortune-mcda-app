// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CompanySelector from './components/CompanySelector';
import MethodSelector from './components/MethodSelector';
import WeightSelector from './components/WeightSelector';  // Uvozi komponento
import CriteriaSelector from './components/CriteriaSelector';

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
  const [error, setError] = useState(null);
  const [isBenefit, setIsBenefit] = useState({});  // Initialize isBenefit as an object

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

  const handleSubmit = async () => {

    if (selectedCompanies.length === 0 || Object.values(weights).reduce((a, b) => a + b, 0) !== 100) {
      alert("Please select companies and ensure weights total 100%");
      return;
    }

    const payload = {
      companies: selectedCompanies,
      weights: weights,
      is_benefit: {
        revenue: true,  // Primer: prihodki so benefit (več je bolje)
        profit: true,   // Dobiček je benefit
        revenueGrowth: true,
        employees: false  // Število zaposlenih bi lahko bil cost kriterij (manjše je bolje)
      }
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
      setWsmResults(data);  // Shranimo rezultate v stanje
      console.log('WSM Results:', data);
    } catch (error) {
      console.error('Error fetching WSM results:', error);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Investment Decision Support System - MDSA</h1>
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
        {wsmResults.length > 0 && (
          <div>
            <h2>WSM Results</h2>
            <ul className="list-group">
              {wsmResults.map((result, index) => (
                <li key={index} className="list-group-item">
                  <strong>{result.name}</strong>: {result.score.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
    
  );
};

export default App;