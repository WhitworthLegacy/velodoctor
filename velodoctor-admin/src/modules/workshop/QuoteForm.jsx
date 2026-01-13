import { useState } from 'react';
import Button from '../../components/ui/Button';
import { apiFetch } from '../../lib/apiClient';

export default function QuoteForm({ intervention, onSuccess, onCancel }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Mise à jour Supabase : Prix + Changement de statut
    try {
      await apiFetch(`/api/admin/interventions/${intervention.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          quote_amount: parseFloat(amount),
          status: 'quote_sent'
        })
      });
      onSuccess(); // Ferme la modale et rafraîchit
    } catch (err) {
      console.error(err);
      setError(err?.message || "Erreur lors de l'envoi du devis");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <p style={{ color: 'var(--danger)', marginBottom: '10px' }}>
          {error}
        </p>
      )}
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
