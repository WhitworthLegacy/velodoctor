import Link from 'next/link';
import { Wrench, ShoppingBag, Truck, Clock, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-light text-dark">
      
      {/* 1. HERO SECTION : L'impact visuel */}
      <section className="relative bg-dark text-white overflow-hidden">
        {/* Fond abstrait ou image sombre ici */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark to-primary/80 opacity-90"></div>
        
        <div className="container mx-auto px-6 py-20 relative z-10 flex flex-col items-center text-center">
          {/* Logo Symbolique (L'éclair) */}
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6 shadow-lg animate-pulse">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold italic tracking-tight mb-4">
            VELODOCTOR
          </h1>
          <p className="text-xl md:text-2xl font-medium text-gray-200 mb-8 tracking-widest uppercase">
            You Ride, We Repair
          </p>
          
          <p className="max-w-2xl text-gray-300 mb-10 text-lg">
            Le spécialiste de la réparation mobile pour vélos et trottinettes électriques. 
            Nous venons à vous pour que vous restiez en mouvement.
          </p>

          {/* Les 2 Boutons d'Action (Le Split) */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
            <Link 
              href="/services" 
              className="flex items-center justify-center gap-2 bg-primary hover:bg-[#009bb0] text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-lg"
            >
              <Wrench size={20} />
              Réparer mon véhicule
            </Link>
            
            <Link 
              href="/shop" 
              className="flex items-center justify-center gap-2 bg-white text-dark hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-lg border-2 border-transparent hover:border-gray-200"
            >
              <ShoppingBag size={20} className="text-secondary" />
              Accéder à la boutique
            </Link>
          </div>
        </div>
      </section>

      {/* 2. NOS VALEURS (Tiré du PDF) */}
      <section className="py-20 container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10">
          <ValueCard 
            icon={<Truck className="w-10 h-10 text-primary" />}
            title="Commodité avant tout"
            text="Service à la demande, où que vous soyez. Fini la contrainte de transporter votre vélo."
          />
          <ValueCard 
            icon={<ShieldCheck className="w-10 h-10 text-secondary" />}
            title="Réparations expertes"
            text="Techniciens qualifiés pour tous les problèmes de vélos et trottinettes électriques."
          />
          <ValueCard 
            icon={<Clock className="w-10 h-10 text-primary" />}
            title="Mobilité Urbaine"
            text="Pensé pour les navetteurs et livreurs. Rapide, efficace et prêt pour la route."
          />
        </div>
      </section>

      {/* 3. FOOTER RAPIDE */}
      <footer className="bg-dark text-gray-400 py-10 text-center">
        <p>© 2026 VeloDoctor. All rights reserved.</p>
      </footer>
    </main>
  );
}

// Petit composant pour les cartes valeurs
function ValueCard({ icon, title, text }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center flex flex-col items-center">
      <div className="bg-gray-50 p-4 rounded-full mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-dark">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}