import React from 'react';

const CriteriaSelector = ({ selectedCriteria, setSelectedCriteria }) => {
  const criteriaList = [
    { key: 'revenue', label: 'Revenue' },
    { key: 'profit', label: 'Profit' },
    { key: 'revenue_change', label: 'Revenue Change' },
    { key: 'profit_change', label: 'Profit Change' },
    { key: 'employees', label: 'Employees' },
    { key: 'assets', label: 'Assets' },
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
  );
};

export default CriteriaSelector;