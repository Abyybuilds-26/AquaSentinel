import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const DEMO_ACCOUNTS = [
  {
    role: 'owner',
    name: 'Ravi Shetty',
    email: 'owner@aquasentinel.com',
    password: 'owner123',
    icon: '🏠',
    desc: 'Full access: Dashboard, Monitoring, Alerts, Analytics, Map',
    color: 'var(--accent)',
  },
  {
    role: 'resident',
    name: 'Priya Nair',
    email: 'resident@aquasentinel.com',
    password: 'resident123',
    icon: '👤',
    desc: 'Personal usage and building overview',
    color: 'var(--success)',
  },
  {
    role: 'admin',
    name: 'Admin User',
    email: 'admin@aquasentinel.com',
    password: 'admin123',
    icon: '⚙️',
    desc: 'All properties overview and city-wide map',
    color: 'var(--warning)',
  },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'resident' ? '/resident/dashboard' : `/${user.role === 'admin' ? 'map' : 'owner/dashboard'}`);
    } catch {
      setError('Invalid email or password. Use the demo accounts below.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  };

  return (
    <div className="login-page">
      {/* Background effects */}
      <div className="login-bg">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
      </div>

      <div className="login-container">
        {/* Left: Branding */}
        <div className="login-brand">
          <div className="login-brand-logo">💧</div>
          <h1 className="login-brand-name">AquaSentinel</h1>
          <p className="login-brand-tagline">Smart Water Monitoring for Shared Housing</p>

          <div className="login-features">
            {['📡 Real-time sensor monitoring', '🔔 Instant leak & overflow alerts', '📊 Usage analytics & trends', '🗺️ Geographic property mapping'].map((f) => (
              <div key={f} className="login-feature">{f}</div>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div className="login-form-wrap">
          <div className="login-form-card">
            <h2 className="login-form-title">Sign In</h2>
            <p className="login-form-sub">Access your water monitoring dashboard</p>

            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
                <label htmlFor="login-email">Email</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="login-field">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>
              <button id="login-submit" type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            <div className="login-divider">
              <span>Quick Access — Demo Accounts</span>
            </div>

            <div className="login-demos">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  id={`demo-${acc.role}`}
                  className="login-demo-card"
                  style={{ '--demo-color': acc.color }}
                  onClick={() => fillDemo(acc)}
                >
                  <span className="login-demo-icon">{acc.icon}</span>
                  <div className="login-demo-info">
                    <div className="login-demo-role">{acc.name} ({acc.role})</div>
                    <div className="login-demo-desc">{acc.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
