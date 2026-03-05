
import React, { useState } from 'react';

const AnimatedConstructionLogo = () => (
    <div className="construction-logo active" style={{ perspective: '1000px' }}>
        <div className="blueprint-grid" />
        <div className="building-block-1" />
        <div className="building-block-2" />
        <div className="building-block-3" />
        <div className="connecting-line line-1" />
        <div className="connecting-line line-2" />
    </div>
);

const EstimationResult = ({ result, savedId, setView, saveProject, onSmartUpgrade }) => {
    const [showUpgradePrompt, setShowUpgradePrompt] = useState(true);
    const [showUpgradeOptions, setShowUpgradeOptions] = useState(false);
    const breakdown = Array.isArray(result.breakdown) ? result.breakdown : [];
    const gradePlan = result?.grade_plan || result?.inputs?.grade_plan || 'Base';
    const [availableUpgrades, setAvailableUpgrades] = React.useState([
        ...(gradePlan === 'Base' ? ['Classic', 'Premium', 'Elite'] :
           gradePlan === 'Classic' ? ['Premium', 'Elite'] :
           gradePlan === 'Premium' ? ['Elite'] : [])
    ]);

    const handleSmartUpgrade = (grade) => {
        if (typeof onSmartUpgrade === 'function') onSmartUpgrade(grade);
    };

    return (
        <>
            <section className="animate" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{
                    position: 'absolute',
                    top: '2rem',
                    left: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    zIndex: 100
                }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(0,242,255,0.15), rgba(124,58,237,0.15))',
                        border: '2px solid rgba(0,242,255,0.3)',
                        borderRadius: '12px',
                        padding: '0.7rem',
                        boxShadow: '0 8px 25px rgba(0,242,255,0.15)'
                    }}>
                        <AnimatedConstructionLogo />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div style={{
                            fontSize: '0.85rem',
                            fontWeight: 900,
                            letterSpacing: '1.5px',
                            color: '#00f2ff',
                            textTransform: 'uppercase'
                        }}>AI Builder</div>
                        <div style={{
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            letterSpacing: '1px',
                            color: 'rgba(0,242,255,0.5)',
                            textTransform: 'uppercase'
                        }}>Est. 2026</div>
                    </div>
                </div>

                <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <button className="btn-ghost" onClick={() => setView('wizard')}>← RE-EVALUATE</button>
                        <h2 style={{ fontSize: '4.5rem', fontWeight: 900, marginTop: '1.5rem', letterSpacing: '-3px' }}>VALUATION</h2>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8rem', letterSpacing: '4px', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>AI CORE ID</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#67E8F9' }}>{savedId || 'EST-PREVIEW-2026'}</div>
                    </div>
                </div>

                {/* Rental Homes: show only relevant rental details */}
                {isRental && (
                    <div style={{ marginBottom: '2rem', textAlign: 'left', color: '#a5f3fc', fontSize: '1.1rem', background: 'rgba(0,242,255,0.04)', borderRadius: '18px', padding: '1.5rem 2rem' }}>
                        <b>Rental Project Details:</b>
                        <div style={{ marginTop: 8 }}>
                            <b>Site Type:</b> {result.site_type}<br />
                            <b>Plot Dimensions:</b> {result.dimensions}<br />
                            <b>Floors:</b> {result.floors}<br />
                            <b>Unit Type:</b> {result.unit_type}<br />
                            <b>Plan:</b> {result.plan}<br />
                            <b>Semi Interior:</b> Included<br />
                            <b>External Staircase:</b> Yes
                        </div>
                    </div>
                )}
                <div style={{ padding: isRental ? '2.5rem' : '4rem', marginBottom: '3rem', textAlign: 'center', background: 'linear-gradient(145deg, rgba(8, 10, 14, 0.78), rgba(12, 14, 20, 0.62))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '32px', backdropFilter: 'blur(55px) saturate(160%)', boxShadow: '0 24px 70px rgba(9, 30, 66, 0.18), inset 0 1px 0 rgba(255,255,255,0.14)', display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <p style={{ fontSize: '0.9rem', letterSpacing: '6px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Total Estimated Investment</p>
                    <div style={{ fontSize: isRental ? '5rem' : '8rem', fontWeight: 1000, letterSpacing: '-6px', margin: '1.5rem 0', color: '#fff', textShadow: '0 0 60px rgba(103,232,249,0.3)' }}>
                        ₹{typeof result.total_cost === 'number' ? result.total_cost.toLocaleString('en-IN') : result.total_cost}
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
                        <button className="btn-primary" onClick={saveProject} style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>
                            SECURE THIS VALUATION
                        </button>
                        <button
                            onClick={() => setView('selection')}
                            style={{
                                padding: '1.2rem 3rem',
                                fontSize: '1.1rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#fff',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontWeight: 800,
                                transition: '0.3s'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            }}
                        >
                            NEW PROJECT
                        </button>
                    </div>

                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', width: '100%' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem', color: '#67E8F9', textAlign: 'center' }}>📈 Market Analysis</h3>
                        <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', lineHeight: 1.7, textAlign: 'left', maxWidth: '900px', margin: '0 auto' }}>
                            {result?.market_analysis || 'Based on our deep logic analysis of the 2026 market dynamics, this valuation represents the most accurate and competitive fit for your specific project requirements.'}
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', width: '100%' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem', color: '#FCD34D', textAlign: 'center' }}>✨ Smart Upgrade</h3>
                        
                        {showUpgradePrompt && !showUpgradeOptions && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
                                <p style={{ color: '#FCD34D', fontWeight: 700, fontSize: '1.2rem', margin: 0 }}>Would you like Smart Upgrades?</p>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    <button
                                        style={{ padding: '0.8rem 2.5rem', fontSize: '1rem', background: '#FCD34D', color: '#222', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                                        onClick={() => { setShowUpgradePrompt(false); setShowUpgradeOptions(true); }}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        style={{ padding: '0.8rem 2.5rem', fontSize: '1rem', background: '#64748B', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                                        onClick={() => { setShowUpgradePrompt(false); setShowUpgradeOptions(false); }}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        )}
                        {showUpgradeOptions && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', width: '100%' }}>
                                <p style={{ color: '#FCD34D', fontWeight: 700, fontSize: '1.2rem', margin: 0 }}>Choose Upgrade Grade:</p>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    {availableUpgrades && availableUpgrades.length > 0 ? (
                                        availableUpgrades.map((grade) => (
                                            <button
                                                key={grade}
                                                style={{
                                                    padding: '0.8rem 2rem',
                                                    fontSize: '1rem',
                                                    background: grade === 'Classic' ? '#FCD34D' : grade === 'Premium' ? '#a3e635' : '#38bdf8',
                                                    color: '#222',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    fontWeight: 700,
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => handleSmartUpgrade(grade)}
                                            >
                                                {grade}
                                            </button>
                                        ))
                                    ) : (
                                        <p style={{ color: '#64748B', fontWeight: 700, fontSize: '1rem', margin: 0 }}>No upgrades available</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: 0 }}>Base Valuation Breakdown</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {breakdown.map((item, idx) => (
                        <div key={idx} style={{
                            padding: '2rem',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '20px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', marginBottom: '1rem', letterSpacing: '1px' }}>
                                <span>{item.category}</span>
                                <span style={{ color: '#67E8F9' }}>{item.percentage}%</span>
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>{item.component}</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>
                                ₹{item.amount.toLocaleString('en-IN')}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default EstimationResult;
