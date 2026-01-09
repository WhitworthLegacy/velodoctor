import { useEffect, useState } from 'react';
import { Users, Phone, Mail, MapPin, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../../components/ui/Card';

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('full_name', { ascending: true }); // Ordre alphabétique

      if (error) throw error;
      setClients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Filtrage dynamique selon la recherche
  const filteredClients = clients.filter(client => 
    client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm)
  );

  return (
    <div className="container">
      <header style={{ marginBottom: '20px' }}>
        <h1>👥 Clients</h1>
        
        {/* Barre de recherche */}
        <div style={{ position: 'relative', marginTop: '10px' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--gray)' }} />
          <input 
            type="text" 
            placeholder="Rechercher un nom ou un numéro..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px' }} // Espace pour l'icône
          />
        </div>
      </header>

      {loading ? <p>Chargement...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredClients.length === 0 ? (
            <p>Aucun client trouvé.</p>
          ) : (
            filteredClients.map((client) => (
              <Card key={client.id}>
                {/* Nom */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ 
                    background: 'var(--primary)', 
                    color: 'white', 
                    width: '40px', height: '40px', 
                    borderRadius: '50%', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {client.full_name.charAt(0)}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>{client.full_name}</h3>
                </div>

                {/* Coordonnées */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--dark)' }}>
                  
                  {/* Téléphone (Cliquable sur mobile) */}
                  {client.phone && (
                    <a href={`tel:${client.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                      <Phone size={16} color="var(--secondary)" />
                      {client.phone}
                    </a>
                  )}

                  {/* Email */}
                  {client.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={16} color="var(--gray)" />
                      {client.email}
                    </div>
                  )}

                  {/* Adresse */}
                  {client.address && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} color="var(--gray)" />
                      {client.address}
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}