import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Wrench, Package } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import QuoteItemForm from './QuoteItemForm';

export default function QuoteItemsList({ quoteId, onItemsChange }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchItems();
  }, [quoteId]);

  async function fetchItems() {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('quote_items')
        .select(`
          *,
          inventory_items (
            id,
            name,
            price_sell
          )
        `)
        .eq('quote_id', quoteId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setItems(data || []);
    } catch (err) {
      console.error('Error fetching quote items:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      setDeleteLoading(itemId);
      setError(null);

      // Delete the item
      const { error: deleteError } = await supabase
        .from('quote_items')
        .delete()
        .eq('id', itemId);

      if (deleteError) throw deleteError;

      // Recalculate totals
      await supabase.rpc('recalc_quote_totals', { p_quote_id: quoteId });

      // Refresh items and parent quote
      await fetchItems();
      if (onItemsChange) onItemsChange();
    } catch (err) {
      console.error('Error deleting quote item:', err);
      setError(err.message);
    } finally {
      setDeleteLoading(null);
    }
  }

  function handleAdd() {
    setEditingItem(null);
    setIsModalOpen(true);
  }

  function handleEdit(item) {
    setEditingItem(item);
    setIsModalOpen(true);
  }

  async function handleFormSuccess() {
    setIsModalOpen(false);
    setEditingItem(null);
    await fetchItems();
    if (onItemsChange) onItemsChange();
  }

  function handleFormCancel() {
    setIsModalOpen(false);
    setEditingItem(null);
  }

  if (loading) {
    return (
      <Card>
        <p>Loading quote items...</p>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>Quote Items</h3>
          <Button onClick={handleAdd}>
            <Plus size={16} /> Add Item
          </Button>
        </div>

        {error && (
          <p style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</p>
        )}

        {items.length === 0 ? (
          <p style={{ color: 'var(--gray)', textAlign: 'center', padding: '20px' }}>
            No items added yet. Click "Add Item" to get started.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--bg)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--gray)', fontWeight: '600' }}>Type</th>
                  <th style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--gray)', fontWeight: '600' }}>Label</th>
                  <th style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--gray)', fontWeight: '600', textAlign: 'right' }}>Qty</th>
                  <th style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--gray)', fontWeight: '600', textAlign: 'right' }}>Unit Price</th>
                  <th style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--gray)', fontWeight: '600', textAlign: 'right' }}>Total</th>
                  <th style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--gray)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--bg)' }}>
                    <td style={{ padding: '12px 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {item.kind === 'labor' ? (
                          <>
                            <Wrench size={16} color="var(--primary)" />
                            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary)' }}>Labor</span>
                          </>
                        ) : (
                          <>
                            <Package size={16} color="var(--secondary)" />
                            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--secondary)' }}>Part</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>{item.label}</p>
                        {item.inventory_items && (
                          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--gray)' }}>
                            ({item.inventory_items.name})
                          </p>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '14px' }}>
                      {item.qty}
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '14px' }}>
                      {(item.unit_price || 0).toFixed(2)} €
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '14px', fontWeight: '600' }}>
                      {(item.line_total || 0).toFixed(2)} €
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleEdit(item)}
                          style={{
                            padding: '6px',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteLoading === item.id}
                          style={{
                            padding: '6px',
                            border: 'none',
                            background: 'transparent',
                            cursor: deleteLoading === item.id ? 'not-allowed' : 'pointer',
                            color: 'var(--danger)',
                            display: 'flex',
                            alignItems: 'center',
                            opacity: deleteLoading === item.id ? 0.5 : 1
                          }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add/Edit Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleFormCancel}
        title={editingItem ? 'Edit Quote Item' : 'Add Quote Item'}
      >
        <QuoteItemForm
          quoteId={quoteId}
          item={editingItem}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </Modal>
    </>
  );
}
