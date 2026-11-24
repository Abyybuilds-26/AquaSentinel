import { useNavigate } from 'react-router-dom';
import './Landing.css';

const FEATURES = [
  { icon: '📡', title: 'Real-time Monitoring', desc: 'Live sensor data for tank level, flow rate, and leak detection — updated every second.' },
  { icon: '🔔', title: 'Instant Alerts', desc: 'Automatic notifications for leaks, overflow, high usage, and sensor failures.' },
  { icon: '📊', title: 'Usage Analytics', desc: 'Daily and hourly water usage charts to understand consumption patterns.' },
  { icon: '🗺️', title: 'Property Mapping', desc: 'Interactive map showing all monitored properties with real-time status indicators.' },
];

const DEMO_FLOW = [
  { step: '01', title: 'Login', desc: 'Sign in as an owner, resident, or admin.' },
  { step: '02', title: 'Monitor', desc: 'View live sensor data on the dashboard.' },
  { step: '03', title: 'Simulate', desc: 'Trigger scenarios: leak, overflow, high usage.' },
  { step: '04', title: 'Alert', desc: 'Receive instant alerts and notifications.' },
  { step: '05', title: 'Locate', desc: 'See the property turn red on the map.' },
  { step: '06', title: 'Resolve', desc: 'Resolve alerts and restore normal status.' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* BG effects */}
      <div className="landing-bg">
        <div className="landing-orb landing-orb-1" />
        <div className="landing-orb landing-orb-2" />
        <div className="landing-grid" />
      </div>

      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-nav-logo">💧 AquaSentinel</div>
        <button id="landing-login-btn" className="btn btn-primary" onClick={() => navigate('/login')}>
          Sign In →
        </button>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-badge">🚀 MVP Prototype — Smart Water Management</div>
        <h1 className="landing-hero-title">
          Monitor Water.<br />
          <span className="landing-hero-accent">Detect Problems.</span><br />
          Save Resources.
        </h1>
        <p className="landing-hero-sub">
          AquaSentinel is a smart water usage tracker for PGs, hostels, and shared housing.
          Monitor consumption, detect leaks instantly, and manage properties on an interactive map.
        </p>
        <div className="landing-hero-ctas">
          <button id="hero-get-started" className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
            Get Started →
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => navigate('/map')}>
            🗺️ View Map
          </button>
        </div>

        {/* Live stats */}
        <div className="landing-stats">
          {[
            { val: '1,240 L', label: 'Monitored Today' },
            { val: '72%', label: 'Tank Level' },
            { val: '4.2 L/min', label: 'Flow Rate' },
            { val: '5', label: 'Properties' },
          ].map((s) => (
            <div key={s.label} className="landing-stat">
              <div className="landing-stat-val">{s.val}</div>
              <div className="landing-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="landing-section">
        <div className="landing-section-header">
          <h2 className="landing-section-title">Everything you need to manage water</h2>
          <p className="landing-section-sub">A complete monitoring solution for shared housing</p>
        </div>
        <div className="landing-features-grid">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`landing-feature-card animate-in animate-delay-${i + 1}`}>
              <div className="landing-feature-icon">{f.icon}</div>
              <h3 className="landing-feature-title">{f.title}</h3>
              <p className="landing-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo flow */}
      <section className="landing-section">
        <div className="landing-section-header">
          <h2 className="landing-section-title">The complete demo story</h2>
          <p className="landing-section-sub">Monitor → Detect → Alert → Locate → Investigate → Resolve</p>
        </div>
        <div className="landing-flow">
          {DEMO_FLOW.map((step, i) => (
            <div key={step.step} className="landing-flow-step">
              <div className="landing-flow-num">{step.step}</div>
              <div className="landing-flow-title">{step.title}</div>
              <div className="landing-flow-desc">{step.desc}</div>
              {i < DEMO_FLOW.length - 1 && <div className="landing-flow-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <h2>Ready to monitor smarter?</h2>
        <p>Use demo credentials to explore all features.</p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
          Launch Demo →
        </button>
      </section>

      <footer className="landing-footer">
        <p>© 2024 AquaSentinel — Smart Water Monitoring Prototype</p>
      </footer>
    </div>
  );
}
