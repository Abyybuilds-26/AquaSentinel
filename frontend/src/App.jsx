import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SensorProvider } from './context/SensorContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import OwnerDashboard from './pages/owner/Dashboard';
import Monitoring from './pages/owner/Monitoring';
import Alerts from './pages/owner/Alerts';
import Analytics from './pages/owner/Analytics';
import ResidentDashboard from './pages/resident/Dashboard';
import MapPage from './pages/MapPage';

/** Wraps authenticated pages with the shell (sidebar + topbar) */
function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <TopBar />
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SensorProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />

            {/* Owner routes */}
            <Route
              path="/owner/dashboard"
              element={
                <ProtectedRoute roles={['owner']}>
                  <AppShell><OwnerDashboard /></AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/monitoring"
              element={
                <ProtectedRoute roles={['owner']}>
                  <AppShell><Monitoring /></AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/alerts"
              element={
                <ProtectedRoute roles={['owner']}>
                  <AppShell><Alerts /></AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/analytics"
              element={
                <ProtectedRoute roles={['owner']}>
                  <AppShell><Analytics /></AppShell>
                </ProtectedRoute>
              }
            />

            {/* Resident routes */}
            <Route
              path="/resident/dashboard"
              element={
                <ProtectedRoute roles={['resident']}>
                  <AppShell><ResidentDashboard /></AppShell>
                </ProtectedRoute>
              }
            />

            {/* Shared: Map (owner + admin) */}
            <Route
              path="/map"
              element={
                <ProtectedRoute roles={['owner', 'admin']}>
                  <AppShell><MapPage /></AppShell>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SensorProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
