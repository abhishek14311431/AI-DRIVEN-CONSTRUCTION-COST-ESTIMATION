import React from 'react';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App render error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#05030A', color: '#fff' }}>
          <div style={{ maxWidth: '720px', width: '100%', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(10,12,18,0.92)' }}>
            <div style={{ fontSize: '0.8rem', letterSpacing: '0.2em', color: '#67E8F9', marginBottom: '0.75rem', textTransform: 'uppercase', fontWeight: 800 }}>Render error detected</div>
            <h1 style={{ margin: '0 0 1rem', fontSize: '2rem' }}>The estimation view crashed.</h1>
            <p style={{ margin: '0 0 1.5rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.7 }}>
              A React render error occurred while loading the final estimation screen. The app is still usable, and you can reset to recover.
            </p>
            <pre style={{ margin: '0 0 1.5rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#FCA5A5', background: 'rgba(239,68,68,0.08)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.25)' }}>
              {this.state.error?.message || 'Unknown render failure'}
            </pre>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={this.handleReset} style={{ padding: '0.9rem 1.4rem', borderRadius: '999px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #00F2FF, #006AFF)', color: '#fff', fontWeight: 700 }}>
                Reset App
              </button>
              <button onClick={() => window.location.reload()} style={{ padding: '0.9rem 1.4rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', background: 'rgba(255,255,255,0.06)', color: '#fff', fontWeight: 700 }}>
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;