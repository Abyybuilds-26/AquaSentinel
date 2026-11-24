import { useState } from 'react';
import { useSensor } from '../../context/SensorContext';
import client from '../../api/client';
import './Alerts.css';

const SEVERITY_CONFIG = {
  critical: { icon: '🔴', color: 'var(--critical)', bg: 'var(--critical-dim)' },
  warning:  { icon: '🟡', color: 'var(--warning)',  bg: 'var(--warning-dim)'  },
  info:     { icon: '🔵', color: 'var(--accent)',   bg: 'var(--accent-dim)'   },
};

const TYPE_LABELS = {
  LEAK:           'Possible Leak',
  OVERFLOW:       'Tank Overflow',
  HIGH_USAGE:     'High Usage',
  LOW_TANK:       'Low Tank Level',
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

export default function Alerts() {
  const { alerts, refreshData } = useSensor();
  const [filter, setFilter] = useState('all');
  const [resolving, setResolving] = useState(null);

  const filtered =
    filter === 'active'   ? alerts.filter((a) => a.status === 'active') :
    filter === 'resolved' ? alerts.filter((a) => a.status === 'resolved') :
    alerts;

  const activeCount = alerts.filter((a) => a.status === 'active').length;

  const handleResolve = async (alert) => {
    setResolving(alert.id);
    try {
      await client.patch(`/alerts/${alert.id}/resolve`, { propertyId: alert.propertyId });
      await refreshData();
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    } finally {
      setResolving(null);
    }
  };

  return (
    <div className="page-content">
      <div className="animate-in">
        <div className="page-title">Alerts</div>
        <p className="page-desc">System-generated water monitoring alerts</p>
      </div>

      {/* Summary */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Alerts', val: alerts.length, color: 'var(--accent)' },
          { label: 'Active', val: activeCount, color: activeCount > 0 ? 'var(--critical)' : 'var(--success)' },
          { label: 'Resolved', val: alerts.filter((a) => a.status === 'resolved').length, color: 'var(--success)' },
        ].map((s, i) => (
          <div key={s.label} className={`card card-sm animate-in animate-delay-${i + 1}`}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="alerts-tabs animate-in animate-delay-2">
        {['all', 'active', 'resolved'].map((f) => (
          <button
            key={f}
            id={`alerts-filter-${f}`}
            className={`alerts-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'active' && activeCount > 0 && (
              <span className="alerts-tab-badge">{activeCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="alerts-list animate-in animate-delay-3">
        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 16 }}>No {filter} alerts</div>
          </div>
        ) : (
          filtered.map((alert) => {
            const cfg = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;
            return (
              <div key={alert.id} className="alert-card" style={{ '--acolor': cfg.color, '--abg': cfg.bg }}>
                <div className="alert-card-left">
                  <div className="alert-card-icon">{cfg.icon}</div>
                  <div className={`badge badge-${alert.severity}`}>{alert.severity}</div>
                </div>

                <div className="alert-card-body">
                  <div className="alert-card-type">{TYPE_LABELS[alert.type] || alert.type}</div>
                  <div className="alert-card-msg">{alert.message}</div>

                  <div className="alert-card-meta">
                    {alert.estimatedWasteLiters > 0 && (
                      <span className="alert-card-waste">
                        💧 Est. waste: <strong>{alert.estimatedWasteLiters} L</strong>
                      </span>
                    )}
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                      🕐 {timeAgo(alert.createdAt)} · {new Date(alert.createdAt).toLocaleString()}
                    </span>
                    {alert.resolvedAt && (
                      <span style={{ color: 'var(--success)', fontSize: 12 }}>
                        ✅ Resolved {timeAgo(alert.resolvedAt)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="alert-card-action">
                  <div className={`badge badge-${alert.status === 'active' ? 'critical' : 'normal'}`}>
                    {alert.status}
                  </div>
                  {alert.status === 'active' && (
                    <button
                      id={`resolve-alert-${alert.id}`}
                      className="btn btn-success btn-sm"
                      disabled={resolving === alert.id}
                      onClick={() => handleResolve(alert)}
                      style={{ marginTop: 8, whiteSpace: 'nowrap' }}
                    >
                      {resolving === alert.id ? 'Resolving...' : '✓ Resolve'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
