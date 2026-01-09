import { useState } from 'react';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

export default function QuoteForm({ intervention, onSuccess, onCancel }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // Mise à jour Supabase : Prix + Changement de statut
    const { error } = await supabase
      .from('interventions')
      .update({ 
        quote_amount: parseFloat(amount),
        status: 'quote_sent' 
      })
      .eq('id', intervention.id);

    setLoading(false);
    
    if (!error) {
      onSuccess(); // Ferme la modale et rafraîchit
    } else {
      alert("Erreur lors de l'envoi du devis");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ marginBottom: '15px', color: 'var(--gray)' }}>
        Pour : <strong>{intervention.vehicles?.brand} {intervention.vehicles?.model}</strong>
      </p>

      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
        Montant du devis (€)
      </label>
      <input 
        type="number" 
        placeholder="ex: 120.50" 
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        autoFocus
        step="0.01"
      />

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Envoi...' : 'Envoyer le devis'}
        </Button>
      </div>
    </form>
  );
}