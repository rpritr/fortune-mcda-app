// src/App.js
import React, { useState } from 'react';
import CompanySelector from './components/CompanySelector';
import MethodSelector from './components/MethodSelector';

const App = () => {
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('AHP');

  const handleSubmit = () => {
    console.log('Selected Companies:', selectedCompanies);
    console.log('Selected Method:', selectedMethod);
    // Tukaj boš kasneje dodal logiko za izračun MCDA
  };

  return (
    <div>
      <h1>Investment Decision Support System</h1>
      <CompanySelector
        selectedCompanies={selectedCompanies}
        setSelectedCompanies={setSelectedCompanies}
      />
      <MethodSelector
        selectedMethod={selectedMethod}
        setSelectedMethod={setSelectedMethod}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default App;