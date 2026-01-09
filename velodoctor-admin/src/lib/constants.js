//

// 1. RÔLES
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  DRIVER: 'driver',
  TECH: 'tech',
};

// 2. MAPPING CRM (Indispensable pour l'automatisation)
// On fait correspondre les clés du code aux "slugs" de ta base de données
export const CRM_STAGES = {
  NEW_LEAD: 'reception',       // Correspond à ta colonne "Réception"
  APPOINTMENT: 'missions',     // Correspond à "Missions"
  DONE: 'mission_fini',        // Correspond à "Mission fini"
  SATISFACTION: 'cloture',     // Correspond à "Cloture" (Le but final)
};

// 3. STATUTS LOGISTIQUE (Legacy)
export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_TRANSIT: 'in_transit',
  DONE: 'done',
  CANCELLED: 'cancelled',
};

// 4. STATUTS ATELIER (Legacy)
export const WORKSHOP_STATUS = {
  DIAGNOSING: 'diagnosing',
  QUOTE_SENT: 'quote_sent',
  APPROVED: 'approved',
  REPAIRING: 'repairing',
  READY: 'ready',
};

// 5. COULEURS (Badges & Colonnes)
export const STATUS_COLORS = {
  // Slugs DB (Trello)
  reception: 'bg-gray-200 text-gray-800',
  missions: 'bg-blue-100 text-blue-800',
  mission_fini: 'bg-green-100 text-green-800',
  atelier: 'bg-purple-100 text-purple-800',
  encaissements: 'bg-yellow-100 text-yellow-800',
  cloture: 'bg-teal-100 text-teal-800',
  annuler: 'bg-red-100 text-red-800',
  
  // Legacy
  pending: 'bg-gray-200 text-gray-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_transit: 'bg-orange-100 text-orange-800',
  done: 'bg-green-100 text-green-800',
  ready: 'bg-teal-100 text-teal-800',
  repairing: 'bg-orange-100 text-orange-800',
};

export const STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  in_transit: 'En transit',
  done: 'Terminé',
  cancelled: 'Annulé',
  diagnosing: 'Diagnostic',
  quote_sent: 'Devis envoyé',
  approved: 'Devis validé',
  repairing: 'Réparation',
  ready: 'Prêt',
};