'use client';

import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  // Mock cart state (will be replaced with real state management later)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      slug: "batterie-36v-10ah",
      name: "Batterie 36V 10Ah",
      price: 299,
      quantity: 1,
    },
    {
      id: 2,
      slug: "kit-freins-hydrauliques",
      name: "Kit freins hydrauliques",
      price: 89,
      quantity: 2,
    },
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <Section spacing="lg" background="white">
          <div className="text-center max-w-2xl mx-auto">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-vdDark mb-4">
              Votre panier est vide
            </h1>
            <p className="text-gray-600 mb-8">
              Parcourez notre boutique pour ajouter des produits à votre panier.
            </p>
            <Button href="/shop" variant="primary" size="lg">
              Voir la boutique
            </Button>
          </div>
        </Section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <Section spacing="default" background="surface">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-vdDark mb-4">
            Panier
          </h1>
          <p className="text-lg text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'article' : 'articles'} dans votre panier
          </p>
        </div>
      </Section>

      {/* Cart Content */}
      <Section spacing="default" background="white">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} padding="default">
                <div className="flex gap-4">
                  {/* Product Image Placeholder */}
                  <div className="w-24 h-24 bg-vdSurface rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/shop/${item.slug}`}
                      className="font-semibold text-vdDark hover:text-vdPrimary transition block mb-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-vdAccent font-bold text-lg">
                      {item.price}€
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-vdBorder rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2 hover:bg-vdSurface transition"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="px-4 font-medium text-vdDark">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2 hover:bg-vdSurface transition"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h2 className="text-xl font-bold text-vdDark mb-6">
                Résumé de la commande
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-vdBorder">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span className="font-medium">{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Gratuit' : `${shipping.toFixed(2)}€`}
                  </span>
                </div>
                {subtotal < 100 && (
                  <p className="text-xs text-vdPrimary">
                    Livraison gratuite dès 100€ d'achat
                  </p>
                )}
              </div>

              <div className="flex justify-between text-xl font-bold text-vdDark mb-6">
                <span>Total</span>
                <span>{total.toFixed(2)}€</span>
              </div>

              <Button
                href="/checkout"
                variant="primary"
                size="lg"
                className="w-full mb-3"
              >
                Commander
              </Button>

              <Button
                href="/shop"
                variant="ghost"
                size="md"
                className="w-full"
              >
                Continuer mes achats
              </Button>
            </Card>
          </div>
        </div>
      </Section>

    </main>
  );
}
