import { useState } from 'react';
import client from '../../api/client';
import './SimulatorPanel.css';

const SCENARIOS = [
  {
    key: 'normal',
    label: 'Normal',
    icon: '✅',
    desc: 'Reset to normal operation',
    cls: 'sim-normal',
  },
  {
    key: 'leak',
    label: 'Simulate Leak',
    icon: '💧',
    desc: 'Flow rate 8.5 L/min, leak detected',
    cls: 'sim-critical',
  },
  {
    key: 'overflow',
    label: 'Simulate Overflow',
    icon: '🌊',
    desc: 'Tank level 97%, overflow flag',
    cls: 'sim-critical',
  },
  {
    key: 'high_usage',
    label: 'High Usage',
    icon: '📈',
    desc: 'Flow rate 12.8 L/min, high consumption',
    cls: 'sim-warning',
  },
  {
    key: 'low_tank',
    label: 'Low Tank',
    icon: '⚠️',
    desc: 'Tank at 14%, refill needed',
    cls: 'sim-warning',
  },
  {
    key: 'offline',
    label: 'Sensor Offline',
    icon: '📵',
    desc: 'Sensor stops reporting',
    cls: 'sim-offline',
  },
];

export default function SimulatorPanel({ onScenarioTriggered }) {
  const [active, setActive] = useState('normal');
  const [loading, setLoading] = useState(null);

  const trigger = async (scenario) => {
    if (loading) return;
    setLoading(scenario);
    try {
      await client.post('/simulate', { scenario, propertyId: 'p1' });
      setActive(scenario);
      onScenarioTriggered?.(scenario);
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="sim-panel">
      <div className="sim-panel-header">
        <div>
          <div className="sim-panel-title">🎮 Sensor Simulator</div>
          <div className="sim-panel-sub">
            Simulate IoT sensor scenarios to test the monitoring system
          </div>
        </div>
        <div className={`sim-status ${active !== 'normal' ? 'sim-status-active' : ''}`}>
          {active !== 'normal' ? `⚡ ${active.replace('_', ' ')}` : '● Normal'}
        </div>
      </div>

      <div className="sim-grid">
        {SCENARIOS.map((s) => (
          <button
            key={s.key}
            className={`sim-btn ${s.cls} ${active === s.key ? 'sim-btn-active' : ''} ${loading === s.key ? 'sim-btn-loading' : ''}`}
            onClick={() => trigger(s.key)}
            disabled={!!loading}
          >
            <div className="sim-btn-icon">{loading === s.key ? '⟳' : s.icon}</div>
            <div className="sim-btn-label">{s.label}</div>
            <div className="sim-btn-desc">{s.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
