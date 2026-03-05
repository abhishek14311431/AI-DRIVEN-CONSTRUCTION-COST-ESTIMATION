import React, { useState } from 'react';

const INTERIOR_STYLES = [
  { value: 'base', label: 'Base Interior', desc: 'Essential interior package', price: 650000 },
  { value: 'semi', label: 'Semi Interior', desc: 'Enhanced comfort and finish', price: 1300000 },
  { value: 'full_furnished', label: 'Full Furnished', desc: 'Premium move-in ready', price: 2000000 }
];

export function InteriorSelector() {
  const [totalSqft, setTotalSqft] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [result, setResult] = useState(null);

  const handleEstimate = async () => {
    const res = await fetch('/interior/estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total_sqft: Number(totalSqft), style: selectedStyle })
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div>
      <h2>Select Interior Style</h2>
      <input
        type="number"
        placeholder="Enter total sqft"
        value={totalSqft}
        onChange={e => setTotalSqft(e.target.value)}
      />
      <div>
        {INTERIOR_STYLES.map(style => (
          <div key={style.value} onClick={() => setSelectedStyle(style.value)} style={{ border: selectedStyle === style.value ? '2px solid blue' : '1px solid gray', margin: '8px', padding: '8px', cursor: 'pointer' }}>
            <h3>{style.label}</h3>
            <p>{style.desc}</p>
            <p>Estimated Price: ₹{style.price.toLocaleString('en-IN')}</p>
          </div>
        ))}
      </div>
      <button onClick={handleEstimate} disabled={!totalSqft || !selectedStyle}>Estimate</button>
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
