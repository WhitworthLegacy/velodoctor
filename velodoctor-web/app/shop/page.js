import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { ShoppingBag } from "lucide-react";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Link from "next/link";
import { products as fallbackProducts } from "@/lib/products"; // fallback only
import { fetchPublishedProducts } from "@/lib/productsDb";

export const metadata = {
  title: "Boutique - Pièces et accessoires vélo | VeloDoctor",
  description:
    "Achetez des pièces détachées et accessoires pour vélos et trottinettes électriques. Livraison rapide à Bruxelles.",
};

function formatPrice(value) {
  if (value == null || Number.isNaN(Number(value))) return null;
  return `${Number(value)}€`;
}

function isInStock(dbProduct) {
  const qty = dbProduct?.inventory_items?.quantity;
  if (qty == null) return true; // si pas de stock géré, on n’affiche pas “rupture”
  return Number(qty) > 0;
}

export default async function ShopPage() {
  noStore(); // ⬅️ cette ligne uniquement
  let dbProducts = [];
  let dbError = null;

  try {
    dbProducts = await fetchPublishedProducts();
  } catch (e) {
    console.error("[shop] DB fetch error:", e);
    dbError = e;
  }

  const useFallback = !dbProducts || dbProducts.length === 0;

  // Normalize products for UI
  const list = useFallback
    ? fallbackProducts.map((p) => ({
        key: `fallback-${p.id}`,
        slug: p.slug,
        title: p.name,
        category: p.category,
        description: p.description,
        price: formatPrice(p.price),
        inStock: !!p.inStock,
        coverImageUrl: p.image || null,
        source: "fallback",
      }))
    : dbProducts.map((p) => ({
        key: p.id,
        slug: p.slug,
        title: p.title,
        category: null, // ta table products n’a pas category -> optionnel
        description: p.description,
        price: formatPrice(p.inventory_items?.price_sell),
        inStock: isInStock(p),
        coverImageUrl: p.cover_image_url,
        source: "db",
      }));

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <Section spacing="default" background="surface">
        <div className="text-center max-w-3xl mx-auto">
          <ShoppingBag className="w-12 h-12 text-vdPrimary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-vdDark mb-4">
            Boutique VeloDoctor
          </h1>
          <p className="text-lg text-gray-600">
            Pièces détachées et accessoires pour vélos et trottinettes électriques.
            Livraison à Bruxelles et alentours.
          </p>

          {dbError ? (
            <p className="mt-4 text-sm text-red-600">
              Erreur boutique (DB). Fallback activé.
            </p>
          ) : null}

          {useFallback ? (
            <p className="mt-4 text-sm text-gray-500">
              Mode fallback (produits en dur) — ajoute des produits dans Supabase pour activer la boutique DB.
            </p>
          ) : null}
        </div>
      </Section>

      {/* Products Grid */}
      <Section spacing="default" background="white">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((product) => (
            <ProductCard key={product.key} product={product} />
          ))}
        </div>

        {list.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun produit disponible pour le moment.</p>
          </div>
        )}
      </Section>

      {/* CTA Section */}
      <Section spacing="sm" background="surface">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-vdDark mb-3">Besoin d'un conseil ?</h2>
          <p className="text-gray-600 mb-6">
            Contactez-nous pour obtenir des recommandations personnalisées.
          </p>
          <Button href="/contact" variant="secondary" size="md">
            Nous contacter
          </Button>
        </div>
      </Section>
    </main>
  );
}

// Product Card Component
function ProductCard({ product }) {
  return (
    <Link href={`/shop/${product.slug}`}>
      <Card className="h-full group" hover={true}>
        {/* Product Image Placeholder */}
        <div className="aspect-square bg-vdSurface rounded-xl mb-4 flex items-center justify-center overflow-hidden">
          {product.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.coverImageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <ShoppingBag className="w-16 h-16 text-gray-300" />
          )}
        </div>

        {/* Optional category badge (fallback only unless you add category in DB later) */}
        {product.category ? (
          <div className="mb-2">
            <span className="text-xs font-medium text-vdPrimary bg-vdPrimary/10 px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        ) : null}

        <h3 className="text-lg font-bold text-vdDark mb-2 group-hover:text-vdPrimary transition">
          {product.title}
        </h3>

        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-vdAccent">
            {product.price ?? "Sur devis"}
          </p>

          {product.inStock ? (
            <span className="text-xs text-green-600 font-medium">En stock</span>
          ) : (
            <span className="text-xs text-gray-400 font-medium">Rupture</span>
          )}
        </div>

        {product.source === "db" ? null : (
          <p className="mt-3 text-xs text-gray-400">
            Produit fallback
          </p>
        )}
      </Card>
    </Link>
  );
}