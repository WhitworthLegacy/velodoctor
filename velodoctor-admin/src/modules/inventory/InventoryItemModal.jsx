import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Package } from 'lucide-react';
import { apiFetch } from '../../lib/apiClient';
import Button from '../../components/ui/Button';
import { deleteInventoryItemById } from '../../lib/adminApi';

const EMPTY_FORM = {
  name: '',
  reference: '',
  supplier_name: '',
  quantity: 0,
  min_threshold: 5,
  price_buy: '',
  price_sell: ''
};

function toFormValues(item) {
  if (!item) return { ...EMPTY_FORM };
  return {
    name: item.name || '',
    reference: item.reference || '',
    supplier_name: item.supplier_name || '',
    quantity: Number(item.quantity ?? 0),
    min_threshold: Number(item.min_threshold ?? 5),
    price_buy: item.price_buy ?? '',
    price_sell: item.price_sell ?? ''
  };
}

function formatPrice(value) {
  if (value == null || value === '') return '—';
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return '—';
  return `${parsed}€`;
}

function getProductMeta(item) {
  const product = Array.isArray(item?.products) ? item.products[0] : item?.products;
  return product || null;
}

export default function InventoryItemModal({ item, onSaved }) {
  const isNew = !item?.id;
  const [formData, setFormData] = useState(() => toFormValues(item));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [movementQty, setMovementQty] = useState(1);
  const [movementType, setMovementType] = useState('OUT');
  const [movementError, setMovementError] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [technician, setTechnician] = useState('');

  const currentProduct = useMemo(() => getProductMeta(item), [item]);
  const currentQty = item?.quantity ?? formData.quantity ?? 0;

  useEffect(() => {
    setFormData(toFormValues(item));
    setError(null);
  }, [item]);

  useEffect(() => {
    if (!item?.id || movementType !== 'OUT') return;
    loadClients();
  }, [item?.id, movementType]);

  async function loadClients() {
    try {
      const payload = await apiFetch('/api/admin/clients');
      setClients((payload.clients || []).slice(0, 50));
    } catch (err) {
      console.error(err);
      setMovementError(err?.message || 'Erreur chargement clients');
      setClients([]);
    }
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      name: formData.name,
      reference: formData.reference || null,
      supplier_name: formData.supplier_name || null,
      quantity: Number(formData.quantity ?? 0),
      min_threshold: Number(formData.min_threshold ?? 0),
      price_buy: formData.price_buy === '' ? null : Number(formData.price_buy),
      price_sell: formData.price_sell === '' ? null : Number(formData.price_sell)
    };

    try {
      if (isNew) {
        await apiFetch('/api/admin/inventory-items', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } else {
        await apiFetch(`/api/admin/inventory-items/${item.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
      }
      onSaved?.();
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Erreur sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  async function handleMovement(e) {
    e.preventDefault();
    if (!item?.id) return;
    setMovementError(null);
    const qty = parseInt(movementQty, 10);
    if (!Number.isFinite(qty) || qty <= 0) {
      setMovementError('Quantite invalide');
      return;
    }

    if (movementType === 'OUT' && qty > currentQty) {
      setMovementError('Stock insuffisant');
      return;
    }

    const delta = movementType === 'IN' ? qty : -qty;
    const noteParts = [];
    if (movementType === 'OUT') {
      noteParts.push(`Client: ${selectedClient || 'Client Comptoir'}`);
    }
    if (technician) {
      noteParts.push(`Technicien: ${technician}`);
    }

    try {
      await apiFetch('/api/admin/stock-movements', {
        method: 'POST',
        body: JSON.stringify({
          inventory_item_id: item.id,
          delta,
          reason: movementType === 'IN' ? 'Stock IN' : 'Stock OUT',
          note: noteParts.length > 0 ? noteParts.join(' | ') : null
        })
      });
      onSaved?.();
      setMovementQty(1);
    } catch (err) {
      console.error(err);
      setMovementError(err?.message || 'Erreur MAJ Stock');
    }
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px' }}>
        <div>
          <div style={{ width: '100%', aspectRatio: '1', background: '#F3F4F6', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {currentProduct?.cover_image_url ? (
              <img src={currentProduct.cover_image_url} alt={item?.name || formData.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Package size={48} color="#CBD5E1" />
            )}
          </div>
          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--gray)' }}>
            {currentProduct?.slug ? `Slug shop: ${currentProduct.slug}` : 'Produit shop non lie'}
          </div>
        </div>

        <div>
          <h3 style={{ marginTop: 0 }}>{item?.name || formData.name || 'Nouvelle piece'}</h3>
          {item?.reference || formData.reference ? (
            <p style={{ fontSize: '12px', color: 'var(--gray)' }}>
              Ref: {item?.reference || formData.reference} • Fourn: {item?.supplier_name || formData.supplier_name || '—'}
            </p>
          ) : null}

          <form onSubmit={handleSave}>
            {error && (
              <p style={{ color: 'var(--danger)', marginBottom: '10px' }}>
                {error}
              </p>
            )}

            {isNew && (
              <>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Nom de la piece</label>
                <input name="name" value={formData.name} onChange={handleChange} required placeholder="Ex: Pneu 10x2.5-6.5" />

                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Reference</label>
                    <input name="reference" value={formData.reference} onChange={handleChange} placeholder="REF-123" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Fournisseur</label>
                    <input name="supplier_name" value={formData.supplier_name} onChange={handleChange} placeholder="VeloDoctor" />
                  </div>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: isNew ? '10px' : 0 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Prix Achat HT</label>
                <input type="number" step="0.01" name="price_buy" value={formData.price_buy} onChange={handleChange} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Prix Vente TTC</label>
                <input type="number" step="0.01" name="price_sell" value={formData.price_sell} onChange={handleChange} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#DC2626' }}>Seuil Min</label>
                <input type="number" name="min_threshold" value={formData.min_threshold} onChange={handleChange} />
              </div>
            </div>

            {isNew ? (
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Stock Initial</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
                </div>
              </div>
            ) : null}

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
              <Button type="submit" disabled={saving}>
                {saving ? 'Sauvegarde...' : isNew ? 'Creer' : 'Enregistrer'}
              </Button>
              {!isNew && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!item?.id) return;
                    if (!confirm('Supprimer définitivement ce produit ?')) return;
                    setDeleting(true);
                    try {
                      await deleteInventoryItemById(item.id);
                      onSaved?.();
                    } catch (err) {
                      console.error(err);
                      setError(err?.message || 'Erreur suppression');
                    } finally {
                      setDeleting(false);
                    }
                  }}
                  disabled={deleting}
                  style={{
                    background: '#EF4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '13px',
                  }}
                >
                  {deleting ? 'Suppression...' : 'Supprimer le produit'}
                </button>
              )}
              <div style={{ fontSize: '12px', color: 'var(--gray)' }}>
                Achat: {formatPrice(formData.price_buy)} • Vente: {formatPrice(formData.price_sell)}
              </div>
            </div>
          </form>
        </div>
      </div>

      {!isNew && (
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
          <h4 style={{ marginTop: 0 }}>Mouvement de stock</h4>
          {movementError && (
            <p style={{ color: 'var(--danger)', marginBottom: '10px' }}>
              {movementError}
            </p>
          )}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
            <button
              type="button"
              onClick={() => setMovementType('OUT')}
              style={{
                background: movementType === 'OUT' ? '#FEF3C7' : '#F3F4F6',
                color: '#B45309',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ArrowDown size={14} /> Sortie
            </button>
            <button
              type="button"
              onClick={() => setMovementType('IN')}
              style={{
                background: movementType === 'IN' ? '#D1FAE5' : '#F3F4F6',
                color: '#065F46',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ArrowUp size={14} /> Entree
            </button>
            <div style={{ fontSize: '12px', color: 'var(--gray)' }}>
              Stock actuel: <strong>{currentQty}</strong>
            </div>
          </div>

          <form onSubmit={handleMovement}>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Quantite</label>
            <input type="number" min="1" value={movementQty} onChange={(e) => setMovementQty(e.target.value)} />

            {movementType === 'OUT' && (
              <div style={{ background: '#F3F4F6', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#00ACC2' }}>Client</label>
                <input
                  type="text"
                  placeholder="Rechercher ou taper nom..."
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  list="clients-list"
                />
                <datalist id="clients-list">
                  {clients.map((c) => <option key={c.id} value={c.full_name} />)}
                </datalist>

                <label style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '10px', display: 'block' }}>Technicien</label>
                <select value={technician} onChange={(e) => setTechnician(e.target.value)}>
                  <option value="">Selectionner...</option>
                  <option value="Marc">Marc</option>
                  <option value="Jean">Jean</option>
                  <option value="Sophie">Sophie</option>
                </select>
              </div>
            )}

            <Button type="submit" variant={movementType === 'IN' ? 'primary' : 'secondary'}>
              {movementType === 'IN' ? 'Ajouter au stock' : 'Valider la sortie'}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
