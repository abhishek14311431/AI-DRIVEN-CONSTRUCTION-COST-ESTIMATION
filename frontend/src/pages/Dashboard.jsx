import React, { useState, useEffect } from 'react';

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

const Dashboard = ({ setView }) => {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = dateTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <main className="animate dashboard-main">
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
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(0,242,255,0.15), rgba(124,58,237,0.15))',
                    border: '2px solid rgba(0,242,255,0.3)',
                    borderRadius: '14px',
                    padding: '0.8rem',
                    boxShadow: '0 10px 30px rgba(0,242,255,0.2)'
                }}>
                    <AnimatedConstructionLogo />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div style={{
                        fontSize: '1rem',
                        fontWeight: 900,
                        letterSpacing: '2px',
                        background: 'linear-gradient(90deg, #00f2ff, #20e3b2)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textTransform: 'uppercase'
                    }}>AI Builder</div>
                    <div style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '1.5px',
                        color: 'rgba(0,242,255,0.6)',
                        textTransform: 'uppercase'
                    }}>Est. 2026</div>
                </div>
            </div>

            <div className="liquid-glass-panel">
                <div className="hero-text" style={{ padding: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                        <div className="greeting-label" style={{ margin: 0 }}>{getGreeting()},</div>
                        <div className="live-clock" style={{ fontSize: '0.8rem', opacity: 0.5, letterSpacing: '2px', fontWeight: 600 }}>
                            {formatDate(dateTime)} | {formatTime(dateTime)}
                        </div>
                    </div>
                    <h1 className="user-name-hero" style={{ marginBottom: '1rem' }}>ABHISHEK</h1>
                    <div className="hero-subtitle">
                        Your design intelligence system is ready.<br />
                        Let's architect the future of living.
                    </div>
                </div>

                <div className="dashboard-actions" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', alignItems: 'flex-end', flex: 1 }}>
                    <div className="action-card" onClick={() => setView('selection')} style={{ width: '500px' }}>
                        <div className="card-label">
                            <span>01. INITIALIZE</span>
                            <span style={{ color: '#ffea00' }}>⚡</span>
                        </div>
                        <h3>New Project</h3>
                        <p>Launch Estimator →</p>
                    </div>

                    <div className="action-card" onClick={() => setView('archives')}>
                        <div className="card-label">
                            <span>02. DATABASE</span>
                            <span>📁</span>
                        </div>
                        <h3>View Archives</h3>
                        <div className="btn-circle" style={{ width: '30px', height: '30px', fontSize: '0.8rem', position: 'absolute', bottom: '2.5rem', right: '2.5rem' }}>→</div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
