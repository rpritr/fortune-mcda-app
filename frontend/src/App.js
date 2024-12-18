// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CompanySelector from './components/CompanySelector';
import MethodSelector from './components/MethodSelector';
import WeightSelector from './components/WeightSelector';  // Uvozi komponento
import CriteriaSelector from './components/CriteriaSelector';
import PairwiseComparison from './components/PairwiseComparison';
import ComparisonChart from './components/ComparisonChart';
import "./style/style.css";
const App = () => {
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('WSM');
  const [companies, setCompanies] = useState([]);
  const [weights, setWeights] = useState({
    revenue: 0,
  //  profit: 0,
   // TODO!!!revenueGrowth: 0,
    employees: 0,
  });
  const [selectedCriteria, setSelectedCriteria] = useState([]);
  const [wsmResults, setWsmResults] = useState([]);  // stanje za WSM rezultate
  const [ahpResults, setAHPResults] = useState([]);  // stanje za AHP rezultate
  const [prometheeResults, setPrometheeResults] = useState([]); // stanje za PROMETHEE rezultate
  const [arasResults, setArasResults] = useState([]);  // stanje za WSM rezultate

  const [userInputs, setUserInputs] = useState({});
  const [analysisReport, setAnalysisReport] = useState([]); // analiza vseh metod
  const analysisReportDemo = [
    { company: 'Walmart', WSM: 60, TOPSIS: 55, AHP: 70, PROMETHEE: 65 },
    { company: 'Amazon', WSM: 58, TOPSIS: 60, AHP: 68, PROMETHEE: 66 },
    { company: 'State Grid', WSM: 59, TOPSIS: 58, AHP: 65, PROMETHEE: 64 },
  ];
  
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

    const cleanValue = (value) => {
      if (typeof value === 'string') {
        // Odstrani ne-numerične znake (npr. '$', ',', '%') in pretvori v število
        return parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
      }
      return parseFloat(value) || 0;
    };
    const generateMatrix = (selectedCriteria, selectedCompanies) => {
      const matrix = selectedCompanies.map((company) => {
        return selectedCriteria.map((criterion) => {
          const value = company[criterion];
          return cleanValue(value); // Uporabi čistilno funkcijo
        });
      });
      return matrix;
    };
    const generateMatrixOld = (selectedCriteria, selectedCompanies) => {
      const matrix = selectedCompanies.map((company) => {
        return selectedCriteria.map((criterion) => {
          const value = parseFloat(company[criterion]) || 0; // Dobimo vrednost za kriterij
          return value;
        });
      });
      return matrix;
    };
    
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

    if(selectedMethod !== "AHP") {
      if (selectedCompanies.length === 0 || Object.values(weights).reduce((a, b) => a + b, 0) !== 100) {
        alert("Please select companies and ensure weights total 100%");
        return;
      }
    }

    const getRelevantWeights = () => {
      return selectedCriteria.reduce((filteredWeights, criterion) => {
        filteredWeights[criterion] = weights[criterion] || 0;
        return filteredWeights;
      }, {});
    };

    const getRelevantIsBenefit = () => {
      const defaultIsBenefit = {
        revenue: true,
        profit: true,
        revenueGrowth: true,
        employees: false,
      };
    
      return selectedCriteria.reduce((filteredIsBenefit, criterion) => {
        filteredIsBenefit[criterion] = defaultIsBenefit[criterion] || true; // Default to `true` if not explicitly defined
        return filteredIsBenefit;
      }, {});
    };

    console.log(getRelevantIsBenefit);
    let payload = {
      companies: selectedCompanies,
      weights: getRelevantWeights(),
      is_benefit: getRelevantIsBenefit(),
      criteriaMatrix: generateMatrix(selectedCriteria,selectedCompanies)
    };

    console.log('Selected Companies:', selectedCompanies);
    console.log('Selected Method:', selectedMethod);
    console.log('Selected Criteria:', selectedCriteria);
    console.log('Selected weights:', weights);
    console.log('Selected Payload:', payload);
    
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
      case 'PROMETHEE':
        apiUrl = 'http://localhost:8000/api/mcda/promethee';
        break;
      case 'ARAS':
          apiUrl = 'http://localhost:8000/api/mcda/aras';
      break;
      default:
        alert("Please select a valid MCDA method.");
        return;
    }
  
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    console.log("TOTAL ", totalWeight);
    if (selectedMethod !== "AHP" && totalWeight !== 100) {
      alert('Total weights must equal 100%.');
    } else {
      console.log('Selected Criteria:', selectedCriteria);
      console.log('Selected Weights:', weights);

      // Dodaj logiko za MCDA analizo
    }


    // implementacija klicev na API za posamezne metode
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
      // Dynamically update `analysisReport` with results for the current method
    const updatedReport = selectedCompanies.map((company, index) => {
      const existingEntry =
        analysisReport.find((entry) => entry.company === company.name) || { company: company.name };

      return {
        ...existingEntry,
        [selectedMethod]: data[index]?.score || 0, // Add or update the score for the selected method
      };
    });

    setAnalysisReport(updatedReport); // Update the analysis report
    console.log("Updated Analysis Report:", updatedReport);
      
      console.log(analysisReport);

      if (selectedMethod === 'AHP') {
        setAHPResults(data);  // Nastavi rezultate AHP metode
        console.log(data)
        console.log(wsmResults)
       
      } 
      else if (selectedMethod === 'PROMETHEE') {
        setPrometheeResults(data);
      }
      else if (selectedMethod === 'ARAS') {
        setArasResults(data);
      }
      else {
        setWsmResults(data);  // Nastavi rezultate za WSM in TOPSIS metode
      }
    } catch (error) {
      console.error('Error fetching WSM results:', error);
    }
  };

  return (
    <div className="container my-5">
    
      <h1 className="text-center mb-4">Investment Decision Support System - MCDA</h1>
          <CompanySelector
            selectedCompanies={selectedCompanies}
            setSelectedCompanies={setSelectedCompanies}
            companies={companies}
          />
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
           
          <CriteriaSelector
            selectedCriteria={selectedCriteria}
            setSelectedCriteria={setSelectedCriteria}
            setIsBenefit={setIsBenefit} 
          />
         {selectedMethod === 'AHP' && (
            <PairwiseComparison
          selectedCriteria={selectedCriteria}
          userInputs={userInputs}
          setUserInputs={setUserInputs}
        />
          )}
      {/* Vnos uteži za izbrane kriterije */}
      {selectedCriteria.length > 0 && selectedMethod !== 'AHP' && (
            <WeightSelector
              selectedCriteria={selectedCriteria}
              weights={weights}
              setWeights={setWeights}
            />
      
      )}

      {/* Izbor MCDA metode */}
      

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
        {(selectedMethod === 'ARAS') && arasResults.length > 0 && (
          <div>
            <h2>{selectedMethod} Results</h2>
            <ul className="list-group">
              {arasResults.map((result, index) => (
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
      {selectedMethod === 'PROMETHEE' && prometheeResults.length > 0 && (
  <div>
    <h2>PROMETHEE Results</h2>
    <ul>
      {prometheeResults.map((result, index) => (
        <li key={index}>{result.name}: {result.score.toFixed(2)}</li>
      ))}
    </ul>
  </div>
)}

{selectedMethod === 'PROMETHEE' && prometheeResults.results && (
  <div>
    <h2>PROMETHEE Results</h2>
    <table className="table">
      <thead>
        <tr>
          <th>Company</th>
          <th>Phi Plus</th>
          <th>Phi Minus</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {prometheeResults.map((result, index) => (
          <tr key={index}>
            <td>{name}</td>
            <td>{phi_plus.toFixed(2)}</td>
            <td>{phi_minus.toFixed(2)}</td>
            <td>{score.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
<div>
      {/* Drugi deli aplikacije */}
      <h2>Primerjava rezultatov MCDA metod</h2>
      <ComparisonChart data={analysisReport} />
    </div>
    </div>
    
  );
};

export default App;