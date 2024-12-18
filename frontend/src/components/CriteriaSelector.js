import React from 'react';

const CriteriaSelector = ({ selectedCriteria, setSelectedCriteria, isBenefit, setIsBenefit }) => {
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

  const handleCheckboxChange = (e, criterion) => {
    if (selectedCriteria.includes(criterion)) {
      setSelectedCriteria(selectedCriteria.filter((item) => item !== criterion));
    } else {
      setSelectedCriteria([...selectedCriteria, criterion]);
    }
  };

  const handleIsBenefitChange = (e, criterion) => {
    setIsBenefit({
      ...isBenefit,
      [criterion]: e.target.checked,  // Posodobimo vrednost isBenefit za izbrani kriterij
    });
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
            onChange={(e) => handleCheckboxChange(e, criteria.key)}
            />
          <label>{criteria.label}</label>
          {selectedCriteria.includes(criteria.key) && (
                <div className="form-check form-switch ms-4" key={`${criteria.key}-benefit`}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`${criteria.key}-isBenefit`}
                  //  checked={isBenefit[criteria.key] || false}
                    onChange={(e) => handleIsBenefitChange(e, criteria.key)}
                  />
                  <label className="form-check-label" htmlFor={`${criteria.key}-isBenefit`}>
                    Is Benefit?
                  </label>
                </div>
              )}
        </div>
      ))}
      </div>
      </div>
      </div>

  );
};

export default CriteriaSelector;