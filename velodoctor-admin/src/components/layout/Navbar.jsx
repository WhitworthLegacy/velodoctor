import { Truck, Wrench, Shield } from 'lucide-react';

export default function Navbar() {
  return (
    <nav style={{ 
      height: 'var(--header-height)', 
      background: 'var(--white)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      {/* LOGO - Style conforme à la charte (Poppins, Italique, Gras) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          background: 'var(--dark)', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          {/* Éclair symbolique du logo */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        </div>
        <span style={{ 
          fontFamily: 'Poppins', 
          fontWeight: 800, 
          fontSize: '20px', 
          fontStyle: 'italic',
          color: 'var(--dark)',
          letterSpacing: '-0.5px'
        }}>
          VELODOCTOR
        </span>
      </div>


    </nav>
  );
}