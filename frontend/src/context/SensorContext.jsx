import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import client from '../api/client';

const SensorContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export function SensorProvider({ children }) {
  const [sensorState, setSensorState] = useState(null);
  const [properties, setProperties] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);

  // Initial data fetch
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [sensorRes, propsRes, alertsRes] = await Promise.all([
          client.get('/sensors/current'),
          client.get('/properties'),
          client.get('/alerts'),
        ]);
        setSensorState(sensorRes.data);
        setProperties(propsRes.data.properties || []);
        setAlerts(alertsRes.data.alerts || []);
      } catch {
        // Not logged in yet, ignore
      }
    };
    fetchInitial();
  }, []);

  // Socket.io connection
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('sensor_update', (data) => {
      setSensorState(data);
    });

    socket.on('property_update', (updated) => {
      setProperties(updated);
    });

    socket.on('new_alert', (alert) => {
      setAlerts((prev) => [alert, ...prev]);
      setNotifications((prev) => [
        { ...alert, read: false, notifId: `n_${Date.now()}` },
        ...prev,
      ]);
      setUnreadCount((c) => c + 1);
    });

    socket.on('alert_resolved', ({ alertId }) => {
      setAlerts((prev) =>
        prev.map((a) => a.id === alertId ? { ...a, status: 'resolved' } : a)
      );
    });

    return () => socket.disconnect();
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const refreshData = async () => {
    try {
      const [sensorRes, propsRes, alertsRes] = await Promise.all([
        client.get('/sensors/current'),
        client.get('/properties'),
        client.get('/alerts'),
      ]);
      setSensorState(sensorRes.data);
      setProperties(propsRes.data.properties || []);
      setAlerts(alertsRes.data.alerts || []);
    } catch { /* ignore */ }
  };

  return (
    <SensorContext.Provider
      value={{
        sensorState,
        properties,
        alerts,
        notifications,
        unreadCount,
        markAllRead,
        refreshData,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
}

export function useSensor() {
  return useContext(SensorContext);
}
