import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/apiClient';
import Button from '../../components/ui/Button';

export default function StockMovementModal({ item, type, onSuccess, onCancel }) {
  const [quantity, setQuantity] = useState(1);
  const [technician, setTechnician] = useState(''); // Nom du technicien (ou email session)
  const [error, setError] = useState(null);
  
  // Pour la sélection client
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');

  useEffect(() => {
    // Si c'est une sortie, on charge la liste des clients pour l'associer
    if (type === 'OUT') {
      loadClients();
    }
  }, [type]);

  async function loadClients() {
    try {
      const payload = await apiFetch('/api/admin/clients');
      setClients((payload.clients || []).slice(0, 50));
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Erreur chargement clients');
      setClients([]);
    }
  }

  async function handleConfirm(e) {
    e.preventDefault();
    setError(null);
    if (type === 'OUT' && quantity > item.quantity) {
      alert("⚠️ Stock insuffisant !");
      return;
    }

    try {
      const qty = parseInt(quantity, 10);
      const delta = type === 'IN' ? qty : -qty;
      const noteParts = [];
      if (type === 'OUT') {
        noteParts.push(`Client: ${selectedClient || 'Client Comptoir'}`);
      }
      if (technician) {
        noteParts.push(`Technicien: ${technician}`);
      }

      await apiFetch('/api/admin/stock-movements', {
        method: 'POST',
        body: JSON.stringify({
          inventory_item_id: item.id,
          delta,
          reason: type === 'IN' ? 'Stock IN' : 'Stock OUT',
          note: noteParts.length > 0 ? noteParts.join(' | ') : null
        })
      });

      onSuccess();
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Erreur MAJ Stock');
    }
  }

  return (
    <form onSubmit={handleConfirm}>
      {error && (
        <p style={{ color: 'var(--danger)', marginBottom: '10px' }}>
          {error}
        </p>
      )}
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
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
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
