import { Wrench, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function WorkshopCard({ intervention, onUpdateStatus }) {
  const navigate = useNavigate();
  const vehicle = intervention.vehicles || {};
  const client = vehicle.clients || {}; // On récupère le client via le véhicule

  // Icone selon le type
  const isScooter = vehicle.type === 'trottinette';
  
  return (
    <Card>
      {/* En-tête : Véhicule + Badge Statut */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* On pourrait changer l'icône ici selon vélo/trottinette */}
            <Wrench size={18} color="var(--primary)" />
            {vehicle.brand} {vehicle.model}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--gray)', marginTop: '4px' }}>
            Client: {client.full_name || 'Inconnu'}
          </p>
        </div>
        <Badge status={intervention.status} />
      </div>

      {/* Note de diagnostic (Le problème) */}
      <div style={{ 
        background: '#fff4e5', // Fond orange très pâle
        borderLeft: '4px solid var(--secondary)',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '16px',
        fontSize: '14px',
        color: 'var(--dark)'
      }}>
        <div style={{ display: 'flex', gap: '6px', fontWeight: 600, marginBottom: '4px', color: 'var(--secondary)' }}>
          <AlertCircle size={16} />
          Diagnostic :
        </div>
        {intervention.diagnosis_note || "Aucune note pour le moment."}
      </div>

      {/* Actions Rapides (Simulées pour le MVP) */}
      <div style={{ display: 'flex', gap: '10px' }}>
        
        {/* Si en diagnostic -> Passer en Devis */}
        {intervention.status === 'diagnosing' && (
          <Button 
            onClick={() => onUpdateStatus(intervention.id, 'quote_sent')}
            style={{ fontSize: '14px', padding: '8px' }}
          >
            Envoyer Devis
          </Button>
        )}

        {/* Si réparé -> Terminer */}
        {intervention.status === 'repairing' && (
          <Button 
            variant="secondary"
            onClick={() => onUpdateStatus(intervention.id, 'ready')}
            style={{ fontSize: '14px', padding: '8px' }}
          >
            Terminer Réparation
          </Button>
        )}

        {/* View Detail Button */}
        <Button
            variant="outline"
            style={{ fontSize: '14px', padding: '8px' }}
            onClick={() => navigate(`/workshop/${intervention.id}`)}
        >
         <FileText size={16} /> View Details
        </Button>
      </div>
    </Card>
  );
}