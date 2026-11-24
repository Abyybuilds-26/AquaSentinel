import { useEffect, useState } from 'react';
import client from '../../api/client';
import { DailyBarChart } from '../../components/analytics/AnalyticsCharts';

export default function ResidentDashboard() {
  const [usage, setUsage] = useState(null);
  const [tab, setTab] = useState('daily');

  useEffect(() => {
    client.get('/analytics/resident').then((res) => setUsage(res.data.data));
  }, []);

  if (!usage) return <div className="page-content" style={{ color: 'var(--text-muted)' }}>Loading...</div>;

  const weeklyChartData = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => ({
    day,
    usage: usage.dailyHistory?.[i] || 0,
  }));

  const vsAvg = usage.today - usage.pgAverage;
  const vsColor = vsAvg <= 0 ? 'var(--success)' : 'var(--warning)';

  return (
    <div className="page-content">
      <div className="animate-in">
        <div className="page-title">My Water Usage</div>
        <p className="page-desc">Your personal consumption vs. PG average</p>
      </div>

      {/* Today comparison */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="card animate-in animate-delay-1">
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Your Usage Today</div>
          <div style={{ fontSize: 40, fontWeight: 900, color: 'var(--accent)' }}>{usage.today} <span style={{ fontSize: 18, fontWeight: 500, color: 'var(--text-secondary)' }}>L</span></div>
          <div style={{ marginTop: 12, fontSize: 13, color: vsColor }}>
            {vsAvg <= 0 ? `✅ ${Math.abs(vsAvg)} L below` : `⚠️ ${vsAvg} L above`} PG average
          </div>
        </div>
        <div className="card animate-in animate-delay-2">
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>PG Average Today</div>
          <div style={{ fontSize: 40, fontWeight: 900, color: 'var(--text-secondary)' }}>{usage.pgAverage} <span style={{ fontSize: 18, fontWeight: 500 }}>L</span></div>
          <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-muted)' }}>Average across all residents</div>
        </div>
        <div className="card animate-in animate-delay-3">
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Weekly Average</div>
          <div style={{ fontSize: 40, fontWeight: 900, color: 'var(--accent)' }}>{usage.weeklyAvg} <span style={{ fontSize: 18, fontWeight: 500, color: 'var(--text-secondary)' }}>L/day</span></div>
          <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-muted)' }}>Last 7 days average</div>
        </div>
      </div>

      {/* Visual comparison bar */}
      <div className="card animate-in animate-delay-2" style={{ marginBottom: 24 }}>
        <div className="section-title" style={{ marginBottom: 16 }}>Usage Comparison</div>
        {[
          { label: 'Your Usage Today', val: usage.today, max: 80, color: 'var(--accent)' },
          { label: 'PG Average', val: usage.pgAverage, max: 80, color: 'var(--text-muted)' },
        ].map((bar) => (
          <div key={bar.label} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{bar.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: bar.color }}>{bar.val} L</span>
            </div>
            <div style={{ height: 10, background: 'var(--bg-base)', borderRadius: 99, border: '1px solid var(--border)' }}>
              <div style={{
                height: '100%', borderRadius: 99,
                width: `${(bar.val / bar.max) * 100}%`,
                background: bar.color,
                transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
              }} />
            </div>
          </div>
        ))}
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, fontStyle: 'italic' }}>
          ℹ️ Usage data is informational. No rankings or comparisons between residents are shown.
        </div>
      </div>

      {/* Weekly chart */}
      <div className="card animate-in animate-delay-3">
        <div className="section-header">
          <div className="section-title">Your 7-Day Usage</div>
        </div>
        <DailyBarChart data={weeklyChartData} />
      </div>
    </div>
  );
}
