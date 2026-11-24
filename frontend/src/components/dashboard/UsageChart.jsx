import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-bright)',
        borderRadius: 8,
        padding: '8px 14px',
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{label}</p>
        <p style={{ color: 'var(--accent)', fontSize: 16, fontWeight: 700 }}>
          {payload[0].value} L
        </p>
      </div>
    );
  }
  return null;
};

export default function UsageChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="usageGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.08)" />
        <XAxis
          dataKey="day"
          tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}L`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="usage"
          stroke="#06b6d4"
          strokeWidth={2.5}
          fill="url(#usageGrad)"
          dot={{ fill: '#06b6d4', strokeWidth: 0, r: 4 }}
          activeDot={{ r: 6, fill: '#22d3ee' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
