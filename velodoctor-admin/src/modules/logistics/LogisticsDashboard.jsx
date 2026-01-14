import { useEffect, useState } from 'react';
import AppointmentCard from './AppointmentCard';
import { Automation } from '../../lib/automation';
import AdminDetailsModal from '../../components/admin/AdminDetailsModal';
import { deleteAppointmentById, isAdminRole } from '../../lib/adminApi';
import { apiFetch, getDataVersion } from '../../lib/apiClient';

let logisticsCache = { data: null, version: 0 };

export default function LogisticsDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchAppointments();
    fetchAdminStatus();
  }, []);

  useEffect(() => {
    const handleDataChange = () => {
      logisticsCache = { data: null, version: getDataVersion() };
      fetchAppointments(true);
    };

    window.addEventListener('admin-data-changed', handleDataChange);
    return () => window.removeEventListener('admin-data-changed', handleDataChange);
  }, []);

  async function fetchAppointments(force = false) {
    const dataVersion = getDataVersion();
    if (!force && logisticsCache.data && logisticsCache.version === dataVersion) {
      setAppointments(logisticsCache.data);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      const payload = await apiFetch('/api/admin/appointments');
      const nextAppointments = payload.appointments || [];
      logisticsCache = { data: nextAppointments, version: dataVersion };
      setAppointments(nextAppointments);
    } catch (err) {
      console.error("Erreur de chargement:", err);
      setError("Impossible de charger les rendez-vous.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchAdminStatus() {
    const admin = await isAdminRole();
    setIsAdmin(admin);
  }

  // ✨ NOUVELLE FONCTION : Met à jour le statut dans la base de données
  async function handleStatusUpdate(id, newStatus, appointment) {
      if (newStatus === 'done') {
        // SI C'EST FINI -> AUTOMATISATION COMPLÈTE
        if(confirm("Confirmer la fin de mission et envoyer l'avis Google ?")) {
          const success = await Automation.completeJob('appointments', id, appointment.clients?.id);
          if(success) fetchAppointments(true); // Rafraîchir la liste
        }
      } else {
        // CAS CLASSIQUE (ex: En transit)
        try {
          await apiFetch(`/api/admin/appointments/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatus }),
          });
          fetchAppointments(true);
        } catch (updateError) {
          console.error(updateError);
          alert("Impossible de mettre à jour le statut.");
        }
      }
  }

  const handleOpenDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setDetailsOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;
    if (!confirm('Supprimer ce rendez-vous ?')) return;
    try {
      await deleteAppointmentById(selectedAppointment.id);
      setDetailsOpen(false);
      setSelectedAppointment(null);
      fetchAppointments(true);
    } catch (deleteError) {
      console.error(deleteError);
      alert('Suppression impossible.');
    }
  };

  const formatDateTime = (value) =>
    value
      ? new Date(value).toLocaleString('fr-BE', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : '—';

  const appointmentSections = selectedAppointment
    ? [
        { label: 'Client', value: selectedAppointment.clients?.full_name || 'Client inconnu' },
        { label: 'Email', value: selectedAppointment.clients?.email },
        { label: 'Téléphone', value: selectedAppointment.clients?.phone },
        { label: 'Adresse', value: selectedAppointment.address || selectedAppointment.clients?.address },
        { label: 'Service', value: selectedAppointment.service_type },
        { label: 'Date', value: formatDateTime(selectedAppointment.scheduled_at) },
        { label: 'Statut', value: selectedAppointment.status },
        ...(selectedAppointment.message ? [{ label: 'Message', value: selectedAppointment.message }] : []),
      ]
    : [];

  const appointmentEditableFields = selectedAppointment
    ? [
        {
          name: 'scheduled_at',
          label: 'Date',
          type: 'datetime-local',
          value: toLocalInputValue(selectedAppointment.scheduled_at),
        },
        {
          name: 'status',
          label: 'Statut',
          type: 'select',
          value: selectedAppointment.status || 'pending',
          options: [
            { value: 'pending', label: 'En attente' },
            { value: 'confirmed', label: 'Confirmé' },
            { value: 'in_transit', label: 'En transit' },
            { value: 'done', label: 'Terminé' },
            { value: 'cancelled', label: 'Annulé' },
          ],
        },
        {
          name: 'service_type',
          label: 'Service',
          type: 'select',
          value: selectedAppointment.service_type || 'collecte',
          options: [
            { value: 'collecte', label: 'Collecte' },
            { value: 'depot_atelier', label: 'Dépôt atelier' },
          ],
        },
        {
          name: 'address',
          label: 'Adresse',
          type: 'text',
          value: selectedAppointment.address || selectedAppointment.clients?.address || '',
        },
        {
          name: 'message',
          label: 'Message',
          type: 'textarea',
          value: selectedAppointment.message || '',
        },
      ]
    : [];

  const handleSaveAppointment = async (draft) => {
    if (!selectedAppointment?.id) return;
    const payload = {
      status: draft.status || selectedAppointment.status,
      service_type: draft.service_type || selectedAppointment.service_type,
      address: draft.address || null,
      message: draft.message || null,
    };

    if (draft.scheduled_at) {
      const nextDate = new Date(draft.scheduled_at);
      if (!Number.isNaN(nextDate.getTime())) {
        payload.scheduled_at = nextDate.toISOString();
      }
    }

    await apiFetch(`/api/admin/appointments/${selectedAppointment.id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    fetchAppointments(true);
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '20px' }}>
        <h1>🚛 Hub Logistique</h1>
        <p style={{ color: 'var(--gray)' }}>Gérez vos enlèvements et livraisons.</p>
      </header>

      {loading && <p>Chargement...</p>}
      
      {error && (
        <div style={{ padding: '10px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {appointments.length === 0 ? (
            <p>Aucun rendez-vous prévu.</p>
          ) : (
            appointments.map((apt) => (
              <AppointmentCard 
                key={apt.id} 
                appointment={apt} 
                onUpdate={handleStatusUpdate} /* 👈 On passe la fonction à la carte */
                onDetails={handleOpenDetails}
              />
            ))
          )}
        </div>
      )}

      <AdminDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title="Détails du rendez-vous"
        sections={appointmentSections}
        editableFields={appointmentEditableFields}
        onSave={handleSaveAppointment}
        isAdmin={isAdmin}
        onDelete={handleDelete}
      />
    </div>
  );
}

function toLocalInputValue(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (v) => String(v).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
