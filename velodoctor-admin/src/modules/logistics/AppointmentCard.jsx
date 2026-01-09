import { MapPin, Clock, Truck, User, Phone } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

// On reçoit "onUpdate" en plus de "appointment"
export default function AppointmentCard({ appointment, onUpdate }) {
  
  const time = new Date(appointment.scheduled_at).toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit'
  });

  const clientName = appointment.clients?.full_name || 'Client inconnu';
  const clientPhone = appointment.clients?.phone || '';
  const vehicleName = appointment.vehicles 
    ? `${appointment.vehicles.brand} ${appointment.vehicles.model}` 
    : 'Véhicule non spécifié';
  const address = appointment.address || appointment.clients?.address;

  // Logique intelligente du bouton
  const isDone = appointment.status === 'done';
  const isPickup = appointment.type === 'pickup';

  return (
    <Card>
      {/* En-tête */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '18px' }}>
          <Clock size={18} color="var(--primary)" />
          {time}
        </div>
        <Badge status={appointment.status} />
      </div>

      {/* Info Client */}
      <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <User size={16} color="var(--gray)" />
        <span style={{ fontWeight: 500 }}>{clientName}</span>
        {/* Petit lien pour appeler direct sur mobile */}
        {clientPhone && (
          <a href={`tel:${clientPhone}`} style={{ color: 'var(--primary)', marginLeft: 'auto' }}>
            <Phone size={18} />
          </a>
        )}
      </div>

      {/* Info Véhicule */}
      <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--dark)' }}>
        <Truck size={16} color="var(--gray)" />
        <span>{vehicleName}</span>
      </div>

      {/* Adresse */}
      <div style={{ 
        display: 'flex', gap: '8px', fontSize: '14px', color: 'var(--gray)', 
        background: '#f8f9fa', padding: '8px', borderRadius: '8px', marginBottom: '12px'
      }}>
        <MapPin size={16} style={{ minWidth: '16px' }} />
        {address}
      </div>

      {/* Bouton d'action - Caché si déjà terminé */}
      {!isDone && (
        <div style={{ marginTop: '10px' }}>
          <Button 
            variant={isPickup ? "primary" : "secondary"}
            onClick={() => {
                // Au clic, on appelle le chef pour dire "C'est fait !"
                if(confirm('Confirmer cette action ?')) {
                    onUpdate(appointment.id, 'done', appointment);
                }
            }}
          >
             {isPickup ? 'Récupérer le véhicule' : 'Livrer au client'}
          </Button>
        </div>
      )}
    </Card>
  );
}