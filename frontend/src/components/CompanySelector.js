// src/components/CompanySelector.js
import React from 'react';

const CompanySelector = ({ selectedCompanies, setSelectedCompanies, companies }) => {
  const handleCheckboxChange = (e) => {
    const company = e.target.value;
    if (selectedCompanies.includes(company)) {
      setSelectedCompanies(selectedCompanies.filter((item) => item !== company));
    } else {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  };

  return (
    <div>
      <h2>Select Companies</h2>
      {companies.map((company, index) => (
        <div key={index}>
          <input
            type="checkbox"
            value={company.name}
            onChange={handleCheckboxChange}
            checked={selectedCompanies.includes(company.name)}
          />
          <label>{company.name} - Revenue: {company.revenue}, Profit: {company.profit}</label>
        </div>
      ))}
    </div>
  );
};

export default CompanySelector;