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
    name: "Pneu 10x2.5-6.5",
    price: 34.99,
    category: "Pneus",
    description: "Pneu route pour trottinette, format 10x2.5-6.5.",
    features: ["Taille: 10x2.5-6.5", "Montage possible en atelier"],
    image: "/placeholder-tire.jpg",
    inStock: true,
  },
  {
    id: 2,
    name: "Pneu 8x2.125",
    price: 30.0,
    category: "Pneus",
    description: "Pneu 8x2.125 pour usage urbain.",
    features: ["Taille: 8x2.125", "Montage possible en atelier"],
    image: "/placeholder-tire.jpg",
    inStock: true,
  },
  {
    id: 3,
    name: "Pneu 10.2.75-6.5",
    price: 45.0,
    category: "Pneus",
    description: "Pneu 10.2.75-6.5 pour confort et adhérence.",
    features: ["Taille: 10.2.75-6.5", "Montage possible en atelier"],
    image: "/placeholder-tire.jpg",
    inStock: true,
  },
  {
    id: 4,
    name: "Pneu 10.2.75-6.5 Tubeless",
    price: 49.0,
    category: "Pneus",
    description: "Pneu tubeless 10.2.75-6.5 pour moins de crevaisons.",
    features: ["Taille: 10.2.75-6.5", "Tubeless"],
    image: "/placeholder-tire.jpg",
    inStock: true,
  },
  {
    id: 5,
    name: "Pneu 20x4",
    price: 50.0,
    category: "Pneus",
    description: "Pneu 20x4 pour vélos fatbike et gros volumes.",
    features: ["Taille: 20x4", "Gros volume"],
    image: "/placeholder-tire.jpg",
    inStock: true,
  },
  {
    id: 6,
    name: "Pneu 8x3 increvable",
    price: 39.0,
    category: "Pneus",
    description: "Pneu plein 8x3 increvable pour usage intensif.",
    features: ["Taille: 8x3", "Increvable"],
    image: "/placeholder-tire.jpg",
    inStock: true,
  },
  {
    id: 7,
    name: "Pneu 10x2.5-6.5 increvable",
    price: 44.0,
    category: "Pneus",
    description: "Pneu plein 10x2.5-6.5 increvable.",
    features: ["Taille: 10x2.5-6.5", "Increvable"],
    image: "/placeholder-tire.jpg",
    inStock: true,
  },
  {
    id: 8,
    name: "Pneu 60/70-6.5",
    price: 49.99,
    category: "Pneus",
    description: "Pneu 60/70-6.5 pour trottinette.",
    features: ["Taille: 60/70-6.5", "Montage possible en atelier"],
    image: "/placeholder-tire.jpg",
    inStock: true,
  },
  {
    id: 9,
    name: 'Pneu 26"',
    price: 59.0,
    category: "Pneus",
    description: 'Pneu 26" pour vélo.',
    features: ['Taille: 26"', "Montage possible en atelier"],
    image: "/placeholder-tire.jpg",
    inStock: true,
  },
  {
    id: 10,
    name: "Chaine anti-vol",
    price: 25.0,
    category: "Accessoires",
    description: "Chaine anti-vol robuste pour securiser le vehicule.",
    features: ["Securite renforcee", "Usage urbain"],
    image: "/placeholder-accessory.jpg",
    inStock: true,
  },
  {
    id: 11,
    name: 'Chambre a air 26"',
    price: 20.0,
    category: "Accessoires",
    description: 'Chambre a air 26" compatible velo.',
    features: ['Taille: 26"', "Montage possible en atelier"],
    image: "/placeholder-part.jpg",
    inStock: true,
  },
  {
    id: 12,
    name: "Cable de freins",
    price: 20.0,
    category: "Accessoires",
    description: "Cable de freins pour remplacement rapide.",
    features: ["Compatible freins standards"],
    image: "/placeholder-part.jpg",
    inStock: true,
  },
  {
    id: 13,
    name: "Chambre a air 8.5x3",
    price: 15.0,
    category: "Accessoires",
    description: "Chambre a air 8.5x3 pour trottinette.",
    features: ["Taille: 8.5x3", "Montage possible en atelier"],
    image: "/placeholder-part.jpg",
    inStock: true,
  },
  {
    id: 14,
    name: "Chambre a air 60/70-6.5",
    price: 15.0,
    category: "Accessoires",
    description: "Chambre a air 60/70-6.5.",
    features: ["Taille: 60/70-6.5", "Montage possible en atelier"],
    image: "/placeholder-part.jpg",
    inStock: true,
  },
  {
    id: 15,
    name: "Chambre a air 20x4",
    price: 24.95,
    category: "Accessoires",
    description: "Chambre a air 20x4 pour gros pneus.",
    features: ["Taille: 20x4", "Montage possible en atelier"],
    image: "/placeholder-part.jpg",
    inStock: true,
  },
  {
    id: 16,
    name: "Plaquettes de frein RT006",
    price: 15.0,
    category: "Accessoires",
    description: "Plaquettes de frein RT006.",
    features: ["Freinage fiable", "Remplacement rapide"],
    image: "/placeholder-brakes.jpg",
    inStock: true,
  },
  {
    id: 17,
    name: "Plaquettes de freins Magura",
    price: 15.0,
    category: "Accessoires",
    description: "Plaquettes compatibles Magura.",
    features: ["Freinage fiable", "Remplacement rapide"],
    image: "/placeholder-brakes.jpg",
    inStock: true,
  },
  {
    id: 18,
    name: "Display Kukirin",
    price: 70.0,
    category: "Accessoires",
    description: "Display Kukirin pour controle et affichage.",
    features: ["Affichage clair", "Compatible Kukirin"],
    image: "/placeholder-part.jpg",
    inStock: true,
  },
  {
    id: 19,
    name: "CS001 plaquettes resine 20mm (Xiaomi)",
    price: 15.0,
    category: "Accessoires",
    description: "Plaquettes resine 20mm compatibles Xiaomi.",
    features: ["Resine 20mm", "Compatible Xiaomi"],
    image: "/placeholder-brakes.jpg",
    inStock: true,
  },
  {
    id: 20,
    name: "Ecran S866 avec connecteur",
    price: 40.0,
    category: "Accessoires",
    description: "Ecran S866 avec connecteur.",
    features: ["Ecran de controle", "Connecteur inclus"],
    image: "/placeholder-part.jpg",
    inStock: true,
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
