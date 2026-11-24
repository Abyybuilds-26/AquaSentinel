import './SensorReadout.css';

const STATUS_MAP = {
  true:    { label: 'DETECTED', cls: 'status-critical' },
  false:   { label: 'NORMAL',   cls: 'status-normal' },
  online:  { label: 'ONLINE',   cls: 'status-normal' },
  offline: { label: 'OFFLINE',  cls: 'status-offline' },
};

export default function SensorReadout({ sensor }) {
  if (!sensor) return <div className="sensor-loading">Loading sensor data...</div>;

  const tankPct = sensor.tankLevel ?? 0;
  const tankColor =
    tankPct >= 95 ? 'var(--critical)' :
    tankPct <= 20 ? 'var(--warning)' :
    'var(--accent)';

  const connStatus = STATUS_MAP[sensor.connectionStatus] || STATUS_MAP.online;
  const leakStatus = STATUS_MAP[String(sensor.leakDetected)] || STATUS_MAP.false;
  const ovflStatus = STATUS_MAP[String(sensor.overflowDetected)] || STATUS_MAP.false;

  return (
    <div className="sensor-readout">
      {/* Tank Level */}
      <div className="sensor-block">
        <div className="sensor-block-header">
          <span className="sensor-block-label">💧 Tank Level</span>
          <span className="sensor-block-value" style={{ color: tankColor }}>
            {sensor.tankLevel !== null ? `${sensor.tankLevel}%` : 'N/A'}
          </span>
        </div>
        <div className="tank-bar-bg">
          <div
            className="tank-bar-fill"
            style={{ width: `${tankPct}%`, background: tankColor }}
          />
        </div>
        <div className="tank-bar-labels">
          <span>Empty</span>
          <span>Full</span>
        </div>
      </div>

      {/* Flow Rate */}
      <div className="sensor-block">
        <div className="sensor-block-header">
          <span className="sensor-block-label">🌊 Flow Rate</span>
          <span className="sensor-block-value">
            {sensor.connectionStatus === 'offline' ? '—' : `${sensor.flowRate} L/min`}
          </span>
        </div>
        <div className="flow-bar-bg">
          <div
            className="flow-bar-fill"
            style={{ width: `${Math.min((sensor.flowRate / 15) * 100, 100)}%` }}
          />
        </div>
        <div className="tank-bar-labels">
          <span>0</span>
          <span>15 L/min</span>
        </div>
      </div>

      {/* Status grid */}
      <div className="sensor-status-grid">
        <div className="sensor-status-item">
          <span className="sensor-status-icon">🔍</span>
          <span className="sensor-status-label">Leak Sensor</span>
          <span className={`sensor-status-val ${leakStatus.cls}`}>{leakStatus.label}</span>
        </div>
        <div className="sensor-status-item">
          <span className="sensor-status-icon">⚠️</span>
          <span className="sensor-status-label">Overflow Sensor</span>
          <span className={`sensor-status-val ${ovflStatus.cls}`}>{ovflStatus.label}</span>
        </div>
        <div className="sensor-status-item">
          <span className="sensor-status-icon">📡</span>
          <span className="sensor-status-label">Connection</span>
          <span className={`sensor-status-val ${connStatus.cls}`}>{connStatus.label}</span>
        </div>
      </div>

      {/* Last updated */}
      <div className="sensor-updated">
        Last updated: {new Date(sensor.lastUpdated || Date.now()).toLocaleTimeString()}
      </div>
    </div>
  );
}
