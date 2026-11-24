import { useSensor } from '../../context/SensorContext';
import SensorReadout from '../../components/monitoring/SensorReadout';
import SimulatorPanel from '../../components/monitoring/SimulatorPanel';

export default function Monitoring() {
  const { sensorState, refreshData } = useSensor();

  return (
    <div className="page-content">
      <div className="animate-in">
        <div className="page-title">Water Monitoring</div>
        <p className="page-desc">Live sensor readings and simulation controls for Green Valley PG</p>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Live Sensor Readout */}
        <div className="card animate-in animate-delay-1">
          <div className="section-header">
            <div>
              <div className="section-title">📡 Live Sensor Data</div>
              <div className="section-subtitle">Updates in real-time via WebSocket</div>
            </div>
            <div className={`badge ${sensorState?.connectionStatus === 'offline' ? 'badge-offline' : 'badge-active'}`}>
              {sensorState?.connectionStatus === 'offline' ? '⚫ Offline' : '🟢 Live'}
            </div>
          </div>
          <SensorReadout sensor={sensorState} />
        </div>

        {/* Simulator Panel */}
        <div className="animate-in animate-delay-2">
          <SimulatorPanel onScenarioTriggered={refreshData} />

          {/* Current scenario info */}
          {sensorState?.scenario && sensorState.scenario !== 'normal' && (
            <div className="card card-sm" style={{ marginTop: 16, borderColor: 'var(--critical)', background: 'var(--critical-dim)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>⚡</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--critical)' }}>
                    Active Scenario: {sensorState.scenario.replace('_', ' ').toUpperCase()}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                    Check the dashboard and map for alert updates. Click "Normal" to reset.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
