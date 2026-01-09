import { useState, useEffect } from 'react';
import { Package, Plus, ArrowDown, ArrowUp, AlertTriangle, ShoppingCart, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import InventoryForm from './InventoryForm'; // Fichier suivant
import StockMovementModal from './StockMovementModal'; // Fichier suivant

export default function InventoryDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modales
  const [isFormOpen, setIsFormOpen] = useState(false); // Création/Edit
  const [isMoveOpen, setIsMoveOpen] = useState(false); // Entrée/Sortie
  const [selectedItem, setSelectedItem] = useState(null);
  const [moveType, setMoveType] = useState('OUT'); // 'IN' ou 'OUT'

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    setLoading(true);
    const { data } = await supabase.from('inventory_items').select('*').order('name');
    setItems(data || []);
    setLoading(false);
  }

  // Filtrage
  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.reference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Articles à commander (Stock <= Seuil)
  const lowStockItems = items.filter(i => i.quantity <= i.min_threshold);

  return (
    <div className="container" style={{ paddingBottom: '100px' }}>
      <header style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>📦 Stock</h1>
          <Button onClick={() => { setSelectedItem(null); setIsFormOpen(true); }} style={{ width: 'auto', padding: '8px 12px' }}>
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

      {loading ? <p>Chargement...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredItems.map(item => (
            <Card key={item.id} style={{ borderLeft: item.quantity <= item.min_threshold ? '4px solid #EF4444' : '4px solid #10B981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>{item.name}</h3>
                  <p style={{ color: 'var(--gray)', fontSize: '12px', margin: '2px 0' }}>Ref: {item.reference || 'N/A'} • Fourn: {item.supplier_name || '?'}</p>
                  <div style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--dark)', marginTop: '5px' }}>
                    Stock : {item.quantity} <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 'normal' }}>/ min {item.min_threshold}</span>
                  </div>
                </div>
                
                {/* Actions Rapides */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button 
                    onClick={() => { setSelectedItem(item); setMoveType('OUT'); setIsMoveOpen(true); }}
                    style={{ background: '#FEF3C7', color: '#B45309', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 'bold' }}
                  >
                    <ArrowDown size={14} /> Sortir
                  </button>
                  <button 
                    onClick={() => { setSelectedItem(item); setMoveType('IN'); setIsMoveOpen(true); }}
                    style={{ background: '#D1FAE5', color: '#065F46', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 'bold' }}
                  >
                    <ArrowUp size={14} /> Entrer
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modale Création / Édition */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Fiche Article">
        <InventoryForm 
          item={selectedItem} 
          onSuccess={() => { setIsFormOpen(false); fetchInventory(); }} 
          onCancel={() => setIsFormOpen(false)} 
        />
      </Modal>

      {/* Modale Mouvement (Entrée/Sortie) */}
      <Modal isOpen={isMoveOpen} onClose={() => setIsMoveOpen(false)} title={moveType === 'IN' ? "📦 Réception Stock" : "🔧 Sortie Atelier"}>
        <StockMovementModal
          item={selectedItem}
          type={moveType}
          onSuccess={() => { setIsMoveOpen(false); fetchInventory(); }}
          onCancel={() => setIsMoveOpen(false)}
        />
      </Modal>
    </div>
  );
}