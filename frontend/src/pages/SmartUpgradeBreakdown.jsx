import React, { useState, useEffect } from 'react';

// Upgrade facilities mapping
const UPGRADE_FACILITIES = {
    'Classic': {
        description: 'Granite Premium Grade Flooring',
        materials: [
            { id: 'flooring', label: 'Granite Flooring', amount: 45000, description: 'High-grade polished granite across living areas' },
            { id: 'stairs', label: 'Granite Stairs', amount: 35000, description: 'Granite with anti-slip finish' },
            { id: 'counters', label: 'Granite Kitchen Counters', amount: 28000, description: 'Thick granite counter with edges' },
            { id: 'window_frames', label: 'Premium Wooden Window Frames', amount: 52000, description: 'Teak wood with high-quality glass' },
            { id: 'doors', label: 'Premium Wooden Doors', amount: 38000, description: 'Solid wood doors with modern hardware' }
        ]
    },
    'Premium': {
        description: 'Italian Marble Premium Grade',
        materials: [
            { id: 'flooring', label: 'Imported Marble Flooring', amount: 78000, description: 'Italian marble flooring throughout' },
            { id: 'stairs', label: 'Imported Marble Stairs', amount: 65000, description: 'Italian marble stairs with beveled edges' },
            { id: 'counters', label: 'Italian Marble Counters', amount: 52000, description: 'Premium Italian marble kitchen counters' },
            { id: 'wall_cladding', label: 'Marble Wall Cladding', amount: 42000, description: 'Partial marble wall cladding in main areas' },
            { id: 'jacuzzi', label: 'Jacuzzi Tub', amount: 85000, description: 'Premium heated jacuzzi installation' },
            { id: 'lighting', label: 'Designer Lighting', amount: 48000, description: 'Premium designer light fixtures' }
        ]
    },
    'Elite': {
        description: 'Italian Marble Ultra Luxury Grade',
        materials: [
            { id: 'flooring', label: 'Italian Marble Flooring', amount: 125000, description: 'Premium Italian marble throughout all areas' },
            { id: 'stairs', label: 'Italian Marble Stairs', amount: 95000, description: 'Hand-cut Italian marble with gold accents' },
            { id: 'counters', label: 'Italian Marble Counters', amount: 78000, description: 'Premium Italian marble with edge detailing' },
            { id: 'wall_cladding', label: 'Full Marble Wall Cladding', amount: 65000, description: 'Complete marble cladding in living & bedrooms' },
            { id: 'jacuzzi', label: 'Premium Jacuzzi Tub', amount: 125000, description: 'Luxury heated jacuzzi with spa features' },
            { id: 'lightning_smart', label: 'Smart Home Lighting', amount: 68000, description: 'App-controlled smart lighting system' },
            { id: 'home_automation', label: 'Home Automation', amount: 95000, description: 'Complete home automation & security' },
            { id: 'steam_shower', label: 'Steam Shower', amount: 85000, description: 'Luxury steam shower with therapy features' }
        ]
    }
};

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

