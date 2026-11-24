import { useNavigate } from 'react-router-dom';
import './AlertFeed.css';

const SEVERITY_CONFIG = {
  critical: { color: 'var(--critical)', bg: 'var(--critical-dim)', icon: '🔴', label: 'Critical' },
  warning:  { color: 'var(--warning)',  bg: 'var(--warning-dim)',  icon: '🟡', label: 'Warning' },
  info:     { color: 'var(--accent)',   bg: 'var(--accent-dim)',   icon: '🔵', label: 'Info' },
};

const TYPE_LABELS = {
  LEAK:           'Possible Leak',
  OVERFLOW:       'Tank Overflow',
  HIGH_USAGE:     'High Usage',
  LOW_TANK:       'Low Tank',
  SENSOR_OFFLINE: 'Sensor Offline',
};

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AlertFeed({ alerts = [] }) {
  const navigate = useNavigate();
  const recent = alerts.slice(0, 5);

  return (
    <div className="alert-feed">
      {recent.length === 0 ? (
        <div className="alert-feed-empty">
          <span>✅</span>
          <p>All systems normal</p>
        </div>
      ) : (
        recent.map((alert) => {
          const cfg = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;
          return (
            <div key={alert.id} className="alert-feed-item" style={{ '--alert-color': cfg.color, '--alert-bg': cfg.bg }}>
              <div className="alert-feed-icon">{cfg.icon}</div>
              <div className="alert-feed-body">
                <div className="alert-feed-type">{TYPE_LABELS[alert.type] || alert.type}</div>
                <div className="alert-feed-msg">{alert.message}</div>
                <div className="alert-feed-meta">
                  <span className={`badge badge-${alert.status === 'active' ? 'critical' : 'normal'}`}>
                    {alert.status}
                  </span>
                  <span className="alert-feed-time">{timeAgo(alert.createdAt)}</span>
                </div>
              </div>
            </div>
          );
        })
      )}
      {alerts.length > 5 && (
        <button className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 8 }}
          onClick={() => navigate('/owner/alerts')}>
          View all {alerts.length} alerts →
        </button>
      )}
    </div>
  );
}
