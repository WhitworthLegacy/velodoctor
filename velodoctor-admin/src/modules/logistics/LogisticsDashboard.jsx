import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import AppointmentCard from './AppointmentCard';
import { Automation } from '../../lib/automation';

export default function LogisticsDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          clients (full_name, address, phone),
          vehicles (brand, model, type)
        `)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      setAppointments(data);
    } catch (err) {
      console.error("Erreur de chargement:", err);
      setError("Impossible de charger les rendez-vous.");
    } finally {
      setLoading(false);
    }
  }

  // ✨ NOUVELLE FONCTION : Met à jour le statut dans la base de données
  async function handleStatusUpdate(id, newStatus, appointment) {
      if (newStatus === 'done') {
        // SI C'EST FINI -> AUTOMATISATION COMPLÈTE
        if(confirm("Confirmer la fin de mission et envoyer l'avis Google ?")) {
          const success = await Automation.completeJob('appointments', id, appointment.clients?.id);
          if(success) fetchAppointments(); // Rafraîchir la liste
        }
      } else {
        // CAS CLASSIQUE (ex: En transit)
        const { error } = await supabase
          .from('appointments')
          .update({ status: newStatus })
          .eq('id', id);
        if (!error) fetchAppointments();
      }
  }

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
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}