import { useState, useEffect, useRef } from 'react';
import { User, Phone, Mail, MapPin, Activity, CheckSquare, Cloud, Loader2, Archive } from 'lucide-react';
import Button from '../../components/ui/Button';
import { mergeChecklistsWithDefaults } from '../../lib/checklists';

export default function ClientForm({ client, availableStages, onSave, onCancel, onArchive }) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    address: '',
    vehicle_info: '',
    crm_stage: '',
    notes: '',
    checklists: mergeChecklistsWithDefaults(),
  });
  const [saveStatus, setSaveStatus] = useState('idle');
  const isReadyToSave = useRef(false);

  useEffect(() => {
    isReadyToSave.current = false;

    if (client) {
      setFormData({
        full_name: client.full_name || '',
        phone: client.phone || '',
        email: client.email || '',
        address: client.address || '',
        vehicle_info: client.vehicle_info || '',
        crm_stage: client.crm_stage || (availableStages && availableStages.length > 0 ? availableStages[0].slug : ''),
        notes: client.notes || '',
        checklists: mergeChecklistsWithDefaults(client.checklists),
      });
    } else {
      setFormData(prev => ({
        ...prev,
        crm_stage: (availableStages && availableStages.length > 0 ? availableStages[0].slug : ''),
        checklists: mergeChecklistsWithDefaults(),
      }));
    }
    const timer = setTimeout(() => { isReadyToSave.current = true; }, 500);

    return () => clearTimeout(timer);
  }, [client]);

  useEffect(() => {
    if (!isReadyToSave.current) return;
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      onSave({ ...client, ...formData }, true); 
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData]);

  const handleArchive = () => {
    if (window.confirm("⚠️ Êtes-vous sûr de vouloir archiver ce client ?\nIl ne sera plus visible dans le pipeline principal.")) {
      if (onArchive) {
        onArchive(client); // Appelle la fonction du parent
      } else {
        alert("Fonction d'archivage non connectée");
      }
    }
  };

  const toggleItem = (categoryKey, itemId) => {
    setFormData(prev => {
      const newChecklists = { ...prev.checklists };
      // Sécurité si la catégorie n'existe pas
      if (!newChecklists[categoryKey]) return prev;
      
      const category = newChecklists[categoryKey];
      // Sécurité si items n'existe pas
      const items = category.items || [];
      
      category.items = items.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item);
      return { ...prev, checklists: newChecklists };
    });
  };

  const calculateProgress = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) return 0;
    return Math.round((items.filter(i => i.checked).length / items.length) * 100);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ maxHeight: '80vh', overflowY: 'auto', paddingRight: '5px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 'bold' }}>
            N° DE SUIVI : {client?.tracking_id ? String(client.tracking_id).padStart(5, '0') : 'NOUVEAU'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#1F2937' }}>{formData.full_name || 'Nouveau Client'}</h2>
            {saveStatus === 'saving' && <span style={{ fontSize: '11px', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px' }}><Loader2 size={12} className="animate-spin"/> Sauvegarde...</span>}
            {saveStatus === 'saved' && <span style={{ fontSize: '11px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}><Cloud size={12}/> Enregistré</span>}
          </div>
        </div>
        <div style={{ minWidth: '200px' }}>
            <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#00ACC2', marginBottom: '2px', display: 'block' }}>ÉTAPE ACTUELLE</label>
            <select name="crm_stage" value={formData.crm_stage} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '2px solid #00ACC2', fontWeight: '600', backgroundColor: '#fff' }}>
              {(availableStages || []).map((col) => (<option key={col.id} value={col.slug}>{col.label}</option>))}
            </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* CHECKLISTS (Avec sécurité anti-crash) */}
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eee', padding: '15px' }}>
          <h3 style={{ marginTop: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckSquare size={18} color="#00ACC2"/> Suivi des Tâches</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {formData.checklists && Object.entries(formData.checklists).map(([key, category]) => {
              // Si la catégorie est mal formée, on l'ignore au lieu de planter
              if (!category || !category.items) return null;
              
              const progress = calculateProgress(category.items);
              return (
                <div key={key} style={{ background: '#F9FAFB', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <span style={{ fontWeight: '600', fontSize: '13px', color: '#374151' }}>{category.title || key}</span>
                    <span style={{ fontSize: '11px', color: '#6B7280' }}>{progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#E5E7EB', borderRadius: '3px', marginBottom: '8px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: progress === 100 ? '#10B981' : '#00ACC2', transition: 'width 0.3s ease' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {Array.isArray(category.items) && category.items.map(item => (
                      <label key={item.id || Math.random()} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={!!item.checked} onChange={() => toggleItem(key, item.id)} style={{ width: '14px', height: '14px', cursor: 'pointer', accentColor: '#00ACC2' }} />
                        <span style={{ textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? '#9CA3AF' : '#374151' }}>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* INFOS */}
        <div>
          <div style={{ background: '#F9FAFB', padding: '15px', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>👤 Coordonnées</h4>
            <div style={{ marginBottom: '8px' }}><label style={{ fontSize: '11px', fontWeight: 'bold', color: '#6B7280' }}>Nom Complet</label><input name="full_name" value={formData.full_name} onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} /></div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
              <div style={{ flex: 1 }}><label style={{ fontSize: '11px', fontWeight: 'bold', color: '#6B7280' }}>Téléphone</label><input name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} /></div>
              <div style={{ flex: 1 }}><label style={{ fontSize: '11px', fontWeight: 'bold', color: '#6B7280' }}>Email</label><input name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} /></div>
            </div>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#6B7280' }}>Adresse</label><input name="address" value={formData.address} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
          </div>
          <div style={{ background: '#F9FAFB', padding: '15px', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>🛴 Véhicule</h4>
            <input name="vehicle_info" value={formData.vehicle_info} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', fontWeight: 'bold' }} />
          </div>
          <div style={{ background: '#F9FAFB', padding: '15px', borderRadius: '8px', border: '1px solid #E5E7EB', minHeight: '100px' }}>
             <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}><Activity size={14}/> Notes / Historique</h4>
             <textarea name="notes" value={formData.notes} onChange={handleChange} style={{ width: '100%', height: '80px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', resize: 'none', fontFamily: 'inherit' }}/>
          </div>
        </div>
      </div>
      {/* Modification du Footer pour inclure l'archivage */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
        
        {/* Bouton Archiver (Visible seulement si le client existe déjà, pas pour un nouveau) */}
        {client?.id ? (
          <button 
            type="button" 
            onClick={handleArchive}
            style={{ 
              background: '#FEF2F2', 
              color: '#DC2626', 
              border: '1px solid #FECACA', 
              padding: '10px 15px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'background 0.2s'
            }}
          >
            <Archive size={16} /> Archiver
          </button>
        ) : (
          <div></div> /* Div vide pour garder l'alignement si pas de bouton archiver */
        )}

        <Button type="button" variant="primary" onClick={onCancel} style={{ width: client?.id ? 'auto' : '100%', flex: client?.id ? '1' : 'none' }}>
          Fermer la fiche
        </Button>
      </div>
    </div>
  );
}
