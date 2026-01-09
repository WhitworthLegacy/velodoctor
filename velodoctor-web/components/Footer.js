import Link from 'next/link';
import { Zap } from 'lucide-react';
import Container from './Container';

export default function Footer() {
  return (
    <footer className="bg-vdDark text-white py-12">
      <Container>
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-vdAccent rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-base">VeloDoctor</span>
            </div>
            <p className="text-sm text-white opacity-80">
              Réparation mobile de vélos et trottinettes électriques à Bruxelles.
              Diagnostic, devis et interventions rapides à domicile ou en atelier.
            </p>
            <div className="text-sm text-white">
              <p>Contact: <a className="underline" href="mailto:trott@velodoctor.be">trott@velodoctor.be</a></p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <h3 className="font-semibold uppercase tracking-wide text-white">Navigation</h3>
            <div className="flex flex-col gap-2">
              <Link href="/services" className="hover:opacity-80 transition">Services</Link>
              <Link href="/booking" className="hover:opacity-80 transition">Rendez-vous</Link>
              <Link href="/shop" className="hover:opacity-80 transition">Boutique</Link>
              <Link href="/blog" className="hover:opacity-80 transition">Blog</Link>
              <Link href="/contact" className="hover:opacity-80 transition">Contact</Link>
              <Link href="/zones" className="hover:opacity-80 transition">Zones desservies</Link>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <h3 className="font-semibold uppercase tracking-wide text-white">Informations</h3>
            <div className="flex flex-col gap-2">
              <Link href="/mentions-legales" className="hover:opacity-80 transition">
                Mentions légales
              </Link>
              <Link href="/confidentialite" className="hover:opacity-80 transition">
                Confidentialité
              </Link>
              <Link href="/conditions" className="hover:opacity-80 transition">
                Conditions
              </Link>
            </div>
            <p className="text-xs text-white opacity-80">© 2026 VeloDoctor. Tous droits réservés.</p>
          </div>

          <div className="space-y-3 text-sm md:col-span-1">
            <h3 className="font-semibold uppercase tracking-wide text-white">Zones desservies</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-white">
              <span>Anderlecht</span>
              <span>Auderghem</span>
              <span>Berchem-Sainte-Agathe</span>
              <span>Bruxelles-Ville</span>
              <span>Etterbeek</span>
              <span>Evere</span>
              <span>Forest</span>
              <span>Ganshoren</span>
              <span>Ixelles</span>
              <span>Jette</span>
              <span>Koekelberg</span>
              <span>Molenbeek-Saint-Jean</span>
              <span>Saint-Gilles</span>
              <span>Saint-Josse-ten-Noode</span>
              <span>Schaerbeek</span>
              <span>Uccle</span>
              <span>Watermael-Boitsfort</span>
              <span>Woluwe-Saint-Lambert</span>
              <span>Woluwe-Saint-Pierre</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
