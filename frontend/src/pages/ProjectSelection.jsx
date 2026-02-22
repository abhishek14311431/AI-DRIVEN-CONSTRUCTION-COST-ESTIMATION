import React from 'react';
import { projectConfigs } from '../constants/projectConfigs';

const ProjectSelection = ({ setView, startProject }) => {
    return (
        <main className="animate selection-view" style={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 0' }}>
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
