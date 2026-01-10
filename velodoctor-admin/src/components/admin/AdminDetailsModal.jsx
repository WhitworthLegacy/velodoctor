import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function AdminDetailsModal({
  open,
  onClose,
  title,
  sections = [],
  actions = [],
  isAdmin = false,
  onDelete,
  deleteLabel = 'Supprimer',
}) {
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

  return (
    <Modal isOpen={open} onClose={onClose} title={title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sections.map((section) => (
          <div key={section.label} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gray)' }}>
              {section.label}
            </span>
            <div style={{ fontWeight: 500, color: 'var(--dark)' }}>{renderValue(section.value)}</div>
          </div>
        ))}
      </div>

      {(actions.length > 0 || (isAdmin && onDelete)) && (
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
