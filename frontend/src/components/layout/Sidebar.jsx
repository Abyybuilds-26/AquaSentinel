import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const OWNER_NAV = [
  { path: '/owner/dashboard',  label: 'Dashboard',   icon: '⚡' },
  { path: '/owner/monitoring', label: 'Monitoring',   icon: '📡' },
  { path: '/owner/alerts',     label: 'Alerts',       icon: '🔔' },
  { path: '/owner/analytics',  label: 'Analytics',    icon: '📊' },
  { path: '/map',              label: 'Property Map', icon: '🗺️' },
];

const RESIDENT_NAV = [
  { path: '/resident/dashboard', label: 'My Usage',   icon: '💧' },
  { path: '/map',                label: 'Map',         icon: '🗺️' },
];

const ADMIN_NAV = [
  { path: '/map', label: 'All Properties', icon: '🗺️' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems =
    user?.role === 'owner'    ? OWNER_NAV :
    user?.role === 'resident' ? RESIDENT_NAV : ADMIN_NAV;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">💧</div>
        <div>
          <div className="sidebar-logo-name">AquaSentinel</div>
          <div className="sidebar-logo-tagline">Smart Water Monitor</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">Navigation</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User card */}
      <div className="sidebar-user">
        <div className="sidebar-avatar">{user?.avatar || '?'}</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user?.name}</div>
          <div className="sidebar-user-role">{user?.role}</div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout} title="Logout">
          ⬡
        </button>
      </div>
    </aside>
  );
}
