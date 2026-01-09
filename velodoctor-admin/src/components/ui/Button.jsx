export default function Button({ children, onClick, variant = 'primary', style = {} }) {
  const baseStyle = {
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'opacity 0.2s',
  };

  const variants = {
    primary: {
      background: 'var(--primary)',
      color: 'white',
    },
    secondary: {
      background: 'var(--secondary)',
      color: 'white',
    },
    outline: {
      background: 'transparent',
      border: '2px solid var(--primary)',
      color: 'var(--primary)',
    }
  };

  return (
    <button 
      onClick={onClick} 
      style={{ ...baseStyle, ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
}