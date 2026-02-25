import React from 'react';

const AnimatedConstructionLogo = () => {
    return (
        <div className="construction-logo active" style={{ perspective: '1000px' }}>
            <div className="blueprint-grid" />
            <div className="building-block-1" />
            <div className="building-block-2" />
            <div className="building-block-3" />
            <div className="connecting-line line-1" />
            <div className="connecting-line line-2" />
        </div>
    );
};

const EstimationResult = ({ result, savedId, setView, saveProject }) => {
    // Standardizing format to match 2026 Smart Breakdown engine
    const breakdown = Array.isArray(result.breakdown) ? result.breakdown : [];

    return (
        <section className="animate" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header with Logo */}
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

            <div className="liquid-glass-panel" style={{ padding: '4rem', marginBottom: '3rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '32px' }}>
                <p style={{ fontSize: '0.9rem', letterSpacing: '6px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Total Estimated Investment</p>
                <div style={{ fontSize: '8rem', fontWeight: 1000, letterSpacing: '-6px', margin: '1.5rem 0', color: '#fff', textShadow: '0 0 60px rgba(103,232,249,0.3)' }}>
                    ₹{typeof result.total_cost === 'number' ? result.total_cost.toLocaleString('en-IN') : result.total_cost}
                </div>
                <button className="btn-primary" onClick={saveProject} style={{ padding: '1.2rem 3rem', fontSize: '1.1rem' }}>
                    SECURE THIS VALUATION
                </button>
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
    );
};

export default EstimationResult;
