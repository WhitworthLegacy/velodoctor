import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import fr from 'date-fns/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Le style du calendrier
import { supabase } from '../../lib/supabase';

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

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    
    // 1. Récupérer les RDV Logistiques (Transport)
    const { data: appointments } = await supabase
      .from('appointments')
      .select(`*, clients(full_name), vehicles(brand, model)`);

    // 2. Récupérer les Interventions (Atelier)
    // Note : Pour l'instant on utilise 'created_at' comme date, 
    // idéalement on ajoutera une colonne 'planned_at' plus tard.
    const { data: interventions } = await supabase
      .from('interventions')
      .select(`*, vehicles(brand, model, clients(full_name))`);

    // 3. Fusionner et formater pour le calendrier
    const logisticsEvents = (appointments || []).map(apt => ({
      id: `apt-${apt.id}`,
      title: `🚛 ${apt.clients?.full_name || 'Client'} - ${apt.type === 'pickup' ? 'Récup' : 'Livr'}`,
      start: new Date(apt.scheduled_at),
      end: new Date(new Date(apt.scheduled_at).getTime() + 60 * 60 * 1000), // Durée fictive 1h
      type: 'logistics',
      status: apt.status
    }));

    const workshopEvents = (interventions || []).map(int => ({
      id: `int-${int.id}`,
      title: `🔧 ${int.vehicles?.brand} (${int.status})`,
      start: new Date(int.created_at), // Date d'entrée atelier
      end: new Date(new Date(int.created_at).getTime() + 2 * 60 * 60 * 1000), // Durée fictive 2h
      type: 'workshop',
      status: int.status
    }));

    setEvents([...logisticsEvents, ...workshopEvents]);
    setLoading(false);
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

  return (
    <div className="container" style={{ height: '85vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ marginBottom: '15px' }}>
        <h1>📅 Agenda Maître</h1>
      </header>

      {loading ? <p>Chargement du planning...</p> : (
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
            onSelectEvent={event => alert(event.title)} // Simple alerte au clic pour l'instant
          />
        </div>
      )}
    </div>
  );
}