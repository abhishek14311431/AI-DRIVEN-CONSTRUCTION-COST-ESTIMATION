import { useState, useEffect } from 'react';
import { projectConfigs } from './constants/projectConfigs';
import Dashboard from './pages/Dashboard';
import ProjectSelection from './pages/ProjectSelection';
import ProjectWizard from './pages/ProjectWizard';
import EstimationResult from './pages/EstimationResult';
import Archives from './pages/Archives';
import UpgradesPage from './pages/UpgradesPage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

function App() {
  const [view, setView] = useState('dashboard');
  const [projectType, setProjectType] = useState(null);
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [upgradeGrade, setUpgradeGrade] = useState(null);
  const [animationDirection, setAnimationDirection] = useState('forward');
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => { loadProjects(); }, []);

  // Helper function to navigate with animation direction
  const navigateTo = (newView, direction = 'forward') => {
    setAnimationDirection(direction);
    setAnimationKey(prev => prev + 1);
    setView(newView);
  };

  const loadProjects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/projects/`);
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  const startProject = (type) => {
    setProjectType(type);
    setStep(0);
    setResult(null);
    setSavedId(null);

    // Initialize with empty inputs - let user select values
    setInputs({});
    navigateTo('wizard', 'forward');
  };

  const handleNext = async (direction = 1) => {
    const config = projectConfigs[projectType];
    if (direction === -1) {
      setStep(Math.max(0, step - 1));
      return;
    }
    if (step < config.steps.length - 1) {
      setStep(step + 1);
    } else {
      calculateEstimation();
    }
  };

  const calculateEstimation = async () => {
    setLoading(true);
    try {
      const endpoint = `${API_BASE_URL}/${projectType.replace('_', '-')}/estimate`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });
      const data = await res.json();
      if (res.ok) { 
        setResult(data); 
        navigateTo('result', 'forward');
      }
      else { alert(data.detail); }
    } catch (e) { alert(e.message); }
    finally { setLoading(false); }
  };

  const saveProject = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/${projectType.replace('_', '-')}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });
      const data = await res.json();
      if (res.ok) { setSavedId(data.project_id); loadProjects(); }
    } catch (e) { alert(e.message); }
    finally { setLoading(false); }
  };

  const handleSmartUpgrade = (grade) => {
    setUpgradeGrade(grade);
    navigateTo('upgrade', 'forward');
  };

  const handleFinalizeUpgrades = (selectedFacilities, totalUpgradeAmount) => {
    const baseAmount = result.base_cost_original || result.total_cost;
    setResult({
      ...result,
      base_cost_original: baseAmount,
      total_cost: baseAmount + totalUpgradeAmount,
      upgrade_applied: true,
      upgrade_details: {
        baseAmount,
        totalUpgradeAmount,
        upgradeGrade,
        selectedFacilities
      }
    });
    navigateTo('result', 'backward');
  };

  const wizardStepBgs = [
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2200&q=95',  // Step 0: Plot & Dimensions
    'https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=2200&q=95',  // Step 1: Floor & Grade Plan
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2200&q=95',     // Step 2: Additional Details
    'https://images.unsplash.com/photo-1494526585095-c41746248156?w=2000&q=80',  // Step 3: Review Plan (black aesthetic)
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=2000&q=80',  // Step 4: Interior
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=2000&q=80',  // Step 5: Add-ons
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=2000&q=80',  // Step 6: Cost Estimation
  ];

  const getBg = () => {
    if (view === 'wizard') return wizardStepBgs[step] || wizardStepBgs[0];
    const staticBgs = {
      dashboard: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=2000&q=80',
      selection: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=2000&q=80',
      result: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=2000&q=80',
      upgrade: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=2000&q=80'
    };
    return staticBgs[view] || staticBgs.dashboard;
  };

  return (
    <div className="app-root">
      <div className="building-overlay"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(10, 10, 11, 0.2), rgba(10, 10, 11, 0.65)), url(${getBg()})` }}>
      </div>

      <div id="app">
        {view === 'dashboard' && (
          <div key={`dashboard-${animationKey}`} className={`page-transition-${animationDirection}`}>
            <Dashboard navigateTo={navigateTo} />
          </div>
        )}

        {view === 'selection' && (
          <div key={`selection-${animationKey}`} className={`page-transition-${animationDirection}`}>
            <ProjectSelection navigateTo={navigateTo} startProject={startProject} />
          </div>
        )}

        {view === 'wizard' && (
          <div key={`wizard-${animationKey}`} className={`page-transition-${animationDirection}`}>
            <ProjectWizard
              projectType={projectType}
              step={step}
              inputs={inputs}
              setInputs={setInputs}
              navigateTo={navigateTo}
              handleNext={handleNext}
              API_BASE_URL={API_BASE_URL}
              onSmartUpgrade={handleSmartUpgrade}
            />
          </div>
        )}

        {view === 'result' && (
          <div key={`result-${animationKey}`} className={`page-transition-${animationDirection}`}>
            <EstimationResult
              result={result}
              savedId={savedId}
              navigateTo={navigateTo}
              saveProject={saveProject}
              onSmartUpgrade={handleSmartUpgrade}
            />
          </div>
        )}

        {view === 'upgrade' && (
          <div key={`upgrade-${animationKey}`} className={`page-transition-${animationDirection}`}>
            <UpgradesPage
              grade={upgradeGrade}
              onFinalize={handleFinalizeUpgrades}
              onBack={() => navigateTo('result', 'backward')}
            />
          </div>
        )}

        {view === 'archives' && (
          <div key={`archives-${animationKey}`} className={`page-transition-${animationDirection}`}>
            <Archives navigateTo={navigateTo} API_BASE_URL={API_BASE_URL} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;


