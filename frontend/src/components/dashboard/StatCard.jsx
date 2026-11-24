import './StatCard.css';

const TREND_COLOR = { up: 'var(--critical)', down: 'var(--success)', neutral: 'var(--text-muted)' };

export default function StatCard({ icon, label, value, unit, sub, color, trend, trendLabel, delay = 0 }) {
  return (
    <div className={`stat-card animate-in animate-delay-${delay}`} style={{ '--card-color': color || 'var(--accent)' }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-body">
        <div className="stat-label">{label}</div>
        <div className="stat-value">
          {value}
          {unit && <span className="stat-unit">{unit}</span>}
        </div>
        {sub && <div className="stat-sub">{sub}</div>}
        {trend && (
          <div className="stat-trend" style={{ color: TREND_COLOR[trend] }}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendLabel}
          </div>
        )}
      </div>
      <div className="stat-glow" />
    </div>
  );
}
