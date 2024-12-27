// src/components/MethodSelector.js
import React from 'react';

const methods = ['AHP', 'TOPSIS', 'PROMETHEE', 'WSM', 'ARAS'];

const MethodSelector = ({ selectedMethod, setSelectedMethod }) => {
  return (
    <div>
      <h2>Izberite MCDA metodo</h2>
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