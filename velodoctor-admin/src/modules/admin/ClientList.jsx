import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Phone, Mail, MapPin, Search } from 'lucide-react';
import Card from '../../components/ui/Card';
import AdminDetailsModal from '../../components/admin/AdminDetailsModal';
import { deleteAppointmentById, isAdminRole } from '../../lib/adminApi';
import { useClients, useClientAppointments, useUpdateClient } from '../../lib/hooks/useApi';

export default function ClientList() {
  const queryClient = useQueryClient();
  const { data: clients = [], isLoading: loading, error: fetchError } = useClients();
  const updateClient = useUpdateClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const { data: clientAppointments = [], isLoading: appointmentsLoading } = useClientAppointments(selectedClient?.id);

  const error = fetchError ? `Impossible de charger les clients${fetchError?.status ? ` (HTTP ${fetchError.status})` : ''}.` : null;

  useEffect(() => {
    isAdminRole().then(setIsAdmin);
  }, []);

  const handleOpenDetails = (client) => {
    setSelectedClient(client);
    setDetailsOpen(true);
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!confirm('Supprimer ce rendez-vous ?')) return;
    try {
      await deleteAppointmentById(appointmentId);
      queryClient.invalidateQueries({ queryKey: ['client-appointments', selectedClient?.id] });
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

  const filteredClients = clients.filter(client =>
    client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm)
  );

  const clientEditableFields = selectedClient
    ? [
        { name: 'full_name', label: 'Nom', type: 'text', value: selectedClient.full_name || '' },
        { name: 'phone', label: 'Téléphone', type: 'text', value: selectedClient.phone || '' },
        { name: 'email', label: 'Email', type: 'text', value: selectedClient.email || '' },
        { name: 'address', label: 'Adresse', type: 'text', value: selectedClient.address || '' },
        { name: 'vehicle_info', label: 'Véhicule', type: 'text', value: selectedClient.vehicle_info || '' },
        { name: 'notes', label: 'Notes', type: 'textarea', value: selectedClient.notes || '' },
        { name: 'crm_stage', label: 'Stage CRM', type: 'text', value: selectedClient.crm_stage || '' },
      ]
    : [];

  const handleSaveClient = async (draft) => {
    if (!selectedClient?.id) return;
    updateClient.mutate({
      id: selectedClient.id,
      data: {
        full_name: draft.full_name || null,
        phone: draft.phone || null,
        email: draft.email || null,
        address: draft.address || null,
        vehicle_info: draft.vehicle_info || null,
        notes: draft.notes || null,
        crm_stage: draft.crm_stage || null,
      },
    });
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '20px' }}>
        <h1>👥 Clients</h1>

        <div style={{ position: 'relative', marginTop: '10px' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--gray)' }} />
          <input
            type="text"
            placeholder="Rechercher un nom ou un numéro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>
      </header>

      {loading ? <p>Chargement...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {error ? (
            <div style={{ padding: '10px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px' }}>
              {error}
            </div>
          ) : filteredClients.length === 0 ? (
            <p>Aucun client trouvé.</p>
          ) : (
            filteredClients.map((client) => (
              <Card key={client.id} onClick={() => handleOpenDetails(client)}>
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--dark)' }}>
                  {client.phone && (
                    <a href={`tel:${client.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                      <Phone size={16} color="var(--secondary)" />
                      {client.phone}
                    </a>
                  )}

                  {client.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={16} color="var(--gray)" />
                      {client.email}
                    </div>
                  )}

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
        editableFields={clientEditableFields}
        onSave={handleSaveClient}
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
