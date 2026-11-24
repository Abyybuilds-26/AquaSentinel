import { useEffect, useState } from 'react';
import client from '../../api/client';
import { DailyBarChart, HourlyLineChart } from '../../components/analytics/AnalyticsCharts';

export default function Analytics() {
  const [daily, setDaily] = useState({ data: [], stats: {} });
  const [hourly, setHourly] = useState([]);
  const [tab, setTab] = useState('daily');

  useEffect(() => {
    Promise.all([
      client.get('/analytics/daily'),
      client.get('/analytics/hourly'),
    ]).then(([d, h]) => {
      setDaily(d.data);
      setHourly(h.data.data || []);
    });
  }, []);

  const stats = daily.stats || {};

  return (
    <div className="page-content">
      <div className="animate-in">
        <div className="page-title">Analytics</div>
        <p className="page-desc">Water usage trends and consumption statistics</p>
      </div>

      {/* Summary stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total (7 days)', val: `${stats.total?.toLocaleString() || '—'} L`, icon: '📊', color: 'var(--accent)' },
          { label: 'Daily Average', val: `${stats.avg || '—'} L`, icon: '📈', color: 'var(--accent)' },
          { label: 'Highest Day', val: `${stats.highest || '—'} L`, icon: '⬆️', color: 'var(--critical)' },
          { label: 'Lowest Day',  val: `${stats.lowest || '—'} L`, icon: '⬇️', color: 'var(--success)' },
        ].map((s, i) => (
          <div key={s.label} className={`card card-sm animate-in animate-delay-${i + 1}`}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart tabs */}
      <div className="card animate-in animate-delay-2">
        <div className="section-header">
          <div className="section-title">Usage Charts</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['daily', 'hourly'].map((t) => (
              <button
                key={t}
                id={`analytics-tab-${t}`}
                className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setTab(t)}
              >
                {t === 'daily' ? '📅 7-Day' : '⏱️ Hourly (Today)'}
              </button>
            ))}
          </div>
        </div>

        {tab === 'daily' ? (
          <>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>
              Water consumption over the last 7 days (litres)
            </div>
            <DailyBarChart data={daily.data || []} />
          </>
        ) : (
          <>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>
              Hourly water consumption for today (litres)
            </div>
            <HourlyLineChart data={hourly} />
          </>
        )}
      </div>
    </div>
  );
}
