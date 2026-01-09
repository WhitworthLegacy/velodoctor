import { NavLink } from 'react-router-dom';
import { Truck, Wrench, Calendar, Kanban, Users, Package } from 'lucide-react'; // Ajout de l'icône Users

export default function BottomNav() {
  const navStyle = {
    height: 'var(--nav-height)',
    background: 'var(--white)',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-around', // Répartit les 5 boutons équitablement
    alignItems: 'center',
    borderTop: '1px solid #eee',
    zIndex: 100,
    paddingBottom: 'env(safe-area-inset-bottom)'
  };

  const getLinkStyle = ({ isActive }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    color: isActive ? 'var(--primary)' : 'var(--gray)',
    fontWeight: isActive ? 600 : 400,
    fontSize: '10px', // 👈 J'ai réduit un peu la police (10px) pour que 5 items passent bien
    gap: '4px',
    minWidth: '50px', // Zone de clic confortable
    textAlign: 'center'
  });

  return (
    <div style={navStyle}>
      {/* 1. Logistique */}
      <NavLink to="/logistics" style={getLinkStyle}>
        <Truck size={22} /> {/* Icônes légèrement plus petites (22px) */}
        <span>Logistique</span>
      </NavLink>

      {/* 2. Agenda */}
      <NavLink to="/planning" style={getLinkStyle}>
        <Calendar size={22} />
        <span>Agenda</span>
      </NavLink>
      
      {/* 3. CRM */}
      <NavLink to="/crm" style={getLinkStyle}>
        <Kanban size={22} />
        <span>CRM</span>
      </NavLink>

      {/* 4. Atelier */}
      <NavLink to="/workshop" style={getLinkStyle}>
        <Wrench size={22} />
        <span>Atelier</span>
      </NavLink>

      {/* 5. Clients (Réintégré) */}
      <NavLink to="/admin" style={getLinkStyle}>
        <Users size={22} />
        <span>Clients</span>
      </NavLink>

      <NavLink to="/inventory" style={getLinkStyle}>
        <Package size={22} />
        <span>Stock</span>
      </NavLink>
    </div>
  );
}