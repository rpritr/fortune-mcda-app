import React, { useEffect } from 'react';

const WeightSelector = ({ selectedCriteria, weights, setWeights }) => {
  // update values on call
  useEffect(() => {
    const initialWeights = selectedCriteria.reduce((acc, criteria) => {
      if (!weights.hasOwnProperty(criteria)) {  // check if weight exist
        acc[criteria] = weights[criteria] || 0;  // use existing values
      } else {
        acc[criteria] = weights[criteria];  // use same weights
      }
      return acc;
    }, {});

    setWeights((prevWeights) => ({
      ...prevWeights,
      ...initialWeights,
    }));
  }, [selectedCriteria]);  //set weights

  const handleWeightChange = (e) => {
    const { name, value } = e.target;
    setWeights((prevWeights) => ({
      ...prevWeights,
      [name]: Number(value),  // set state
    }));
  };

  return (
    <div>
    <div className="card mb-4">
          <div className="card-header">
            <h2>Določanje uteži</h2>
          </div>
          <div className="card-body">
      <h2>Določite uteži za kriterije</h2>
      {selectedCriteria.map((criteria) => (
        <div key={criteria}>
          <label>{criteria} (%): </label>
          <input
            type="number"
            name={criteria}
            value={weights[criteria] || 0}  // show state
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