import { ShoppingBag, CheckCircle, ArrowLeft } from "lucide-react";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Link from "next/link";

import { getDbProductBySlug } from "@/lib/productsDb";
import { FALLBACK_PRODUCTS_ENABLED, getProductBySlug, toUiProductFromFallback } from "@/lib/products";

function toUiFromDb(db) {
  return {
    id: db.id,
    slug: db.slug,
    title: db.title,
    description: db.description,
    cover_image_url: db.cover_image_url,
    price: db.inventory_items?.price_sell ?? null,
    inStock: (db.inventory_items?.quantity ?? 0) > 0,
    features: [],
    category: "Pièce / Accessoire",
  };
}

async function resolveSlug(params) {
  // Next 15: params peut être un Promise
  const p = await params;
  return p?.slug ? String(p.slug) : null;
}

export async function generateMetadata({ params }) {
  const slug = await resolveSlug(params);

  if (!slug) return { title: "Produit non trouvé | VeloDoctor" };

  try {
    const db = await getDbProductBySlug(slug, { allowUnpublished: false });
    if (db) {
      return {
        title: db.seo_title || `${db.title} | VeloDoctor`,
        description: db.seo_description || db.description || undefined,
      };
    }
  } catch (e) {
    console.error("[shop][slug] generateMetadata DB error:", e);
  }

  const fb = getProductBySlug(slug);
  if (fb) {
    return { title: `${fb.name} | VeloDoctor`, description: fb.description };
  }

  return { title: "Produit non trouvé | VeloDoctor" };
}

export default async function ProductPage({ params }) {
  const slug = await resolveSlug(params);

  let product = null;
  let usedFallback = false;

  if (!slug) {
    return (
      <main className="min-h-screen bg-white">
        <Section spacing="lg" background="white">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-vdDark mb-4">Produit non trouvé</h1>
            <p className="text-gray-600 mb-6">Slug invalide.</p>
            <Button href="/shop" variant="secondary" icon={<ArrowLeft size={20} />}>
              Retour à la boutique
            </Button>
          </div>
        </Section>
      </main>
    );
  }

  try {
    const db = await getDbProductBySlug(slug, { allowUnpublished: false });
    if (db) product = toUiFromDb(db);
  } catch (e) {
    console.error("[shop][slug] DB error:", e);
  }

  if (!product && FALLBACK_PRODUCTS_ENABLED) {
    const fb = getProductBySlug(slug);
    if (fb) {
      usedFallback = true;
      product = toUiProductFromFallback(fb);
    }
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white">
        <Section spacing="lg" background="white">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-vdDark mb-4">Produit non trouvé</h1>
            <p className="text-gray-600 mb-6">Ce produit n'existe pas ou n'est plus disponible.</p>
            <Button href="/shop" variant="secondary" icon={<ArrowLeft size={20} />}>
              Retour à la boutique
            </Button>
          </div>
        </Section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Section spacing="sm" background="white">
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-vdPrimary transition">
          <ArrowLeft size={16} />
          <span>Retour à la boutique</span>
        </Link>
      </Section>

      <Section spacing="default" background="white">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="aspect-square bg-vdSurface rounded-2xl flex items-center justify-center sticky top-24">
              <ShoppingBag className="w-32 h-32 text-gray-300" />
            </div>
          </div>

          <div>
            <div className="mb-4">
              <span className="text-sm font-medium text-vdPrimary bg-vdPrimary/10 px-3 py-1 rounded-full">
                {product.category || "Pièce / Accessoire"}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-vdDark mb-4">{product.title}</h1>

            <div className="flex items-center gap-4 mb-6">
              <p className="text-4xl font-bold text-vdAccent">
                {typeof product.price === "number" ? `${product.price}€` : "Sur devis"}
              </p>

              {product.inStock ? (
                <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">En stock</span>
              ) : (
                <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">Rupture de stock</span>
              )}
            </div>

            {product.description && <p className="text-gray-700 leading-relaxed mb-8">{product.description}</p>}
            {usedFallback && <p className="text-sm text-gray-500 mb-6">(Mode dégradé : affichage provisoire)</p>}

            {Array.isArray(product.features) && product.features.length > 0 && (
              <Card className="mb-8">
                <h3 className="font-bold text-vdDark mb-4">Caractéristiques</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-5 h-5 text-vdPrimary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button href="/cart" variant="primary" size="lg" className="flex-1" disabled={!product.inStock}>
                {product.inStock ? "Ajouter au panier" : "Rupture de stock"}
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Poser une question
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}