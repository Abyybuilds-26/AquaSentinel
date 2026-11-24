import { useEffect, useState } from 'react';
import { useSensor } from '../../context/SensorContext';
import StatCard from '../../components/dashboard/StatCard';
import UsageChart from '../../components/dashboard/UsageChart';
import AlertFeed from '../../components/dashboard/AlertFeed';
import client from '../../api/client';
import './Dashboard.css';

export default function OwnerDashboard() {
  const { sensorState, alerts } = useSensor();
  const [dailyData, setDailyData] = useState([]);

  useEffect(() => {
    client.get('/analytics/daily').then((res) => setDailyData(res.data.data || []));
  }, []);

  const sensor = sensorState || {};
  const activeAlerts = alerts.filter((a) => a.status === 'active');

  const tankColor =
    (sensor.tankLevel || 0) >= 95 ? 'var(--critical)' :
    (sensor.tankLevel || 0) <= 20 ? 'var(--warning)' :
    'var(--accent)';

  const flowColor = sensor.leakDetected ? 'var(--critical)' : 'var(--accent)';

  return (
    <div className="page-content">
      {/* Header */}
      <div className="animate-in">
        <div className="page-title">Owner Dashboard</div>
        <p className="page-desc">Real-time overview of Green Valley PG water system</p>
      </div>

      {/* Stat Cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <StatCard
          icon="💧" label="Today's Usage"
          value={sensor.todayUsageLiters?.toLocaleString() || '1,240'} unit="L"
          sub="Monitoring active" color="var(--accent)" delay={1}
        />
        <StatCard
          icon="🏗️" label="Tank Level"
          value={sensor.tankLevel ?? 72} unit="%"
          sub={sensor.tankLevel >= 95 ? '⚠️ Near overflow' : sensor.tankLevel <= 20 ? '⚠️ Critically low' : 'Normal range'}
          color={tankColor} delay={2}
        />
        <StatCard
          icon="🌊" label="Flow Rate"
          value={sensor.flowRate ?? 4.2} unit="L/min"
          sub={sensor.leakDetected ? '🔴 Leak detected!' : 'Normal flow'}
          color={flowColor} delay={3}
        />
        <StatCard
          icon="🔔" label="Active Alerts"
          value={activeAlerts.length || sensor.activeAlertCount || 0}
          sub={activeAlerts.length > 0 ? 'Requires attention' : 'All systems normal'}
          color={activeAlerts.length > 0 ? 'var(--critical)' : 'var(--success)'} delay={4}
        />
        <StatCard
          icon="💰" label="Est. Cost Today"
          value={`₹${sensor.estimatedCostRs ?? 49.6}`}
          sub="@ ₹0.04 per litre" color="var(--warning)" delay={5}
        />
        <StatCard
          icon="🌱" label="Water Saved"
          value={sensor.waterSavedLiters?.toLocaleString() ?? '260'} unit="L"
          sub="vs. 1500L baseline" color="var(--success)" delay={6}
        />
        <div className="card animate-in animate-delay-5" style={{ gridColumn: 'span 2' }}>
          <div className="sensor-strip">
            {[
              { label: 'Leak Sensor', val: sensor.leakDetected ? 'DETECTED' : 'NORMAL', ok: !sensor.leakDetected },
              { label: 'Overflow', val: sensor.overflowDetected ? 'DETECTED' : 'NORMAL', ok: !sensor.overflowDetected },
              { label: 'Connection', val: sensor.connectionStatus === 'offline' ? 'OFFLINE' : 'ONLINE', ok: sensor.connectionStatus !== 'offline' },
            ].map((s) => (
              <div key={s.label} className="sensor-strip-item">
                <div className="sensor-strip-dot" style={{ background: s.ok ? 'var(--success)' : 'var(--critical)' }} />
                <div>
                  <div className="sensor-strip-label">{s.label}</div>
                  <div className="sensor-strip-val" style={{ color: s.ok ? 'var(--success)' : 'var(--critical)' }}>{s.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts + Alerts */}
      <div className="grid-2">
        <div className="card animate-in animate-delay-3">
          <div className="section-header">
            <div>
              <div className="section-title">7-Day Usage</div>
              <div className="section-subtitle">Water consumption trend</div>
            </div>
          </div>
          <UsageChart data={dailyData} />
        </div>

        <div className="card animate-in animate-delay-4">
          <div className="section-header">
            <div>
              <div className="section-title">Recent Alerts</div>
              <div className="section-subtitle">Latest system notifications</div>
            </div>
          </div>
          <AlertFeed alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
