import { supabase } from './supabase';
import { CRM_STAGES } from './constants';

// ⚠️ COLLE ICI L'URL DE TA WEB APP GOOGLE (Obtenue après déploiement)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzfbv3XH8Awpvk0xRRtwnQiwnmzK9TW11ssBDrD3jIr7piI58DaKl6xc8pB1nFUeuFh/exec";

export const Automation = {
  
  /**
   * AUTOMATISATION PRINCIPALE
   * Marque le job comme fini ET déclenche l'envoi de mail via Google Script
   */
  async completeJob(table, id, client_id) {
    console.log(`🤖 Automation: Finishing job ${id}...`);

    // 1. Mise à jour de la mission (Status = Done)
    const { error: jobError } = await supabase
      .from(table)
      .update({ status: 'done' }) // ou 'ready' pour atelier, à adapter selon ta logique
      .eq('id', id);

    if (jobError) {
      console.error("Erreur MAJ Job:", jobError);
      return false;
    }

    // 2. Mise à jour CRM & Envoi Mail
    if (client_id) {
      // A. On passe le client en "Satisfaction" dans le CRM
      await supabase
        .from('clients')
        .update({ crm_stage: CRM_STAGES.SATISFACTION })
        .eq('id', client_id);
      
      // B. On appelle Google Script pour le mail
      await this.triggerGoogleMail(client_id);
    }

    return true;
  },

  /**
   * APPEL DU SCRIPT GOOGLE
   */
  async triggerGoogleMail(client_id) {
    try {
      // On récupère les infos fraîches du client
      const { data: client } = await supabase
        .from('clients')
        .select('*')
        .eq('id', client_id)
        .single();

      if (!client || !client.email) {
        alert("⚠️ Pas d'email client, envoi annulé.");
        return;
      }

      // On envoie les données à Google Script (en mode 'no-cors' pour éviter les erreurs navigateur)
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: client.email,
          name: client.full_name,
          type: 'satisfaction_survey' // Pour distinguer si tu ajoutes d'autres mails plus tard
        })
      });

      alert(`✅ Mail envoyé à ${client.full_name} (via Google)`);

    } catch (error) {
      console.error("Erreur appel Google Script:", error);
      alert("Erreur lors de l'envoi du mail.");
    }
  }
};