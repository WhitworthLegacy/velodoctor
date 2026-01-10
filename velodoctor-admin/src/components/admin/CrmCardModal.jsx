import { useMemo, useState } from 'react';
import Modal from '../ui/Modal';

export default function CrmCardModal({
  open,
  onClose,
  client,
  columns = [],
  appointments = [],
  appointmentsLoading = false,
  onStageChange,
  onDeleteAppointment,
  isAdmin = false,
}) {
  const [noteDraft, setNoteDraft] = useState('');

  const stageValue = client?.crm_stage || 'reception';
  const stageOptions = useMemo(
    () => columns.map((col) => ({ value: col.slug, label: col.label })),
    [columns]
  );

  if (!open) return null;

  return (
    <Modal isOpen={open} onClose={onClose} title="Fiche CRM">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
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
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '20px' }}>
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

            <SectionBlock title="📅 Rendez-vous / المواعيد">
              {appointmentsLoading && <p style={{ margin: 0 }}>Chargement...</p>}
              {!appointmentsLoading && appointments.length === 0 && <p style={{ margin: 0 }}>—</p>}
              {!appointmentsLoading && appointments.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {appointments.map((apt) => (
                    <div key={apt.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
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

            <SectionBlock title="📎 Pièces jointes / المرفقات">
              <p style={{ margin: 0, color: 'var(--gray)' }}>Aucune pièce jointe.</p>
            </SectionBlock>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SectionBlock title="🗒️ Activité / Activity">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div style={{ padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                  <strong>System</strong>
                  <div style={{ color: 'var(--gray)' }}>Historique à venir…</div>
                </div>
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
        </div>
      </div>
    </Modal>
  );
}

function SectionBlock({ title, children }) {
  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '14px', border: '1px solid #E5E7EB' }}>
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
