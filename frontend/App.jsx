import React, { useState } from "react";

function App() {
  const [dimensions, setDimensions] = useState("");
  const [bedrooms, setBedrooms] = useState(3);
  const [upgrades, setUpgrades] = useState([]);
  const [result, setResult] = useState(null);

  const handleEstimate = async () => {
    const res = await fetch("http://localhost:8000/api/v1/own-house/estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dimensions, bedrooms, upgrades })
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>AI-Driven Construction Cost Estimation</h1>
      <div>
        <label>Dimensions: </label>
        <input value={dimensions} onChange={e => setDimensions(e.target.value)} />
      </div>
      <div>
        <label>Bedrooms: </label>
        <input type="number" value={bedrooms} onChange={e => setBedrooms(Number(e.target.value))} />
      </div>
      <div>
        <label>Upgrades (comma separated): </label>
        <input value={upgrades.join(",")} onChange={e => setUpgrades(e.target.value.split(","))} />
      </div>
      <button onClick={handleEstimate}>Estimate Cost</button>
      {result && (
        <div style={{ marginTop: 32 }}>
          <h2>Estimation Result</h2>
          <div>Base Cost: {result.base_cost}</div>
          <div>Upgrade Cost: {result.upgrade_cost}</div>
          <div>Total Cost: {result.total_cost}</div>
          <div>Breakdown: {JSON.stringify(result.breakdown)}</div>
        </div>
      )}
    </div>
  );
}

export default App;
