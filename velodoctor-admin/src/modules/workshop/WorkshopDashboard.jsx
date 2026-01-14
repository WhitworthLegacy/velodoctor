import { useState } from 'react';
import { useInterventions, useUpdateIntervention } from '../../lib/hooks/useApi';
import WorkshopCard from './WorkshopCard';
import Modal from '../../components/ui/Modal';
import QuoteForm from './QuoteForm';
import VehicleSheet from './VehicleSheet';
import { Automation } from '../../lib/automation';

export default function WorkshopDashboard() {
  const { data: interventions = [], isLoading: loading, error: fetchError, refetch } = useInterventions();
  const updateIntervention = useUpdateIntervention();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [selectedIntervention, setSelectedIntervention] = useState(null);

  const error = fetchError?.message || (fetchError ? 'Erreur chargement interventions' : null);

  function handleAction(id, actionType) {
    const intervention = interventions.find(i => i.id === id);
    setSelectedIntervention(intervention);

    if (actionType === 'quote_sent') {
      setModalMode('QUOTE');
      setIsModalOpen(true);
    } else if (actionType === 'view_sheet') {
      setModalMode('SHEET');
      setIsModalOpen(true);
    } else {
      updateStatus(id, actionType);
    }
  }

  async function updateStatus(id, newStatus) {
    const intervention = interventions.find(i => i.id === id);
    const clientId = intervention?.vehicles?.clients?.id;

    if (newStatus === 'ready') {
      if(confirm("Réparation terminée ? Envoyer mail de récupération ?")) {
        const success = await Automation.completeJob('interventions', id, clientId);
        if(success) refetch();
      }
    } else {
      updateIntervention.mutate({ id, data: { status: newStatus } });
    }
  }

  return (
    <div className="container">
      <header style={{ marginBottom: '20px' }}>
        <h1>🔧 Atelier</h1>
      </header>

      {error && (
        <p style={{ color: 'var(--danger)', marginBottom: '12px' }}>
          {error}
        </p>
      )}

      {loading ? <p>Chargement...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {interventions.map((intervention) => (
            <WorkshopCard
              key={intervention.id}
              intervention={intervention}
              onUpdateStatus={handleAction}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'QUOTE' ? "Nouveau Devis" : "Détails Véhicule"}
      >
        {selectedIntervention && modalMode === 'QUOTE' && (
          <QuoteForm
            intervention={selectedIntervention}
            onCancel={() => setIsModalOpen(false)}
            onSuccess={() => { setIsModalOpen(false); refetch(); }}
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
