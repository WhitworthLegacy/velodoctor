import { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';

export default function VehicleSheet({ intervention, onClose }) {
  const [uploading, setUploading] = useState(false);
  const vehicle = intervention.vehicles;
  
  // On récupère les photos existantes (stockées en tableau de texte dans la DB)
  // Note: Pour le MVP on utilise un champ texte simple ou tableau, 
  // ici on va simuler l'ajout localement pour l'instant T.
  const [photos, setPhotos] = useState(intervention.photos_before || []);

  async function handlePhotoUpload(e) {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      // 1. Upload vers Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('photos')
        .upload(fileName, file);

      if (error) throw error;

      // 2. Récupérer l'URL publique
      const { data: publicUrlData } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);
      
      const newPhotoUrl = publicUrlData.publicUrl;

      // 3. Sauvegarder l'URL dans la table 'interventions' (SQL)
      // On ajoute la nouvelle URL au tableau existant
      const newPhotosList = [...photos, newPhotoUrl];
      
      const { error: dbError } = await supabase
        .from('interventions')
        .update({ photos_before: newPhotosList })
        .eq('id', intervention.id);

      if (dbError) throw dbError;

      setPhotos(newPhotosList); // Mettre à jour l'affichage
      alert("Photo ajoutée !");

    } catch (error) {
      console.error(error);
      alert("Erreur d'upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Fiche Véhicule</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
      </div>

      {/* Infos Véhicule */}
      <div style={{ background: '#F3F4F6', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 5px 0' }}>{vehicle.brand} {vehicle.model}</h3>
        <p style={{ margin: 0, color: 'var(--gray)', fontSize: '14px' }}>Type: {vehicle.type}</p>
        <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #ddd' }} />
        <p style={{ margin: 0, fontSize: '14px' }}>
          <strong>Client :</strong> {vehicle.clients?.full_name}<br/>
          <strong>Diagnostic :</strong> {intervention.diagnosis_note}
        </p>
      </div>

      {/* Section Photos */}
      <h4 style={{ marginBottom: '10px' }}>Photos (Preuves)</h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '15px' }}>
        {photos.map((url, index) => (
          <img key={index} src={url} alt="Preuve" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} />
        ))}
        
        {/* Bouton Faux Upload (Déclencheur) */}
        <label style={{ 
          border: '2px dashed #ddd', borderRadius: '8px', 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          aspectRatio: '1', cursor: 'pointer', color: 'var(--primary)'
        }}>
          {uploading ? '...' : <Camera size={24} />}
          <span style={{ fontSize: '10px', marginTop: '4px' }}>Ajouter</span>
          <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} disabled={uploading} />
        </label>
      </div>

      <Button variant="outline" onClick={onClose}>Fermer</Button>
    </div>
  );
}