import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function AdminDetailsModal({
  open,
  onClose,
  title,
  sections = [],
  actions = [],
  editableFields = [],
  onSave,
  saveLabel = 'Enregistrer',
  isAdmin = false,
  onDelete,
  deleteLabel = 'Supprimer',
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const canEdit = editableFields.length > 0 && typeof onSave === 'function';

  useEffect(() => {
    if (!open) return;
    const nextDraft = {};
    editableFields.forEach((field) => {
      nextDraft[field.name] = field.value ?? '';
    });
    setDraft(nextDraft);
    setIsEditing(false);
  }, [open, editableFields]);

  const renderValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return <span style={{ color: 'var(--gray)' }}>—</span>;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span style={{ color: 'var(--gray)' }}>—</span>;
      }
      return (
        <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {value.map((item, index) => (
            <li key={`${item}-${index}`} style={{ color: 'var(--dark)' }}>
              {item}
            </li>
          ))}
        </ul>
      );
    }

    return value;
  };

  const handleSave = async () => {
    await onSave?.(draft);
    setIsEditing(false);
  };

  return (
    <Modal isOpen={open} onClose={onClose} title={title}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: 'var(--gray)' }}>
          {canEdit ? 'Modifiable' : 'Consultation'}
        </div>
        {canEdit && (
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            style={{
              border: '1px solid #E5E7EB',
              padding: '6px 10px',
              borderRadius: '8px',
              background: isEditing ? '#00ACC2' : 'white',
              color: isEditing ? 'white' : '#1F2937',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isEditing ? 'Annuler' : 'Modifier'}
          </button>
        )}
      </div>

      {!isEditing && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
          }}
        >
          {sections.map((section) => (
            <div
              key={section.label}
              style={{
                background: '#F9FAFB',
                borderRadius: '12px',
                padding: '12px',
                border: '1px solid #E5E7EB',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--gray)',
                }}
              >
                {section.label}
              </span>
              <div style={{ marginTop: '6px', fontWeight: 600, color: 'var(--dark)' }}>
                {renderValue(section.value)}
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <div style={{ display: 'grid', gap: '12px' }}>
          {editableFields.map((field) => {
            const value = draft[field.name] ?? '';
            const commonProps = {
              id: field.name,
              name: field.name,
              value,
              onChange: (e) => setDraft((prev) => ({ ...prev, [field.name]: e.target.value })),
              style: { width: '100%' },
            };

            return (
              <label key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray)' }}>
                  {field.label}
                </span>
                {field.type === 'textarea' ? (
                  <textarea {...commonProps} rows={4} />
                ) : field.type === 'select' ? (
                  <select {...commonProps}>
                    {(field.options || []).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input type={field.type || 'text'} {...commonProps} />
                )}
              </label>
            );
          })}
        </div>
      )}

      {(actions.length > 0 || (isAdmin && onDelete) || (canEdit && isEditing)) && (
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
          {actions.map((action) => (
            <div key={action.label} style={{ minWidth: '160px' }}>
              <Button
                onClick={action.onClick}
                variant={action.variant || 'outline'}
                style={{ width: 'auto' }}
              >
                {action.label}
              </Button>
            </div>
          ))}
          {canEdit && isEditing && (
            <Button onClick={handleSave} style={{ width: 'auto' }}>
              {saveLabel}
            </Button>
          )}
          {isAdmin && onDelete && (
            <button
              onClick={onDelete}
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                background: '#ef4444',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {deleteLabel}
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}
