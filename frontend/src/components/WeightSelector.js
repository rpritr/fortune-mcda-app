import React from 'react';

const WeightSelector = ({ weights, setWeights }) => {
  const handleWeightChange = (e) => {
    const { name, value } = e.target;
    setWeights({
      ...weights,
      [name]: Number(value),  // Poskrbi, da se vrednost shrani kot število
    });
  };

  return (
    <div>
      <h2>Set Criteria Weights</h2>
      <div>
        <label>Revenue (%): </label>
        <input
          type="number"
          name="revenue"
          value={weights.revenue}
          onChange={handleWeightChange}
          min="0"
          max="100"
        />
      </div>
      <div>
        <label>Profit (%): </label>
        <input
          type="number"
          name="profit"
          value={weights.profit}
          onChange={handleWeightChange}
          min="0"
          max="100"
        />
      </div>
      <div>
        <label>Revenue Growth (%): </label>
        <input
          type="number"
          name="revenueGrowth"
          value={weights.revenueGrowth}
          onChange={handleWeightChange}
          min="0"
          max="100"
        />
      </div>
      <div>
        <label>Employees (%): </label>
        <input
          type="number"
          name="employees"
          value={weights.employees}
          onChange={handleWeightChange}
          min="0"
          max="100"
        />
      </div>
    </div>
  );
};

export default WeightSelector;