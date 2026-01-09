import Link from 'next/link';
import { Zap } from 'lucide-react';
import Container from './Container';

export default function Footer() {
  return (
    <footer className="bg-vdDark text-gray-400 py-10">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-vdAccent rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-base">VeloDoctor</span>
          </div>

          <div className="text-center md:text-left">
            <p className="text-sm">© 2026 VeloDoctor. Tous droits réservés.</p>
            <p className="text-xs text-gray-500 mt-1">Vous roulez, on répare</p>
          </div>

          <div className="flex gap-5 text-sm">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="hover:text-white transition-colors">
              Confidentialité
            </Link>
            <Link href="/conditions" className="hover:text-white transition-colors">
              Conditions
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
