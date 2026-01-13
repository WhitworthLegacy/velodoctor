import { useState } from 'react';
import { apiFetch } from '../../lib/apiClient';
import Button from '../../components/ui/Button';

export default function InventoryForm({ item, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    reference: item?.reference || '',
    supplier_name: item?.supplier_name || '',
    quantity: item?.quantity || 0,
    min_threshold: item?.min_threshold || 5,
    price_buy: item?.price_buy || '',
    price_sell: item?.price_sell || ''
  });
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...formData };

    try {
      setError(null);
      if (item?.id) {
        await apiFetch(`/api/admin/inventory-items/${item.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
      } else {
        await apiFetch('/api/admin/inventory-items', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Erreur sauvegarde');
    }
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <p style={{ color: 'var(--danger)', marginBottom: '10px' }}>
          {error}
        </p>
      )}
      <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Nom de la pièce</label>
      <input name="name" value={formData.name} onChange={handleChange} required placeholder="Ex: Chambre à air 8.5" />

      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1 }}>
           <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Référence</label>
           <input name="reference" value={formData.reference} onChange={handleChange} placeholder="REF-123" />
        </div>
        <div style={{ flex: 1 }}>
           <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Fournisseur</label>
           <input name="supplier_name" value={formData.supplier_name} onChange={handleChange} placeholder="VeloParts" />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1 }}>
           <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Stock Initial</label>
           <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
        </div>
        <div style={{ flex: 1 }}>
           <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#DC2626' }}>Alerte Min</label>
           <input type="number" name="min_threshold" value={formData.min_threshold} onChange={handleChange} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1 }}>
           <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Prix Achat HT</label>
           <input type="number" step="0.01" name="price_buy" value={formData.price_buy} onChange={handleChange} />
        </div>
        <div style={{ flex: 1 }}>
           <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Prix Vente TTC</label>
           <input type="number" step="0.01" name="price_sell" value={formData.price_sell} onChange={handleChange} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
}
