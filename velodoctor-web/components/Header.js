import Link from 'next/link';
import { Zap, Menu, X } from 'lucide-react';
import Button from './Button';
import { useState } from 'react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-vdBorder">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-vdAccent rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold text-vdDark">VeloDoctor</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-vdPrimary transition">
              Accueil
            </Link>
            <Link href="/services" className="text-sm font-medium text-gray-600 hover:text-vdPrimary transition">
              Services
            </Link>
            <Link href="/shop" className="text-sm font-medium text-gray-600 hover:text-vdPrimary transition">
              Boutique
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-vdPrimary transition">
              Contact
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button href="/booking" variant="primary" size="sm">
              Réserver
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-vdPrimary"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
