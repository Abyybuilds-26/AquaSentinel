import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSensor } from '../../context/SensorContext';
import NotificationPanel from '../common/NotificationPanel';
import './TopBar.css';

const ROUTE_TITLES = {
  '/owner/dashboard':  { title: 'Dashboard',      subtitle: 'Real-time water monitoring overview' },
  '/owner/monitoring': { title: 'Monitoring',      subtitle: 'Live sensor data & simulation controls' },
  '/owner/alerts':     { title: 'Alerts',          subtitle: 'Active and historical alerts' },
  '/owner/analytics':  { title: 'Analytics',       subtitle: 'Water usage trends and statistics' },
  '/map':              { title: 'Property Map',    subtitle: 'Geographic view of all monitored properties' },
  '/resident/dashboard': { title: 'My Usage',      subtitle: 'Your personal water consumption' },
};

export default function TopBar() {
  const { pathname } = useLocation();
  const { unreadCount } = useSensor();
  const [showNotifs, setShowNotifs] = useState(false);

  const { title, subtitle } = ROUTE_TITLES[pathname] || { title: 'AquaSentinel', subtitle: '' };

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <h1 className="topbar-title">{title}</h1>
          {subtitle && <span className="topbar-subtitle">{subtitle}</span>}
        </div>

        <div className="topbar-right">
          {/* Live indicator */}
          <div className="topbar-live">
            <span className="live-dot" />
            Live
          </div>

          {/* Notification bell */}
          <button
            id="notif-bell"
            className={`topbar-notif-btn ${unreadCount > 0 ? 'has-unread' : ''}`}
            onClick={() => setShowNotifs((v) => !v)}
            aria-label="Notifications"
          >
            🔔
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {/* Time */}
          <div className="topbar-time">
            {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </header>

      {showNotifs && (
        <NotificationPanel onClose={() => setShowNotifs(false)} />
      )}
    </>
  );
}
