import { Wrench, ShoppingBag, Truck, Clock, ShieldCheck, Zap, CheckCircle, MapPin } from 'lucide-react';
import Button from '@/components/Button';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Container from '@/components/Container';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* HERO SECTION - FRENCH */}
      <section className="relative bg-gradient-to-br from-vdDark to-vdPrimary overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}></div>
        </div>

        <Container className="relative z-10 py-14 md:py-20">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

            {/* Logo Icon */}
            <div className="w-16 h-16 bg-vdAccent rounded-xl flex items-center justify-center mb-6 shadow-vd-lg">
              <Zap className="w-9 h-9 text-white" strokeWidth={2.5} />
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 tracking-tight">
              VELODOCTOR
            </h1>

            {/* Tagline */}
            <p className="text-lg md:text-xl font-semibold text-white/90 mb-6">
              Vous roulez, on répare
            </p>

            {/* Subheading */}
            <p className="max-w-2xl text-base md:text-lg text-white/85 mb-8 leading-relaxed">
              Service de réparation mobile expert pour vélos et trottinettes électriques.
              Nous venons à vous pour que vous restiez en mouvement.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center">
              <Button
                href="/services"
                variant="primary"
                size="lg"
                icon={<Wrench size={20} />}
              >
                Réserver une réparation
              </Button>

              <Button
                href="/shop"
                variant="secondary"
                size="lg"
                icon={<ShoppingBag size={20} />}
                className="bg-white border-white text-vdDark hover:bg-gray-100"
              >
                Acheter des pièces
              </Button>
            </div>

          </div>
        </Container>
      </section>

      {/* HOW IT WORKS - FRENCH */}
      <Section spacing="default" background="white" containerSize="default">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-vdDark mb-3">
            Comment ça fonctionne
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            Réparez votre vélo ou trottinette en trois étapes simples
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <StepCard
            number="1"
            icon={<MapPin className="w-8 h-8" />}
            title="Réservez en ligne"
            description="Planifiez une réparation à l'endroit et l'heure qui vous conviennent. Nous venons chez vous, au bureau ou ailleurs."
          />
          <StepCard
            number="2"
            icon={<Wrench className="w-8 h-8" />}
            title="On répare"
            description="Notre technicien certifié arrive avec tous les outils et pièces nécessaires pour diagnostiquer et réparer votre véhicule sur place."
          />
          <StepCard
            number="3"
            icon={<CheckCircle className="w-8 h-8" />}
            title="Roulez à nouveau"
            description="Qualité garantie. Reprenez la route avec un vélo ou une trottinette parfaitement fonctionnel, couvert par notre garantie."
          />
        </div>
      </Section>

      {/* VALUE PROPOSITIONS - FRENCH */}
      <Section spacing="default" background="surface" containerSize="default">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-vdDark mb-3">
            Pourquoi choisir VeloDoctor
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            Le choix de confiance des cyclistes urbains et livreurs professionnels
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <ValueCard
            icon={<Truck className="w-9 h-9 text-vdPrimary" />}
            title="Service mobile"
            description="Pas besoin de transporter votre vélo. Nous apportons l'atelier chez vous, vous économisant temps et tracas."
          />
          <ValueCard
            icon={<ShieldCheck className="w-9 h-9 text-vdAccent" />}
            title="Réparations expertes"
            description="Techniciens certifiés formés sur tous les modèles de vélos et trottinettes. Un service professionnel en qui vous pouvez avoir confiance."
          />
          <ValueCard
            icon={<Clock className="w-9 h-9 text-vdPrimary" />}
            title="Délai rapide"
            description="La plupart des réparations sont effectuées le jour même. Reprenez la route rapidement avec un temps d'arrêt minimal."
          />
        </div>
      </Section>

      {/* CTA SECTION - FRENCH - REDUCED PADDING */}
      <Section spacing="sm" background="white" containerSize="default">
        <div className="bg-gradient-to-br from-vdPrimary to-vdDark rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-vd-md">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Prêt à rouler ?
          </h2>
          <p className="text-base md:text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            Réservez votre service de réparation mobile dès aujourd'hui et découvrez la commodité VeloDoctor.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              href="/services"
              variant="primary"
              size="md"
              icon={<Wrench size={20} />}
            >
              Planifier une réparation
            </Button>
            <Button
              href="/shop"
              variant="secondary"
              size="md"
              icon={<ShoppingBag size={20} />}
              className="bg-white border-white text-vdDark hover:bg-gray-100"
            >
              Parcourir la boutique
            </Button>
          </div>
        </div>
      </Section>

      {/* FOOTER - FRENCH */}
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
              <a href="/confidentialite" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="/conditions" className="hover:text-white transition-colors">Conditions</a>
              <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </Container>
      </footer>

    </main>
  );
}

// Step Card Component
function StepCard({ number, icon, title, description }) {
  return (
    <div className="relative">
      <Card className="text-center h-full" hover={true}>
        {/* Step Number Badge */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-11 h-11 bg-vdAccent rounded-full flex items-center justify-center shadow-vd-sm">
          <span className="text-white font-bold text-lg">{number}</span>
        </div>

        {/* Icon */}
        <div className="bg-vdPrimary/10 text-vdPrimary p-3.5 rounded-xl inline-flex mb-4 mt-4">
          {icon}
        </div>

        {/* Content */}
        <h3 className="text-lg md:text-xl font-bold text-vdDark mb-2">{title}</h3>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed">{description}</p>
      </Card>
    </div>
  );
}

// Value Card Component
function ValueCard({ icon, title, description }) {
  return (
    <Card className="text-center h-full group" hover={true}>
      <div className="bg-vdSurface p-4 rounded-xl inline-flex mb-4 group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-bold text-vdDark mb-2">{title}</h3>
      <p className="text-sm md:text-base text-gray-600 leading-relaxed">{description}</p>
    </Card>
  );
}