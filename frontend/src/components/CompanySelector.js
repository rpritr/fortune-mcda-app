import React from 'react';

const CompanySelector = ({ selectedCompanies, setSelectedCompanies, companies }) => {
  const handleCheckboxChange = (e, company) => {
    if (selectedCompanies.find((selected) => selected.name === company.name)) {
      // if found company update
      setSelectedCompanies(selectedCompanies.filter((item) => item.name !== company.name));
    } else {
      //if not add it
      setSelectedCompanies([...selectedCompanies, company]);
    }
  };

const handleSelectAll = (e) => {
  if (e.target.checked) {
    // if all selected set
    setSelectedCompanies(companies);
  } else {
    // if deselected unset
    setSelectedCompanies([]);
  }

}

  return (
    <div>
      <div className="card mb-4">
          <div className="card-header">
            <h2>Izbira alternativ</h2>
          </div>
          <div className="card-body">
        <h2>Izberite podjetja za analizo</h2>
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