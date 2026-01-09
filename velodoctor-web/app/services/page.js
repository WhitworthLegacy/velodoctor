import { Wrench, Zap, ShieldCheck, CheckCircle, Clock } from 'lucide-react';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Button from '@/components/Button';

export const metadata = {
  title: "Nos Services - Réparation mobile vélo et trottinette | VeloDoctor",
  description: "Services de réparation mobile pour vélos et trottinettes électriques à Bruxelles. Diagnostic gratuit, intervention rapide, garantie 6 mois.",
};

const services = [
  {
    icon: <Wrench className="w-8 h-8" />,
    title: "Révision complète",
    description: "Contrôle et réglage de tous les éléments mécaniques de votre vélo.",
    price: "À partir de 45€",
    features: [
      "Freins et patins",
      "Vitesses et dérailleur",
      "Chaîne et transmission",
      "Pneus et chambres à air",
      "Éclairage et sécurité",
    ],
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Diagnostic électrique",
    description: "Analyse complète du système électrique de votre vélo ou trottinette.",
    price: "Gratuit si réparation acceptée",
    features: [
      "Test batterie et charge",
      "Contrôle moteur",
      "Vérification contrôleur",
      "Diagnostic câblage",
      "Devis transparent",
    ],
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Réparation crevaison",
    description: "Réparation ou remplacement de pneu sur place.",
    price: "À partir de 25€",
    features: [
      "Réparation chambre à air",
      "Remplacement pneu",
      "Contrôle jante",
      "Gonflage optimal",
      "Intervention rapide",
    ],
  },
  {
    icon: <Wrench className="w-8 h-8" />,
    title: "Entretien freins",
    description: "Réglage, nettoyage ou remplacement du système de freinage.",
    price: "À partir de 35€",
    features: [
      "Réglage freins à patins",
      "Freins à disque",
      "Freins hydrauliques",
      "Changement câbles",
      "Test de sécurité",
    ],
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Dépannage d'urgence",
    description: "Intervention rapide pour problème urgent (livreurs, urgence).",
    price: "À partir de 60€",
    features: [
      "Intervention sous 2h",
      "Diagnostic express",
      "Réparation immédiate",
      "Disponible 7j/7",
      "Priorité livreurs",
    ],
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Upgrade électrique",
    description: "Amélioration ou remplacement de composants électriques.",
    price: "Sur devis",
    features: [
      "Changement batterie",
      "Upgrade moteur",
      "Contrôleur plus puissant",
      "Accessoires électriques",
      "Conseil personnalisé",
    ],
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <Section spacing="lg" background="surface">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white border border-vdBorder rounded-full px-4 py-2 mb-6">
            <Wrench className="w-4 h-4 text-vdAccent" />
            <span className="text-sm font-medium text-vdDark">Service mobile à domicile</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-vdDark mb-4">
            Nos services de réparation
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Réparation professionnelle de vélos et trottinettes électriques.
            Nous nous déplaçons à domicile ou au bureau à Bruxelles.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-vdPrimary" />
              <span>Diagnostic offert</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-vdPrimary" />
              <span>Intervention rapide</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-vdPrimary" />
              <span>Garantie 6 mois</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Services Grid */}
      <Section spacing="default" background="white">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </Section>

      {/* How It Works */}
      <Section spacing="default" background="surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-vdDark text-center mb-12">
            Comment ça fonctionne
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-vdAccent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="font-bold text-vdDark mb-2">Réservez en ligne</h3>
              <p className="text-sm text-gray-600">
                Choisissez votre service et votre créneau horaire
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-vdAccent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="font-bold text-vdDark mb-2">Nous intervenons</h3>
              <p className="text-sm text-gray-600">
                Notre technicien vient chez vous avec tout le matériel
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-vdAccent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="font-bold text-vdDark mb-2">C'est réparé</h3>
              <p className="text-sm text-gray-600">
                Vous repartez avec votre véhicule fonctionnel
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section spacing="default" background="white">
        <div className="max-w-3xl mx-auto">
          <Card className="text-center border-2 border-vdPrimary" padding="lg">
            <h2 className="text-2xl md:text-3xl font-bold text-vdDark mb-4">
              Besoin d'une réparation ?
            </h2>
            <p className="text-gray-600 mb-8">
              Réservez votre créneau en ligne ou contactez-nous pour un devis personnalisé.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button href="/booking" variant="primary" size="lg">
                Réserver maintenant
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Demander un devis
              </Button>
            </div>
          </Card>
        </div>
      </Section>

    </main>
  );
}

// Service Card Component
function ServiceCard({ service }) {
  return (
    <Card className="h-full" hover={true}>
      <div className="bg-vdPrimary/10 text-vdPrimary p-3 rounded-xl inline-flex mb-4">
        {service.icon}
      </div>

      <h3 className="text-xl font-bold text-vdDark mb-2">
        {service.title}
      </h3>

      <p className="text-sm text-gray-600 mb-4">
        {service.description}
      </p>

      <p className="text-vdAccent font-bold text-lg mb-4">
        {service.price}
      </p>

      <ul className="space-y-2 mb-6">
        {service.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-vdPrimary flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button href="/booking" variant="secondary" size="sm" className="w-full">
        Réserver ce service
      </Button>
    </Card>
  );
}
