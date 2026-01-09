import { Wrench, ShoppingBag, ShieldCheck, Zap, CheckCircle, MapPin, Phone, Mail, MessageCircle, Star, Euro, HelpCircle } from 'lucide-react';
import Button from '@/components/Button';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Container from '@/components/Container';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* HERO SECTION - PREMIUM MINIMAL WHITE */}
      <Section spacing="lg" background="white">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">

          {/* Small Accent Badge */}
          <div className="inline-flex items-center gap-2 bg-vdSurface border border-vdBorder rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-vdAccent" strokeWidth={2.5} />
            <span className="text-sm font-medium text-vdDark">Service mobile premium</span>
          </div>

          {/* Main Heading with Accent Underline */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-vdDark mb-4 tracking-tight">
            Réparation mobile de{' '}
            <span className="accent-underline">vélos et trottinettes</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 font-medium">
            Vous roulez, on répare
          </p>

          {/* Subheading */}
          <p className="max-w-2xl text-base md:text-lg text-gray-600 mb-10 leading-relaxed">
            Service de réparation expert à domicile pour vélos et trottinettes électriques.
            Diagnostic offert, intervention rapide, garantie incluse.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl justify-center mb-8">
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
            >
              Acheter des pièces
            </Button>

            <Button
              href="/contact"
              variant="ghost"
              size="lg"
              icon={<Phone size={20} />}
            >
              Nous contacter
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 pt-6 border-t border-vdBorder">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-vdPrimary" />
              <span>Diagnostic gratuit</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-vdPrimary" />
              <span>Intervention sous 48h</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-vdPrimary" />
              <span>Garantie 6 mois</span>
            </div>
          </div>
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section spacing="default" background="surface">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-vdDark mb-3">
            Comment ça marche
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            Trois étapes simples pour remettre votre véhicule en état
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <StepCard
            number="1"
            icon={<MapPin className="w-8 h-8" />}
            title="Réservez en ligne"
            description="Choisissez votre créneau et votre adresse. Nous nous déplaçons à domicile, au bureau ou n'importe où à Bruxelles."
          />
          <StepCard
            number="2"
            icon={<Wrench className="w-8 h-8" />}
            title="Diagnostic gratuit"
            description="Notre technicien certifié établit un devis transparent sur place. Vous décidez, nous réparons immédiatement si vous acceptez."
          />
          <StepCard
            number="3"
            icon={<CheckCircle className="w-8 h-8" />}
            title="Garantie 6 mois"
            description="Réparation terminée en moins d'une heure dans la plupart des cas. Qualité garantie 6 mois, pièces d'origine."
          />
        </div>
      </Section>

      {/* POPULAR SERVICES */}
      <Section spacing="default" background="white">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-vdDark mb-3">
            Services populaires
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            Nos interventions les plus demandées
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <ServiceCard
            icon={<Wrench className="w-8 h-8 text-vdAccent" />}
            title="Révision complète"
            price="À partir de 45€"
            features={["Freins", "Vitesses", "Pneus", "Chaîne"]}
          />
          <ServiceCard
            icon={<Zap className="w-8 h-8 text-vdPrimary" />}
            title="Diagnostic électrique"
            price="Gratuit si devis accepté"
            features={["Batterie", "Moteur", "Contrôleur", "Câblage"]}
          />
          <ServiceCard
            icon={<ShieldCheck className="w-8 h-8 text-vdAccent" />}
            title="Crevaison + pneus"
            price="À partir de 25€"
            features={["Réparation", "Remplacement", "Chambres à air", "Pneus neufs"]}
          />
        </div>

        <div className="text-center mt-8">
          <Button href="/services" variant="secondary" size="md">
            Voir tous les services
          </Button>
        </div>
      </Section>

      {/* PRICING TEASER */}
      <Section spacing="default" background="surface">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border-2 border-vdBorder rounded-2xl p-8 md:p-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-vdAccent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Euro className="w-6 h-6 text-vdAccent" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-vdDark mb-2">
                  Tarifs transparents
                </h2>
                <p className="text-gray-600">
                  Devis clair avant toute intervention. Aucune surprise.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-vdPrimary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-vdDark">Diagnostic offert</p>
                  <p className="text-sm text-gray-600">Si vous acceptez le devis d'intervention</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-vdPrimary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-vdDark">Pas de frais de déplacement</p>
                  <p className="text-sm text-gray-600">Dans la région de Bruxelles</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-vdPrimary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-vdDark">Paiement après réparation</p>
                  <p className="text-sm text-gray-600">Espèces, carte ou virement</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-vdPrimary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-vdDark">Garantie incluse</p>
                  <p className="text-sm text-gray-600">6 mois sur toutes les réparations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* SERVICE ZONES */}
      <Section spacing="default" background="white">
        <div className="max-w-4xl mx-auto text-center">
          <MapPin className="w-12 h-12 text-vdPrimary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-vdDark mb-4">
            Zones desservies
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Nous intervenons dans toute la région de <strong>Bruxelles-Capitale</strong> et les communes avoisinantes.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["Ixelles", "Etterbeek", "Schaerbeek", "Saint-Gilles", "Uccle", "Woluwe", "Anderlecht", "Molenbeek"].map((zone) => (
              <span key={zone} className="px-4 py-2 bg-vdSurface border border-vdBorder rounded-full text-sm font-medium text-vdDark">
                {zone}
              </span>
            ))}
            <span className="px-4 py-2 bg-vdSurface border border-vdBorder rounded-full text-sm font-medium text-gray-500">
              + 19 communes
            </span>
          </div>

          <Button href="/zones" variant="ghost" size="sm" className="text-vdPrimary">
            Voir toutes les zones →
          </Button>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section spacing="default" background="surface">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-vdDark mb-3">
            Avis clients
          </h2>
          <div className="flex justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-vdAccent text-vdAccent" />
            ))}
          </div>
          <p className="text-gray-600">4.9/5 · Basé sur 200+ avis</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <TestimonialCard
            name="Sophie D."
            role="Livreur Uber Eats"
            text="Service impeccable ! Mon vélo électrique est reparti en 30 minutes. Le technicien était professionnel et le tarif très correct."
            rating={5}
          />
          <TestimonialCard
            name="Marc L."
            role="Cycliste urbain"
            text="Enfin un service qui vient à domicile. Plus besoin de trimballer mon vélo. Diagnostic gratuit et réparation immédiate. Top !"
            rating={5}
          />
          <TestimonialCard
            name="Amina K."
            role="Étudiante"
            text="Ma trottinette ne chargeait plus. Le diagnostic était clair et le prix annoncé à l'avance. Réparé en une heure. Je recommande."
            rating={5}
          />
        </div>
      </Section>

      {/* FAQ */}
      <Section spacing="default" background="white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-vdDark mb-3">
              Questions fréquentes
            </h2>
            <p className="text-gray-600">Tout ce que vous devez savoir</p>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="Le diagnostic est-il vraiment gratuit ?"
              answer="Oui, si vous acceptez notre devis de réparation, le diagnostic est offert. Si vous refusez, le diagnostic coûte 15€."
            />
            <FAQItem
              question="Quels moyens de paiement acceptez-vous ?"
              answer="Nous acceptons les espèces, cartes bancaires et virements. Le paiement s'effectue après la réparation."
            />
            <FAQItem
              question="Combien de temps dure une intervention ?"
              answer="La plupart des réparations sont effectuées en moins d'une heure. Pour les interventions plus complexes, nous vous informons du délai."
            />
            <FAQItem
              question="Quelle est votre zone d'intervention ?"
              answer="Nous intervenons dans toute la région de Bruxelles-Capitale et les communes avoisinantes, sans frais de déplacement."
            />
            <FAQItem
              question="Proposez-vous une garantie ?"
              answer="Oui, toutes nos réparations sont garanties 6 mois, pièces et main d'œuvre comprises."
            />
          </div>
        </div>
      </Section>

      {/* FINAL CTA - MINIMAL */}
      <Section spacing="default" background="white">
        <div className="max-w-4xl mx-auto">
          <div className="border-2 border-vdPrimary bg-vdSurface rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-vdDark mb-3">
              Prêt à reprendre la route ?
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Réservez votre créneau en ligne ou contactez-nous directement par téléphone ou WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Button
                href="/services"
                variant="primary"
                size="lg"
                icon={<Wrench size={20} />}
              >
                Réserver maintenant
              </Button>
              <Button
                href="tel:+32XXXXXXXXX"
                variant="ghost"
                size="lg"
                icon={<Phone size={20} />}
                className="border-2 border-vdBorder"
              >
                +32 XXX XX XX XX
              </Button>
            </div>

            {/* Contact Options */}
            <div className="flex flex-wrap justify-center gap-4 pt-6 border-t border-vdBorder">
              <a href="https://wa.me/32XXXXXXXXX" className="flex items-center gap-2 text-sm text-gray-600 hover:text-vdPrimary transition">
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
              <a href="tel:+32XXXXXXXXX" className="flex items-center gap-2 text-sm text-gray-600 hover:text-vdPrimary transition">
                <Phone className="w-4 h-4" />
                <span>Téléphone</span>
              </a>
              <a href="mailto:contact@velodoctor.be" className="flex items-center gap-2 text-sm text-gray-600 hover:text-vdPrimary transition">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
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
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-11 h-11 bg-vdAccent rounded-full flex items-center justify-center shadow-vd-sm">
          <span className="text-white font-bold text-lg">{number}</span>
        </div>
        <div className="bg-vdPrimary/10 text-vdPrimary p-3.5 rounded-xl inline-flex mb-4 mt-4">
          {icon}
        </div>
        <h3 className="text-lg md:text-xl font-bold text-vdDark mb-2">{title}</h3>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed">{description}</p>
      </Card>
    </div>
  );
}

// Service Card Component
function ServiceCard({ icon, title, price, features }) {
  return (
    <Card className="h-full" hover={true}>
      <div className="bg-vdSurface p-3 rounded-xl inline-flex mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-vdDark mb-2">{title}</h3>
      <p className="text-vdAccent font-semibold mb-4">{price}</p>
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-vdPrimary flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// Testimonial Card Component
function TestimonialCard({ name, role, text, rating }) {
  return (
    <Card className="h-full">
      <div className="flex gap-1 mb-3">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-vdAccent text-vdAccent" />
        ))}
      </div>
      <p className="text-gray-700 mb-4 leading-relaxed">"{text}"</p>
      <div className="pt-4 border-t border-vdBorder">
        <p className="font-semibold text-vdDark">{name}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </Card>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }) {
  return (
    <div className="bg-vdSurface border border-vdBorder rounded-xl p-6">
      <div className="flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-vdPrimary flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-vdDark mb-2">{question}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}