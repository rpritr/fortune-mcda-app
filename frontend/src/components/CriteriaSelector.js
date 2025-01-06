import React from 'react';

const CriteriaSelector = ({ selectedCriteria, setSelectedCriteria, isBenefit, setIsBenefit }) => {
  const criteriaList = [
    { key: 'assets', label: 'Sredstva' },
    { key: 'employees', label: 'Zaposleni' },
    { key: 'profit', label: 'Dobiček' },
    { key: 'profit_change', label: 'Sprememba dobička' },
    { key: 'rank', label: 'Rang' },
    { key: 'revenue', label: 'Prihodki' },
    { key: 'revenue_change', label: 'Sprememba prihodkov' },
    { key: 'years_in_rank', label: 'Let v rangu' },

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
      [criterion]: e.target.checked,  // update isBenefit for criteria
    });
  };

  return (
    <div>
     <div className="card mb-4">
        <div className="card-header">
          <h2>Izbira kriterijev</h2>
        </div>
        <div className="card-body">
      <h2>Izberite kriterije za analizo</h2>
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
                    Benefit?
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