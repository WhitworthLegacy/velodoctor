import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { ROLES } from './lib/constants';
import { fetchUserRole } from './lib/adminApi';
import InventoryDashboard from './modules/inventory/InventoryDashboard'; // AJOUT

// Layouts & Pages
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import Login from './modules/auth/Login';

// Modules
import LogisticsDashboard from './modules/logistics/LogisticsDashboard';
import WorkshopDashboard from './modules/workshop/WorkshopDashboard';
import InterventionDetail from './modules/workshop/InterventionDetail';
import ClientList from './modules/admin/ClientList';
import PlanningDashboard from './modules/planning/PlanningDashboard';
import PipelineBoard from './modules/crm/PipelineBoard';

function App() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null); // Stocke le rôle
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.supabase = supabase;
    // 1. Récupérer session + rôle
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (import.meta.env.DEV) {
          console.info('[auth] session fetched', { hasSession: Boolean(session) });
        }
        setSession(session);
        if (session) {
          await resolveUserRole();
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('[auth] session fetch failed', error);
        setLoading(false);
      }
    };

    getSession();

    // 2. Écouteur de changement
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (import.meta.env.DEV) {
        console.info('[auth] auth state changed', { hasSession: Boolean(session) });
      }
      setSession(session);
      if (session) {
        await resolveUserRole();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fonction pour récupérer le rôle dans la table 'profiles' (si elle existe)
  // Sinon on peut définir des rôles basés sur l'email pour le MVP
  async function resolveUserRole() {
    try {
      const role = await fetchUserRole();
      if (import.meta.env.DEV) {
        console.info('[auth] role resolved', { role: role || null });
      }
      setUserRole(role || null);
    } catch (e) {
      console.error(e);
      const status = e?.status;
      if (status === 401 || status === 403) {
        await supabase.auth.signOut();
        setSession(null);
      }
    } finally {
      setLoading(false);
    }
  }

  // Composant de Redirection Accueil
  const HomeRedirect = () => {
    if (!userRole) return <Navigate to="/crm" replace />;
    
    switch(userRole) {
      case ROLES.DRIVER: return <Navigate to="/logistics" replace />;
      case ROLES.TECH: return <Navigate to="/workshop" replace />;
      default: return <Navigate to="/crm" replace />; // Admin -> CRM
    }
  };

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00ACC2' }}>Chargement...</div>;
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
                onClick={() => supabase.auth.signOut()}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
             >
                DECONNEXION
             </button>
        </div>

        <div style={{ paddingBottom: '80px' }}> 
          <Routes>
            {/* 👇 La racine redirige intelligemment */}
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

export default App;
