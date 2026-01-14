import { useState, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import fr from 'date-fns/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AdminDetailsModal from '../../components/admin/AdminDetailsModal';
import { deleteAppointmentById, isAdminRole } from '../../lib/adminApi';
import { useAppointments, useInterventions, useUpdateAppointment, useUpdateIntervention } from '../../lib/hooks/useApi';

const locales = { 'fr': fr };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function PlanningDashboard() {
  const queryClient = useQueryClient();
  const { data: appointments = [], isLoading: appointmentsLoading, error: appointmentsError } = useAppointments();
  const { data: interventions = [], isLoading: interventionsLoading, error: interventionsError } = useInterventions();
  const updateAppointment = useUpdateAppointment();
  const updateIntervention = useUpdateIntervention();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const loading = appointmentsLoading || interventionsLoading;
  const fetchError = appointmentsError || interventionsError;
  const error = fetchError ? `Impossible de charger le planning${fetchError?.status ? ` (HTTP ${fetchError.status})` : ''}.` : null;

  useEffect(() => {
    isAdminRole().then(setIsAdmin);
  }, []);

  const events = useMemo(() => {
    const logisticsEvents = (appointments || []).map(apt => ({
      id: `apt-${apt.id}`,
      title: `🚛 ${apt.clients?.full_name || 'Client'} - ${apt.type === 'pickup' ? 'Récup' : 'Livr'}`,
      start: new Date(apt.scheduled_at),
      end: new Date(new Date(apt.scheduled_at).getTime() + 60 * 60 * 1000),
      type: 'logistics',
      status: apt.status,
      appointment: apt,
    }));

    const workshopEvents = (interventions || []).map(int => ({
      id: `int-${int.id}`,
      title: `🔧 ${int.vehicles?.brand} (${int.status})`,
      start: new Date(int.created_at),
      end: new Date(new Date(int.created_at).getTime() + 2 * 60 * 60 * 1000),
      type: 'workshop',
      status: int.status,
      intervention: int,
    }));

    return [...logisticsEvents, ...workshopEvents];
  }, [appointments, interventions]);

  const eventStyleGetter = (event) => {
    let backgroundColor = event.type === 'logistics' ? '#00ACC2' : '#F58529';
    if (event.status === 'done' || event.status === 'ready') backgroundColor = '#10B981';

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
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    } catch (err) {
      console.error(err);
      alert('Suppression impossible.');
    }
  };

  const eventEditableFields = selectedEvent
    ? selectedEvent.type === 'logistics'
      ? [
          {
            name: 'scheduled_at',
            label: 'Date',
            type: 'datetime-local',
            value: toLocalInputValue(selectedEvent.appointment?.scheduled_at),
          },
          {
            name: 'status',
            label: 'Statut',
            type: 'select',
            value: selectedEvent.appointment?.status || 'pending',
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
            value: selectedEvent.appointment?.service_type || 'collecte',
            options: [
              { value: 'collecte', label: 'Collecte' },
              { value: 'depot_atelier', label: 'Dépôt atelier' },
            ],
          },
          {
            name: 'address',
            label: 'Adresse',
            type: 'text',
            value: selectedEvent.appointment?.address || selectedEvent.appointment?.clients?.address || '',
          },
          {
            name: 'message',
            label: 'Message',
            type: 'textarea',
            value: selectedEvent.appointment?.message || '',
          },
        ]
      : [
          {
            name: 'status',
            label: 'Statut atelier',
            type: 'select',
            value: selectedEvent.intervention?.status || 'diagnosing',
            options: [
              { value: 'diagnosing', label: 'Diagnostic' },
              { value: 'quote_sent', label: 'Devis envoyé' },
              { value: 'approved', label: 'Devis validé' },
              { value: 'repairing', label: 'Réparation' },
              { value: 'ready', label: 'Prêt' },
              { value: 'done', label: 'Terminé' },
            ],
          },
        ]
    : [];

  const handleSaveEvent = async (draft) => {
    if (!selectedEvent) return;
    if (selectedEvent.type === 'logistics') {
      const apt = selectedEvent.appointment || {};
      const payload = {
        status: draft.status || apt.status,
        service_type: draft.service_type || apt.service_type,
        address: draft.address || null,
        message: draft.message || null,
      };

      if (draft.scheduled_at) {
        const nextDate = new Date(draft.scheduled_at);
        if (!Number.isNaN(nextDate.getTime())) {
          payload.scheduled_at = nextDate.toISOString();
        }
      }

      updateAppointment.mutate({ id: apt.id, data: payload });
    } else {
      const intervention = selectedEvent.intervention || {};
      updateIntervention.mutate({ id: intervention.id, data: { status: draft.status } });
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
            defaultView="week"
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
        editableFields={eventEditableFields}
        onSave={handleSaveEvent}
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

function toLocalInputValue(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (v) => String(v).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
