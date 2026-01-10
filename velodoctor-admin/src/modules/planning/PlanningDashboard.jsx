import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import fr from 'date-fns/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Le style du calendrier
import AdminDetailsModal from '../../components/admin/AdminDetailsModal';
import { deleteAppointmentById, isAdminRole } from '../../lib/adminApi';
import { apiFetch } from '../../lib/apiClient';

// Configuration de la langue française pour le calendrier
const locales = {
  'fr': fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function PlanningDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchData();
    fetchAdminStatus();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      // 1. Récupérer les RDV Logistiques (Transport)
      const appointmentsPayload = await apiFetch('/api/admin/appointments');
      const appointments = appointmentsPayload.appointments || [];

      // 2. Récupérer les Interventions (Atelier)
      // Note : Pour l'instant on utilise 'created_at' comme date,
      // idéalement on ajoutera une colonne 'planned_at' plus tard.
      const interventionsPayload = await apiFetch('/api/admin/interventions');
      const interventions = interventionsPayload.interventions || [];

      // 3. Fusionner et formater pour le calendrier
      const logisticsEvents = (appointments || []).map(apt => ({
        id: `apt-${apt.id}`,
        title: `🚛 ${apt.clients?.full_name || 'Client'} - ${apt.type === 'pickup' ? 'Récup' : 'Livr'}`,
        start: new Date(apt.scheduled_at),
        end: new Date(new Date(apt.scheduled_at).getTime() + 60 * 60 * 1000), // Durée fictive 1h
        type: 'logistics',
        status: apt.status,
        appointment: apt,
      }));

      const workshopEvents = (interventions || []).map(int => ({
        id: `int-${int.id}`,
        title: `🔧 ${int.vehicles?.brand} (${int.status})`,
        start: new Date(int.created_at), // Date d'entrée atelier
        end: new Date(new Date(int.created_at).getTime() + 2 * 60 * 60 * 1000), // Durée fictive 2h
        type: 'workshop',
        status: int.status,
        intervention: int,
      }));

      setEvents([...logisticsEvents, ...workshopEvents]);
      setError(null);
    } catch (fetchError) {
      console.error(fetchError);
      const status = fetchError?.status ? ` (HTTP ${fetchError.status})` : '';
      setError(`Impossible de charger le planning${status}.`);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAdminStatus() {
    const admin = await isAdminRole();
    setIsAdmin(admin);
  }

  // Fonction pour donner une couleur selon le type d'événement
  const eventStyleGetter = (event) => {
    let backgroundColor = event.type === 'logistics' ? '#00ACC2' : '#F58529'; // Bleu ou Orange
    if (event.status === 'done' || event.status === 'ready') backgroundColor = '#10B981'; // Vert si fini
    
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const handleDeleteAppointment = async (event) => {
    const apt = event?.appointment;
    if (!apt?.id) return;
    if (!confirm('Supprimer ce rendez-vous ?')) return;
    try {
      await deleteAppointmentById(apt.id);
      setDetailsOpen(false);
      setSelectedEvent(null);
      await fetchData();
    } catch (error) {
      console.error(error);
      alert('Suppression impossible.');
    }
  };

  return (
    <div className="container" style={{ height: '85vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ marginBottom: '15px' }}>
        <h1>📅 Agenda Maître</h1>
      </header>

      {loading ? <p>Chargement du planning...</p> : error ? (
        <div style={{ padding: '10px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px' }}>
          {error}
        </div>
      ) : (
        <div style={{ flex: 1, background: 'white', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            culture='fr'
            messages={{
              next: "Suivant",
              previous: "Précédent",
              today: "Aujourd'hui",
              month: "Mois",
              week: "Semaine",
              day: "Jour",
              agenda: "Liste"
            }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={(event) => {
              setSelectedEvent(event);
              setDetailsOpen(true);
            }}
          />
        </div>
      )}

      <AdminDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={selectedEvent?.type === 'workshop' ? 'Détails atelier' : 'Détails rendez-vous'}
        sections={getEventSections(selectedEvent)}
        isAdmin={isAdmin && selectedEvent?.type === 'logistics'}
        onDelete={selectedEvent?.type === 'logistics' ? () => handleDeleteAppointment(selectedEvent) : null}
        deleteLabel="Supprimer le RDV"
      />
    </div>
  );
}

function getEventSections(event) {
  if (!event) return [];

  if (event.type === 'logistics') {
    const apt = event.appointment || {};
    const client = apt.clients || {};
    return [
      { label: 'Client', value: client.full_name || 'Client inconnu' },
      { label: 'Email', value: client.email },
      { label: 'Téléphone', value: client.phone },
      { label: 'Adresse', value: apt.address || client.address },
      { label: 'Service', value: apt.service_type },
      { label: 'Date', value: formatDate(apt.scheduled_at) },
      { label: 'Statut', value: apt.status },
      ...(apt.message ? [{ label: 'Message', value: apt.message }] : []),
    ];
  }

  const intervention = event.intervention || {};
  const vehicle = intervention.vehicles || {};
  const client = vehicle.clients || {};
  return [
    { label: 'Client', value: client.full_name || 'Client inconnu' },
    { label: 'Véhicule', value: vehicle.brand ? `${vehicle.brand} ${vehicle.model || ''}`.trim() : '—' },
    { label: 'Statut', value: intervention.status },
    { label: 'Date', value: formatDate(intervention.created_at) },
  ];
}

function formatDate(value) {
  return value
    ? new Date(value).toLocaleString('fr-BE', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '—';
}
