import { useState, useEffect } from 'react';
import { Settings, UserPlus } from 'lucide-react';
import { CRM_STAGES } from '../../lib/constants';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import ClientForm from './ClientForm';
import Button from '../../components/ui/Button';
import CrmCardModal from '../../components/admin/CrmCardModal';
import { deleteAppointmentById, deleteClientById, isAdminRole } from '../../lib/adminApi';
import { apiFetch } from '../../lib/apiClient';

const DEFAULT_COLUMNS = [
  { id: 'reception', slug: CRM_STAGES.NEW_LEAD, label: 'Réception', position: 1 },
  { id: 'missions', slug: CRM_STAGES.APPOINTMENT, label: 'Missions Logistique', position: 2 },
  { id: 'mission_fini', slug: CRM_STAGES.DONE, label: 'Mission finie', position: 3 },
  { id: 'atelier', slug: 'atelier', label: 'Atelier', position: 4 },
  { id: 'encaissements', slug: 'encaissements', label: 'Encaissements', position: 5 },
  { id: 'cloture', slug: CRM_STAGES.SATISFACTION, label: 'Clôture', position: 6 },
  { id: 'annuler', slug: 'annuler', label: 'Annulé', position: 7 },
];

let crmCache = { columns: null, leads: null };

export default function PipelineBoard() {
  const [columns, setColumns] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLead, setDetailsLead] = useState(null);
  const [leadAppointments, setLeadAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  
  // Modale
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    fetchData();
    fetchAdminStatus();
  }, []);

  async function fetchData(force = false) {
    if (!force && crmCache.columns && crmCache.leads) {
      setColumns(crmCache.columns);
      setLeads(crmCache.leads);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    try {
      const columnsPayload = await apiFetch('/api/admin/crm-columns');
      const clientsPayload = await apiFetch('/api/admin/clients');
      const colsData = columnsPayload.columns || [];
      const leadsData = clientsPayload.clients || [];
      const orderedColumns = buildColumns(colsData, leadsData);
      setColumns(orderedColumns);
      setLeads(leadsData);
      crmCache = { columns: orderedColumns, leads: leadsData };
      setError(null);
    } catch (error) {
      console.error("Erreur chargement CRM:", error);
      const status = error?.status ? ` (HTTP ${error.status})` : '';
      setError(`Impossible de charger le CRM${status}.`);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAdminStatus() {
    const admin = await isAdminRole();
    setIsAdmin(admin);
  }

  async function loadLeadAppointments(clientId) {
    setAppointmentsLoading(true);
    try {
      const payload = await apiFetch(`/api/admin/clients/${clientId}/appointments`);
      setLeadAppointments(payload.appointments || []);
    } catch (error) {
      console.error(error);
      setLeadAppointments([]);
    }
    setAppointmentsLoading(false);
  }

  // --- HELPER PROGRESSION ---
  const calculateGlobalProgress = (checklists) => {
    if (!checklists || typeof checklists !== 'object') return { total: 0, checked: 0, percent: 0 };
    let totalItems = 0;
    let checkedItems = 0;
    Object.values(checklists).forEach(category => {
      if (category?.items && Array.isArray(category.items)) {
        totalItems += category.items.length;
        checkedItems += category.items.filter(item => item.checked).length;
      }
    });
    const percent = totalItems === 0 ? 0 : Math.round((checkedItems / totalItems) * 100);
    return { total: totalItems, checked: checkedItems, percent };
  };

  // --- ACTIONS ---
  const handleCreateLead = () => {
    setSelectedLead(null); // NULL = Mode Création
    setIsModalOpen(true);
  };

  const handleOpenDetails = (lead) => {
    setDetailsLead(lead);
    setDetailsOpen(true);
    loadLeadAppointments(lead.id);
  };

  const handleStageChange = async (nextStage) => {
    if (!detailsLead) return;
    const updated = { ...detailsLead, crm_stage: nextStage };
    setDetailsLead(updated);
    setLeads((prev) => prev.map((l) => (l.id === detailsLead.id ? updated : l)));
    try {
      await apiFetch(`/api/admin/clients/${detailsLead.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ crm_stage: nextStage }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!confirm('Supprimer ce rendez-vous ?')) return;
    try {
      await deleteAppointmentById(appointmentId);
      setLeadAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId));
    } catch (deleteError) {
      console.error(deleteError);
      alert('Suppression impossible.');
    }
  };

  const handleChecklistChange = async (leadId, nextChecklists) => {
    setLeads((prev) => {
      const nextLeads = prev.map((l) => (l.id === leadId ? { ...l, checklists: nextChecklists } : l));
      crmCache = { columns, leads: nextLeads };
      return nextLeads;
    });
    setDetailsLead((prev) => (prev?.id === leadId ? { ...prev, checklists: nextChecklists } : prev));
    try {
      await apiFetch(`/api/admin/clients/${leadId}`, {
        method: 'PATCH',
        body: JSON.stringify({ checklists: nextChecklists }),
      });
    } catch (error) {
      console.error('[CRM] checklists save failed:', error);
    }
  };

  const handlePhotosChange = (leadId, nextPhotos) => {
    setLeads((prev) => {
      const nextLeads = prev.map((l) => (l.id === leadId ? { ...l, crm_photos: nextPhotos } : l));
      crmCache = { columns, leads: nextLeads };
      return nextLeads;
    });
    setDetailsLead((prev) => (prev?.id === leadId ? { ...prev, crm_photos: nextPhotos } : prev));
  };

  const handleDeleteClient = async (lead) => {
    if (!lead) return;
    if (!confirm("Supprimer définitivement ce client ?")) return;
    try {
      await deleteClientById(lead.id);
      setLeads((prev) => prev.filter((l) => l.id !== lead.id));
      setDetailsLead(null);
      setDetailsOpen(false);
      crmCache = { columns, leads: leads.filter((l) => l.id !== lead.id) };
    } catch (error) {
      console.error(error);
      alert("Impossible de supprimer le client.");
    }
  };

  async function updateLead(leadData, silent = false) {
    // Si c'est une sauvegarde manuelle (bouton), on ferme la modale
    if (!silent) setIsModalOpen(false);

    try {
      // 1. MISE À JOUR (Client existant)
      if (leadData.id) {
        setLeads(prev => {
          const nextLeads = prev.map(l => l.id === leadData.id ? leadData : l);
          crmCache = { columns, leads: nextLeads };
          return nextLeads;
        });

        await apiFetch(`/api/admin/clients/${leadData.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            crm_stage: leadData.crm_stage,
            full_name: leadData.full_name,
            phone: leadData.phone,
            email: leadData.email,
            address: leadData.address,
            vehicle_info: leadData.vehicle_info,
            notes: leadData.notes,
            checklists: leadData.checklists,
          }),
        });
      } 
      // 2. CRÉATION (Nouveau client)
      else {
        // On nettoie l'objet avant l'envoi
        const { id, ...newClientData } = leadData;
        const payload = await apiFetch('/api/admin/clients', {
          method: 'POST',
          body: JSON.stringify({
            full_name: newClientData.full_name || 'Nouveau Client',
            phone: newClientData.phone,
            email: newClientData.email,
            address: newClientData.address,
            vehicle_info: newClientData.vehicle_info,
            crm_stage: newClientData.crm_stage || 'reception',
            notes: newClientData.notes,
            checklists: newClientData.checklists || {},
          }),
        });

        if (payload?.client) {
          setLeads(prev => {
            const nextLeads = [payload.client, ...prev];
            crmCache = { columns, leads: nextLeads };
            return nextLeads;
          });
        }
      }
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
      if (!silent) alert(`Erreur lors de la sauvegarde : ${err.message}`);
    }
  }

  // --- ACTION ARCHIVER ---
  async function archiveLead(leadToArchive) {
    // 1. Optimistic UI : On le retire tout de suite de l'affichage
    setLeads(prev => {
      const nextLeads = prev.filter(l => l.id !== leadToArchive.id);
      crmCache = { columns, leads: nextLeads };
      return nextLeads;
    });
    setIsModalOpen(false); // On ferme la modale

    try {
      // 2. Update Supabase
      await apiFetch(`/api/admin/clients/${leadToArchive.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_archived: true }),
      });
      
      // Optionnel : Petit feedback console
      console.log("Client archivé avec succès");

    } catch (err) {
      console.error("Erreur lors de l'archivage:", err);
      alert("Erreur technique lors de l'archivage. Le client risque de réapparaître au rechargement.");
      fetchData(true); // En cas d'erreur, on recharge les données pour être sûr
    }
  }

  // --- DRAG & DROP (VERSION CORRIGÉE - Anti Reset) ---
  const handleDragStart = (e, lead) => {
    // On passe TOUT l'objet lead (avec ses checklists à jour)
    e.dataTransfer.setData("leadData", JSON.stringify(lead));
  };
  
  const handleDragOver = (e) => e.preventDefault();
  
  const handleDrop = async (e, targetSlug) => {
    e.preventDefault();
    try {
      const leadDataString = e.dataTransfer.getData("leadData");
      if (!leadDataString) return;
      
      const currentLead = JSON.parse(leadDataString);
      
      if (currentLead && currentLead.crm_stage !== targetSlug) {
        const updatedLead = { ...currentLead, crm_stage: targetSlug };
        
        // Update UI immédiat
        setLeads(prev => {
          const nextLeads = prev.map(l => l.id === currentLead.id ? updatedLead : l);
          crmCache = { columns, leads: nextLeads };
          return nextLeads;
        });
        
        // Update DB
        await apiFetch(`/api/admin/clients/${currentLead.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ crm_stage: targetSlug }),
        });
      }
    } catch (err) { console.error(err); }
  };

  const getHeaderColor = (slug) => {
    if (slug.includes('reception')) return '#E5E7EB';
    if (slug.includes('missions')) return '#DBEAFE';
    if (slug.includes('fini') || slug.includes('done')) return '#D1FAE5';
    if (slug.includes('atelier')) return '#F3E8FF';
    if (slug.includes('encaissements')) return '#FEF3C7';
    if (slug.includes('cloture')) return '#CCFBF1';
    if (slug.includes('annuler')) return '#FEE2E2';
    return '#E5E7EB';
  };

  if (loading) return <div className="container">Chargement...</div>;

  return (
    <div style={{ height: 'calc(100vh - 80px)', overflowX: 'auto', display: 'flex', flexDirection: 'column', background: '#F3F4F6' }}>
      
      <header style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>📊 Pipeline VeloDoctor</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button onClick={handleCreateLead} style={{ width: 'auto', background: '#00ACC2' }}>
              <UserPlus size={16}/> Nouveau Prospect
          </Button>

          <button onClick={() => setEditMode(!editMode)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', background: 'white' }}>
            <Settings size={16}/> {editMode ? 'Fin Édition' : 'Gérer Colonnes'}
          </button>
        </div>
      </header>

      {error && (
        <div style={{ margin: '0 20px 20px', padding: '10px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', gap: '16px', padding: '0 20px 20px 20px', overflowY: 'hidden' }}>
        {columns.map((col) => (
          <div 
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.slug)}
            style={{ minWidth: '280px', maxWidth: '280px', display: 'flex', flexDirection: 'column', background: '#EAECEF', borderRadius: '12px', height: '100%', border: editMode ? '2px dashed #999' : 'none' }}
          >
            <div style={{ padding: '12px', fontWeight: 'bold', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', backgroundColor: getHeaderColor(col.slug), color: '#374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{col.label}</span>
              <span style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '10px', padding: '2px 8px', fontSize: '12px' }}>
                {leads.filter(l => (l.crm_stage || CRM_STAGES.NEW_LEAD) === col.slug).length}
              </span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {leads.filter(lead => (lead.crm_stage || CRM_STAGES.NEW_LEAD) === col.slug).map(lead => {
                  const stats = calculateGlobalProgress(lead.checklists);
                  return (
                    <div key={lead.id} draggable onDragStart={(e) => handleDragStart(e, lead)} style={{ cursor: 'grab' }}>
                      <Card onClick={() => handleOpenDetails(lead)} className="hover:shadow-md transition-shadow">
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{lead.full_name}</div>
                        {/* Sécurité : Affichage ID avec fallback */}
                        <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '4px' }}>N° {String(lead.tracking_id || 0).padStart(5, '0')}</div>
                        {stats.total > 0 && (
                           <div style={{ marginTop: '8px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6B7280', marginBottom: '2px' }}>
                                 <span>Progression</span><span style={{ fontWeight: 'bold' }}>{stats.checked}/{stats.total}</span>
                              </div>
                              <div style={{ height: '6px', background: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                                 <div style={{ height: '100%', width: `${stats.percent}%`, background: stats.percent === 100 ? '#10B981' : '#00ACC2', transition: 'width 0.3s' }} /> 
                              </div>
                           </div>
                        )}
                      </Card>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
        {columns.length === 0 && <div style={{ padding: '20px' }}>Aucune colonne...</div>}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedLead ? "Fiche Suivi" : "Nouveau Prospect"}>
        <ClientForm 
          client={selectedLead}
          availableStages={columns}
          onSave={updateLead}
          onCancel={() => setIsModalOpen(false)}
          onArchive={archiveLead}  // <--- AJOUTER CETTE LIGNE
        />
      </Modal>

      <CrmCardModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        client={detailsLead}
        columns={columns}
        appointments={leadAppointments}
        appointmentsLoading={appointmentsLoading}
        onStageChange={handleStageChange}
        onDeleteAppointment={handleDeleteAppointment}
        onChecklistChange={handleChecklistChange}
        onPhotosChange={handlePhotosChange}
        onDeleteClient={handleDeleteClient}
        isAdmin={isAdmin}
      />
    </div>
  );
}

function buildColumns(columns, leads) {
  const baseColumns = columns.length > 0 ? [...columns] : [...DEFAULT_COLUMNS];
  const existingSlugs = new Set(baseColumns.map((col) => col.slug));

  (leads || []).forEach((lead) => {
    const slug = lead.crm_stage || CRM_STAGES.NEW_LEAD;
    if (!existingSlugs.has(slug)) {
      existingSlugs.add(slug);
      baseColumns.push({
        id: slug,
        slug,
        label: formatStageLabel(slug),
        position: baseColumns.length + 1,
      });
    }
  });

  return baseColumns.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

function formatStageLabel(slug) {
  return slug
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
