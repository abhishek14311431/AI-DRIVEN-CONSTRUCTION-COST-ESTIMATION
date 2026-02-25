import React, { useState, useEffect } from 'react';
import { projectConfigs } from '../constants/projectConfigs';

const STEP_LABELS = [
    'Plot & Site', 'Building Height', 'Grade', 'Details',
    'Floor Plan', 'Review', 'Interiors', 'Add-ons', 'Cost Est.'
];

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

const InfoPill = ({ inputs, config }) => {
    // Map vastu direction to display text with meaning
    const vastuMap = {
        north: 'North - Prosperity & Wisdom',
        south: 'South - Wealth & Fame',
        east: 'East - Health & Energy',
        west: 'West - Stability & Support'
    };

    // Map interior package to display text
    const interiorMap = {
        'none': 'No Interior',
        'base': 'Base Interior',
        'semi': 'Semi Interior',
        'full_furnished': 'Full Furnished'
    };

    const items = [
        { label: 'PROJECT', value: config.title },
        { label: 'PLOT', value: inputs.plot_size ? (inputs.plot_size === 'full' ? 'Full Site' : 'Double Site') : null },
        { label: 'SIZE', value: inputs.dimensions || null },
        { label: 'FLOOR', value: inputs.floor || null },
        { label: 'GRADE', value: inputs.structural_style || null },
        { label: 'BEDROOMS', value: inputs.bedrooms ? `${inputs.bedrooms} BHK` : null },
        { label: 'LIFT', value: inputs.lift_required === true ? 'Yes' : inputs.lift_required === false ? 'No' : null },
        { label: 'VASTU', value: inputs.vastu_direction ? vastuMap[inputs.vastu_direction.toLowerCase()] : null },
        { label: 'INTERIOR', value: inputs.interior_package && inputs.interior_package !== 'none' ? interiorMap[inputs.interior_package] : null },
    ].filter(item => item.value);

    return (
        <div style={{
            display: 'flex', gap: '1.5rem', alignItems: 'center',
            background: 'linear-gradient(145deg, rgba(8,10,14,0.78), rgba(12,14,20,0.62))', backdropFilter: 'blur(42px) saturate(170%)',
            border: '1px solid rgba(255,255,255,0.16)', borderRadius: '100px',
            padding: '0.8rem 2.2rem', flexWrap: 'wrap', justifyContent: 'flex-start'
        }}>
            {items.map((item, i) => (
                <React.Fragment key={item.label}>
                    {i > 0 && <div style={{ width: '1px', height: '2.8rem', background: 'rgba(255,255,255,0.12)' }} />}
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.69rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>{item.label}</div>
                        <div style={{ fontSize: '1.0925rem', fontWeight: 700, marginTop: '0.2rem' }}>{item.value}</div>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};

const WizardShell = ({ children, config, step, inputs, onBack, onNext, nextLabel, nextDisabled, total, showTopNext = true }) => (
    <main className="animate" style={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 0 6rem', overflowY: 'auto', background: 'transparent' }}>
        {/* Top bar - Centered Layout */}
        <div style={{ width: '92vw', maxWidth: '1584px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', gap: '1.5rem', flexWrap: 'nowrap' }}>
            {/* Left Side - Logo & Back Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexShrink: 0 }}>
                <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(0,242,255,0.1), rgba(124,58,237,0.1))',
                    border: '2px solid rgba(0,242,255,0.2)',
                    borderRadius: '12px',
                    padding: '0.6rem'
                }}>
                    <AnimatedConstructionLogo />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '2.5px', color: '#00f2ff', textTransform: 'uppercase' }}>AI Builder</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '1px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Est. 2026</div>
                </div>
                <button onClick={onBack} style={{
                    padding: '0.9rem 1.5rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.15)',
                    background: 'linear-gradient(145deg, rgba(12,14,20,0.8), rgba(16,18,26,0.66))', backdropFilter: 'blur(30px) saturate(170%)',
                    color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.6rem', letterSpacing: '0.5px',
                    transition: 'all 0.2s ease', whiteSpace: 'nowrap'
                }}>
                    ← Back
                </button>
            </div>
            
            {/* Centered InfoPill */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <InfoPill inputs={inputs} config={config} />
            </div>
            
            {/* Right Side - Next Button */}
            {showTopNext && (
                <button onClick={() => { if (!nextDisabled) onNext(); }} style={{
                    padding: '0.9rem 2rem', borderRadius: '100px',
                    border: nextDisabled ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,242,255,0.4)',
                    background: nextDisabled ? 'rgba(20,24,32,0.62)' : 'linear-gradient(135deg, rgba(39,147,170,0.38), rgba(92,69,140,0.34))',
                    backdropFilter: 'blur(20px)', color: nextDisabled ? 'rgba(255,255,255,0.3)' : '#fff',
                    fontSize: '1rem', fontWeight: 600, cursor: nextDisabled ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.6rem', letterSpacing: '0.5px',
                    transition: 'all 0.3s ease', whiteSpace: 'nowrap', flexShrink: 0
                }}>
                    {nextLabel || 'Next ?'}
                </button>
            )}
            {!showTopNext && <div style={{ width: '120px' }} />}
        </div>

        {/* Content */}
        {children}
    </main>
);

const GlassCard = ({ children, style = {} }) => (
    <div style={{
        width: '92vw', maxWidth: '1584px', padding: '3rem 4rem', borderRadius: '2rem',
        background: 'linear-gradient(145deg, rgba(10,12,18,0.84), rgba(14,16,24,0.7))', backdropFilter: 'blur(58px) saturate(175%)',
        border: '1px solid rgba(255,255,255,0.16)',
        boxShadow: '0 28px 85px rgba(2, 6, 16, 0.5), inset 0 1px 0 rgba(255,255,255,0.14)', marginBottom: '2rem', minHeight: '72vh', animation: 'none',
        ...style
    }}>
        {children}
    </div>
);

const BottomStepButton = ({ label, disabled = false, onClick, top = '0.5rem' }) => (
    <div style={{ width: '92vw', maxWidth: '420px', marginTop: top, marginBottom: '1.3rem', margin: '0 auto' }}>
        <button
            onClick={onClick}
            style={{
                width: '100%',
                padding: '1.3rem 1.6rem',
                borderRadius: '1rem',
                border: disabled ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(145,229,255,0.72)',
                background: disabled ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, rgba(39,147,170,0.38), rgba(92,69,140,0.34))',
                color: disabled ? 'rgba(255,255,255,0.55)' : '#fff',
                fontSize: '1.08rem',
                fontWeight: 700,
                cursor: disabled ? 'not-allowed' : 'pointer',
                letterSpacing: '1px'
            }}
        >
            {label}
        </button>
    </div>
);

const fmt = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

const getCategory = (name) => {
    const n = name.toLowerCase();
    if (n.includes('excav') || n.includes('rcc') || n.includes('foundation') || n.includes('masonry') || n.includes('steel') || n.includes('concrete') || n.includes('earthwork') || n.includes('structure')) return 'STRUCTURE';
    if (n.includes('plumb') || n.includes('elect') || n.includes('sanit') || n.includes('septic') || n.includes('wiring') || n.includes('utility')) return 'UTILITIES';
    if (n.includes('floor') || n.includes('paint') || n.includes('plaster') || n.includes('tile') || n.includes('door') || n.includes('window') || n.includes('woodwork') || n.includes('finish')) return 'FLOORING';
    if (n.includes('compound') || n.includes('parking') || n.includes('rain') || n.includes('lift') || n.includes('gate') || n.includes('waterproof') || n.includes('solar') || n.includes('staircase')) return 'EXTERIOR';
    if (n.includes('interior')) return 'OPTIONAL';
    return 'STRUCTURE';
};

const catColor = {
    'STRUCTURE': { bg: 'rgba(139,92,246,0.18)', text: '#A78BFA', border: 'rgba(139,92,246,0.4)' },
    'UTILITIES': { bg: 'rgba(6,182,212,0.15)', text: '#22D3EE', border: 'rgba(6,182,212,0.4)' },
    'BATHROOM': { bg: 'rgba(251,191,36,0.13)', text: '#FCD34D', border: 'rgba(251,191,36,0.35)' },
    'ELECTRICAL': { bg: 'rgba(52,211,153,0.13)', text: '#6EE7B7', border: 'rgba(52,211,153,0.35)' },
    'FLOORING': { bg: 'rgba(244,114,182,0.13)', text: '#F9A8D4', border: 'rgba(244,114,182,0.35)' },
    'EXTERIOR': { bg: 'rgba(167,139,250,0.13)', text: '#C4B5FD', border: 'rgba(167,139,250,0.35)' },
    'OPTIONAL': { bg: 'rgba(236,72,153,0.13)', text: '#F472B6', border: 'rgba(236,72,153,0.35)' }
};

const liquidGlass = {
    background: 'rgba(255,255,255,0.005)', /* Ultra Transparent */
    backdropFilter: 'blur(32px) saturate(160%)',
    WebkitBackdropFilter: 'blur(32px) saturate(160%)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    boxShadow: '0 4px 24px 0 rgba(0,0,0,0.2)',
};

const CountUp = ({ end, duration = 1200 }) => {
    const [count, setCount] = useState(0);
    const target = typeof end === 'string' ? parseFloat(end.replace(/[^0-9.]/g, '')) : end;

    useEffect(() => {
        if (!target || isNaN(target)) {
            setCount(0);
            return;
        }

        // Always start from 0 when the component mounts or target changes
        let startValue = 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out quad
            const easeProgress = progress * (2 - progress);
            const currentCount = Math.floor(easeProgress * target);

            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(target);
            }
        };

        requestAnimationFrame(animate);
        return () => { }; // Cleanup not needed for simple RAF version as progress < 1 check handles it
    }, [target, duration]);

    return (
        <span>{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(count)}</span>
    );
};

const SignaturePad = ({ onSave, onClear }) => {
    const canvasRef = React.useRef(null);
    const [isDrawing, setIsDrawing] = React.useState(false);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
    }, []);

    const getPos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e) => {
        const pos = getPos(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const pos = getPos(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const endDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        onSave(canvasRef.current.toDataURL());
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onClear();
    };

    return (
        <div style={{ position: 'relative', background: '#fff', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', height: '200px', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)' }}>
            <canvas
                ref={canvasRef}
                width={600}
                height={200}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={endDrawing}
                style={{ cursor: 'crosshair', width: '100%', height: '100%', touchAction: 'none' }}
            />
            <button
                onClick={clearCanvas}
                style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.08)', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '10px', fontWeight: 800, cursor: 'pointer', color: '#000', letterSpacing: '0.1em' }}
            >CLEAR SIGNATURE</button>
        </div>
    );
};

