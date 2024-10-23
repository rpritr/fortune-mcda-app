import React from 'react';

const CompanySelector = ({ selectedCompanies, setSelectedCompanies, companies }) => {
  const handleCheckboxChange = (e, company) => {
    if (selectedCompanies.find((selected) => selected.name === company.name)) {
      // Če je podjetje že izbrano, ga odstranimo
      setSelectedCompanies(selectedCompanies.filter((item) => item.name !== company.name));
    } else {
      // Če podjetje še ni izbrano, ga dodamo
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
            onChange={(e) => handleCheckboxChange(e, company)}
            checked={!!selectedCompanies.find((selected) => selected.name === company.name)}
          />
          <label>{company.name} - Revenue: {company.revenue}, Profit: {company.profit}</label>
        </div>
      ))}
    </div>
  );
};

export default CompanySelector;