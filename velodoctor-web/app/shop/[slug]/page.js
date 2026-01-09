import { ShoppingBag, CheckCircle, ArrowLeft } from 'lucide-react';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Link from 'next/link';
import { getProductBySlug } from '@/lib/products';

export async function generateMetadata({ params }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Produit non trouvé | VeloDoctor",
    };
  }

  return {
    title: `${product.name} - ${product.price}€ | VeloDoctor`,
    description: product.description,
  };
}

export default function ProductPage({ params }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return (
      <main className="min-h-screen bg-white">
        <Section spacing="lg" background="white">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-vdDark mb-4">
              Produit non trouvé
            </h1>
            <p className="text-gray-600 mb-6">
              Ce produit n'existe pas ou n'est plus disponible.
            </p>
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

      {/* Back link */}
      <Section spacing="sm" background="white">
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-vdPrimary transition">
          <ArrowLeft size={16} />
          <span>Retour à la boutique</span>
        </Link>
      </Section>

      {/* Product Detail */}
      <Section spacing="default" background="white">
        <div className="grid md:grid-cols-2 gap-12">

          {/* Product Image */}
          <div>
            <div className="aspect-square bg-vdSurface rounded-2xl flex items-center justify-center sticky top-24">
              <ShoppingBag className="w-32 h-32 text-gray-300" />
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Category Badge */}
            <div className="mb-4">
              <span className="text-sm font-medium text-vdPrimary bg-vdPrimary/10 px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-vdDark mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <p className="text-4xl font-bold text-vdAccent">
                {product.price}€
              </p>
              {product.inStock ? (
                <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                  En stock
                </span>
              ) : (
                <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                  Rupture de stock
                </span>
              )}
            </div>

            <p className="text-gray-700 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Features */}
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

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                href="/cart"
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={!product.inStock}
              >
                {product.inStock ? "Ajouter au panier" : "Rupture de stock"}
              </Button>
              <Button
                href="/contact"
                variant="secondary"
                size="lg"
              >
                Poser une question
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-vdBorder">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-vdPrimary flex-shrink-0 mt-0.5" />
                  <span>Livraison gratuite à Bruxelles</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-vdPrimary flex-shrink-0 mt-0.5" />
                  <span>Installation disponible (+30€)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-vdPrimary flex-shrink-0 mt-0.5" />
                  <span>Garantie constructeur incluse</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

    </main>
  );
}
