import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
    }
    // La redirection est gérée automatiquement par App.jsx
  }

  return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'var(--dark)', padding: '20px'
    }}>
      <div style={{
        background: 'white', padding: '30px', borderRadius: '16px',
        width: '100%', maxWidth: '400px', textAlign: 'center'
      }}>
        <div style={{ 
          width: '60px', height: '60px', background: 'var(--primary)', 
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
           <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        </div>
        <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Bienvenue</h1>
        <p style={{ color: 'var(--gray)', marginBottom: '30px' }}>Connectez-vous à l'espace VeloDoctor.</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" placeholder="Email employé" value={email}
            onChange={(e) => setEmail(e.target.value)} required style={{ padding: '14px' }}
          />
          <input 
            type="password" placeholder="Mot de passe" value={password}
            onChange={(e) => setPassword(e.target.value)} required style={{ padding: '14px' }}
          />
          {error && <div style={{ color: 'var(--danger)', background: '#fee2e2', padding: '10px', borderRadius: '8px' }}>{error}</div>}
          <Button type="submit" disabled={loading} style={{ marginTop: '10px' }}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
      </div>
    </div>
  );
}