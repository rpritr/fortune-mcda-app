// src/components/MethodSelector.js
import React from 'react';

const methods = ['AHP', 'TOPSIS', 'PROMETHEE', 'WSM'];

const MethodSelector = ({ selectedMethod, setSelectedMethod }) => {
  return (
    <div>
      <h2>Select MCDA Method</h2>
      <select value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)}>
        {methods.map((method, index) => (
          <option key={index} value={method}>
            {method}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MethodSelector;