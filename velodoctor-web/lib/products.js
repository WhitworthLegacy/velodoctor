const slugify = (value) =>
  value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const baseProducts = [
  {
    id: 1,
    name: "Batterie 36V 10Ah",
    price: 299,
    category: "Batteries",
    description:
      "Batterie lithium-ion haute capacité compatible avec la plupart des vélos électriques. Autonomie jusqu'à 50km selon utilisation.",
    features: [
      "Capacité: 10Ah / 36V",
      "Technologie: Lithium-ion",
      "Autonomie: jusqu'à 50km",
      "Garantie: 2 ans",
      "Compatible: vélos 36V standard",
    ],
    image: "/placeholder-battery.jpg",
    inStock: true,
  },
  {
    id: 2,
    name: "Kit freins hydrauliques",
    price: 89,
    category: "Freins",
    description:
      "Kit complet de freins hydrauliques pour vélo. Installation professionnelle recommandée.",
    features: [
      "Type: hydraulique",
      "Puissance de freinage élevée",
      "Installation disponible: +30€",
      "Garantie: 1 an",
    ],
    image: "/placeholder-brakes.jpg",
    inStock: true,
  },
  {
    id: 3,
    name: "Pneu trottinette 10 pouces",
    price: 35,
    category: "Pneus",
    description:
      "Pneu renforcé 10 pouces pour trottinettes électriques. Confort et adhérence améliorés.",
    features: [
      "Taille: 10 pouces",
      "Gomme renforcée",
      "Bonne adhérence sur route humide",
      "Montage possible en atelier",
    ],
    image: "/placeholder-tire.jpg",
    inStock: true,
  },
  {
    id: 4,
    name: "Chargeur universel 42V",
    price: 45,
    category: "Chargeurs",
    description:
      "Chargeur universel 42V compatible avec la plupart des batteries 36V.",
    features: [
      "Sortie: 42V",
      "Protection surtension",
      "Câble renforcé",
      "Garantie: 1 an",
    ],
    image: "/placeholder-charger.jpg",
    inStock: true,
  },
  {
    id: 5,
    name: "Éclairage LED avant",
    price: 25,
    category: "Accessoires",
    description:
      "Éclairage LED puissant pour visibilité maximale de nuit et par mauvais temps.",
    features: [
      "Lumen élevé",
      "Recharge USB",
      "Fixation rapide",
      "Autonomie longue durée",
    ],
    image: "/placeholder-light.jpg",
    inStock: true,
  },
  {
    id: 6,
    name: "Contrôleur moteur 48V",
    price: 120,
    category: "Électronique",
    description:
      "Contrôleur moteur 48V pour vélos électriques. Idéal pour remplacer une unité défaillante.",
    features: [
      "Compatibilité: moteurs 48V",
      "Gestion thermique améliorée",
      "Paramétrage en atelier",
      "Garantie: 1 an",
    ],
    image: "/placeholder-controller.jpg",
    inStock: false,
  },
];

export const products = baseProducts.map((product) => ({
  ...product,
  slug: product.slug || slugify(product.name),
}));

export const getProductBySlug = (slug) =>
  products.find((product) => product.slug === slug) || null;

if (process.env.NODE_ENV !== 'production') {
  const slugCounts = products.reduce((acc, product) => {
    if (!product.slug) {
      console.warn('[products] Missing slug for product:', product.name);
      return acc;
    }
    acc[product.slug] = (acc[product.slug] || 0) + 1;
    return acc;
  }, {});

  Object.entries(slugCounts).forEach(([slug, count]) => {
    if (count > 1) {
      console.warn(`[products] Duplicate slug detected: ${slug}`);
    }
  });
}
