import { useEffect, useMemo, useState } from 'react';
import { Camera } from 'lucide-react';
import Modal from '../ui/Modal';
import { apiFetch } from '../../lib/apiClient';
import { mergeChecklistsWithDefaults } from '../../lib/checklists';

export default function CrmCardModal({
  open,
  onClose,
  client,
  columns = [],
  appointments = [],
  appointmentsLoading = false,
  onStageChange,
  onDeleteAppointment,
  onChecklistChange,
  onPhotosChange,
  onDeleteClient,
  isAdmin = false,
}) {
  const [noteDraft, setNoteDraft] = useState('');
  const [checklists, setChecklists] = useState(() => mergeChecklistsWithDefaults());
  const [hiddenSections, setHiddenSections] = useState({});
  const [photos, setPhotos] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    setChecklists(mergeChecklistsWithDefaults(client?.checklists));
    setHiddenSections({});
    setPhotos(client?.crm_photos || []);
  }, [client]);

  const stageValue = client?.crm_stage || 'reception';
  const stageOptions = useMemo(
    () => columns.map((col) => ({ value: col.slug, label: col.label })),
    [columns]
  );

  const updateChecklists = (next) => {
    setChecklists(next);
    if (onChecklistChange && client?.id) {
      onChecklistChange(client.id, next);
    }
  };

  const toggleItem = (categoryKey, itemId) => {
    const next = { ...checklists };
    const category = next[categoryKey];
    if (!category || !category.items) return;
    const items = category.items.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    next[categoryKey] = { ...category, items };
    updateChecklists(next);
  };

  const handleAddChecklistItem = (categoryKey) => {
    const label = window.prompt("Nom de la tâche");
    if (!label) return;

    const next = { ...checklists };
    const category = next[categoryKey] || { title: categoryKey, items: [] };
    const newItem = { id: `custom-${Date.now()}`, label, checked: false };
    const items = [...(category.items || []), newItem];
    next[categoryKey] = { ...category, items };
    updateChecklists(next);
  };

  const handleRemoveCategory = (categoryKey) => {
    if (!window.confirm("Supprimer cette section du suivi ?")) return;
    const next = { ...checklists };
    delete next[categoryKey];
    updateChecklists(next);
  };

  const toggleHideChecked = (categoryKey) => {
    setHiddenSections((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }));
  };

  const calculateProgress = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) return 0;
    return Math.round((items.filter((item) => item.checked).length / items.length) * 100);
  };

  const handleDeleteClient = () => {
    if (!isAdmin || !client?.id || !onDeleteClient) return;
    if (!window.confirm("Supprimer définitivement ce client ?")) return;
    onDeleteClient(client);
  };

  const handlePhotoUpload = async (event) => {
    if (!client?.id) return;
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploadingPhoto(true);

    try {
      const payload = await apiFetch(`/api/admin/clients/${client.id}/photos`, {
        method: 'POST',
        body: formData,
        timeoutMs: 20000,
      });
      const nextPhotos = payload.photos || [];
      setPhotos(nextPhotos);
      if (onPhotosChange) {
        onPhotosChange(client.id, nextPhotos);
      }
      event.target.value = '';
    } catch (error) {
      console.error("[CRM] photo upload error:", error);
      alert("Impossible d'ajouter la photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (!open) return null;

  return (
    <Modal isOpen={open} onClose={onClose} title="Fiche CRM">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <h2 style={{ margin: 0, fontSize: '20px' }}>{client?.full_name || 'Client'}</h2>
            <div style={{ fontSize: '12px', color: 'var(--gray)' }}>
              #{String(client?.tracking_id || 0).padStart(5, '0')}
            </div>
          </div>
          <div style={{ minWidth: '220px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray)' }}>
              Étape / المرحلة
            </label>
            <select
              value={stageValue}
              onChange={(e) => onStageChange?.(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                fontWeight: 600,
              }}
            >
              {stageOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {isAdmin && (
            <button
              onClick={handleDeleteClient}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                background: '#EF4444',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Supprimer la fiche
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SectionBlock title="🗂️ Suivi des tâches">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {Object.entries(checklists).map(([key, category]) => {
                  const items = category?.items || [];
                  const progress = calculateProgress(items);
                  const visibleItems = hiddenSections[key]
                    ? items.filter((item) => !item.checked)
                    : items;
                  return (
                    <div
                      key={key}
                      style={{
                        background: '#F9FAFB',
                        padding: '12px',
                        borderRadius: '10px',
                        border: '1px solid #E5E7EB',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '6px',
                        }}
                      >
                        <div>
                          <span
                            style={{ fontWeight: 600, fontSize: '13px', color: '#1F2937' }}
                          >
                            {category?.title || key}
                          </span>
                          <span style={{ marginLeft: '10px', fontSize: '11px', color: '#6B7280' }}>
                            {progress}%
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => toggleHideChecked(key)}
                            style={{
                              fontSize: '11px',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid #CBD5E1',
                              background: hiddenSections[key] ? '#E0F2FE' : 'white',
                              cursor: 'pointer',
                            }}
                          >
                            {hiddenSections[key] ? 'Voir tous' : 'Cacher cochés'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(key)}
                            style={{
                              fontSize: '11px',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid #FECACA',
                              background: '#FEF2F2',
                              color: '#DC2626',
                              cursor: 'pointer',
                            }}
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '6px',
                          background: '#E5E7EB',
                          borderRadius: '4px',
                          marginBottom: '10px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: progress === 100 ? '#10B981' : '#00ACC2',
                            transition: 'width 0.3s',
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {visibleItems.map((item) => (
                          <label
                            key={item.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              color: item.checked ? '#9CA3AF' : '#1F2937',
                              textDecoration: item.checked ? 'line-through' : 'none',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={!!item.checked}
                              onChange={() => toggleItem(key, item.id)}
                              style={{ width: '14px', height: '14px', cursor: 'pointer' }}
                            />
                            {item.label}
                          </label>
                        ))}
                        {!visibleItems.length && (
                          <span style={{ color: '#9CA3AF', fontSize: '11px' }}>Aucune tâche</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddChecklistItem(key)}
                        style={{
                          marginTop: '10px',
                          fontSize: '12px',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px dashed #CBD5E1',
                          background: 'white',
                          cursor: 'pointer',
                          alignSelf: 'flex-start',
                        }}
                      >
                        Ajouter un élément
                      </button>
                    </div>
                  );
                })}
                {Object.keys(checklists).length === 0 && (
                  <p style={{ color: '#6B7280', fontSize: '13px' }}>Pas de section définie.</p>
                )}
              </div>
            </SectionBlock>

            <SectionBlock title="💬 Commentaires / التعليقات">
              <textarea
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Écrire un commentaire..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  padding: '10px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
              <button
                onClick={() => setNoteDraft('')}
                style={{
                  marginTop: '8px',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #00ACC2',
                  color: '#00ACC2',
                  background: 'transparent',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Ajouter
              </button>
            </SectionBlock>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SectionBlock title="👤 Profil / الملف الشخصي">
              <InfoRow label="Nom" value={client?.full_name} />
              <InfoRow label="Téléphone" value={client?.phone} />
              <InfoRow label="Email" value={client?.email} />
              <InfoRow label="Adresse" value={client?.address} />
            </SectionBlock>

            <SectionBlock title="🛠️ Véhicule / المركبة">
              <InfoRow label="Infos" value={client?.vehicle_info} />
            </SectionBlock>

            <SectionBlock title="📝 Notes / ملاحظات">
              <p style={{ margin: 0, color: 'var(--dark)' }}>{client?.notes || '—'}</p>
            </SectionBlock>

            <SectionBlock title="📷 Pièces jointes">
              {photos.length === 0 && (
                <p style={{ margin: 0, color: 'var(--gray)', fontSize: '13px' }}>Aucune pièce jointe.</p>
              )}
              {photos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' }}>
                  {photos.map((url, index) => (
                    <img
                      key={`${url}-${index}`}
                      src={url}
                      alt={`Attachment ${index + 1}`}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid #E5E7EB',
                      }}
                    />
                  ))}
                </div>
              )}
              <label
                style={{
                  marginTop: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px dashed #CBD5E1',
                  cursor: 'pointer',
                  width: 'fit-content',
                }}
              >
                <Camera size={16} />
                <span style={{ fontSize: '13px' }}>{uploadingPhoto ? 'Upload...' : 'Ajouter une photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                  disabled={uploadingPhoto}
                />
              </label>
            </SectionBlock>
          </div>
        </div>

        <SectionBlock title="📅 Rendez-vous / المواعيد">
          {appointmentsLoading && <p style={{ margin: 0 }}>Chargement...</p>}
          {!appointmentsLoading && appointments.length === 0 && <p style={{ margin: 0 }}>—</p>}
          {!appointmentsLoading && appointments.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {new Date(apt.scheduled_at).toLocaleString('fr-BE', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--gray)' }}>
                      {apt.service_type} · {apt.status}
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => onDeleteAppointment?.(apt.id)}
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
          )}
        </SectionBlock>

        <SectionBlock title="🗒️ Activité / Activity">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
              <strong>System</strong>
              <div style={{ color: 'var(--gray)' }}>Historique à venir…</div>
            </div>
          </div>
        </SectionBlock>
      </div>
    </Modal>
  );
}

function SectionBlock({ title, children }) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '14px',
        border: '1px solid #E5E7EB',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '10px' }}>{title}</div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '13px' }}>
      <span style={{ color: 'var(--gray)' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value || '—'}</span>
    </div>
  );
}
