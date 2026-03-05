import React, { useState } from 'react';

const UPGRADE_GRADES = {
  Classic: [
    { id: 'flooring', label: 'Granite Flooring', amount: 45000 },
    { id: 'stairs', label: 'Granite Stairs', amount: 35000 },
    { id: 'counters', label: 'Granite Kitchen Counters', amount: 28000 },
    { id: 'window_frames', label: 'Premium Wooden Window Frames', amount: 52000 },
    { id: 'doors', label: 'Premium Wooden Doors', amount: 38000 }
  ],
  Premium: [
    { id: 'flooring', label: 'Imported Marble Flooring', amount: 78000 },
    { id: 'stairs', label: 'Imported Marble Stairs', amount: 65000 },
    { id: 'counters', label: 'Italian Marble Counters', amount: 52000 },
    { id: 'wall_cladding', label: 'Marble Wall Cladding', amount: 42000 },
    { id: 'jacuzzi', label: 'Jacuzzi Tub', amount: 85000 },
    { id: 'lighting', label: 'Designer Lighting', amount: 48000 }
  ],
  Elite: [
    { id: 'flooring', label: 'Italian Marble Flooring', amount: 125000 },
    { id: 'stairs', label: 'Italian Marble Stairs', amount: 95000 },
    { id: 'counters', label: 'Italian Marble Counters', amount: 78000 },
    { id: 'wall_cladding', label: 'Full Marble Wall Cladding', amount: 65000 },
    { id: 'jacuzzi', label: 'Premium Jacuzzi Tub', amount: 125000 },
    { id: 'lightning_smart', label: 'Smart Home Lighting', amount: 68000 },
    { id: 'home_automation', label: 'Home Automation', amount: 95000 },
    { id: 'steam_shower', label: 'Steam Shower', amount: 85000 }
  ]
};

const UpgradesPage = ({ grade, onFinalize, onBack }) => {
  const [upgrades, setUpgrades] = useState(
    UPGRADE_GRADES[grade].map(u => ({ ...u, keep: true }))
  );

  const handleToggle = idx => {
    setUpgrades(upgrades => upgrades.map((u, i) => i === idx ? { ...u, keep: !u.keep } : u));
  };

  const totalUpgradeAmount = upgrades.filter(u => u.keep).reduce((sum, u) => sum + u.amount, 0);

  return (
    <section style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '2rem' }}>Edit Upgrades ({grade})</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {upgrades.map((upgrade, idx) => (
          <div key={upgrade.label} style={{
            padding: '2rem',
            background: upgrade.keep ? 'rgba(251,146,60,0.08)' : 'rgba(100,116,139,0.08)',
            border: '2px solid ' + (upgrade.keep ? '#FCD34D' : '#64748B'),
            borderRadius: '18px',
            position: 'relative',
            boxShadow: upgrade.keep ? '0 0 18px #FCD34D33' : 'none',
            transition: '0.2s'
          }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>{upgrade.label}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: upgrade.keep ? '#FCD34D' : '#64748B' }}>
              ₹{upgrade.amount.toLocaleString('en-IN')}
            </div>
            <button
              onClick={() => handleToggle(idx)}
              style={{
                marginTop: '1.2rem',
                padding: '0.7rem 1.5rem',
                background: upgrade.keep ? '#FCD34D' : '#64748B',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: '0.2s'
              }}
            >
              {upgrade.keep ? 'Remove' : 'Keep'}
            </button>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '2rem', color: '#FCD34D' }}>
        Total Upgrade Amount: ₹{totalUpgradeAmount.toLocaleString('en-IN')}
      </div>
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
        <button onClick={onBack} style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', background: '#64748B', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}>Back</button>
        <button onClick={() => onFinalize(upgrades.filter(u => u.keep), totalUpgradeAmount)} style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', background: '#FCD34D', color: '#222', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}>Finalize</button>
      </div>
    </section>
  );
};

export default UpgradesPage;
