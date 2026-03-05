import React, { useState } from 'react';

export function ExteriorSelector() {
  const [features, setFeatures] = useState({
    include_compound_wall: true,
    include_waterproofing: true,
    include_gate: true,
    include_elevation: true
  });
  const [result, setResult] = useState(null);

  const handleToggle = (field) => {
    setFeatures(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleEstimate = async () => {
    const res = await fetch('/exterior/estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(features)
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div>
      <h2>Select Exterior Features</h2>
      {Object.keys(features).map(field => (
        <div key={field}>
          <label>
            <input
              type="checkbox"
              checked={features[field]}
              onChange={() => handleToggle(field)}
            />
            {field.replace(/_/g, ' ')}
          </label>
        </div>
      ))}
      <button onClick={handleEstimate}>Estimate</button>
      {result && (
        <div>
          <h4>Estimation Result</h4>
          <p>Total Cost: ₹{result.total_cost.toLocaleString('en-IN')}</p>
          <pre>{JSON.stringify(result.breakdown, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
