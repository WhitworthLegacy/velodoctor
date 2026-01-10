import { useEffect, useState } from 'react';
import { Users, Phone, Mail, MapPin, Search } from 'lucide-react';
import Card from '../../components/ui/Card';
import AdminDetailsModal from '../../components/admin/AdminDetailsModal';
import { deleteAppointmentById, isAdminRole } from '../../lib/adminApi';
import { apiFetch } from '../../lib/apiClient';

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [clientAppointments, setClientAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchAdminStatus();
  }, []);

  async function fetchClients() {
    try {
      const payload = await apiFetch('/api/admin/clients');
      setClients(payload.clients || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAdminStatus() {
    const admin = await isAdminRole();
    setIsAdmin(admin);
  }

  async function loadClientAppointments(clientId) {
    setAppointmentsLoading(true);
    try {
      const payload = await apiFetch(`/api/admin/clients/${clientId}/appointments`);
      setClientAppointments(payload.appointments || []);
    } catch (error) {
      console.error(error);
      setClientAppointments([]);
    }
    setAppointmentsLoading(false);
  }

  const handleOpenDetails = (client) => {
    setSelectedClient(client);
    setDetailsOpen(true);
    loadClientAppointments(client.id);
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!confirm('Supprimer ce rendez-vous ?')) return;
    try {
      await deleteAppointmentById(appointmentId);
      setClientAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId));
    } catch (deleteError) {
      console.error(deleteError);
      alert('Suppression impossible.');
    }
  };

  const appointmentList = appointmentsLoading
    ? 'Chargement...'
    : clientAppointments.length === 0
      ? '—'
      : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {clientAppointments.map((apt) => (
            <div key={apt.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{formatDateTime(apt.scheduled_at)}</div>
                <div style={{ fontSize: '12px', color: 'var(--gray)' }}>
                  {apt.service_type} · {apt.status}
                </div>
              </div>
              {isAdmin && (
                <button
                  onClick={() => handleDeleteAppointment(apt.id)}
                  style={{
                    border: '1px solid #ef4444',
                    color: '#ef4444',
                    background: 'transparent',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Supprimer
                </button>
              )}
            </div>
          ))}
        </div>
      );

  // Filtrage dynamique selon la recherche
  const filteredClients = clients.filter(client => 
    client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm)
  );

  return (
    <div className="container">
      <header style={{ marginBottom: '20px' }}>
        <h1>👥 Clients</h1>
        
        {/* Barre de recherche */}
        <div style={{ position: 'relative', marginTop: '10px' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--gray)' }} />
          <input 
            type="text" 
            placeholder="Rechercher un nom ou un numéro..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px' }} // Espace pour l'icône
          />
        </div>
      </header>

      {loading ? <p>Chargement...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredClients.length === 0 ? (
            <p>Aucun client trouvé.</p>
          ) : (
            filteredClients.map((client) => (
              <Card key={client.id} onClick={() => handleOpenDetails(client)}>
                {/* Nom */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ 
                    background: 'var(--primary)', 
                    color: 'white', 
                    width: '40px', height: '40px', 
                    borderRadius: '50%', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {client.full_name.charAt(0)}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>{client.full_name}</h3>
                </div>

                {/* Coordonnées */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--dark)' }}>
                  
                  {/* Téléphone (Cliquable sur mobile) */}
                  {client.phone && (
                    <a href={`tel:${client.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                      <Phone size={16} color="var(--secondary)" />
                      {client.phone}
                    </a>
                  )}

                  {/* Email */}
                  {client.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={16} color="var(--gray)" />
                      {client.email}
                    </div>
                  )}

                  {/* Adresse */}
                  {client.address && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} color="var(--gray)" />
                      {client.address}
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      <AdminDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title="Détails client"
        sections={[
          { label: 'Nom', value: selectedClient?.full_name },
          { label: 'Téléphone', value: selectedClient?.phone },
          { label: 'Email', value: selectedClient?.email },
          { label: 'Adresse', value: selectedClient?.address },
          { label: 'Source', value: selectedClient?.source },
          { label: 'Stage CRM', value: selectedClient?.crm_stage },
          { label: 'Notes', value: selectedClient?.notes },
          { label: 'Véhicule', value: selectedClient?.vehicle_info },
          { label: 'Rendez-vous', value: appointmentList },
        ]}
      />
    </div>
  );
}

function formatDateTime(value) {
  return value
    ? new Date(value).toLocaleString('fr-BE', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '—';
}
