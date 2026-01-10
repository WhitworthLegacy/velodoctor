import { ShoppingBag, CheckCircle, ArrowLeft } from 'lucide-react';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Link from 'next/link';
import { getDbProductBySlug } from '@/lib/productsDb'; // ✅ nouveau

export async function generateMetadata({ params }) {
  const product = await getDbProductBySlug(params.slug);

  if (!product) {
    return { title: "Produit non trouvé | VeloDoctor" };
  }

  const title = product.seo_title || `${product.title} | VeloDoctor`;
  const description = product.seo_description || product.description || "Produit VeloDoctor";

  return { title, description };
}

export default async function ProductPage({ params }) {
  const product = await getDbProductBySlug(params.slug);

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

  const price = product.inventory_items?.price_sell ?? null;
  const qty = product.inventory_items?.quantity ?? 0;
  const inStock = qty > 0;

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
            <div className="aspect-square bg-vdSurface rounded-2xl flex items-center justify-center sticky top-24 overflow-hidden">
              {product.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.cover_image_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ShoppingBag className="w-32 h-32 text-gray-300" />
              )}
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-vdDark mb-4">{product.title}</h1>

            <div className="flex items-center gap-4 mb-6">
              <p className="text-4xl font-bold text-vdAccent">
                {price !== null ? `${price}€` : '—'}
              </p>

              {inStock ? (
                <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                  En stock
                </span>
              ) : (
                <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                  Rupture de stock
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-gray-700 leading-relaxed mb-8">{product.description}</p>
            )}

            {/* NOTE: features n’existent pas en DB actuellement -> tu peux soit:
                - les retirer
                - ou ajouter un champ JSONB features dans products
            */}
            <Card className="mb-8">
              <h3 className="font-bold text-vdDark mb-2">Infos</h3>
              <p className="text-sm text-gray-600">
                Référence stock: {product.inventory_items?.name || '—'}
              </p>
              <p className="text-sm text-gray-600">
                Stock: {qty}
              </p>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                href="/cart"
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={!inStock}
              >
                {inStock ? "Ajouter au panier" : "Rupture de stock"}
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