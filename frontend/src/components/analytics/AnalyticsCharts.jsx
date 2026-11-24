import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const DarkTooltip = ({ active, payload, label, unit = 'L' }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border-bright)',
        borderRadius: 8, padding: '8px 14px',
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{label}</p>
        <p style={{ color: 'var(--accent)', fontSize: 16, fontWeight: 700 }}>
          {payload[0].value} {unit}
        </p>
      </div>
    );
  }
  return null;
};

export function DailyBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.08)" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}L`} />
        <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(6,182,212,0.08)' }} />
        <Bar dataKey="usage" fill="#06b6d4" radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function HourlyLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.08)" />
        <XAxis dataKey="hour" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} interval={3} />
        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}L`} />
        <Tooltip content={<DarkTooltip />} />
        <Line
          type="monotone" dataKey="usage" stroke="#f59e0b" strokeWidth={2.5}
          dot={false} activeDot={{ r: 5, fill: '#fbbf24' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
