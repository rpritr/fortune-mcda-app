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

  useEffect(() => {
    // Pridobi podjetja iz našega Flask API-ja
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/companies/json');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  const handleSubmit = () => {
    console.log('Selected Companies:', selectedCompanies);
    console.log('Selected Method:', selectedMethod);
    console.log('Selected Criteria:', selectedCriteria);
    console.log('Selected weights:', weights);

    // Tukaj boš kasneje dodal logiko za izračun MCDA
  };

  return (
    <div>
      <h1>Investment Decision Support System</h1>
      <CompanySelector
        selectedCompanies={selectedCompanies}
        setSelectedCompanies={setSelectedCompanies}
        companies={companies}  // Dodaj podjetja, ki jih pridobiš iz Flask API-ja
      />
      <CriteriaSelector
        selectedCriteria={selectedCriteria}
        setSelectedCriteria={setSelectedCriteria}
      />
      {selectedCriteria.length > 0 && (
        <WeightSelector
          selectedCriteria={selectedCriteria}
          weights={weights}
          setWeights={setWeights}
        />
      )}
      <MethodSelector
        selectedMethod={selectedMethod}
        setSelectedMethod={setSelectedMethod}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default App;