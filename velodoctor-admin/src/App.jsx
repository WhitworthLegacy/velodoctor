import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { queryClient } from './lib/queryClient';
import { useAuth } from './lib/hooks/useAuth';
import { ROLES } from './lib/constants';

import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import Login from './modules/auth/Login';

import LogisticsDashboard from './modules/logistics/LogisticsDashboard';
import WorkshopDashboard from './modules/workshop/WorkshopDashboard';
import InterventionDetail from './modules/workshop/InterventionDetail';
import ClientList from './modules/admin/ClientList';
import PlanningDashboard from './modules/planning/PlanningDashboard';
import PipelineBoard from './modules/crm/PipelineBoard';
import InventoryDashboard from './modules/inventory/InventoryDashboard';

function AppContent() {
  const { session, userRole, loading, error, retry, logout } = useAuth();

  const HomeRedirect = () => {
    if (!userRole) return <Navigate to="/crm" replace />;

    switch(userRole) {
      case ROLES.DRIVER: return <Navigate to="/logistics" replace />;
      case ROLES.TECH: return <Navigate to="/workshop" replace />;
      default: return <Navigate to="/crm" replace />;
    }
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        padding: '20px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #E5E7EB',
          borderTop: '3px solid #00ACC2',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{ color: '#00ACC2', fontSize: '16px' }}>Connexion en cours...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px' }}>⚠️</div>
        <div style={{ color: '#DC2626', fontSize: '16px', maxWidth: '300px' }}>{error}</div>
        <button
          onClick={retry}
          style={{
            background: '#00ACC2',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <Navbar />

        <div style={{ position: 'fixed', top: '15px', right: '20px', zIndex: 101 }}>
          <button
            onClick={logout}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
          >
            DECONNEXION
          </button>
        </div>

        <div style={{ paddingBottom: '80px' }}>
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/logistics" element={<LogisticsDashboard />} />
            <Route path="/crm" element={<PipelineBoard />} />
            <Route path="/workshop" element={<WorkshopDashboard />} />
            <Route path="/workshop/:id" element={<InterventionDetail />} />
            <Route path="/admin" element={<ClientList />} />
            <Route path="/planning" element={<PlanningDashboard />} />
            <Route path="/inventory" element={<InventoryDashboard />} />
            <Route path="*" element={<HomeRedirect />} />
          </Routes>
        </div>

        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
