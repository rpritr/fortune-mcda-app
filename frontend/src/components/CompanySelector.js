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

const handleSelectAll = (e) => {
  if (e.target.checked) {
    // Če je Select All obkljukan, dodamo vsa podjetja
    setSelectedCompanies(companies);
  } else {
    // Če je Select All odkljukan, izpraznimo seznam
    setSelectedCompanies([]);
  }

}

  return (
    <div>
      <div className="card mb-4">
          <div className="card-header">
            <h2>Select Companies</h2>
          </div>
          <div className="card-body">
        <h2>Select Companies</h2>
        <div key="all" className="column">
                <input type="checkbox" name="all" value="all" onClick={handleSelectAll}/>All
            </div>        
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
      </div>
    </div>
  );
};

export default CompanySelector;