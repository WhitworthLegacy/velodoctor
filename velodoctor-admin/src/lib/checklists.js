const DEFAULT_CHECKLISTS = {
  diagnostic: {
    title: "🔍 Diagnostic / التشخيص",
    items: [
      { id: "d1", label: "Identifier les problèmes", checked: false },
      { id: "d2", label: "Prendre des photos", checked: false },
    ],
  },
  devis: {
    title: "💰 Devis / عرض سعر",
    items: [
      { id: "q1", label: "Devis créé", checked: false },
      { id: "q2", label: "Devis validé/refusé", checked: false },
    ],
  },
  reparation: {
    title: "🛠️ Réparation / بصلح",
    items: [
      { id: "r1", label: "En attente de pièces", checked: false },
      { id: "r2", label: "Réparé", checked: false },
    ],
  },
  controle: {
    title: "✅ Contrôle final / السيطرة النهائية",
    items: [
      { id: "c1", label: "Tester le véhicule", checked: false },
      { id: "c2", label: "Nettoyage rapide", checked: false },
    ],
  },
  livraison: {
    title: "📦 Prêt / جاهز للتسليم",
    items: [
      { id: "l1", label: "Client prévenu", checked: false },
      { id: "l2", label: "Véhicule disponible", checked: false },
    ],
  },
};

function cloneCategory(category) {
  return {
    ...category,
    items: (category.items || []).map((item) => ({ ...item })),
  };
}

export function mergeChecklistsWithDefaults(source = {}) {
  const safeSource = source && typeof source === "object" ? source : {};
  const result = {};

  Object.entries(DEFAULT_CHECKLISTS).forEach(([key, category]) => {
    const incoming = safeSource[key];
    const baseItems = Array.isArray(incoming?.items) ? incoming.items : category.items;
    result[key] = {
      title: category.title,
      items: baseItems.map((item) => ({
        id: item.id,
        label: item.label,
        checked: Boolean(item.checked),
      })),
    };
  });

  Object.entries(safeSource).forEach(([key, category]) => {
    if (result[key]) return;
    result[key] = cloneCategory(category);
  });

  return result;
}

export { DEFAULT_CHECKLISTS };
