import { CRM_STAGES } from './constants';
import { apiFetch } from './apiClient';

// ⚠️ COLLE ICI L'URL DE TA WEB APP GOOGLE (Obtenue après déploiement)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzfbv3XH8Awpvk0xRRtwnQiwnmzK9TW11ssBDrD3jIr7piI58DaKl6xc8pB1nFUeuFh/exec";

export const Automation = {
  
  /**
   * AUTOMATISATION PRINCIPALE
   * Marque le job comme fini ET déclenche l'envoi de mail via Google Script
   */
  async completeJob(table, id, client_id) {
    console.log(`🤖 Automation: Finishing job ${id}...`);

    try {
      if (table === 'appointments') {
        await apiFetch(`/api/admin/appointments/${id}/complete`, { method: 'POST' });
      } else {
        await apiFetch(`/api/admin/${table}/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'done' }),
        });
      }
    } catch (jobError) {
      console.error("Erreur MAJ Job:", jobError);
      return false;
    }

    // 2. Mise à jour CRM & Envoi Mail
    if (client_id) {
      await apiFetch(`/api/admin/clients/${client_id}`, {
        method: 'PATCH',
        body: JSON.stringify({ crm_stage: CRM_STAGES.SATISFACTION }),
      });

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
      const payload = await apiFetch(`/api/admin/clients/${client_id}`);
      const client = payload.client;

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
