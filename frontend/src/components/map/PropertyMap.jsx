import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

// Fix leaflet default icons in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Create SVG circle marker icons for each status
function createStatusIcon(status) {
  const colors = {
    normal:   { fill: '#10b981', glow: '#10b98166' },
    warning:  { fill: '#f59e0b', glow: '#f59e0b66' },
    critical: { fill: '#ef4444', glow: '#ef444466' },
    offline:  { fill: '#6b7280', glow: '#6b728066' },
  };
  const { fill, glow } = colors[status] || colors.normal;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <defs>
        <filter id="glow-${status}">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <circle cx="18" cy="18" r="14" fill="${glow}" />
      <circle cx="18" cy="18" r="10" fill="${fill}" filter="url(#glow-${status})" />
      <circle cx="18" cy="18" r="5" fill="white" opacity="0.9" />
      <path d="M18 32 L14 24 Q18 28 22 24 Z" fill="${fill}" />
    </svg>`;

  return L.divIcon({
    className: '',
    html: svg,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
  });
}

const STATUS_EMOJI = { normal: '🟢', warning: '🟡', critical: '🔴', offline: '⚫' };

function FlyToCenter({ properties }) {
  const map = useMap();
  useEffect(() => {
    if (properties.length > 0) {
      const avgLat = properties.reduce((s, p) => s + p.latitude, 0) / properties.length;
      const avgLng = properties.reduce((s, p) => s + p.longitude, 0) / properties.length;
      map.setView([avgLat, avgLng], 14);
    }
  }, []); // eslint-disable-line
  return null;
}

export default function PropertyMap({ properties = [] }) {
  const navigate = useNavigate();

  const center = properties.length > 0
    ? [properties[0].latitude, properties[0].longitude]
    : [12.8698, 74.8431];

  const TYPE_LABELS = {
    LEAK: 'Possible Leak', OVERFLOW: 'Tank Overflow',
    HIGH_USAGE: 'High Usage', LOW_TANK: 'Low Tank', SENSOR_OFFLINE: 'Sensor Offline',
  };

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: '100%', width: '100%', minHeight: 500, borderRadius: 'var(--radius-lg)' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToCenter properties={properties} />

      {properties.map((prop) => (
        <Marker
          key={prop.id}
          position={[prop.latitude, prop.longitude]}
          icon={createStatusIcon(prop.status)}
        >
          <Popup minWidth={240}>
            <div style={{ fontFamily: 'Inter, sans-serif', padding: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{STATUS_EMOJI[prop.status] || '🟢'}</span>
                <strong style={{ fontSize: 15, color: 'var(--text-primary)' }}>{prop.name}</strong>
              </div>

              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                📍 {prop.address}, {prop.city}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', marginBottom: 12 }}>
                {[
                  ['Tank Level', `${prop.tankLevel ?? '—'}%`],
                  ["Today's Usage", `${prop.todayUsage ?? '—'} L`],
                  ['Active Alerts', prop.activeAlerts ?? 0],
                  ['Status', prop.status.charAt(0).toUpperCase() + prop.status.slice(1)],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{v}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => navigate('/owner/dashboard')}
                  style={{
                    flex: 1, padding: '7px 12px', background: '#06b6d4', color: '#000',
                    border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer',
                  }}
                >
                  View Dashboard
                </button>
                {prop.activeAlerts > 0 && (
                  <button
                    onClick={() => navigate('/owner/alerts')}
                    style={{
                      flex: 1, padding: '7px 12px', background: '#ef444422', color: '#ef4444',
                      border: '1px solid #ef444444', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer',
                    }}
                  >
                    View Alerts
                  </button>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
