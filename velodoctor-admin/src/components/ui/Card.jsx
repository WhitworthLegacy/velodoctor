export default function Card({ children, onClick, className = '' }) {
  const cardStyle = {
    background: 'var(--white)',
    borderRadius: 'var(--radius)',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    marginBottom: '12px',
    border: '1px solid #eee',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.2s ease',
  };

  return (
    <div 
      style={cardStyle} 
      className={className}
      onClick={onClick}
      // Petit effet visuel si la carte est cliquable
      onMouseEnter={(e) => onClick && (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={(e) => onClick && (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {children}
    </div>
  );
}