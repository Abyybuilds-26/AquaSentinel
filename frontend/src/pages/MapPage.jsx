import { useSensor } from '../context/SensorContext';
import PropertyMap from '../components/map/PropertyMap';
import './MapPage.css';

const STATUS_COUNTS = (properties) => ({
  normal:   properties.filter((p) => p.status === 'normal').length,
  warning:  properties.filter((p) => p.status === 'warning').length,
  critical: properties.filter((p) => p.status === 'critical').length,
  offline:  properties.filter((p) => p.status === 'offline').length,
});

export default function MapPage() {
  const { properties } = useSensor();
  const counts = STATUS_COUNTS(properties);

  return (
    <div className="page-content" style={{ maxWidth: '100%', paddingRight: 32 }}>
      <div className="animate-in">
        <div className="page-title">Property Map</div>
        <p className="page-desc">Geographic view of all monitored properties — click markers for details</p>
      </div>

      {/* Status summary */}
      <div className="map-status-bar animate-in animate-delay-1">
        <div className="map-status-total">
          <span className="map-status-num">{properties.length}</span>
          <span className="map-status-label">Total Properties</span>
        </div>
        <div className="map-status-divider" />
        {[
          { key: 'normal',   label: 'Normal',   icon: '🟢', color: 'var(--success)' },
          { key: 'warning',  label: 'Warning',  icon: '🟡', color: 'var(--warning)' },
          { key: 'critical', label: 'Critical', icon: '🔴', color: 'var(--critical)' },
          { key: 'offline',  label: 'Offline',  icon: '⚫', color: 'var(--offline)' },
        ].map((s) => (
          <div key={s.key} className="map-status-item">
            <span>{s.icon}</span>
            <span style={{ color: s.color, fontWeight: 700, fontSize: 18 }}>{counts[s.key]}</span>
            <span className="map-status-item-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="map-container animate-in animate-delay-2">
        <PropertyMap properties={properties} />
      </div>

      {/* Legend */}
      <div className="map-legend animate-in animate-delay-3">
        <div className="map-legend-title">Map Legend</div>
        {[
          { icon: '🟢', label: 'Normal — All systems operational' },
          { icon: '🟡', label: 'Warning — High usage or low tank' },
          { icon: '🔴', label: 'Critical — Leak or overflow detected' },
          { icon: '⚫', label: 'Offline — Sensor not responding' },
        ].map((l) => (
          <div key={l.label} className="map-legend-item">
            <span>{l.icon}</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
