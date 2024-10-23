import React from 'react';

const CriteriaSelector = ({ selectedCriteria, setSelectedCriteria }) => {
  const criteriaList = [
    { key: 'assets', label: 'Assets' },
    { key: 'employees', label: 'Employees' },
    { key: 'profit', label: 'Profit' },
    { key: 'profit_change', label: 'Profit Change' },
    { key: 'rank', label: 'Rank' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'revenue_change', label: 'Revenue Change' },
    { key: 'years_in_rank', label: 'Years in rank' },

  ];

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      setSelectedCriteria([...selectedCriteria, name]);
    } else {
      setSelectedCriteria(selectedCriteria.filter((item) => item !== name));
    }
  };

  return (
    <div>
     <div className="card mb-4">
        <div className="card-header">
          <h2>Select Criteria for Analysis</h2>
        </div>
        <div className="card-body">
      <h2>Select Criteria for Analysis</h2>
      {criteriaList.map((criteria) => (
        <div key={criteria.key}>
          <input
            type="checkbox"
            name={criteria.key}
            checked={selectedCriteria.includes(criteria.key)}
            onChange={handleCheckboxChange}
          />
          <label>{criteria.label}</label>
        </div>
      ))}
      </div>
      </div>
      </div>

  );
};

export default CriteriaSelector;