import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div 
      // 1. L'action de fermeture est ici (sur le fond sombre)
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
    >
      <div 
        // 2. IMPORTANT : On empêche le clic de traverser la boîte blanche
        // Sinon, cliquer DANS le formulaire fermerait aussi la modale !
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '1000px', // On garde notre largeur confortable
          padding: '24px',
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={24} />
          </button>
        </div>

        {/* Contenu */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
            {children}
        </div>
      </div>
    </div>
  );
}