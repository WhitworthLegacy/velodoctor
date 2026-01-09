import { STATUS_COLORS, STATUS_LABELS } from '../../lib/constants';

export default function Badge({ status }) {
  // Récupère la classe couleur ou met du gris par défaut
  const colorClass = STATUS_COLORS[status] || 'bg-gray-100 text-gray-600';
  const label = STATUS_LABELS[status] || status;

  // Conversion des classes Tailwind (ex: bg-blue-100) en style CSS brut pour faire simple
  // Note: Normalement on installe Tailwind, mais ici on fait du CSS Vanilla comme demandé.
  // Je vais simuler les couleurs manuellement pour que ça marche direct.
  
  const getStyle = (status) => {
    switch (status) {
      case 'pending': return { bg: '#E5E7EB', color: '#1F2937' }; // Gris
      case 'confirmed': return { bg: '#DBEAFE', color: '#1E40AF' }; // Bleu
      case 'in_transit': 
      case 'repairing': return { bg: '#FFEDD5', color: '#9A3412' }; // Orange (Pumpkin soft)
      case 'done': 
      case 'ready': return { bg: '#D1FAE5', color: '#065F46' }; // Vert
      case 'diagnosing': return { bg: '#EDE9FE', color: '#5B21B6' }; // Violet
      case 'cancelled': return { bg: '#FEE2E2', color: '#991B1B' }; // Rouge
      default: return { bg: '#F3F4F6', color: '#374151' };
    }
  };

  const style = getStyle(status);

  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 600,
      backgroundColor: style.bg,
      color: style.color,
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }}>
      {label}
    </span>
  );
}