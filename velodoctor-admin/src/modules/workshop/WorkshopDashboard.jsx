import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import WorkshopCard from './WorkshopCard';
import Modal from '../../components/ui/Modal';
import QuoteForm from './QuoteForm';
import VehicleSheet from './VehicleSheet'; // 👈 Import du nouveau composant
import { Automation } from '../../lib/automation';

export default function WorkshopDashboard() {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // États Modale
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null); // 'QUOTE' ou 'SHEET'
  const [selectedIntervention, setSelectedIntervention] = useState(null);

  useEffect(() => {
    fetchInterventions();
  }, []);

  async function fetchInterventions() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('interventions')
        .select(`*, vehicles (brand, model, type, clients (full_name))`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInterventions(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }

  // Cette fonction est appelée par les boutons de la carte
  function handleAction(id, actionType) {
    const intervention = interventions.find(i => i.id === id);
    setSelectedIntervention(intervention);

    if (actionType === 'quote_sent') {
      setModalMode('QUOTE');
      setIsModalOpen(true);
    } else if (actionType === 'view_sheet') { // 👈 Nouveau cas
      setModalMode('SHEET');
      setIsModalOpen(true);
    } else {
      // Cas standard (update direct)
      updateStatus(id, actionType);
    }
  }


  // Dans ta fonction handleAction ou updateStatus :
  async function updateStatus(id, newStatus) {
      // On trouve l'intervention concernée pour avoir l'ID client
      const intervention = interventions.find(i => i.id === id);
      // On suppose que l'intervention a une structure : { ..., vehicles: { clients: { id: ... } } }
      const clientId = intervention?.vehicles?.clients?.id;

      if (newStatus === 'ready') { // 'ready' = Terminé pour l'atelier
        if(confirm("Réparation terminée ? Envoyer mail de récupération ?")) {
            // On utilise Automation
            const success = await Automation.completeJob('interventions', id, clientId);
            if(success) fetchInterventions();
        }
      } else {
        // Cas normal
        await supabase.from('interventions').update({ status: newStatus }).eq('id', id);
        fetchInterventions();
      }
  }

  return (
    <div className="container">
      <header style={{ marginBottom: '20px' }}>
        <h1>🔧 Atelier</h1>
      </header>

      {loading ? <p>Chargement...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {interventions.map((intervention) => (
            <WorkshopCard 
              key={intervention.id} 
              intervention={intervention} 
              onUpdateStatus={handleAction} // On passe notre fonction améliorée
            />
          ))}
        </div>
      )}

      {/* LA MODALE POLYVALENTE */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'QUOTE' ? "Nouveau Devis" : "Détails Véhicule"}
      >
        {selectedIntervention && modalMode === 'QUOTE' && (
          <QuoteForm 
            intervention={selectedIntervention}
            onCancel={() => setIsModalOpen(false)}
            onSuccess={() => { setIsModalOpen(false); fetchInterventions(); }}
          />
        )}
        
        {selectedIntervention && modalMode === 'SHEET' && (
          <VehicleSheet 
            intervention={selectedIntervention}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}