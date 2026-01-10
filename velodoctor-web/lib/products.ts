// lib/products.ts

export const slugify = (value: string) =>
  value
    .toString()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const FALLBACK_PRODUCTS_ENABLED = true;

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
    features: ["Lumen élevé", "Recharge USB", "Fixation rapide", "Autonomie longue durée"],
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
    features: ["Compatibilité: moteurs 48V", "Gestion thermique améliorée", "Paramétrage en atelier", "Garantie: 1 an"],
    image: "/placeholder-controller.jpg",
    inStock: false,
  },
];

export const products = baseProducts.map((p) => ({
  ...p,
  slug: slugify(p.name),
}));

export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug) || null;

export function toUiProductFromFallback(p: any) {
  return {
    id: String(p.id),
    slug: p.slug,
    title: p.name,
    description: p.description || null,
    cover_image_url: p.image || null,
    price: typeof p.price === "number" ? p.price : null,
    inStock: !!p.inStock,
    features: Array.isArray(p.features) ? p.features : [],
    category: p.category || null,
  };
}

export function toUiProductsFromFallback(list = products) {
  return list.map(toUiProductFromFallback);
}