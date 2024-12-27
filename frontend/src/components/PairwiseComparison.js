import React from 'react';

const PairwiseComparison = ({ selectedCriteria, userInputs, setUserInputs }) => {
  const handleInputChange = (e, criteriaPair) => {
    const value = parseFloat(e.target.value);
    const [criteria1, criteria2] = criteriaPair.split("-");
  
    setUserInputs((prevInputs) => ({
      ...prevInputs,
      [criteriaPair]: value, // Direct input
      [`${criteria2}-${criteria1}`]: (value !== 0) ? 1 / value : 0 // Inverse value
    }));
  };

  return (
    <div>
      <h2>Primerjava po parih</h2>
      <div className="pairwise-comparisons">
        {selectedCriteria.map((criteria1, index1) =>
          selectedCriteria.slice(index1 + 1).map((criteria2, index2) => {
            const criteriaPair = `${criteria1}-${criteria2}`;
            return (
              <div key={criteriaPair} className="pairwise-comparison">
                <label>
                  {criteria1} proti {criteria2}
                </label>
                <input
                  type="number"
                  min="0.1"
                  max="9"
                  step="0.1"
                  value={userInputs[criteriaPair] || 1}
                  onChange={(e) => handleInputChange(e, criteriaPair)}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PairwiseComparison;