const ProjectWizard = ({ projectType, step, inputs, setInputs, setView, handleNext }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
    const [estData, setEstData] = useState(null);
    const [loadingEst, setLoadingEst] = useState(false);
    const [displayTotal, setDisplayTotal] = useState(0);
    const [countStarted, setCountStarted] = useState(false);
    const [isLoadedHUD, setIsLoadedHUD] = useState(false);
    const [filterHUD, setFilterHUD] = useState('ALL');

    // Project Finalization States
    const [showFinalize, setShowFinalize] = useState(false);
    const [clientName, setClientName] = useState('');
    const [signature, setSignature] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [showUpgradeOptions, setShowUpgradeOptions] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const config = projectConfigs[projectType] || projectConfigs.own_house;
    const currentStep = config.steps[step];
    const total = config.steps.length;

    useEffect(() => {
        if (currentStep.type === 'final-estimate') {
            fetchEstimation();
        } else if (currentStep.type === 'addons') {
            // Pre-fetch in background
            fetchEstimation(true);
        }
    }, [currentStep.type, step]);

    // Trigger HUD load animations only on the final step
    useEffect(() => {
        if (currentStep.type !== 'final-estimate') {
            setIsLoadedHUD(false);
            setCountStarted(false);
            setDisplayTotal(0);
            return;
        }

        const loadTimer = setTimeout(() => {
            setIsLoadedHUD(true);
            const countTimer = setTimeout(() => setCountStarted(true), 600);
            return () => clearTimeout(countTimer);
        }, 100);

        return () => clearTimeout(loadTimer);
    }, [currentStep.type]);

    // Animate the total valuation once data is present and animation is allowed
    useEffect(() => {
        if (currentStep.type !== 'final-estimate' || !countStarted || !estData?.total_cost) return;

        let start = 0;
        const end = estData.total_cost;
        const duration = 2000;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayTotal(end);
                clearInterval(timer);
            } else {
                setDisplayTotal(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [countStarted, estData, currentStep.type]);

    // Prepare request payload with defaults for missing required fields
    const prepareEstimationPayload = () => {
        const payload = { ...inputs };
        
        // Define required fields with defaults based on project type
        const requiredDefaults = {
            plot_size: 'full',
            dimensions: '30x40',
            floor: 'G+2',
            bedrooms: 3,
            structural_style: 'Base',
            zone: 'B',
            lift_required: false,
            interior_package: 'none',
            include_compound_wall: false,
            include_rainwater_harvesting: false,
            include_car_parking: false,
            family_count: 5,
            children_count: 2,
            grandparents_living: false,
            pooja_room: false
        };
        
        // Merge with defaults if missing
        Object.keys(requiredDefaults).forEach(key => {
            if (payload[key] === undefined || payload[key] === null || payload[key] === '') {
                payload[key] = requiredDefaults[key];
            }
        });
        
        return payload;
    };

    const fetchEstimation = async (isBackground = false, retryCount = 0) => {
        const maxRetries = 3;
        
        if (!isBackground) setLoadingEst(true);
        
        try {
            // Validate minimum required fields
            if (!inputs.plot_size || !inputs.dimensions) {
                if (!isBackground) {
                    setEstData({ 
                        error: true, 
                        message: "Please complete required fields: Plot Size and Dimensions" 
                    });
                }
                if (!isBackground) setLoadingEst(false);
                return;
            }

            const endpoint = `${API_BASE_URL}/${projectType.replace('_', '-')}/estimate`;
            const payload = prepareEstimationPayload();
            
            console.log(`[Attempt ${retryCount + 1}/${maxRetries + 1}] Fetching from:`, endpoint);
            console.log('Payload:', payload);

            // Set a timeout for the fetch
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                setEstData(data);
                if (!isBackground) {
                    setDisplayTotal(data.total_cost || 0);
                    console.log('✓ Estimation loaded successfully:', data.total_cost);
                }
            } else if (res.status >= 500 && retryCount < maxRetries) {
                // Server error - retry with exponential backoff
                console.warn(`Server error ${res.status}, retrying...`);
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
                return fetchEstimation(isBackground, retryCount + 1);
            } else if (!isBackground) {
                try {
                    const errData = await res.json();
                    let errorMsg = `API Error ${res.status}`;
                    
                    // Parse validation errors from Pydantic
                    if (Array.isArray(errData.detail)) {
                        const missingFields = errData.detail
                            .filter(e => e.type === 'missing')
                            .map(e => e.loc[e.loc.length - 1])
                            .join(', ');
                        if (missingFields) {
                            errorMsg = `Missing required fields: ${missingFields}`;
                        }
                    } else if (typeof errData.detail === 'string') {
                        errorMsg = errData.detail;
                    }
                    
                    setEstData({ 
                        error: true, 
                        message: errorMsg
                    });
                } catch {
                    setEstData({ 
                        error: true, 
                        message: `Server Error ${res.status}. Please ensure backend is running and try again.` 
                    });
                }
            }
        } catch (err) {
            console.error('Estimation fetch error:', err.message);
            
            if (err.name === 'AbortError') {
                if (retryCount < maxRetries) {
                    console.warn('Request timeout, retrying...');
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
                    return fetchEstimation(isBackground, retryCount + 1);
                }
                if (!isBackground) {
                    setEstData({ 
                        error: true, 
                        message: "Request timeout. Ensure backend is running at " + API_BASE_URL 
                    });
                }
            } else if (err.message.includes('Failed to fetch')) {
                if (retryCount < maxRetries) {
                    console.warn('Network error, retrying...');
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
                    return fetchEstimation(isBackground, retryCount + 1);
                }
                if (!isBackground) {
                    setEstData({ 
                        error: true, 
                        message: "Cannot reach API server. Check if backend is running on port 8000." 
                    });
                }
            } else {
                if (!isBackground) {
                    setEstData({ 
                        error: true, 
                        message: `Error: ${err.message}` 
                    });
                }
            }
        } finally {
            if (!isBackground) setLoadingEst(false);
        }
    };

    const [saveError, setSaveError] = useState(null);

    const handleSaveProject = async () => {
        if (!clientName) {
            setSaveError("Client Name is required for architectural sign-off.");
            return;
        }
        if (!signature || signature.length < 100) {
            setSaveError("Please provide a digital signature to authorize this estimation.");
            return;
        }

        setIsSaving(true);
        setSaveError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/projects/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_type: projectType,
                    input_json: {
                        ...inputs,
                        client_name: clientName,
                        signature: signature,
                        inflation_factor: "1.02%",
                        valuation_year: "2026"
                    },
                    total_cost: estData.total_cost,
                    breakdown_json: { items: estData.breakdown }
                })
            });

            if (res.ok) {
                setSaveSuccess(true);
                setTimeout(() => {
                    setView('archives');
                }, 6000);
            } else {
                const errData = await res.json();
                setSaveError(errData.detail || "Database Persistence Error. Please check site connectivity.");
            }
        } catch (err) {
            console.error("Failed to save project:", err);
            setSaveError("Network infrastructure failure. Project could not be persisted.");
        } finally {
            setIsSaving(false);
        }
    };

    const onBack = () => step === 0 ? setView('selection') : handleNext(-1);
    const setField = (field, value) => setInputs(prev => ({ ...prev, [field]: value }));

    if (currentStep.type === 'split-selection') {
        const left = currentStep.leftSide;
        const right = currentStep.rightSide;
        const leftValue = inputs[left.field];
        const rightOptions = leftValue ? (right.optionsByParent?.[leftValue] || []) : [];
        const rightValue = inputs[right.field];
        const canProceed = Boolean(leftValue && rightValue);

        // Plot Dimension Visualization Component
        const PlotDiagramVisualization = () => {
            if (!rightValue) return null;
            
            const [width, depth] = rightValue.split('x').map(Number);
            const sqFt = width * depth;
            const sqM = (sqFt * 0.092903).toFixed(2);
            
            // Calculate scale for visualization (max 300px)
            const maxDim = Math.max(width, depth);
            const scale = 300 / maxDim;
            const scaledWidth = width * scale;
            const scaledDepth = depth * scale;
            
            return (
                <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, rgba(0,242,255,0.08), rgba(124,58,237,0.06))',
                    border: '2px solid rgba(0,242,255,0.25)',
                    borderRadius: '1.8rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1.5rem',
                    alignItems: 'start'
                }}>
                    {/* LEFT: Information Panels */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        {/* Plot Size */}
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(0,242,255,0.1)',
                            border: '1px solid rgba(0,242,255,0.3)',
                            borderRadius: '1rem'
                        }}>
                            <div style={{ fontSize: '0.7rem', color: '#00f2ff', fontWeight: 700, letterSpacing: '1.5px', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                                Plot Size
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>
                                {leftValue === 'full' ? 'Full Site' : 'Double Site'}
                            </div>
                        </div>
                        
                        {/* Dimensions */}
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(32,227,178,0.1)',
                            border: '1px solid rgba(32,227,178,0.3)',
                            borderRadius: '1rem'
                        }}>
                            <div style={{ fontSize: '0.7rem', color: '#20e3b2', fontWeight: 700, letterSpacing: '1.5px', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                                Dimensions
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>
                                {width}' × {depth}'
                            </div>
                        </div>

                        {/* Total Area */}
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(124,58,237,0.1)',
                            border: '1px solid rgba(124,58,237,0.3)',
                            borderRadius: '1rem'
                        }}>
                            <div style={{ fontSize: '0.7rem', color: '#a78bfa', fontWeight: 700, letterSpacing: '1.5px', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                Total Area
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1.2rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.3rem', fontWeight: 600 }}>sq ft</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>
                                        {sqFt.toLocaleString()}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.3rem', fontWeight: 600 }}>sq m</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>
                                        {sqM}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: SVG Diagram */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', justifyContent: 'flex-start' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#00f2ff', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                            Plot Layout
                        </div>
                        
                        <svg width="368" height="368" viewBox="0 0 380 380" style={{ background: 'rgba(20,25,40,0.5)', borderRadius: '1rem', border: '1px solid rgba(0,242,255,0.3)' }}>
                            {/* Grid background */}
                            <defs>
                                <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,242,255,0.1)" strokeWidth="0.5"/>
                                </pattern>
                            </defs>
                            <rect width="380" height="380" fill="url(#smallGrid)" />
                            
                            {/* Plot area */}
                            <rect 
                                x={(380 - scaledWidth) / 2} 
                                y={(380 - scaledDepth) / 2} 
                                width={scaledWidth} 
                                height={scaledDepth}
                                fill="url(#plotGrad)"
                                stroke="#00f2ff"
                                strokeWidth="3"
                            />
                            
                            {/* Gradient for plot */}
                            <defs>
                                <linearGradient id="plotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{stopColor:'rgba(0,242,255,0.3)', stopOpacity:1}} />
                                    <stop offset="100%" style={{stopColor:'rgba(32,227,178,0.2)', stopOpacity:1}} />
                                </linearGradient>
                            </defs>
                            
                            {/* Width dimension */}
                            <line 
                                x1={(380 - scaledWidth) / 2} 
                                y1={360} 
                                x2={(380 - scaledWidth) / 2 + scaledWidth} 
                                y2={360}
                                stroke="#20e3b2"
                                strokeWidth="2"
                            />
                            <circle cx={(380 - scaledWidth) / 2} cy="360" r="3" fill="#20e3b2" />
                            <circle cx={(380 - scaledWidth) / 2 + scaledWidth} cy="360" r="3" fill="#20e3b2" />
                            <text 
                                x={190} 
                                y="375" 
                                textAnchor="middle" 
                                fill="#20e3b2" 
                                fontSize="14" 
                                fontWeight="700"
                            >
                                {width}'
                            </text>
                            
                            {/* Depth dimension */}
                            <line 
                                x1="20" 
                                y1={(380 - scaledDepth) / 2} 
                                x2="20" 
                                y2={(380 - scaledDepth) / 2 + scaledDepth}
                                stroke="#00f2ff"
                                strokeWidth="2"
                            />
                            <circle cx="20" cy={(380 - scaledDepth) / 2} r="3" fill="#00f2ff" />
                            <circle cx="20" cy={(380 - scaledDepth) / 2 + scaledDepth} r="3" fill="#00f2ff" />
                            <text 
                                x="8" 
                                y={190} 
                                textAnchor="middle" 
                                fill="#00f2ff" 
                                fontSize="14" 
                                fontWeight="700"
                                transform={`rotate(-90 8 ${190})`}
                            >
                                {depth}'
                            </text>
                            
                            {/* Compass */}
                            <g transform="translate(330, 30)">
                                <circle cx="0" cy="0" r="15" fill="rgba(0,242,255,0.1)" stroke="rgba(0,242,255,0.4)" strokeWidth="1"/>
                                <line x1="0" y1="-12" x2="0" y2="-18" stroke="#00f2ff" strokeWidth="2"/>
                                <text x="0" y="-20" textAnchor="middle" fill="#00f2ff" fontSize="10" fontWeight="700">N</text>
                            </g>
                        </svg>
                    </div>
                </div>
            );
        };

        const plotImages = {
            full: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=95',
            double: 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=1800&q=95'
        };

        const dimensionImages = {
            '30x40': 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=1800&q=95',
            '30x50': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=95',
            '40x40': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=95',
            '40x50': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1800&q=95',
            '40x60': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1800&q=95',
            '50x80': 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1800&q=95',
            '60x80': 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1800&q=95',
            '60x100': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=95'
        };

        return (
            <WizardShell config={config} step={step} inputs={inputs} onBack={onBack} onNext={handleNext} total={total} showTopNext={false}>
                <GlassCard>
                    <h2 style={{ fontSize: '2.8rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: '2.2rem' }}>{currentStep.title}</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.4rem' }}>
                        <div>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', opacity: 0.62, letterSpacing: '2px' }}>{left.label.toUpperCase()}</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.2rem' }}>
                                {left.options.map(opt => {
                                    const isActive = inputs[left.field] === opt.value;
                                    const image = plotImages[opt.value];
                                    return (
                                        <div key={opt.value}
                                            onClick={() => { setField(left.field, opt.value); setField(right.field, null); }}
                                            style={{
                                                cursor: 'pointer',
                                                minHeight: '250px',
                                                borderRadius: '1.2rem',
                                                overflow: 'hidden',
                                                position: 'relative',
                                                border: isActive ? '2px solid rgba(0,242,255,0.7)' : '2px solid rgba(255,255,255,0.08)',
                                                boxShadow: isActive ? '0 0 18px rgba(0,242,255,0.2)' : 'none'
                                            }}>
                                            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: 'scale(1.16)', filter: 'saturate(1.12) contrast(1.08)', opacity: 0.75 }} />
                                            <div style={{ position: 'relative', height: '100%', padding: '1.45rem', background: 'linear-gradient(to top, rgba(10,18,35,0.56), rgba(10,18,35,0.12))', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                                <div style={{ fontSize: '1.45rem', fontWeight: 800 }}>{opt.label}</div>
                                                <div style={{ fontSize: '1.05rem', opacity: 0.8, marginTop: '0.35rem' }}>{opt.desc}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', opacity: 0.62, letterSpacing: '2px' }}>{right.label.toUpperCase()}</h4>
                            {!leftValue ? (
                                <div style={{ fontSize: '1.02rem', opacity: 0.65, padding: '1.1rem 0.55rem' }}>Select plot size first to view dimensions.</div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.2rem' }}>
                                    {rightOptions.map(opt => {
                                        const isActive = inputs[right.field] === opt.value;
                                        const image = dimensionImages[opt.value];
                                        return (
                                            <div key={opt.value}
                                                onClick={() => setField(right.field, opt.value)}
                                                style={{
                                                    cursor: 'pointer',
                                                    minHeight: '250px',
                                                    borderRadius: '1.2rem',
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                    border: isActive ? '2px solid rgba(0,242,255,0.7)' : '2px solid rgba(255,255,255,0.08)',
                                                    boxShadow: isActive ? '0 0 18px rgba(0,242,255,0.2)' : 'none'
                                                }}>
                                                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: 'scale(1.16)', filter: 'saturate(1.12) contrast(1.08)', opacity: 0.75 }} />
                                                <div style={{ position: 'relative', height: '100%', padding: '1.45rem', background: 'linear-gradient(to top, rgba(10,18,35,0.56), rgba(10,18,35,0.12))', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                                    <div style={{ fontSize: '1.45rem', fontWeight: 800 }}>{opt.label}</div>
                                                    <div style={{ fontSize: '1.05rem', opacity: 0.8, marginTop: '0.35rem' }}>{opt.desc}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                    {rightValue && <PlotDiagramVisualization />}
                </GlassCard>
                <BottomStepButton
                    label={canProceed ? 'NEXT ->' : 'SELECT PLOT SIZE AND DIMENSION TO CONTINUE'}
                    disabled={!canProceed}
                    onClick={() => { if (canProceed) handleNext(); }}
                />
            </WizardShell >
        );
    }

    if (currentStep.type === 'floor-grade') {
        const canProceed = Boolean(inputs[currentStep.floorField] && inputs[currentStep.gradeField]);

        return (
            <WizardShell config={config} step={step} inputs={inputs} onBack={onBack} onNext={handleNext} total={total} showTopNext={false}>
                <GlassCard>
                    <h2 style={{ fontSize: '2.8rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: '2.2rem' }}>{currentStep.title}</h2>

                    <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.1rem', opacity: 0.72, letterSpacing: '2px' }}>BUILDING HEIGHT</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem', marginBottom: '2rem' }}>
                        {currentStep.floorOptions.map(opt => {
                            const isActive = inputs[currentStep.floorField] === opt.value;
                            return (
                                <div key={opt.value}
                                    onClick={() => setField(currentStep.floorField, opt.value)}
                                    style={{
                                        cursor: 'pointer',
                                        borderRadius: '1.4rem',
                                        overflow: 'hidden',
                                        minHeight: '240px',
                                        position: 'relative',
                                        border: isActive ? '3px solid rgba(0,242,255,0.8)' : '2px solid rgba(255,255,255,0.15)',
                                        boxShadow: isActive ? '0 0 30px rgba(0,242,255,0.4), inset 0 0 20px rgba(0,242,255,0.1)' : '0 8px 24px rgba(0,0,0,0.25)',
                                        transition: 'all 0.3s ease'
                                    }}>
                                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${opt.img})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: 'scale(1.2)', filter: 'saturate(1.2) contrast(1.1) brightness(0.95)', opacity: 0.85 }} />
                                    
                                    {/* G+ Badge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        background: isActive ? 'linear-gradient(135deg, rgba(0,242,255,0.9), rgba(32,227,178,0.7))' : 'rgba(0,242,255,0.7)',
                                        padding: '0.6rem 1rem',
                                        borderRadius: '0.8rem',
                                        fontSize: '1.4rem',
                                        fontWeight: 900,
                                        color: '#fff',
                                        textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        boxShadow: isActive ? '0 0 16px rgba(0,242,255,0.6)' : 'none',
                                        zIndex: 10,
                                        letterSpacing: '1px'
                                    }}>
                                        {opt.value}
                                    </div>
                                    
                                    <div style={{ position: 'relative', height: '100%', padding: '1.4rem', background: 'linear-gradient(to top, rgba(10,18,35,0.75), rgba(10,18,35,0.2))', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                        <div style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '0.5px' }}>{opt.desc}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.3rem', opacity: 0.88, letterSpacing: '2px', textTransform: 'uppercase' }}>CONSTRUCTION GRADE</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem' }}>
                        {currentStep.gradeOptions.map(opt => {
                            const isActive = inputs[currentStep.gradeField] === opt.value;
                            const gradeColors = {
                                'Base': { bg: 'rgba(100,116,139,0.5)', border: 'rgba(100,116,139,0.8)', glow: 'rgba(100,116,139,0.4)' },
                                'Classic': { bg: 'rgba(59,130,246,0.5)', border: 'rgba(59,130,246,0.8)', glow: 'rgba(59,130,246,0.4)' },
                                'Premium': { bg: 'rgba(168,85,247,0.5)', border: 'rgba(168,85,247,0.8)', glow: 'rgba(168,85,247,0.4)' },
                                'Elite': { bg: 'rgba(236,72,153,0.5)', border: 'rgba(236,72,153,0.8)', glow: 'rgba(236,72,153,0.4)' }
                            };
                            const colors = gradeColors[opt.value] || gradeColors['Base'];
                            
                            return (
                                <div key={opt.value}
                                    onClick={() => setField(currentStep.gradeField, opt.value)}
                                    style={{
                                        cursor: 'pointer',
                                        borderRadius: '1.4rem',
                                        overflow: 'hidden',
                                        minHeight: '240px',
                                        position: 'relative',
                                        border: isActive ? `3px solid ${colors.border}` : '2px solid rgba(255,255,255,0.15)',
                                        boxShadow: isActive ? `0 0 30px ${colors.glow}, inset 0 0 20px ${colors.bg}` : '0 8px 24px rgba(0,0,0,0.25)',
                                        transition: 'all 0.3s ease'
                                    }}>
                                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${opt.img})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: 'scale(1.2)', filter: 'saturate(1.2) contrast(1.1) brightness(0.95)', opacity: 0.85 }} />
                                    
                                    {/* Grade Badge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        background: isActive ? `linear-gradient(135deg, ${colors.border}, ${colors.border}cc)` : colors.bg,
                                        padding: '0.6rem 1rem',
                                        borderRadius: '0.8rem',
                                        fontSize: '1.2rem',
                                        fontWeight: 900,
                                        color: '#fff',
                                        textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        boxShadow: isActive ? `0 0 16px ${colors.glow}` : 'none',
                                        zIndex: 10,
                                        letterSpacing: '1px'
                                    }}>
                                        ★ {opt.value}
                                    </div>
                                    
                                    <div style={{ position: 'relative', height: '100%', padding: '1.4rem', background: 'linear-gradient(to top, rgba(10,18,35,0.75), rgba(10,18,35,0.2))', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                        <div style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '0.5px' }}>{opt.desc}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </GlassCard>
                <BottomStepButton
                    label={canProceed ? 'NEXT ->' : 'SELECT FLOOR AND GRADE TO CONTINUE'}
                    disabled={!canProceed}
                    onClick={() => { if (canProceed) handleNext(); }}
                />
            </WizardShell>
        );
    }

    if (currentStep.type === 'complex-grid') {
        const sectionValid = (section) => {
            const value = inputs[section.field];
            if (section.type === 'toggle') return value === true || value === false;
            return value !== undefined && value !== null && value !== '';
        };

        const canProceed = (currentStep.sections || []).every(sectionValid);

        return (
            <WizardShell config={config} step={step} inputs={inputs} onBack={onBack} onNext={handleNext} total={total} showTopNext={false}>
                <GlassCard style={{ minHeight: 'auto', padding: '3rem 4rem 2.2rem' }}>
                    <h2 style={{ fontSize: '2.8rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: '2rem' }}>{currentStep.title}</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.9rem' }}>
                        {(currentStep.sections || []).map(section => {
                            const value = inputs[section.field];
                            const options = section.optionsByPlotSize?.[inputs.plot_size] || section.options || [];
                            const customField = `${section.field}_custom`;

                            return (
                                <div key={section.field} style={{
                                    border: '1px solid rgba(255,255,255,0.22)',
                                    borderRadius: '1rem',
                                    background: 'linear-gradient(145deg, rgba(16,20,28,0.72), rgba(12,16,24,0.56))',
                                    boxShadow: '0 10px 24px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.28)',
                                    padding: '1.45rem 1.45rem 1.55rem'
                                }}>
                                    <div style={{ fontSize: '1.28rem', fontWeight: 700, marginBottom: '0.9rem', opacity: 0.96 }}>{section.label}</div>

                                    {section.type === 'toggle' && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.95rem' }}>
                                            {[{ label: 'Yes', value: true }, { label: 'No', value: false }].map(opt => {
                                                const active = value === opt.value;
                                                return (
                                                    <button key={opt.label}
                                                        onClick={() => setField(section.field, opt.value)}
                                                        style={{
                                                            padding: '1rem 1.1rem',
                                                            borderRadius: '0.82rem',
                                                            border: active ? '1px solid rgba(145,229,255,0.85)' : '1px solid rgba(255,255,255,0.22)',
                                                            background: active ? 'linear-gradient(135deg, rgba(39,147,170,0.38), rgba(92,69,140,0.34))' : 'rgba(255,255,255,0.07)',
                                                            color: '#fff',
                                                            cursor: 'pointer',
                                                            fontWeight: 700,
                                                            fontSize: '1.2rem'
                                                        }}>
                                                        {opt.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {section.type === 'number-custom' && (
                                        <>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem' }}>
                                                {options.map(opt => {
                                                    const optValue = opt.value;
                                                    const active = value === optValue;
                                                    return (
                                                        <button key={String(optValue)}
                                                            onClick={() => setInputs(prev => ({ ...prev, [section.field]: optValue, [customField]: '' }))}
                                                            style={{
                                                                padding: '0.95rem 0.8rem',
                                                                borderRadius: '0.78rem',
                                                                border: active ? '1px solid rgba(145,229,255,0.85)' : '1px solid rgba(255,255,255,0.22)',
                                                                background: active ? 'linear-gradient(135deg, rgba(39,147,170,0.38), rgba(92,69,140,0.34))' : 'rgba(255,255,255,0.07)',
                                                                color: '#fff',
                                                                cursor: 'pointer',
                                                                fontSize: '1.02rem',
                                                                fontWeight: 700,
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                gap: '0.4rem'
                                                            }}>
                                                            <div>{opt.label || optValue}</div>
                                                            {opt.desc && <div style={{ fontSize: '0.85rem', opacity: 0.75, fontWeight: 500 }}>{opt.desc}</div>}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {section.hasCustom && (
                                                <div style={{ marginTop: '1.05rem' }}>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        placeholder="Custom"
                                                        value={inputs[customField] || ''}
                                                        onChange={(e) => {
                                                            const raw = e.target.value;
                                                            const parsed = raw === '' ? '' : Number(raw);
                                                            setInputs(prev => ({ ...prev, [customField]: raw, [section.field]: parsed === '' ? null : parsed }));
                                                        }}
                                                        style={{
                                                            width: '100%',
                                                            background: 'rgba(20,24,32,0.62)',
                                                            border: '1px solid rgba(255,255,255,0.24)',
                                                            borderRadius: '0.78rem',
                                                            color: '#fff',
                                                            padding: '1rem 1.1rem',
                                                            fontSize: '1.04rem',
                                                            outline: 'none'
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </GlassCard>
                <div style={{ marginTop: '-15px' }}>
                    <BottomStepButton
                        label={canProceed ? 'NEXT ->' : 'FILL ALL DETAILS TO CONTINUE'}
                        disabled={!canProceed}
                        onClick={() => { if (canProceed) handleNext(); }}
                    />
                </div>
            </WizardShell>
        );
    }
    /* STEP 6: Review Your Plan */
    if (currentStep.type === 'review') {
        // Grade-specific facilities
        const gradeFacilities = {
            Base: [
                { title: 'RCC Structure', detail: 'Standard RCC framed structure with IS-compliant design and workmanship.' },
                { title: 'Foundation', detail: 'Standard RCC footing with soil excavation and PCC bed preparation.' },
                { title: 'Masonry', detail: 'Solid/AAC block walls for external and internal partitions.' },
                { title: 'Flooring', detail: 'Ceramic/Vitrified tiles (600x600mm) with anti-skid in wet areas.' },
                { title: 'Staircase', detail: 'RCC staircase with polished granite treads and matching skirting.' },
                { title: 'Main Door', detail: 'Decorative main door with high-quality flush doors.' },
                { title: 'Windows', detail: 'Powder-coated aluminum/uPVC sliding windows with safety grills.' },
                { title: 'Electrical', detail: 'Concealed copper wiring with Havells/Legrand modular switches and MCB.' },
                { title: 'Plumbing', detail: 'CPVC/PVC plumbing network with standard sanitary fixtures.' },
                { title: 'Plaster & Paint', detail: 'Smooth internal plaster with double-coat putty and emulsion paint.' }
            ],
            Classic: [
                { title: 'Enhanced RCC Structure', detail: 'Upgraded RCC frame with tighter rebar detailing and superior concrete quality control.' },
                { title: 'Premium Foundation', detail: 'Enhanced foundation system with reinforced design and strict curing protocols.' },
                { title: 'Superior Masonry', detail: 'Precision masonry work with improved joint finishing and corner detailing.' },
                { title: 'Granite Flooring', detail: 'Premium 18mm granite flooring in living areas with elegant finish.' },
                { title: 'Granite Staircase', detail: 'Premium 18mm granite staircase with full bull-nosing and high-gloss polish.' },
                { title: 'Teak Wood Doors', detail: 'Teak wood main door frame with premium skin doors and designer hardware.' },
                { title: 'Premium Windows', detail: 'Upgraded uPVC windows with thicker sections and sound/dust insulation.' },
                { title: 'Enhanced Electrical', detail: 'Premium Legrand/Havells electrical with more load points and designer switches.' },
                { title: 'Premium Plumbing', detail: 'Premium branded CP fittings (Jaguar/Kohler) with superior chrome finish.' },
                { title: 'Premium Finishing', detail: 'Superior wall putty leveling with multi-coat premium emulsion paint.' },
                { title: 'Advanced Waterproofing', detail: 'Double-layer waterproofing with reinforced mesh for long-term reliability.' },
                { title: 'Terracing', detail: 'Advanced weathering treatment with thermal insulation and slope management.' }
            ],
            Premium: [
                { title: 'Industrial RCC Structure', detail: 'Industrial-grade structural execution with enhanced seismic resistance and QA logs.' },
                { title: 'Heavy-Duty Foundation', detail: 'Heavy-duty foundation with chemical soil treatment and premium concrete mix.' },
                { title: 'Elite Masonry', detail: 'Elite block work with precision bonding and crack-resistant detailing.' },
                { title: 'Italian Marble Flooring', detail: 'Luxury imported Italian marble with high-precision laying and mirror polish.' },
                { title: 'Marble Staircase', detail: 'Imported marble staircase with designer nosing and integrated LED profile slots.' },
                { title: 'Exotic Teak Doors', detail: 'Exotic teak wood main door and premium veneer-finish internal doors.' },
                { title: 'Architectural Windows', detail: 'High-end architectural aluminum with toughened glass performance.' },
                { title: 'Smart Electrical', detail: 'Comprehensive smart-ready electrical package with designer glass switches.' },
                { title: 'Luxury Sanitaryware', detail: 'Luxury CP/Sanitaryware (Jaguar/Kohler) with concealed divertors.' },
                { title: 'Designer Finishes', detail: 'Artisanal plaster with luxury velvet-finish paints and accent wall textures.' },
                { title: 'Architectural Waterproofing', detail: 'Advanced crystalline waterproofing for 100% leak-proof assurance.' },
                { title: 'Cool Roof Terrace', detail: 'Architectural terrace with cool-roof tiling and superior drainage.' }
            ],
            Elite: [
                { title: 'Elite RCC Engineering', detail: 'World-class structural engineering with maximum durability and highest safety factors.' },
                { title: 'World-Class Foundation', detail: 'World-class foundation design with specialized waterproofing and elite supervision.' },
                { title: 'Zero-Tolerance Masonry', detail: 'Zero-tolerance masonry work with specialized alignment and premium bonding.' },
                { title: 'Italian Marble Supreme', detail: 'Exquisite Italian marble flooring with bespoke book-matching and seamless finish.' },
                { title: 'Designer Marble Staircase', detail: 'Designer Italian marble staircase with glass railings and premium stone detailing.' },
                { title: 'Biometric Doors', detail: 'Custom-crafted solid wood doors with biometric access and premium PVD hardware.' },
                { title: 'Slimline System Windows', detail: 'Slimline system windows with acoustic laminations and high-performance glazing.' },
                { title: 'Full Home Automation', detail: 'Full home automation ready package with elite-series touch panels and scene control.' },
                { title: 'Ultra-Luxury Fixtures', detail: 'Ultra-luxury sanitaryware (Toto/Grohe/Kohler) with wall-hung premium fixtures.' },
                { title: 'Elite Finishing', detail: 'High-precision wall engineering with designer-series paints and royal textures.' },
                { title: 'Premium Membrane Waterproofing', detail: 'Premium membrane-based waterproofing with multi-year performance warranty.' },
                { title: 'Elite Terrace Design', detail: 'Elite rooftop finish with landscaped deck suitability and advanced insulation.' },
                { title: 'Smart Climate Control', detail: 'Integrated climate control system with smart thermostat management.' }
            ]
        };

        const selectedGrade = inputs.structural_style || 'Base';
        const facilitiesForGrade = gradeFacilities[selectedGrade] || gradeFacilities.Base;
        const selectedGradeLabel = selectedGrade;

        const facilityPriorityOrder = {
            Structure: 100,
            Foundation: 95,
            Masonry: 88,
            Flooring: 82,
            Electrical: 76,
            Plumbing: 74,
            Doors: 66,
            Windows: 62,
            Staircase: 58,
            Terrace: 52,
            'Plaster & Putty': 48,
            Painting: 44,
            Waterproofing: 40
        };

        const facilitiesForGradeSorted = [...facilitiesForGrade].sort(
            (a, b) => (facilityPriorityOrder[b.title] || 0) - (facilityPriorityOrder[a.title] || 0)
        );

        return (
            <WizardShell config={config} step={step} inputs={inputs} onBack={onBack} onNext={handleNext} nextLabel="LOOKS GOOD - CONTINUE NEXT" total={total} showTopNext={false}>
                <GlassCard style={{ padding: '3.5rem 4rem 2.5rem', minHeight: '82vh', maxWidth: '1480px' }}>
                    <h2 style={{ fontSize: '3.74rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: '0.6rem', letterSpacing: '-0.6px' }}>Structure Plan & Materials</h2>
                    <p style={{ opacity: 0.55, fontSize: '1.1rem', letterSpacing: '1.1px', marginBottom: '1.8rem' }}>CONFIRM THE INCLUDED FACILITIES & MATERIALS BEFORE PROCEEDING</p>

                    {/* Grade Overview Section */}
                    <div style={{
                        marginBottom: '2rem',
                        background: 'linear-gradient(135deg, rgba(0,242,255,0.08), rgba(112,0,255,0.06))',
                        border: '1px solid rgba(0,242,255,0.15)',
                        borderRadius: '1.6rem',
                        padding: '2rem'
                    }}>
                        <h3 style={{ fontSize: '1.54rem', fontWeight: 800, marginBottom: '1.2rem', color: '#00f2ff', letterSpacing: '1px' }}>
                            {selectedGradeLabel.toUpperCase()} GRADE - MATERIALS & SPECIFICATIONS
                        </h3>
                        
                        {selectedGrade === 'Base' && (
                            <div style={{ fontSize: '1.155rem', lineHeight: 1.8, color: '#fff', opacity: 0.9 }}>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Cement & Concrete:</span> Ambuja Cement or ACC Portland cement (Type I) with M20 grade concrete, 6" RCC slab thickness & 9" wall thickness. IS-compliant mix design with standard workability and durability.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Reinforcement Steel:</span> Tata Steel or JSW Steel TMT bars (500D Grade) conforming to IS 1786 specifications with minimum 40mm concrete cover for effective corrosion protection and structural stability.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Flooring - Tiles:</span> Kajaria or Somany ceramic vitrified tiles (600x600mm or 400x400mm) in living and bedrooms. Anti-skid tiles in wet areas for safety. Standard polish and moderate durability.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Staircase:</span> RCC staircase with polished granite treads (25mm thickness) and risers. Simple finish with matching granite skirting and standard edge protection.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Doors & Windows:</span> High-quality flush doors with hardwood frames. Powder-coated aluminum or standard uPVC sliding windows with integrated safety grills and basic hardware fittings.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Electrical - Wiring:</span> Concealed copper wiring (1.5mm² - 6mm²) with Havells or Legrand modular switches. MCB distribution board with D-curve breakers, 4-6 circuits per phase, standard load management.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Plumbing - Pipes & Fixtures:</span> CPVC or PVC pipes (ASTM D2846 compliant) for hot/cold water supply. Standard-grade CP fittings with basic sanitary fixtures. Septic tank system for waste management.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Waterproofing:</span> Single-layer chemical waterproofing on terrace, toilets, and balconies using premium sealants. Standard curing and basic protective coverage.
                                </p>
                                <p>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Finishing & Paint:</span> Smooth internal plaster with standard putty (2 coats), interior emulsion paint (2 coats), and weather-shield exterior paint for lasting protection and aesthetic appeal.
                                </p>
                            </div>
                        )}

                        {selectedGrade === 'Classic' && (
                            <div style={{ fontSize: '1.155rem', lineHeight: 1.8, color: '#fff', opacity: 0.9 }}>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Cement & Concrete - Enhanced:</span> Ambuja Cement Super or ACC Gold with M25 grade concrete, 7" RCC slab thickness & 10" wall thickness. Enhanced quality control with higher cement content for improved durability and reduced permeability.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Reinforcement Steel - Premium:</span> Tata Steel Tiscon or JSW Jindal premium TMT bars with superior yield strength and ductility. 500D Grade bars with 45mm concrete cover and comprehensive corrosion protection measures.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Flooring - Premium Tiles:</span> Porcelain Vitrified Tiles (PVT) by Kajaria Premium or Somany Ceramics with superior finish (600x600mm or 800x800mm). Higher durability rating with refined surface texture and enhanced aesthetics.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Staircase - Premium Granite:</span> Premium 18mm polished granite staircase with full bull-nosing on all edges and high-gloss mirror finish. Precision tread cuts with matching skirting and landing details for elegant appearance.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Doors & Windows - Upgraded:</span> Teak wood main door frame with premium skin doors and designer hardware fittings. Upgraded uPVC windows with thicker frames (70mm) and sound/dust insulation features with better UPVC quality grades.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Electrical - Premium Package:</span> Premium Legrand or Havells electrical infrastructure with modular switches in contemporary designs. MCB board with selective load distribution, 8-10 circuits per phase with improved load management capability.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Plumbing & Sanitaryware:</span> Premium CPVC pipes with enhanced thickness and superior CP fittings (Jaguar or Kohler standard range). Premium sanitary fixtures with superior chrome finish and better performance specifications.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Waterproofing - Double Layer:</span> Double-layer chemical waterproofing system with reinforced mesh embedded in the top layer. Extended curing protocols for superior adhesion and comprehensive protection against water seepage with 5-year performance warranty.
                                </p>
                                <p>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Finishing & Paints - Premium:</span> Premium-grade putty with multi-coat application for superior leveling and smoothness. Premium emulsion paints (3-4 coats) with advanced washability, superior weather-shield exterior paint for long-lasting protection and aesthetics.
                                </p>
                            </div>
                        )}

                        {selectedGrade === 'Premium' && (
                            <div style={{ fontSize: '1.155rem', lineHeight: 1.8, color: '#fff', opacity: 0.9 }}>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Cement & Concrete - Premium:</span> Ambuja Cement Ultra Tech or ACC Ultra Tech with M30 grade concrete, 8" RCC slab thickness & 11" wall thickness. Superior concrete mix with higher strength, lower permeability, and enhanced durability for 50+ years.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Reinforcement Steel - High-Grade:</span> Tata Steel Tiscon Premium Grade or JSW Jindal Superior Rebars with enhanced tensile properties. 500D and 550D grade bars with 50mm concrete cover and advanced corrosion inhibitor systems for maximum structural integrity.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Flooring - Italian Porcelain:</span> Premium Porcelain Italian Tiles or CeramEuro imports (800x800mm or custom sizes). Superior durability with Class A ratings, advanced surface treatments, exquisite design options with perfect color and texture consistency.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Staircase - Italian Marble:</span> Premium imported Italian marble staircase with integrated LED profile lighting in edges. Precision cuts with decorative bull-nose edges, full polished finish, glass railings with chrome fixtures, and bespoke design detailing.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Doors & Windows - Architectural:</span> Exotic hardwood doors (teak/merbau) with premium veneer finishes and custom architectural designs. High-end aluminum windows (Schüco/Reynaers systems) with triple-glazing, thermal breaks, and superior acoustic insulation (10mm laminated glass).
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Electrical - Smart-Ready System:</span> Premium Siemens or Philips electrical infrastructure with designer glass switches and smart-home pre-wiring. Advanced distribution board with selective RCCBs, 12-15 circuits per phase, home automation backbone ready for future upgrades.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Plumbing & Sanitaryware - Luxury:</span> Luxury-range CP fittings (Kohler premium collections or Grohe equivalent) with concealed divertors and designer fixtures. Premium sanitary ware with soft-close mechanisms, premium chrome finishes, and comprehensive water management systems.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Waterproofing - Advanced Crystalline:</span> Advanced crystalline waterproofing treatment with self-healing capability. Multi-layer application with specialized sealants ensuring 100% leak-proof performance with 10-year comprehensive warranty and maintenance protocols included.
                                </p>
                                <p>
                                    <span style={{ color: '#00ffcc', fontWeight: 700 }}>Finishing & Paints - Designer:</span> Gypsum-based artisanal plaster with precision finishes and multiple texture options. Designer-series premium paints (Asian Paints Royale or Berger Select) with 4-5 coat application, velvet finishes, accent wall customization, and premium exterior protective coatings.
                                </p>
                            </div>
                        )}

                        {selectedGrade === 'Elite' && (
                            <div style={{ fontSize: '1.155rem', lineHeight: 1.8, color: '#fff', opacity: 0.9 }}>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#ffd700', fontWeight: 700 }}>Cement & Concrete - Supreme:</span> Ambuja Cement Ultra Tech Premium or ACC Elite Grade with M40+ concrete, 9" RCC slab thickness & 12" wall thickness. World-class concrete specification with ultra-low permeability, self-compacting properties, and 75+ year durability guarantee.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#ffd700', fontWeight: 700 }}>Reinforcement Steel - Premium Grade:</span> Tata Steel Premium Grade Rebars or JSW Premium Highest Tensile variants with 600 MPa+ yield strength. Advanced 550D and 600D grade bars with 55mm concrete cover, corrosion-resistant epoxy coating, and independent structural certifications throughout.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#ffd700', fontWeight: 700 }}>Flooring - Hand-Selected Italian Marble:</span> Hand-selected exquisite Italian marble (Carrara, Calacatta, or equivalent premium grades) with custom book-matching layouts. Seamless polished finishes with mirror-surface quality, premium inlay patterns, and personalized stone selection consultancy.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#ffd700', fontWeight: 700 }}>Staircase - Bespoke Marble Supreme:</span> Bespoke hand-selected Italian marble staircase with integrated LED ambient lighting systems in edge profiles. Precision stone craftsmanship, premium tempered glass railings with designer chrome/brass fixtures, and handcrafted stone detailing throughout with architectural significance.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#ffd700', fontWeight: 700 }}>Doors & Windows - Biometric Luxury:</span> Custom-crafted solid wood doors with integrated biometric access systems and advanced smart locks. Premium slimline system windows (Schüco/Reynaers/Sorensen systems) with acoustic triple-glazing, thermal breaks, motorized blinds integration, and contemporary architectural design masterpieces.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#ffd700', fontWeight: 700 }}>Electrical - Full Home Automation:</span> Premium Philips Hue smart lighting ecosystem or Siemens Smart Home advanced controls with designer glass touch panels. Advanced BMS-compatible distribution boards with selective RCCBs/ELCBs, 20+ circuits per phase, comprehensive home automation backbone, IoT integration ready.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#ffd700', fontWeight: 700 }}>Plumbing & Sanitaryware - World-Renown:</span> Ultra-luxury sanitaryware from Toto (Japan), Grohe (Germany), or Kohler (premium collections) with wall-hung fixtures and concealed cisterns. Designer basin designs with premium PVD finishes, Swiss-engineered concealed divertors with precision valve systems, and comprehensive water management ecosystems.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <span style={{ color: '#ffd700', fontWeight: 700 }}>Waterproofing - Premium Membrane with Warranty:</span> Premium membrane-based waterproofing systems with advanced polymer technology and self-healing coatings. Multi-year comprehensive performance warranty (15 years), specialized maintenance protocols included, seamless protection of all wet areas with architectural redundancy built-in.
                                </p>
                                <p>
                                    <span style={{ color: '#ffd700', fontWeight: 700 }}>Finishing, Paints & Climate Control:</span> High-precision wall engineering with designer-series premium paint consultancy from international color experts. Royal textures with custom paint formulations, bespoke interior elements throughout. Full integrated smart climate control with AI-powered zone-based temperature management, energy optimization, and seamless home automation ecosystem integration for ultimate comfort and luxury living.
                                </p>
                            </div>
                        )}
                    </div>

                    <div style={{
                        marginTop: '0.5rem',
                        background: 'linear-gradient(135deg, rgba(0,242,255,0.06), rgba(112,0,255,0.05))',
                        border: '1px solid rgba(0,242,255,0.2)',
                        borderRadius: '1.6rem',
                        padding: '1.8rem 1.9rem'
                    }}>
                        <h4 style={{ fontSize: '1.37rem', fontWeight: 800, marginBottom: '1rem', opacity: 0.95, letterSpacing: '1.7px' }}>
                            FACILITIES INCLUDED IN {selectedGradeLabel.toUpperCase()} GRADE
                        </h4>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '1.1rem'
                        }}>
                            {facilitiesForGradeSorted.map(f => (
                                <div key={f.title} style={{
                                    background: 'rgba(255,255,255,0.035)',
                                    border: '1px solid rgba(255,255,255,0.09)',
                                    borderRadius: '1.1rem',
                                    padding: '1.15rem 1.3rem',
                                    minHeight: '145px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    transition: 'transform 0.2s ease, border-color 0.2s ease'
                                }}>
                                    <div style={{ fontSize: '1.33rem', fontWeight: 800, color: '#00f2ff', letterSpacing: '1.2px', marginBottom: '0.55rem' }}>{f.title.toUpperCase()}</div>
                                    <div style={{ fontSize: '1.32rem', opacity: 0.85, lineHeight: 1.55 }}>{f.detail}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </GlassCard>
                <div style={{ width: '92vw', maxWidth: '1480px', marginTop: '0.8rem' }}>
                    <BottomStepButton
                        label="CONTINUE NEXT"
                        onClick={handleNext}
                        top="0"
                    />
                </div>
            </WizardShell>
        );
    }

    /* STEP 7: Interior Selection */
    if (currentStep.type === 'interior-select') {
        const section = currentStep.sections[0];
        const canProceed = Boolean(inputs[section.field]);
        const selectedGrade = inputs.structural_style || 'Base';

        const packageLabels = {
            none: 'None',
            base: 'Base',
            semi: 'Semi',
            full_furnished: 'Full'
        };

        const getAIRecommendation = (pkgValue) => {
            if (selectedGrade === 'Base' && pkgValue === 'base') return 'OPTIMAL COST-VALUE BALANCE';
            if (selectedGrade === 'Classic' && pkgValue === 'semi') return 'PERFECT LIFESTYLE MATCH';
            if (selectedGrade === 'Premium' && pkgValue === 'full_furnished') return 'LUXURY SYNERGY CHOICE';
            if (selectedGrade === 'Luxury' && pkgValue === 'full_furnished') return 'ULTIMATE TURNKEY EXCELLENCE';
            return null;
        };

        return (
            <WizardShell config={config} step={step} inputs={inputs} onBack={onBack} onNext={handleNext} total={total} showTopNext={false}>
                <div style={{ padding: '2rem 3rem', maxWidth: '2000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Header */}
                    <div>
                        <h2 style={{ fontSize: '3.2rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#fff', marginBottom: '0.8rem', letterSpacing: '-1.2px' }}>Interior Selection</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                            <div style={{ width: '60px', height: '4px', background: 'linear-gradient(90deg, #00f2ff, #20e3b2)', borderRadius: '10px' }}></div>
                            <p style={{ color: '#00f2ff', fontSize: '1.05rem', letterSpacing: '2px', fontWeight: 900, textTransform: 'uppercase' }}>
                                Synced with {selectedGrade.toUpperCase()} Grade
                            </p>
                        </div>
                    </div>

                    {/* Cards Grid - 2 columns for better readability */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.8rem', minHeight: 'calc(100vh - 350px)' }}>
                        {section.options.map(opt => {
                            const isActive = inputs[section.field] === opt.value;
                            const aiRec = getAIRecommendation(opt.value);
                            const displayLabel = packageLabels[opt.value] || opt.label;

                            return (
                                <div
                                    key={opt.value}
                                    onClick={() => setField(section.field, opt.value)}
                                    style={{
                                        cursor: 'pointer',
                                        borderRadius: '2.5rem',
                                        border: isActive ? '3px solid #00f2ff' : aiRec ? '2px solid rgba(0,242,255,0.4)' : '2px solid rgba(255,255,255,0.15)',
                                        background: isActive 
                                            ? 'linear-gradient(135deg, rgba(0,242,255,0.08), rgba(32,227,178,0.04))' 
                                            : 'linear-gradient(135deg, rgba(20,30,45,0.6), rgba(15,25,40,0.8))',
                                        backdropFilter: 'blur(50px) saturate(180%)',
                                        padding: '2.5rem',
                                        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1.5rem',
                                        position: 'relative',
                                        boxShadow: isActive 
                                            ? '0 25px 50px rgba(0,242,255,0.15)' 
                                            : '0 15px 35px rgba(0,0,0,0.3)',
                                        overflow: 'hidden',
                                        transform: isActive ? 'scale(1.02)' : 'scale(1)',
                                        minHeight: '600px'
                                    }}>

                                    {/* AI Badge */}
                                    {aiRec && (
                                        <div style={{
                                            position: 'absolute', top: '0', right: '0',
                                            background: 'linear-gradient(135deg, #00f2ff, #20e3b2)', 
                                            color: '#000',
                                            fontSize: '0.75rem', fontWeight: 1000, padding: '0.6rem 1.5rem', 
                                            borderRadius: '0 0 0 2rem',
                                            letterSpacing: '1.5px', zIndex: 5,
                                            textTransform: 'uppercase'
                                        }}>
                                            ✨ AI RECOMMENDED
                                        </div>
                                    )}

                                    {/* Title Section */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                                        <div style={{ fontSize: '2.3rem', fontWeight: 1000, letterSpacing: '0.5px', color: isActive ? '#00f2ff' : '#fff' }}>
                                            {displayLabel.toUpperCase()}
                                        </div>
                                        {isActive && (
                                            <div style={{
                                                fontSize: '0.75rem', fontWeight: 1000, letterSpacing: '1.5px',
                                                color: '#000', background: 'linear-gradient(135deg, #00f2ff, #20e3b2)',
                                                borderRadius: '999px', padding: '0.5rem 1rem',
                                                textTransform: 'uppercase'
                                            }}>✓ SELECTED</div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div style={{ 
                                        fontSize: '1.32rem', 
                                        opacity: 0.95, 
                                        lineHeight: 1.6, 
                                        fontWeight: 500, 
                                        color: '#e0e0e0',
                                        padding: '1rem 1.5rem',
                                        background: 'rgba(0,242,255,0.05)',
                                        borderRadius: '1.5rem',
                                        borderLeft: '4px solid #00f2ff'
                                    }}>
                                        {opt.desc}
                                    </div>

                                    {/* Inclusions Section */}
                                    <div>
                                        <div style={{ 
                                            fontSize: '1.32rem', 
                                            color: '#00f2ff', 
                                            fontWeight: 1000, 
                                            letterSpacing: '2.5px', 
                                            marginBottom: '1.2rem',
                                            textTransform: 'uppercase'
                                        }}>
                                            ✓ What's Included
                                        </div>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr',
                                            gap: '0.85rem',
                                        }}>
                                            {(opt.inclusions || []).map((point, idx) => (
                                                <div key={idx} style={{ 
                                                    fontSize: '1.35rem', 
                                                    opacity: 0.95, 
                                                    lineHeight: 1.5, 
                                                    display: 'flex', 
                                                    gap: '0.8rem', 
                                                    alignItems: 'flex-start',
                                                    color: '#ffffff'
                                                }}>
                                                    <div style={{ 
                                                        minWidth: '8px', 
                                                        width: '8px',
                                                        height: '8px', 
                                                        background: '#00f2ff', 
                                                        borderRadius: '50%', 
                                                        marginTop: '0.45rem',
                                                        flexShrink: 0
                                                    }} />
                                                    <span style={{ fontWeight: 400 }}>{point}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* AI Explanation */}
                                    <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(0,242,255,0.2)', marginTop: 'auto' }}>
                                        <div style={{ 
                                            fontSize: '1.13rem', 
                                            color: '#20e3b2', 
                                            fontWeight: 1000, 
                                            letterSpacing: '2px', 
                                            marginBottom: '0.8rem',
                                            textTransform: 'uppercase'
                                        }}>
                                            💡 Why Choose This?
                                        </div>
                                        <div style={{ 
                                            fontSize: '1.39rem', 
                                            opacity: 0.95, 
                                            lineHeight: 1.6, 
                                            fontStyle: 'italic', 
                                            color: '#e0e0e0', 
                                            borderLeft: '3px solid #20e3b2', 
                                            paddingLeft: '1.2rem', 
                                            fontWeight: 400
                                        }}>
                                            {opt.aiExplain}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Continue Button */}
                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}>
                        <div
                            onClick={() => { if (canProceed) handleNext(); }}
                            style={{
                                width: '100%',
                                maxWidth: '600px',
                                padding: '1.2rem',
                                background: canProceed 
                                    ? 'linear-gradient(90deg, #00f2ff, #20e3b2)' 
                                    : 'rgba(255,255,255,0.08)',
                                border: canProceed ? 'none' : '2px solid rgba(255,255,255,0.15)',
                                borderRadius: '2rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: canProceed ? 'pointer' : 'not-allowed',
                                transition: 'all 0.4s ease',
                                boxShadow: canProceed 
                                    ? '0 20px 50px rgba(0,242,255,0.3)' 
                                    : 'none',
                                transform: canProceed ? 'translateY(0)' : 'translateY(0)',
                                opacity: canProceed ? 1 : 0.5
                            }}>
                            <span style={{ 
                                fontSize: '1.35rem', 
                                fontWeight: 950, 
                                color: canProceed ? '#000' : 'rgba(255,255,255,0.3)', 
                                letterSpacing: '3px',
                                textTransform: 'uppercase'
                            }}>
                                {canProceed ? '✓ Continue →' : '← Select Package'}
                            </span>
                        </div>
                    </div>
                </div>
            </WizardShell>
        );
    }

    /* STEP 8: Addons */
    if (currentStep.type === 'addons') {
        const configForType = projectConfigs[inputs.project_type] || projectConfigs.own_house;
        const floorGradeStep = configForType.steps.find(s => s.type === 'floor-grade');
        const selectedFloor = floorGradeStep?.floorOptions.find(o => o.value === inputs.floor);
        const selectedGrade = floorGradeStep?.gradeOptions.find(o => o.value === (inputs.structural_style || 'Base'));

        const isDouble = inputs.plot_size === 'double';
        const areaFt = isDouble ? '2,400' : '1,200';
        const areaSqM = isDouble ? '222.97' : '111.48';

        // Helper Components
        const Section = ({ title, subtitle, children }) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ paddingBottom: '0.8rem', borderBottom: '2px solid rgba(0,242,255,0.3)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#00f2ff', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{subtitle}</div>
                    <h3 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, color: '#fff', letterSpacing: '-1px' }}>{title}</h3>
                </div>
                {children}
            </div>
        );

        const QuickCard = ({ label, value, emoji }) => (
            <div style={{
                background: 'linear-gradient(135deg, rgba(0,242,255,0.12), rgba(32,227,178,0.08))',
                border: '1px solid rgba(0,242,255,0.3)',
                borderRadius: '1.2rem',
                padding: '1.2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,242,255,0.2), rgba(32,227,178,0.15))';
                e.currentTarget.style.borderColor = 'rgba(0,242,255,0.6)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,242,255,0.3)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,242,255,0.12), rgba(32,227,178,0.08))';
                e.currentTarget.style.borderColor = 'rgba(0,242,255,0.3)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}>
                <div style={{ fontSize: '2rem' }}>{emoji}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#00f2ff' }}>{value}</div>
            </div>
        );

        const InfoCard = ({ label, value }) => (
            <div style={{
                background: 'rgba(15,20,28,0.6)',
                border: '1px solid rgba(0,242,255,0.25)',
                borderRadius: '0.8rem',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(0,242,255,0.6)';
                e.currentTarget.style.background = 'rgba(0,242,255,0.08)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(0,242,255,0.25)';
                e.currentTarget.style.background = 'rgba(15,20,28,0.6)';
            }}>
                <div style={{ fontSize: '0.7rem', color: '#20e3b2', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>{value}</div>
            </div>
        );

        const AmenityCard = ({ label, value }) => (
            <div style={{
                background: value ? 'linear-gradient(135deg, rgba(32,227,178,0.15), rgba(0,242,255,0.1))' : 'rgba(15,20,28,0.6)',
                border: value ? '1px solid rgba(32,227,178,0.4)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.8rem',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                transition: 'all 0.3s ease'
            }}>
                <div style={{ fontSize: '0.7rem', color: value ? '#20e3b2' : 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: value ? '#20e3b2' : 'rgba(255,255,255,0.3)' }}>{value ? '✓' : '✗'}</div>
            </div>
        );

        const GlassPanel = ({ children, title, subtitle }) => (
            <div style={{
                background: 'rgba(15, 20, 25, 0.45)',
                backdropFilter: 'blur(45px) saturate(180%)',
                borderRadius: '2.5rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '4rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem',
                boxShadow: '0 50px 100px rgba(0,0,0,0.6)',
                height: '100%'
            }}>
                {title && (
                    <div style={{ marginBottom: '2.5rem' }}>
                        <div style={{ color: '#00f2ff', fontSize: '0.85rem', fontWeight: 1000, letterSpacing: '6px', textTransform: 'uppercase', marginBottom: '0.6rem' }}>{subtitle}</div>
                        <h3 style={{ fontSize: '2.8rem', fontWeight: 900, margin: 0, letterSpacing: '-1.5px' }}>{title}</h3>
                    </div>
                )}
                {children}
            </div>
        );

        const SpecCard = ({ label, value, color = '#00f2ff' }) => (
            <div style={{
                background: 'linear-gradient(135deg, rgba(0,242,255,0.08), rgba(124,58,237,0.06))',
                border: `2px solid ${color}33`,
                borderRadius: '1.2rem',
                padding: '1.4rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = color;
                e.currentTarget.style.background = `linear-gradient(135deg, ${color}15, ${color}08)`;
                e.currentTarget.style.boxShadow = `0 0 20px ${color}40`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = `${color}33`;
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,242,255,0.08), rgba(124,58,237,0.06))';
                e.currentTarget.style.boxShadow = 'none';
            }}>
                <div style={{ fontSize: '0.8rem', color: color, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', letterSpacing: '0.5px' }}>{value}</div>
            </div>
        );

        const ListDetail = ({ label, value, action = null }) => (
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.6rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                width: '100%'
            }}>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>{label}</span>
                {action ? action : <span style={{ fontSize: '1.25rem', fontWeight: 1000, color: '#fff' }}>{value}</span>}
            </div>
        );

        const YesNoToggle = ({ active, onClick }) => (
            <div onClick={onClick} style={{
                display: 'flex',
                background: 'rgba(255,255,255,0.03)',
                padding: '5px',
                borderRadius: '14px',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.1)',
                width: '130px',
                transition: '0.3s'
            }}>
                <div style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '10px 0',
                    fontSize: '0.8rem',
                    fontWeight: 1000,
                    borderRadius: '10px',
                    background: active ? '#00f2ff' : 'transparent',
                    color: active ? '#000' : 'rgba(255,255,255,0.2)',
                    transition: '0.3s'
                }}>YES</div>
                <div style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '10px 0',
                    fontSize: '0.8rem',
                    fontWeight: 1000,
                    borderRadius: '10px',
                    background: !active ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: !active ? '#fff' : 'rgba(255,255,255,0.2)',
                    transition: '0.3s'
                }}>NO</div>
            </div>
        );

        return (
            <div style={{
                width: '100vw',
                minHeight: '100vh',
                background: `linear-gradient(rgba(10,12,18,0.7), rgba(10,12,18,0.9)), url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                padding: '6rem 8vw',
                display: 'flex',
                flexDirection: 'column',
                color: '#fff',
                fontFamily: "'Inter', sans-serif",
                gap: '5rem',
                overflowY: 'auto'
            }}>

                {/* HEADER SECTION: BACK BUTTON ON LEFT */}
                <div style={{ width: '100%', maxWidth: '1728px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '4rem' }}>
                    <div
                        onClick={onBack}
                        style={{
                            cursor: 'pointer',
                            padding: '1.2rem 2.4rem',
                            borderRadius: '1.2rem',
                            background: 'rgba(255,255,255,0.04)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            fontSize: '0.85rem',
                            fontWeight: 900,
                            color: 'rgba(255,255,255,0.6)',
                            letterSpacing: '3px',
                            transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                            flexShrink: 0
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateX(-5px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                    >
                        ← GO BACK
                    </div>
                    <h1 style={{ fontSize: '4.8rem', fontWeight: 900, letterSpacing: '-3.5px', margin: 0 }}>Project Specification</h1>
                </div>

                <div style={{ width: '100%', maxWidth: '1520px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                    {/* LEFT: ALL PROJECT DETAILS + AMENITIES - VERTICAL LIST */}
                    <div style={{
                        background: 'rgba(15, 20, 25, 0.45)',
                        backdropFilter: 'blur(45px) saturate(180%)',
                        borderRadius: '2.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '3.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2.2rem',
                        boxShadow: '0 50px 100px rgba(0,0,0,0.6)'
                    }}>
                        <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '2px solid rgba(0,242,255,0.3)' }}>
                            <div style={{ color: '#00f2ff', fontSize: '0.95rem', fontWeight: 1000, letterSpacing: '6px', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Complete Information</div>
                            <h3 style={{ fontSize: '3.2rem', fontWeight: 900, margin: 0, letterSpacing: '-1.5px' }}>All Project Details</h3>
                        </div>

                        {/* PROJECT OVERVIEW SECTION */}
                        <div>
                            <div style={{ fontSize: '1.15rem', color: '#00f2ff', fontWeight: 1000, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.2rem' }}>📋 PROJECT OVERVIEW</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginLeft: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.7rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Project Type</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#00f2ff' }}>Dream House</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.7rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Building Height</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#20e3b2' }}>{inputs.floor || 'G+1'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.7rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Building Grade</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#a78bfa' }}>{inputs.structural_style || 'Base'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.7rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Interior Package</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fbbf24' }}>{(inputs.interior_package || 'None').toUpperCase()}</span>
                                </div>
                            </div>
                        </div>

                        {/* PLOT & LOCATION SECTION */}
                        <div>
                            <div style={{ fontSize: '1.15rem', color: '#00f2ff', fontWeight: 1000, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.2rem' }}>📍 PLOT & LOCATION</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginLeft: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.7rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Plot Size</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#00f2ff' }}>{inputs.plot_size === 'full' ? 'Full Site' : 'Double Site'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.7rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Dimensions</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#20e3b2' }}>{inputs.dimensions || '30 x 40'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.7rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Area (sq ft)</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#a78bfa' }}>{areaFt}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.7rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Area (sq m)</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fbbf24' }}>{areaSqM}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.7rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Zone</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#00f2ff' }}>{inputs.zone_details || 'Not Selected'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.7rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Vastu Direction</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#20e3b2' }}>{inputs.vastu_direction ? inputs.vastu_direction.toUpperCase() : 'Not Selected'}</span>
                                </div>
                            </div>
                        </div>

                        {/* STRUCTURE & LAYOUT SECTION */}
                        <div>
                            <div style={{ fontSize: '1.15rem', color: '#00f2ff', fontWeight: 1000, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.2rem' }}>🏗️ STRUCTURE & LAYOUT</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginLeft: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.7rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Bedrooms</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#a78bfa' }}>{inputs.bedrooms || 3} BHK</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.7rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Family Members</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fbbf24' }}>{inputs.family_count || 1} Persons</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.7rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Children</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ec4899' }}>{inputs.children_count || 0}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.7rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Grandparents Living</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#00f2ff' }}>{inputs.grandparents_living ? 'YES' : 'NO'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.7rem' }}>
                                    <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Lift Required</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#20e3b2' }}>{inputs.lift_required ? 'YES' : 'NO'}</span>
                                </div>
                            </div>
                        </div>

                        {/* AMENITIES SECTION */}
                        <div>
                            <div style={{ fontSize: '1.15rem', color: '#00f2ff', fontWeight: 1000, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.2rem' }}>✨ AMENITIES</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginLeft: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.7rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Pooja Room</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: inputs.pooja_room ? '#20e3b2' : 'rgba(255,255,255,0.4)' }}>{inputs.pooja_room ? '✓ YES' : '✗ NO'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.7rem' }}>
                                    <span style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Guest Bedroom</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: inputs.terrace_guest_bedroom ? '#20e3b2' : 'rgba(255,255,255,0.4)' }}>{inputs.terrace_guest_bedroom ? '✓ YES' : '✗ NO'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: ADDITIONAL FEATURES - NOW BELOW LEFT PANEL */}
                    <div style={{
                        background: 'rgba(15, 20, 25, 0.45)',
                        backdropFilter: 'blur(45px) saturate(180%)',
                        borderRadius: '2.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '3.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem',
                        boxShadow: '0 50px 100px rgba(0,0,0,0.6)'
                    }}>
                        <div style={{ marginBottom: '1rem', paddingBottom: '1.2rem', borderBottom: '2px solid rgba(0,242,255,0.3)' }}>
                            <div style={{ color: '#00f2ff', fontSize: '0.95rem', fontWeight: 1000, letterSpacing: '6px', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Features & Settings</div>
                            <h3 style={{ fontSize: '2.8rem', fontWeight: 900, margin: 0, letterSpacing: '-1px' }}>Additional Add-ons</h3>
                        </div>

                        {/* ADDITIONAL FEATURES SECTION */}
                        <div>
                            <div style={{ fontSize: '1.3rem', color: '#00f2ff', fontWeight: 1000, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>⚙️ ADDITIONAL FEATURES</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.3rem' }}>
                                {['include_compound_wall', 'include_rainwater_harvesting', 'include_car_parking'].map(field => {
                                    const addon = currentStep.addons.find(a => a.field === field);
                                    return (
                                        <div key={field} style={{
                                            background: inputs[field] ? 'linear-gradient(135deg, rgba(32,227,178,0.1), rgba(0,242,255,0.08))' : 'rgba(15,20,28,0.6)',
                                            border: inputs[field] ? '1px solid rgba(32,227,178,0.3)' : '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '1.2rem',
                                            padding: '1.4rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '0.95rem', color: inputs[field] ? '#20e3b2' : 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{addon?.label}</div>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: inputs[field] ? '#20e3b2' : 'rgba(255,255,255,0.4)' }}>{inputs[field] ? '✓ INCLUDED' : '✗ EXCLUDED'}</div>
                                            </div>
                                            <YesNoToggle active={inputs[field]} onClick={() => setField(field, !inputs[field])} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* CONTINUE BUTTON */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
                        <button
                            onClick={onBack}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '2px solid rgba(255,255,255,0.2)',
                                color: '#fff',
                                padding: '1.2rem 2.8rem',
                                borderRadius: '1rem',
                                fontSize: '1rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                letterSpacing: '2px',
                                transition: 'all 0.3s ease',
                                textTransform: 'uppercase'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                            }}
                        >
                            ← Go Back
                        </button>
                        <button
                            onClick={handleNext}
                            style={{
                                background: 'linear-gradient(135deg, rgba(0,242,255,0.3), rgba(32,227,178,0.2))',
                                border: '2px solid rgba(0,242,255,0.6)',
                                color: '#00f2ff',
                                padding: '1.2rem 2.8rem',
                                borderRadius: '1rem',
                                fontSize: '1rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                letterSpacing: '2px',
                                transition: 'all 0.3s ease',
                                textTransform: 'uppercase',
                                boxShadow: '0 0 20px rgba(0,242,255,0.3)'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,242,255,0.5), rgba(32,227,178,0.3))';
                                e.currentTarget.style.boxShadow = '0 0 30px rgba(0,242,255,0.5)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,242,255,0.3), rgba(32,227,178,0.2))';
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(0,242,255,0.3)';
                            }}
                        >
                            Generate Estimate ↗
                        </button>
                    </div>

                </div>
            </div>
        );
    }

    // Unified logic moved outside or handled globally

    const getCategory = (name) => {
        const n = name.toLowerCase();
        if (n.includes('excav') || n.includes('rcc') || n.includes('foundation') || n.includes('masonry') || n.includes('steel') || n.includes('concrete') || n.includes('earthwork') || n.includes('structure')) return 'STRUCTURE';
        if (n.includes('plumb') || n.includes('elect') || n.includes('sanit') || n.includes('septic') || n.includes('wiring') || n.includes('utility')) return 'FIXED COST';
        if (n.includes('floor') || n.includes('paint') || n.includes('plaster') || n.includes('tile') || n.includes('door') || n.includes('window') || n.includes('woodwork') || n.includes('finish')) return 'FINISH';
        if (n.includes('compound') || n.includes('parking') || n.includes('rain') || n.includes('lift') || n.includes('gate') || n.includes('waterproof') || n.includes('solar') || n.includes('staircase')) return 'ADJUSTMENT';
        if (n.includes('interior')) return 'INTERIOR';
        return 'STRUCTURE';
    };

    const catColor = {
        'STRUCTURE': { bg: 'rgba(139,92,246,0.18)', text: '#A78BFA', border: 'rgba(139,92,246,0.4)' },
        'UTILITIES': { bg: 'rgba(6,182,212,0.15)', text: '#22D3EE', border: 'rgba(6,182,212,0.4)' },
        'BATHROOM': { bg: 'rgba(251,191,36,0.13)', text: '#FCD34D', border: 'rgba(251,191,36,0.35)' },
        'ELECTRICAL': { bg: 'rgba(52,211,153,0.13)', text: '#6EE7B7', border: 'rgba(52,211,153,0.35)' },
        'FLOORING': { bg: 'rgba(244,114,182,0.13)', text: '#F9A8D4', border: 'rgba(244,114,182,0.35)' },
        'EXTERIOR': { bg: 'rgba(167,139,250,0.13)', text: '#C4B5FD', border: 'rgba(167,139,250,0.35)' },
        'OPTIONAL': { bg: 'rgba(236,72,153,0.13)', text: '#F472B6', border: 'rgba(236,72,153,0.35)' }
    };

    const liquidGlass = {
        background: 'rgba(255,255,255,0)', /* Maximum Transparency */
        backdropFilter: 'blur(8px) saturate(110%)',
        WebkitBackdropFilter: 'blur(8px) saturate(110%)',
        border: '1px solid rgba(255,255,255,0.03)',
        borderRadius: '32px',
        boxShadow: '0 24px 80px 0 rgba(0,0,0,0.5)',
    };

    /* ─── STEP 9: Cost Estimation — Premium AI Dashboard ─── */
    if (currentStep.type === 'final-estimate') {

        const totalCost = estData?.total_cost || 0;
        const breakdown = Array.isArray(estData?.breakdown) ? estData.breakdown : [];
        const sorted = [...breakdown].sort((a, b) => (b.amount || 0) - (a.amount || 0));

        return (
            <div style={{
                minHeight: '100vh', width: '100vw', color: '#fff',
                fontFamily: "'Inter', 'Outfit', sans-serif", overflowY: 'auto',
                background: 'transparent', /* Transparent to show the layers below */
                position: 'relative',
                scrollBehavior: 'smooth'
            }}>
                {/* Layer -1: Deep Base Color */}
                <div style={{ position: 'fixed', inset: 0, background: '#05030A', zIndex: -3 }} />

                {/* Layer 0: High-definition cityscape background */}
                <div style={{
                    position: 'fixed', inset: 0, zIndex: -2,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=2000&q=95)',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    opacity: 0.95,
                    filter: 'contrast(1.1) saturate(1.1) brightness(0.7)'
                }} />

                {/* Layer 1: Subtle Vignette to keep text readable */}
                <div style={{
                    position: 'fixed', inset: 0, zIndex: -1,
                    background: 'radial-gradient(circle at center, transparent 0%, rgba(5,3,10,0.6) 100%)'
                }} />

                {/* Layer 2: Main Content Stack */}
                <div style={{ position: 'relative', zIndex: 2 }}>

                    {/* Glow orbs - clearly floating */}
                    <div style={{ position: 'fixed', top: '10%', left: '25%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', borderRadius: '50%', zIndex: -1, pointerEvents: 'none' }} />
                    <div style={{ position: 'fixed', bottom: '0%', right: '15%', width: '35vw', height: '35vw', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', borderRadius: '50%', zIndex: -1, pointerEvents: 'none' }} />

                    {/* ── 1. FLOATING HEADER (Centered) ── */}
                    <div style={{ position: 'relative', zIndex: 100, padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', color: '#fff', fontSize: '13px', fontWeight: 600, transition: 'all 0.25s', whiteSpace: 'nowrap', fontFamily: "'Outfit', sans-serif" }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                            >← Go Back</button>
                            <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.12)' }} />
                            <div style={{ background: '#fff', color: '#000', padding: '6px 14px', borderRadius: '4px', fontWeight: 1000, fontSize: '16px', letterSpacing: '0.1em' }}>AI</div>
                            <h1 style={{ fontSize: '56px', fontWeight: 1000, margin: 0, color: '#fff', letterSpacing: '-2px', fontFamily: "'Outfit', sans-serif", textTransform: 'uppercase' }}>Cost Estimation</h1>
                        </div>
                    </div>

                    <div style={{ position: 'relative', zIndex: 1, maxWidth: '1550px', margin: '0 auto', padding: '0 32px 100px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

                        {/* Loading */}
                        {(loadingEst || !estData || estData.error) && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', minHeight: '60vh' }}>
                                {loadingEst ? (
                                    <>
                                        <div style={{ width: '64px', height: '64px', border: '3px solid rgba(139,92,246,0.2)', borderTop: '3px solid #8B5CF6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                        <div style={{ fontSize: '14px', letterSpacing: '0.25em', color: '#A78BFA', fontWeight: 600 }}>COMPUTING YOUR ESTIMATE...</div>
                                    </>
                                ) : (
                                    <div style={{ textAlign: 'center', maxWidth: '500px' }}>
                                        <div style={{ fontSize: '56px', marginBottom: '16px' }}>⚠️</div>
                                        <div style={{ fontSize: '22px', color: '#ef4444', fontWeight: 800, marginBottom: '12px' }}>ESTIMATION UNAVAILABLE</div>
                                        <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', marginTop: '12px', lineHeight: '1.6', marginBottom: '28px' }}>
                                            {estData?.message || "Unable to calculate estimation. Please verify:"}
                                        </div>
                                        <div style={{ 
                                            background: 'rgba(239,68,68,0.08)', 
                                            border: '1px solid rgba(239,68,68,0.3)', 
                                            borderRadius: '12px', 
                                            padding: '16px', 
                                            marginBottom: '24px',
                                            fontSize: '13px',
                                            color: 'rgba(255,255,255,0.7)',
                                            lineHeight: '1.7',
                                            textAlign: 'left'
                                        }}>
                                            ✓ Backend server is running on port 8000<br/>
                                            ✓ All required fields are filled (Plot Size, Dimensions)<br/>
                                            ✓ Network connection is stable<br/>
                                            ✓ No firewall is blocking port 8000
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                            <button 
                                                onClick={() => fetchEstimation(false)}
                                                style={{ 
                                                    padding: '12px 32px', 
                                                    borderRadius: '12px', 
                                                    background: 'linear-gradient(135deg, #00F2FF, #006AFF)',
                                                    border: 'none',
                                                    color: '#fff', 
                                                    cursor: 'pointer',
                                                    fontWeight: 700,
                                                    fontSize: '14px',
                                                    transition: '0.3s'
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                            >
                                                🔄 Retry Estimation
                                            </button>
                                            <button 
                                                onClick={onBack}
                                                style={{ 
                                                    padding: '12px 32px', 
                                                    borderRadius: '12px', 
                                                    border: '1px solid #8B5CF6', 
                                                    background: 'transparent', 
                                                    color: '#fff', 
                                                    cursor: 'pointer',
                                                    fontWeight: 700,
                                                    fontSize: '14px',
                                                    transition: '0.3s'
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.1)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                ← Back to Wizard
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {estData && !loadingEst && !estData.error && (<>

                            {/* ── 2. PROJECT SUMMARY ── */}
                            <div style={{
                                ...liquidGlass,
                                padding: '28px 48px',
                                background: 'rgba(255,255,255,0)', // 40% more transparent
                                backdropFilter: 'blur(8px) saturate(110%)',  // Near-invisible glass
                                WebkitBackdropFilter: 'blur(8px) saturate(110%)',
                                border: '1px solid rgba(255,255,255,0.04)',
                                animation: 'fadeInUp 0.6s ease',
                                fontFamily: "'Outfit', sans-serif"
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ color: '#8B5CF6', fontSize: '22px' }}>🏠</div>
                                        <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Outfit', sans-serif" }}>Project Configuration</h2>
                                    </div>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', fontFamily: "'Outfit', sans-serif" }}>SYNCED WITH AI CORE</div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                                    {(() => {
                                        const configSummary = {
                                            'Plot Size': inputs.plot_size ? (inputs.plot_size === 'full' ? 'Full Site' : 'Double Site') : '—',
                                            'Dimensions': inputs.dimensions || '—',
                                            'Building Height': inputs.floor || '—',
                                            'Grade/Style': inputs.structural_style || 'Base',
                                            'Bedrooms': inputs.bedrooms ? `${inputs.bedrooms} BHK` : '—',
                                            'Family Size': inputs.family_count || '—',
                                            'Children': inputs.children_count !== undefined ? inputs.children_count : '—',
                                            'Grandparents': inputs.grandparents_living === true ? 'Yes' : inputs.grandparents_living === false ? 'No' : '—',
                                            'Lift Required': inputs.lift_required === true ? 'Yes' : inputs.lift_required === false ? 'No' : '—',
                                            'Pooja Room': inputs.pooja_room === true ? 'Yes' : inputs.pooja_room === false ? 'No' : '—',
                                            'Interior Package': inputs.interior_package ? inputs.interior_package.replace(/_/g, ' ').toUpperCase() : '—',
                                        };
                                        return Object.entries(configSummary).map(([label, value], i) => (
                                            <div key={i} style={{
                                                padding: '14px 20px',
                                                borderRadius: '14px',
                                                border: '1px solid rgba(255,255,255,0.04)',
                                                background: 'rgba(255,255,255,0)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '6px',
                                                transition: 'all 0.3s ease',
                                                fontFamily: "'Outfit', sans-serif"
                                            }}>
                                                <div style={{ fontSize: '9px', color: 'rgba(103,232,249,0.85)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', fontFamily: "'Outfit', sans-serif" }}>
                                                    {label.replace(/_/g, ' ')}
                                                </div>
                                                <div style={{ fontSize: '17px', fontWeight: 800, color: '#fff', fontFamily: "'Outfit', sans-serif", letterSpacing: '0.02em' }}>
                                                    {value}
                                                </div>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>

                            {/* ── 3. TOTAL INVESTMENT HERO BOX ── */}
                            <div style={{
                                ...liquidGlass,
                                padding: '80px 72px',
                                background: 'linear-gradient(135deg, rgba(139,92,246,0.10) 0%, rgba(107,33,173,0.07) 100%)',
                                textAlign: 'center',
                                animation: 'fadeInUp 0.7s ease 0.1s both',
                                border: '1px solid rgba(139,92,246,0.12)',
                                backdropFilter: 'blur(8px) saturate(110%)', // Near-invisible glass
                                WebkitBackdropFilter: 'blur(8px) saturate(110%)',
                                position: 'relative',
                                overflow: 'hidden',
                                transform: 'scale(1.05)',
                                boxShadow: '0 40px 100px rgba(0,0,0,0.3), 0 0 60px rgba(139,92,246,0.05)'
                            }}>
                                {/* Ambient Glow Inside Hero */}
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', height: '90%', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

                                <div style={{ fontSize: '16px', letterSpacing: '0.6em', color: 'rgba(255,255,255,0.5)', marginBottom: '24px', textTransform: 'uppercase', fontWeight: 900 }}>Total Investment</div>
                                <div style={{ fontSize: '144px', fontWeight: 1000, letterSpacing: '-8px', color: '#fff', lineHeight: 1, textShadow: '0 0 100px rgba(103,232,249,0.4), 0 0 40px rgba(139,92,246,0.6)', position: 'relative' }}>
                                    <span style={{ fontSize: '56px', verticalAlign: 'top', marginRight: '10px', opacity: 0.7 }}>₹</span>
                                    <CountUp end={estData.total_cost} />
                                </div>
                                <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', marginTop: '30px', fontWeight: 700, letterSpacing: '0.15em' }}>PRECISION AI VALUATION · 2026 LIVE</div>
                            </div>

                            {/* ── 4. DETAILED BREAKDOWN GRID ── */}
                            <div style={{
                                ...liquidGlass,
                                padding: '28px 40px',
                                background: 'rgba(255,255,255,0)',
                                backdropFilter: 'blur(8px) saturate(110%)', // Near-invisible glass
                                WebkitBackdropFilter: 'blur(8px) saturate(110%)',
                                border: '1px solid rgba(255,255,255,0.03)',
                                animation: 'fadeInUp 0.8s ease 0.2s both',
                                fontFamily: "'Outfit', sans-serif"
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ fontSize: '20px' }}>📑</div>
                                        <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: '#fff' }}>Detailed Breakdown</h2>
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', fontFamily: "'Outfit', sans-serif" }}>
                                    {(estData.breakdown || []).map((item, idx) => {
                                        const cat = item.category || 'STRUCTURE';
                                        const c = catColor[cat] || catColor['STRUCTURE'];
                                        return (
                                            <div key={idx} style={{
                                                padding: '14px 24px', // Reduced vertical by further 15%
                                                background: 'rgba(255,255,255,0.001)', // Near-Invisible Floating
                                                borderRadius: '20px',
                                                border: '1px solid rgba(255,255,255,0.03)',
                                                transition: 'all 0.3s ease',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '6px',
                                                animation: `fadeInUp 0.6s ease ${0.3 + idx * 0.05}s both`,
                                                fontFamily: "'Outfit', sans-serif"
                                            }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{
                                                        fontSize: '10px', fontWeight: 800, color: c.text, background: c.bg,
                                                        border: `1px solid ${c.border}`, padding: '3px 9px', borderRadius: '5px',
                                                        letterSpacing: '0.18em', fontFamily: "'Outfit', sans-serif"
                                                    }}>{cat}</span>
                                                    <div style={{ fontSize: '12px', color: '#67E8F9', fontWeight: 700, fontFamily: "'Outfit', sans-serif", letterSpacing: '0.05em' }}>{item.percentage}%</div>
                                                </div>
                                                <div style={{
                                                    fontSize: '17px', fontWeight: 400, color: 'rgba(255,255,255,0.88)',
                                                    minHeight: '40px', lineHeight: '1.5', letterSpacing: '0.02em',
                                                    fontFamily: "'Outfit', sans-serif"
                                                }}>{item.component}</div>
                                                <div style={{
                                                    fontSize: '29px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px',
                                                    fontFamily: "'Outfit', sans-serif"
                                                }}>
                                                    <CountUp end={item.amount} />
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* ── 2026 Inflation Margin Card ── */}
                                    {estData && (
                                        <>
                                            <div style={{
                                                ...liquidGlass,
                                                background: 'rgba(103,232,249,0.03)',
                                                border: '1px solid rgba(103,232,249,0.15)',
                                                padding: '24px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                fontFamily: "'Outfit', sans-serif"
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{
                                                        fontSize: '10px', fontWeight: 800, color: '#22D3EE', background: 'rgba(6,182,212,0.1)',
                                                        border: '1px solid rgba(6,182,212,0.3)', padding: '3px 9px', borderRadius: '5px',
                                                        letterSpacing: '0.15em'
                                                    }}>2026 INFLATION MARGIN</span>
                                                    <div style={{ fontSize: '12px', color: '#67E8F9', fontWeight: 700 }}>1.02%</div>
                                                </div>
                                                <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>Market Escalation Factor</div>
                                                <div style={{ fontSize: '29px', fontWeight: 900, color: '#67E8F9', letterSpacing: '-0.5px' }}>
                                                    + ₹<CountUp end={estData.inflation_amount || (estData.total_cost - (estData.total_cost / 1.0102))} />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* ── 5. FINAL DECISION SECTION ── */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
                                <div style={{ ...liquidGlass, padding: '40px', background: 'rgba(255,255,255,0)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                        <div style={{ color: '#67E8F9', fontSize: '20px' }}>📈</div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#fff' }}>Market Analysis</h3>
                                    </div>
                                    <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(103,232,249,0.03)', border: '1px solid rgba(103,232,249,0.1)' }}>
                                        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                                            Based on our deep logic analysis of the <strong style={{ color: '#67E8F9' }}>2026 market dynamics</strong>, this valuation represents the most accurate and competitive fit for your specific project requirements.
                                            We have benchmarked this against current Tier-1 city construction indices to ensure that every structural and finish component is priced for maximum cost-efficiency.{' '}
                                            This estimation is engineered to withstand current material volatility while maintaining a premium standard of civil architectural quality.{' '}
                                            Your current configuration stands as the <strong style={{ color: '#FCD34D' }}>best architectural investment</strong> as per current market trends and professional construction benchmarks.
                                        </p>
                                    </div>
                                </div>

                                <div style={{ ...liquidGlass, padding: '40px', background: 'rgba(255,255,255,0)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                        <div style={{ color: '#FCD34D', fontSize: '20px' }}>✨</div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#fff' }}>Smart Upgrades</h3>
                                    </div>
                                    <div style={{ fontSize: '19px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', marginBottom: '32px', fontFamily: "'Outfit', sans-serif" }}>
                                        Upgrade costs tailored to your project — based on bedrooms, family size, and lift requirements.{' '}
                                        These intelligent enhancements are specifically calculated to ensure optimal space utility and architectural flow for your unique BHK configuration.{' '}
                                        Integrating these premium finishes and mechanical assets now can significantly reduce long-term maintenance overheads while maximizing the property's future equity.{' '}
                                        Our AI model suggests these specific additions to future-proof your structural investment against evolving modern lifestyle standards and high-density residential trends.
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
                                        {!showUpgradeOptions ? (
                                            <>
                                                <button
                                                    onClick={() => { setShowUpgradeOptions(true); setShowFinalize(false); }}
                                                    style={{ flex: 1, padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 800, cursor: 'pointer', transition: '0.3s' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                                >YES</button>
                                                <button
                                                    onClick={(e) => {
                                                        e.currentTarget.style.transform = 'scale(0.98)';
                                                        e.currentTarget.style.boxShadow = '0 0 40px rgba(0,242,255,0.6), inset 0 0 20px rgba(0,242,255,0.2)';
                                                        e.currentTarget.style.background = 'rgba(0,242,255,0.15)';
                                                        setTimeout(() => {
                                                            e.currentTarget.style.transform = 'scale(1)';
                                                            e.currentTarget.style.boxShadow = 'none';
                                                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                                        }, 300);
                                                        setShowFinalize(true);
                                                    }}
                                                    style={{ flex: 1, padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s ease' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                                >NO (Finalize Estimate)</button>
                                            </>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                                                {['Classic', 'Premium', 'Elite'].map(grade => {
                                                    const multipliers = { 'Base': 1.0, 'Classic': 1.15, 'Premium': 1.30, 'Elite': 1.45 };
                                                    const currentGrade = inputs.structural_style || 'Base';
                                                    const currentTotal = estData?.total_cost || 0;
                                                    const baseTotal = currentTotal / multipliers[currentGrade];
                                                    const upgradedTotal = baseTotal * multipliers[grade];

                                                    return (
                                                        <button
                                                            key={grade}
                                                            onClick={async () => {
                                                                const newInputs = { ...inputs, structural_style: grade };
                                                                setInputs(newInputs);
                                                                setShowUpgradeOptions(false);

                                                                // Manual re-fetch with new inputs
                                                                setLoadingEst(true);
                                                                try {
                                                                    const endpoint = `${API_BASE_URL}/${projectType.replace('_', '-')}/estimate`;
                                                                    const res = await fetch(endpoint, {
                                                                        method: 'POST',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify(newInputs)
                                                                    });
                                                                    const data = await res.json();
                                                                    setEstData(data);
                                                                    setDisplayTotal(data.total_cost || 0);
                                                                } catch (err) { console.error(err); }
                                                                finally { setLoadingEst(false); }
                                                            }}
                                                            style={{
                                                                width: '100%', padding: '24px', borderRadius: '14px',
                                                                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                                                                color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                                cursor: 'pointer', transition: '0.2s', fontFamily: "'Outfit', sans-serif"
                                                            }}
                                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                                        >
                                                            <span style={{ fontSize: '20px', fontWeight: 600 }}>{grade === 'Elite' ? 'LUXURY' : grade.toUpperCase()} GRADE</span>
                                                            <span style={{ fontWeight: 900, color: '#67E8F9', fontSize: '24px' }}>₹{new Intl.NumberFormat('en-IN').format(Math.round(upgradedTotal))}</span>
                                                        </button>
                                                    );
                                                })}
                                                <button
                                                    onClick={() => setShowUpgradeOptions(false)}
                                                    style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '18px', cursor: 'pointer', marginTop: '4px', fontFamily: "'Outfit', sans-serif" }}
                                                >← Back to Decison</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ── 6. FINAL AUTHORIZATION BLOCK (Digital Signature) ── */}
                            {showFinalize && !showUpgradeOptions && (
                                <div style={{ ...liquidGlass, padding: '48px', marginTop: '32px', animation: 'fadeInUp 0.6s ease', background: 'rgba(255,255,255,0)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '64px' }}>
                                        {/* Left: Digital Signature */}
                                        <div>
                                            <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '32px', letterSpacing: '0.05em', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>DIGITAL AUTHORIZATION</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: 800, letterSpacing: '0.15em', fontFamily: "'Outfit', sans-serif" }}>CLIENT FULL NAME</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Type full legal name..."
                                                        value={clientName}
                                                        onChange={(e) => setClientName(e.target.value)}
                                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '18px 24px', borderRadius: '14px', color: '#fff', fontSize: '16px', fontFamily: "'Outfit', sans-serif", outline: 'none' }}
                                                    />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: 800, letterSpacing: '0.15em', fontFamily: "'Outfit', sans-serif" }}>DIGITAL SIGNATURE (DRAW BELOW)</label>
                                                    <SignaturePad onSave={(data) => { setSignature(data); setSaveError(null); }} onClear={() => setSignature('')} />
                                                </div>
                                                {saveError && (
                                                    <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#FCA5A5', fontSize: '12px', fontWeight: 600 }}>
                                                        ⚠️ {saveError}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right: Terms & Conditions */}
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <h3 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '32px', letterSpacing: '0.05em', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>TERMS & CONDITIONS</h3>
                                            <div style={{ padding: '28px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', fontSize: '16px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.9', fontFamily: "'Outfit', sans-serif", flex: 1 }}>
                                                <div style={{ marginBottom: '20px' }}>1. Valuation indexed to 2026 market benchmarks for plot size {inputs.plot_size}.</div>
                                                <div style={{ marginBottom: '20px' }}>2. Final execution costs subject to ±5% variance based on site-specific geotechnical reports.</div>
                                                <div style={{ marginBottom: '20px' }}>3. This AI-driven appraisal is valid for persistent architectural planning for 30 calendar days from authorization.</div>
                                                <div style={{ marginBottom: '20px' }}>4. Construction delays, material sourcing, and labor supply chain disruptions are not covered under this estimation. Client is responsible for project timeline contingencies.</div>
                                                <div style={{ marginBottom: '0px' }}>5. Final cost is subject to verification upon site inspection. Additional soil preparation, drainage, or regulatory compliance costs may apply based on municipal and environmental audit reports.</div>
                                            </div>
                                            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                <input
                                                    type="checkbox"
                                                    id="termsAccept"
                                                    checked={termsAccepted}
                                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#00F2FF' }}
                                                />
                                                <label htmlFor="termsAccept" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontWeight: 600, fontFamily: "'Outfit', sans-serif", margin: 0 }}>
                                                    I have read and accept all terms & conditions
                                                </label>
                                            </div>

                                            {saveSuccess ? (
                                                <div style={{
                                                    marginTop: '32px', padding: '32px', borderRadius: '20px',
                                                    background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.3)',
                                                    color: '#6EE7B7', textAlign: 'center', fontWeight: 800,
                                                    fontFamily: "'Outfit', sans-serif", letterSpacing: '0.05em',
                                                    animation: 'pulse 2s infinite'
                                                }}>
                                                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>✓ PROJECT SECURED</div>
                                                    <div style={{ fontSize: '13px', opacity: 0.8 }}>REDIRECTING TO ARCHIVE IN 6 SECONDS...</div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={handleSaveProject}
                                                    disabled={isSaving || !termsAccepted}
                                                    style={{
                                                        width: '100%', marginTop: '32px', padding: '24px', borderRadius: '16px',
                                                        background: (isSaving || !termsAccepted) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #00F2FF, #006AFF)',
                                                        border: 'none', color: '#fff', fontWeight: 900, fontSize: '18px',
                                                        cursor: (isSaving || !termsAccepted) ? 'not-allowed' : 'pointer', transition: '0.3s',
                                                        letterSpacing: '0.1em', fontFamily: "'Outfit', sans-serif",
                                                        boxShadow: (isSaving || !termsAccepted) ? 'none' : '0 10px 30px rgba(0,106,255,0.3)',
                                                        opacity: (!clientName || !signature || !termsAccepted) ? 0.4 : 1
                                                    }}
                                                    onMouseEnter={e => !(isSaving || !termsAccepted) && (e.currentTarget.style.transform = 'translateY(-2px)')}
                                                    onMouseLeave={e => !(isSaving || !termsAccepted) && (e.currentTarget.style.transform = 'translateY(0)')}
                                                >
                                                    {isSaving ? 'VALIDATING & PERSISTING...' : 'AUTHORIZE & SAVE PROJECT'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </>)}
                    </div>

                </div> {/* End Outer Wrapper */}
            </div>
        );
    }


    /* ─── Default Steps (Building Height, Construction Grade, etc.) ─── */
    const field = currentStep.field;
    return (
        <WizardShell config={config} step={step} inputs={inputs} onBack={onBack} onNext={handleNext} total={total}>
            <GlassCard>
                <h2 style={{ fontSize: '2.8rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: '3rem' }}>{currentStep.title}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    {(currentStep.options || []).map(opt => (
                        <div key={opt.value} className={`chip ${inputs[field] === opt.value ? 'active' : ''}`}
                            onClick={() => setField(field, opt.value)}
                            style={{ padding: '0', overflow: 'hidden', cursor: 'pointer', position: 'relative', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                            {opt.img && <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${opt.img})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: 'scale(1.08)', filter: 'saturate(1.12) contrast(1.08)', opacity: 0.75 }} />}
                            <div style={{ position: 'relative', padding: '2rem', background: opt.img ? 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' : 'none' }}>
                                {opt.icon && <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>{opt.icon}</div>}
                                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{opt.label}</div>
                                {opt.desc && <div style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '0.3rem' }}>{opt.desc}</div>}
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </WizardShell>
    );
};

export default ProjectWizard;
