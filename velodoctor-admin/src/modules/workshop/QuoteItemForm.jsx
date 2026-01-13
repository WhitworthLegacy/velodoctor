import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/apiClient';
import Button from '../../components/ui/Button';

export default function QuoteItemForm({ quoteId, item, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    kind: 'labor',
    inventory_item_id: null,
    label: '',
    qty: 1,
    unit_price: 0
  });
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingInventory, setLoadingInventory] = useState(false);

  useEffect(() => {
    // Load inventory items for parts selection
    fetchInventoryItems();

    // If editing, populate form
    if (item) {
      setFormData({
        kind: item.kind || 'labor',
        inventory_item_id: item.inventory_item_id || null,
        label: item.label || '',
        qty: item.qty || 1,
        unit_price: item.unit_price || 0
      });
    }
  }, [item]);

  async function fetchInventoryItems() {
    try {
      setLoadingInventory(true);
      const payload = await apiFetch('/api/admin/inventory-items');
      setInventoryItems(payload.items || []);
    } catch (err) {
      console.error('Error fetching inventory items:', err);
    } finally {
      setLoadingInventory(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleKindChange(e) {
    const newKind = e.target.value;
    setFormData(prev => ({
      ...prev,
      kind: newKind,
      inventory_item_id: null,
      label: '',
      unit_price: 0
    }));
  }

  function handleInventorySelect(e) {
    const itemId = e.target.value;
    if (!itemId) {
      setFormData(prev => ({
        ...prev,
        inventory_item_id: null,
        label: '',
        unit_price: 0
      }));
      return;
    }

    const selectedItem = inventoryItems.find(i => i.id === itemId);
    if (selectedItem) {
      setFormData(prev => ({
        ...prev,
        inventory_item_id: itemId,
        label: selectedItem.name,
        unit_price: selectedItem.price_sell || 0
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.label.trim()) {
      setError('Label is required');
      return;
    }
    if (formData.qty <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }
    if (formData.unit_price < 0) {
      setError('Unit price cannot be negative');
      return;
    }

    try {
      setLoading(true);

      const qty = parseFloat(formData.qty);
      const unitPrice = parseFloat(formData.unit_price);
      const lineTotal = qty * unitPrice;

      const itemData = {
        quote_id: quoteId,
        kind: formData.kind,
        inventory_item_id: formData.inventory_item_id || null,
        label: formData.label.trim(),
        qty,
        unit_price: unitPrice,
        line_total: lineTotal
      };

      if (item?.id) {
        await apiFetch(`/api/admin/quote-items/${item.id}`, {
          method: 'PATCH',
          body: JSON.stringify(itemData)
        });
      } else {
        await apiFetch(`/api/admin/quotes/${quoteId}/items`, {
          method: 'POST',
          body: JSON.stringify(itemData)
        });
      }

      // Success
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error saving quote item:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#fee',
          color: 'var(--danger)',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Kind Selection */}
      <div>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
          Type *
        </label>
        <select
          name="kind"
          value={formData.kind}
          onChange={handleKindChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          <option value="labor">Labor</option>
          <option value="part">Part</option>
        </select>
      </div>

      {/* For Parts: Inventory Selection */}
      {formData.kind === 'part' && (
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
            Select Part from Inventory
          </label>
          {loadingInventory ? (
            <p style={{ fontSize: '14px', color: 'var(--gray)' }}>Loading inventory...</p>
          ) : (
            <select
              value={formData.inventory_item_id || ''}
              onChange={handleInventorySelect}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="">-- Select a part --</option>
              {inventoryItems.map(invItem => (
                <option key={invItem.id} value={invItem.id}>
                  {invItem.name} - {invItem.price_sell?.toFixed(2) || '0.00'} € (Stock: {invItem.quantity || 0})
                </option>
              ))}
            </select>
          )}
          <p style={{ fontSize: '12px', color: 'var(--gray)', margin: '4px 0 0 0' }}>
            Selecting a part will auto-fill label and unit price. You can modify them below.
          </p>
        </div>
      )}

      {/* Label */}
      <div>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
          Label *
        </label>
        <input
          type="text"
          name="label"
          value={formData.label}
          onChange={handleChange}
          required
          placeholder={formData.kind === 'labor' ? 'e.g., Engine diagnosis' : 'e.g., Brake pads'}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Quantity */}
      <div>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
          Quantity *
        </label>
        <input
          type="number"
          name="qty"
          value={formData.qty}
          onChange={handleChange}
          required
          min="0.01"
          step="0.01"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Unit Price */}
      <div>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>
          Unit Price (€) *
        </label>
        <input
          type="number"
          name="unit_price"
          value={formData.unit_price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Line Total Preview */}
      <div style={{
        padding: '12px',
        backgroundColor: 'var(--bg)',
        borderRadius: '4px'
      }}>
        <p style={{ fontSize: '12px', color: 'var(--gray)', margin: '0 0 4px 0' }}>Line Total</p>
        <p style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: 'var(--primary)' }}>
          {(parseFloat(formData.qty || 0) * parseFloat(formData.unit_price || 0)).toFixed(2)} €
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Saving...' : (item ? 'Update Item' : 'Add Item')}
        </Button>
      </div>
    </form>
  );
}
