import { useState } from 'react';
import { useSensor } from '../../context/SensorContext';
import './NotificationPanel.css';

const SEVERITY_ICON = {
  critical: '🔴',
  warning:  '🟡',
  info:     '🔵',
};

const TYPE_LABELS = {
  LEAK:          'Possible Leak',
  OVERFLOW:      'Tank Overflow',
  HIGH_USAGE:    'High Usage',
  LOW_TANK:      'Low Tank Level',
  SENSOR_OFFLINE:'Sensor Offline',
};

export default function NotificationPanel({ onClose }) {
  const { notifications, markAllRead } = useSensor();

  const handleMarkAll = () => markAllRead();

  return (
    <div className="notif-panel">
      <div className="notif-header">
        <span className="notif-title">Notifications</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={handleMarkAll}>
            Mark all read
          </button>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="notif-list">
        {notifications.length === 0 ? (
          <div className="notif-empty">
            <span>✅</span>
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.notifId} className={`notif-item ${n.read ? 'read' : 'unread'}`}>
              <div className="notif-icon">{SEVERITY_ICON[n.severity] || '🔵'}</div>
              <div className="notif-body">
                <div className="notif-type">{TYPE_LABELS[n.type] || n.type}</div>
                <div className="notif-msg">{n.message}</div>
                {n.estimatedWasteLiters > 0 && (
                  <div className="notif-waste">
                    Estimated waste: <strong>{n.estimatedWasteLiters} L</strong>
                  </div>
                )}
                <div className="notif-time">
                  {new Date(n.createdAt).toLocaleTimeString()}
                </div>
              </div>
              {!n.read && <div className="notif-dot" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
