import React, { useEffect } from 'react';

const WeightSelector = ({ selectedCriteria, weights, setWeights }) => {
  // Poskrbi, da so za vsak nov kriterij dodane začetne vrednosti
  useEffect(() => {
    const initialWeights = selectedCriteria.reduce((acc, criteria) => {
      if (!weights.hasOwnProperty(criteria)) {  // Prepreči ponovno inicializacijo, če utež že obstaja
        acc[criteria] = weights[criteria] || 0;  // Ohranimo že vnešene vrednosti
      } else {
        acc[criteria] = weights[criteria];  // Ohranimo obstoječe vrednosti
      }
      return acc;
    }, {});

    setWeights((prevWeights) => ({
      ...prevWeights,
      ...initialWeights,
    }));
  }, [selectedCriteria]);  // Odvisnost samo od `selectedCriteria`

  const handleWeightChange = (e) => {
    const { name, value } = e.target;
    setWeights((prevWeights) => ({
      ...prevWeights,
      [name]: Number(value),  // Posodobi vrednost za posamezen kriterij
    }));
  };

  return (
    <div>
    <div className="card mb-4">
          <div className="card-header">
            <h2>Set Weights for Selected Criteria</h2>
          </div>
          <div className="card-body">
      <h2>Set Weights for Selected Criteria</h2>
      {selectedCriteria.map((criteria) => (
        <div key={criteria}>
          <label>{criteria} (%): </label>
          <input
            type="number"
            name={criteria}
            value={weights[criteria] || 0}  // Pokaži shranjeno vrednost
            onChange={handleWeightChange}
            min="0"
            max="100"
          />
        </div>
      ))}
    </div>
    </div>
    </div>
  );
};

export default WeightSelector;