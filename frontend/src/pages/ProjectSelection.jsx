import React from 'react';
import { projectConfigs } from '../constants/projectConfigs';

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

const ProjectSelection = ({ setView, startProject }) => {
    return (
        <main className="animate selection-view" style={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 0' }}>
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

            {/* Header Outside the Glass Panel */}
            <div className="selection-header-top" style={{ width: '80vw', maxWidth: '1300px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '4rem' }}>
                <button className="btn-ghost-mini" onClick={() => setView('dashboard')} style={{ position: 'absolute', left: '0', fontSize: '1rem', padding: '0.8rem 1.5rem' }}>
                    &larr; Back
                </button>
                <h2 className="selection-title-floating" style={{ fontSize: '4.5rem', fontFamily: "'Playfair Display', serif", fontWeight: '600', color: '#fff', margin: 0 }}>
                    Start Your Project
                </h2>
            </div>

            {/* Glass Panel strictly for Projects - Increased Vertical Length */}
            <div className="liquid-glass-panel" style={{ width: '80vw', maxWidth: '1300px', minHeight: '850px', padding: '6rem 4rem', display: 'block' }}>
                <div className="project-grid-panoramic" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', width: '100%' }}>
                    {Object.keys(projectConfigs).map(key => (
                        <div key={key} className={`project-card-v2 ${projectConfigs[key].theme}`} onClick={() => startProject(key)}>
                            <div className="card-media" style={{ backgroundImage: `url(${projectConfigs[key].image})` }}>
                                <div className="media-overlay">
                                    <div className="icon-badge">
                                        {key === 'own_house' ? '🏠' :
                                            key === 'villa' ? '🏰' :
                                                key === 'rental' ? '🏢' :
                                                    key === 'commercial' ? '🏙️' :
                                                        key === 'interior' ? '🛋️' :
                                                            key === 'exterior' ? '🌳' : '🏢'}
                                    </div>
                                </div>
                            </div>
                            <div className="card-details">
                                <h3>{projectConfigs[key].title}</h3>
                                <p>{projectConfigs[key].subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default ProjectSelection;