const SmartUpgradeBreakdown = ({ result, projectInputs, upgradeGrade, setView, onConfirmUpgrade }) => {
    const [selectedFacilities, setSelectedFacilities] = useState([]);
    const [upgradeBreakdown, setUpgradeBreakdown] = useState([]);
    const [baseAmount, setBaseAmount] = useState(0);
    const [customizedAmount, setCustomizedAmount] = useState(0);

    // Initialize facilities and calculate amounts
    useEffect(() => {
        if (result && upgradeGrade && UPGRADE_FACILITIES[upgradeGrade]) {
            const facilities = UPGRADE_FACILITIES[upgradeGrade].materials;
            setSelectedFacilities(facilities.map(f => f.id));
            
            // Calculate base and upgrade amounts
            const baseCost = result.total_cost / 1.3; // Approximate base without multiplier
            setBaseAmount(Math.round(baseCost));
            
            const totalFacilities = facilities.reduce((sum, f) => sum + f.amount, 0);
            setCustomizedAmount(totalFacilities);
        }
    }, [result, upgradeGrade]);

    // Calculate breakdown items
    useEffect(() => {
        if (UPGRADE_FACILITIES[upgradeGrade]) {
            const facilities = UPGRADE_FACILITIES[upgradeGrade].materials;
            const selected = facilities.filter(f => selectedFacilities.includes(f.id));
            setUpgradeBreakdown(selected);
        }
    }, [selectedFacilities, upgradeGrade]);

    const handleFacilityToggle = (facilityId) => {
        setSelectedFacilities(prev =>
            prev.includes(facilityId)
                ? prev.filter(id => id !== facilityId)
                : [...prev, facilityId]
        );
    };

    const handleRemoveFacility = (facilityId) => {
        setSelectedFacilities(prev => prev.filter(id => id !== facilityId));
    };

    const handleFacilityAmountChange = (facilityId, newAmount) => {
        setUpgradeBreakdown(prev =>
            prev.map(f => f.id === facilityId ? { ...f, amount: Math.max(0, newAmount) } : f)
        );
    };

    const totalUpgradeAmount = upgradeBreakdown.reduce((sum, f) => sum + f.amount, 0);
    const totalAmount = baseAmount + totalUpgradeAmount;

    const gradeDescriptions = {
        'Classic': '🔷 Classic - Granite Premium Grade',
        'Premium': '💎 Premium - Italian Marble',
        'Elite': '👑 Elite - Ultra Luxury Italian Marble'
    };

    return (
        <section className="animate" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh' }}>
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
                    <button 
                        className="btn-ghost" 
                        onClick={() => setView('result')}
                        style={{ fontSize: '1rem' }}
                    >
                        ← BACK
                    </button>
                    <h2 style={{ fontSize: '4.5rem', fontWeight: 900, marginTop: '1.5rem', letterSpacing: '-3px' }}>SMART UPGRADE</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>GRADE</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FCD34D' }}>{gradeDescriptions[upgradeGrade]}</div>
                </div>
            </div>

            {/* ── AMOUNT VISUALIZATION ── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '2rem',
                marginBottom: '3rem'
            }}>
                {/* Base Amount */}
                <div style={{
                    padding: '2rem',
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))',
                    border: '1px solid rgba(59,130,246,0.3)',
                    borderRadius: '20px'
                }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem', textTransform: 'uppercase' }}>Base Amount</div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#3B82F6' }}>₹{baseAmount.toLocaleString('en-IN')}</div>
                </div>

                {/* Plus Sign */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: 'rgba(255,255,255,0.2)' }}>+</div>
                </div>

                {/* Upgrade Amount */}
                <div style={{
                    padding: '2rem',
                    background: 'linear-gradient(135deg, rgba(251,146,60,0.1), rgba(251,146,60,0.05))',
                    border: '1px solid rgba(251,146,60,0.3)',
                    borderRadius: '20px'
                }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem', textTransform: 'uppercase' }}>Upgrade Amount</div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FB923C' }}>₹{totalUpgradeAmount.toLocaleString('en-IN')}</div>
                </div>
            </div>

            {/* ── TOTAL AMOUNT ── */}
            <div style={{
                padding: '3rem',
                background: 'linear-gradient(135deg, rgba(103,232,249,0.15), rgba(124,58,237,0.1))',
                border: '1px solid rgba(103,232,249,0.3)',
                borderRadius: '24px',
                marginBottom: '3rem',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '0.9rem', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem', textTransform: 'uppercase' }}>Total Estimated Investment</div>
                <div style={{
                    fontSize: '5rem',
                    fontWeight: 1000,
                    letterSpacing: '-3px',
                    color: '#fff',
                    textShadow: '0 0 60px rgba(103,232,249,0.3)'
                }}>
                    ₹{totalAmount.toLocaleString('en-IN')}
                </div>
            </div>

            {/* ── COST BREAKDOWN & FACILITIES ── */}
            <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.5px' }}>Upgrade Facilities & Cost Breakdown</h3>
                
                <div style={{
                    display: 'grid',
                    gap: '1rem'
                }}>
                    {upgradeBreakdown.map((facility) => (
                        <div
                            key={facility.id}
                            style={{
                                padding: '1.5rem',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.5rem',
                                transition: '0.3s ease'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.15)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
                            }}
                        >
                            {/* Checkbox */}
                            <input
                                type="checkbox"
                                checked={selectedFacilities.includes(facility.id)}
                                onChange={() => handleFacilityToggle(facility.id)}
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    cursor: 'pointer',
                                    accentColor: '#00f2ff'
                                }}
                            />

                            {/* Facility Details */}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.3rem' }}>
                                    {facility.label}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                                    {facility.description}
                                </div>
                            </div>

                            {/* Editable Amount */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.3rem' }}>COST</div>
                                    <input
                                        type="number"
                                        value={facility.amount}
                                        onChange={(e) => handleFacilityAmountChange(facility.id, parseInt(e.target.value) || 0)}
                                        style={{
                                            width: '120px',
                                            padding: '0.8rem',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            color: '#67E8F9',
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            textAlign: 'right',
                                            outline: 'none',
                                            transition: '0.2s'
                                        }}
                                        onFocus={e => e.currentTarget.style.border = '1px solid rgba(103,232,249,0.5)'}
                                        onBlur={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'}
                                    />
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => handleRemoveFacility(facility.id)}
                                    style={{
                                        padding: '0.8rem',
                                        background: 'rgba(239,68,68,0.1)',
                                        border: '1px solid rgba(239,68,68,0.3)',
                                        borderRadius: '8px',
                                        color: '#FCA5A5',
                                        cursor: 'pointer',
                                        fontWeight: 700,
                                        transition: '0.2s'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'rgba(239,68,68,0.2)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message if no facilities selected */}
                {upgradeBreakdown.length === 0 && (
                    <div style={{
                        padding: '2rem',
                        background: 'rgba(251,146,60,0.1)',
                        border: '1px solid rgba(251,146,60,0.3)',
                        borderRadius: '16px',
                        textAlign: 'center',
                        color: 'rgba(255,255,255,0.6)'
                    }}>
                        No facilities selected. Please select at least one facility to proceed.
                    </div>
                )}
            </div>

            {/* ── ACTION BUTTONS ── */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '3rem',
                marginBottom: '3rem'
            }}>
                <button
                    onClick={() => setView('result')}
                    style={{
                        flex: 1,
                        padding: '1.2rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '14px',
                        color: '#fff',
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: '0.3s'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }}
                >
                    DISCARD UPGRADE
                </button>

                <button
                    onClick={() => {
                        onConfirmUpgrade({
                            upgradeGrade,
                            selectedFacilities: upgradeBreakdown,
                            totalUpgradeAmount,
                            totalAmount
                        });
                    }}
                    disabled={upgradeBreakdown.length === 0}
                    style={{
                        flex: 1,
                        padding: '1.2rem',
                        background: upgradeBreakdown.length > 0 
                            ? 'linear-gradient(135deg, rgba(0,242,255,0.2), rgba(124,58,237,0.2))'
                            : 'rgba(255,255,255,0.05)',
                        border: upgradeBreakdown.length > 0 
                            ? '1px solid rgba(0,242,255,0.3)'
                            : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '14px',
                        color: '#fff',
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        cursor: upgradeBreakdown.length > 0 ? 'pointer' : 'not-allowed',
                        transition: '0.3s',
                        opacity: upgradeBreakdown.length > 0 ? 1 : 0.5
                    }}
                    onMouseEnter={e => {
                        if (upgradeBreakdown.length > 0) {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,242,255,0.3), rgba(124,58,237,0.3))';
                            e.currentTarget.style.boxShadow = '0 0 40px rgba(0,242,255,0.4)';
                        }
                    }}
                    onMouseLeave={e => {
                        if (upgradeBreakdown.length > 0) {
                            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,242,255,0.2), rgba(124,58,237,0.2))';
                            e.currentTarget.style.boxShadow = 'none';
                        }
                    }}
                >
                    CONFIRM UPGRADE (₹{totalAmount.toLocaleString('en-IN')})
                </button>
            </div>
        </section>
    );
};

export default SmartUpgradeBreakdown;
