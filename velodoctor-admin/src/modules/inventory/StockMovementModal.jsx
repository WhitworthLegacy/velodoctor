import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';

export default function StockMovementModal({ item, type, onSuccess, onCancel }) {
  const [quantity, setQuantity] = useState(1);
  const [technician, setTechnician] = useState(''); // Nom du technicien (ou email session)
  
  // Pour la sélection client
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [searchClient, setSearchClient] = useState('');

  useEffect(() => {
    // Si c'est une sortie, on charge la liste des clients pour l'associer
    if (type === 'OUT') {
      loadClients();
    }
  }, [type]);

  async function loadClients() {
    const { data } = await supabase.from('clients').select('id, full_name').order('full_name').limit(50);
    setClients(data || []);
  }

  async function handleConfirm(e) {
    e.preventDefault();
    if (type === 'OUT' && quantity > item.quantity) {
      alert("⚠️ Stock insuffisant !");
      return;
    }

    // 1. Calculer nouvelle quantité
    const newQty = type === 'IN' ? item.quantity + parseInt(quantity) : item.quantity - parseInt(quantity);

    // 2. Mettre à jour l'article
    const { error: updateError } = await supabase
      .from('inventory_items')
      .update({ quantity: newQty })
      .eq('id', item.id);

    if (updateError) { alert("Erreur MAJ Stock"); return; }

    // 3. Créer l'historique (TRACEABILITÉ)
    await supabase.from('stock_movements').insert([{
      item_id: item.id,
      type: type,
      quantity: parseInt(quantity),
      related_client_name: type === 'OUT' ? (searchClient || 'Client Comptoir') : null,
      technician_name: technician || 'Technicien'
    }]);

    onSuccess();
  }

  return (
    <form onSubmit={handleConfirm}>
      <p style={{ marginBottom: '15px' }}>
        Mouvement pour : <strong>{item.name}</strong><br/>
        Stock actuel : {item.quantity}
      </p>

      <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Quantité</label>
      <input 
        type="number" min="1" 
        value={quantity} 
        onChange={(e) => setQuantity(e.target.value)} 
        autoFocus 
      />

      {type === 'OUT' && (
        <div style={{ background: '#F3F4F6', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#00ACC2' }}>👤 Pour quel client ?</label>
          <input 
            type="text" 
            placeholder="Rechercher ou taper nom..." 
            value={searchClient}
            onChange={(e) => setSearchClient(e.target.value)}
            list="clients-list"
          />
          <datalist id="clients-list">
            {clients.map(c => <option key={c.id} value={c.full_name} />)}
          </datalist>

          <label style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '10px', display: 'block' }}>🔧 Technicien</label>
          <select value={technician} onChange={(e) => setTechnician(e.target.value)}>
             <option value="">Sélectionner...</option>
             <option value="Marc">Marc</option>
             <option value="Jean">Jean</option>
             <option value="Sophie">Sophie</option>
          </select>
        </div>
      )}

      <Button type="submit" variant={type === 'IN' ? 'primary' : 'secondary'}>
        {type === 'IN' ? 'Ajouter au stock' : 'Valider la sortie'}
      </Button>
    </form>
  );
}