import React from 'react';

const WeightSelector = ({ selectedCriteria, weights, setWeights }) => {
  const handleWeightChange = (e) => {
    const { name, value } = e.target;
    setWeights({
      ...weights,
      [name]: Number(value),  // Posodobi uteži na podlagi vnosa
    });
  };

  return (
    <div>
      <h2>Set Weights for Selected Criteria</h2>
      {selectedCriteria.map((criteria) => (
        <div key={criteria}>
          <label>{criteria} (%): </label>
          <input
            type="number"
            name={criteria}
            value={weights[criteria] || 0}  // Prikaži utež za izbrani kriterij
            onChange={handleWeightChange}
            min="0"
            max="100"
          />
        </div>
      ))}
    </div>
  );
};

export default WeightSelector;