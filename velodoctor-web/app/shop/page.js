import { ShoppingBag } from 'lucide-react';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Link from 'next/link';
import { products } from '@/lib/products';

export const metadata = {
  title: "Boutique - Pièces et accessoires vélo | VeloDoctor",
  description: "Achetez des pièces détachées et accessoires pour vélos et trottinettes électriques. Livraison rapide à Bruxelles.",
};

export default function ShopPage() {
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
            Livraison rapide à Bruxelles et alentours.
          </p>
        </div>
      </Section>

      {/* Products Grid */}
      <Section spacing="default" background="white">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* No products message */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun produit disponible pour le moment.</p>
          </div>
        )}
      </Section>

      {/* CTA Section */}
      <Section spacing="sm" background="surface">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-vdDark mb-3">
            Besoin d'un conseil ?
          </h2>
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
        <div className="aspect-square bg-vdSurface rounded-xl mb-4 flex items-center justify-center">
          <ShoppingBag className="w-16 h-16 text-gray-300" />
        </div>

        {/* Category Badge */}
        <div className="mb-2">
          <span className="text-xs font-medium text-vdPrimary bg-vdPrimary/10 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Product Info */}
        <h3 className="text-lg font-bold text-vdDark mb-2 group-hover:text-vdPrimary transition">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-vdAccent">
            {product.price}€
          </p>
          {product.inStock ? (
            <span className="text-xs text-green-600 font-medium">En stock</span>
          ) : (
            <span className="text-xs text-gray-400 font-medium">Rupture</span>
          )}
        </div>
      </Card>
    </Link>
  );
}
