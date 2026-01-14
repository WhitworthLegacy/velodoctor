import { useState, useEffect } from 'react';
import { Package, Plus, AlertTriangle, ShoppingCart, Search } from 'lucide-react';
import { apiFetch, getDataVersion } from '../../lib/apiClient';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import InventoryItemModal from './InventoryItemModal';

let inventoryCache = { data: null, version: 0 };

export default function InventoryDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modales
  const [isItemOpen, setIsItemOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    const handleDataChange = () => {
      inventoryCache = { data: null, version: getDataVersion() };
      fetchInventory(true);
    };

    window.addEventListener('admin-data-changed', handleDataChange);
    return () => window.removeEventListener('admin-data-changed', handleDataChange);
  }, []);

  async function fetchInventory(force = false) {
    const dataVersion = getDataVersion();
    if (!force && inventoryCache.data && inventoryCache.version === dataVersion) {
      setItems(inventoryCache.data);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const payload = await apiFetch('/api/admin/inventory-items');
      const nextItems = payload.items || [];
      inventoryCache = { data: nextItems, version: dataVersion };
      setItems(nextItems);
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Erreur chargement stock');
      setItems(inventoryCache || []);
    } finally {
      setLoading(false);
    }
  }

  // Filtrage
  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.reference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Articles à commander (Stock <= Seuil)
  const lowStockItems = items.filter(i => i.quantity <= i.min_threshold);

  function getCoverImage(item) {
    const product = Array.isArray(item.products) ? item.products[0] : item.products;
    return product?.cover_image_url || null;
  }

  function formatPrice(value) {
    if (value == null || value === '') return '—';
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return '—';
    return `${parsed}€`;
  }

  return (
    <div className="container inventory-container" style={{ paddingBottom: '100px' }}>
      <header style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>📦 Stock</h1>
          <Button onClick={() => { setSelectedItem(null); setIsItemOpen(true); }} style={{ width: 'auto', padding: '8px 12px' }}>
            <Plus size={18} /> Nouveau
          </Button>
        </div>

        {/* Barre de recherche */}
        <div style={{ position: 'relative', marginTop: '10px' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--gray)' }} />
          <input 
            type="text" 
            placeholder="Chercher pièce, référence..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>

        {/* Alerte Commande Automatique */}
        {lowStockItems.length > 0 && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '10px', borderRadius: '8px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#991B1B', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} />
              <strong>{lowStockItems.length} articles</strong> bientôt épuisés !
            </div>
            <button 
              onClick={() => alert(`Commande générée pour :\n${lowStockItems.map(i => `- ${i.name} (Reste: ${i.quantity})`).join('\n')}`)}
              style={{ background: '#DC2626', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', display: 'flex', gap: '4px' }}
            >
              <ShoppingCart size={14}/> Commander
            </button>
          </div>
        )}
      </header>

      {error && (
        <p style={{ color: 'var(--danger)', marginBottom: '12px' }}>
          {error}
        </p>
      )}

      {loading ? <p>Chargement...</p> : (
        <div className="inventory-grid">
          {filteredItems.map(item => (
            <Card
              key={item.id}
              onClick={() => { setSelectedItem(item); setIsItemOpen(true); }}
              style={{
                borderLeft: item.quantity <= item.min_threshold ? '4px solid #EF4444' : '4px solid #10B981',
                height: '100%'
              }}
            >
              <div style={{ width: '100%', aspectRatio: '1', background: '#F3F4F6', borderRadius: '12px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {getCoverImage(item) ? (
                  <img src={getCoverImage(item)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Package size={40} color="#CBD5E1" />
                )}
              </div>
              <h3 style={{ margin: 0, fontSize: '16px' }}>{item.name}</h3>
              <p style={{ color: 'var(--gray)', fontSize: '12px', margin: '4px 0 8px' }}>
                Ref: {item.reference || 'N/A'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--dark)' }}>
                  {formatPrice(item.price_sell)}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--gray)' }}>
                  Achat: {formatPrice(item.price_buy)}
                </div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '12px', color: item.quantity <= item.min_threshold ? '#DC2626' : '#10B981' }}>
                Stock: {item.quantity} / min {item.min_threshold}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isItemOpen}
        onClose={() => setIsItemOpen(false)}
        title={selectedItem ? 'Fiche article' : 'Nouvel article'}
      >
        <InventoryItemModal
          item={selectedItem}
          onSaved={() => { setIsItemOpen(false); fetchInventory(true); }}
        />
      </Modal>
    </div>
  );
}
