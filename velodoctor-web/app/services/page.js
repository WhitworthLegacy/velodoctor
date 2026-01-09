import { Wrench, Zap, ShieldCheck, CheckCircle, Clock, MapPin } from 'lucide-react';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Button from '@/components/Button';

export const metadata = {
  title: "Nos Services - Réparation mobile vélo et trottinette | VeloDoctor",
  description:
    "Réparation mobile à Bruxelles. Réservez un diagnostic en ligne : 0€ si devis accepté. Le reste se fait sur devis.",
};

const repairCategories = [
  {
    icon: <Wrench className="w-7 h-7" />,
    title: "Mécanique",
    items: ["Freins", "Transmission", "Roues", "Pneus & chambres à air", "Réglages & révision"],
  },
  {
    icon: <Zap className="w-7 h-7" />,
    title: "Électrique",
    items: ["Batterie", "Chargeur", "Moteur", "Contrôleur", "Câblage"],
  },
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    title: "Sécurité & confort",
    items: ["Éclairage", "Serrage & contrôles", "Petites pièces", "Accessoires", "Optimisations"],
  },
  {
    icon: <Clock className="w-7 h-7" />,
    title: "Dépannage",
    items: ["Panne bloquante", "Intervention rapide", "Organisation atelier", "Suivi", "Retour véhicule"],
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <Section spacing="lg" background="surface">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white border border-vdBorder rounded-full px-4 py-2 mb-6">
            <Wrench className="w-4 h-4 text-vdAccent" />
            <span className="text-sm font-medium text-vdDark">Service mobile à Bruxelles</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-vdDark mb-4">
            Un seul point d’entrée : le diagnostic
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Vous réservez un créneau. On analyse votre vélo/trottinette. Ensuite, on vous envoie le devis.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-vdPrimary" />
              <span>
                Diagnostic : <span className="line-through">45€</span> → <strong>0€</strong>{" "}
                <span className="text-gray-500">(si devis accepté)</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-vdPrimary" />
              <span>Sur devis pour la réparation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-vdPrimary" />
              <span>Créneaux L–S · 9h–17h</span>
            </div>
          </div>
        </div>
      </Section>

      {/* DIAGNOSTIC CARD (PRIMARY CTA) */}
      <Section spacing="default" background="white">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-vdPrimary" padding="lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-vdSurface border border-vdBorder rounded-full px-4 py-2 mb-4">
                  <MapPin className="w-4 h-4 text-vdPrimary" />
                  <span className="text-sm font-medium text-vdDark">
                    Collecte ou dépôt atelier
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-vdDark mb-2">
                  Réserver un diagnostic
                </h2>

                <p className="text-gray-600 mb-4">
                  Le diagnostic sert à identifier la panne et préparer votre devis. 
                  <strong className="text-vdDark"> Il passe à 0€ si vous acceptez le devis.</strong>
                </p>

                <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-vdPrimary" />
                    <span>Analyse mécanique + électrique</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-vdPrimary" />
                    <span>Infos véhicule + symptômes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-vdPrimary" />
                    <span>Créneau confirmé instant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-vdPrimary" />
                    <span>Réparation ensuite sur devis</span>
                  </div>
                </div>
              </div>

              <div className="md:w-64 flex flex-col gap-3">
                <Button href="/booking" variant="primary" size="lg" className="w-full">
                  Prendre RDV
                </Button>
                <Button
                  href="https://wa.me/+32456951445"
                  variant="secondary"
                  size="md"
                  className="w-full"
                >
                  WhatsApp
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Pas besoin de choisir un “service” ici : on commence par le diagnostic.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* WHAT WE REPAIR (NO PRICES) */}
      <Section spacing="default" background="surface">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-vdDark mb-3">
            Ce qu’on répare (sur devis)
          </h2>
          <p className="text-gray-600">
            Après diagnostic, on vous propose la réparation adaptée à votre cas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {repairCategories.map((cat, idx) => (
            <Card key={idx} className="h-full" hover={true}>
              <div className="bg-vdPrimary/10 text-vdPrimary p-3 rounded-xl inline-flex mb-4">
                {cat.icon}
              </div>

              <h3 className="text-xl font-bold text-vdDark mb-3">{cat.title}</h3>

              <ul className="space-y-2">
                {cat.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-vdPrimary flex-shrink-0 mt-0.5" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button href="/booking" variant="primary" size="lg">
            Réserver un diagnostic
          </Button>
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section spacing="default" background="white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-vdDark text-center mb-12">
            Comment ça fonctionne
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <HowStep
              n="1"
              title="Réservez un diagnostic"
              text="Choisissez collecte ou dépôt atelier + un créneau."
            />
            <HowStep
              n="2"
              title="On analyse votre véhicule"
              text="On identifie la panne et ce qu’il faut faire."
            />
            <HowStep
              n="3"
              title="Vous recevez le devis"
              text="Vous acceptez → on lance la réparation (sur devis)."
            />
          </div>
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section spacing="default" background="white">
        <div className="max-w-3xl mx-auto">
          <Card className="text-center border-2 border-vdPrimary" padding="lg">
            <h2 className="text-2xl md:text-3xl font-bold text-vdDark mb-4">
              Réservez, on s’occupe du reste
            </h2>
            <p className="text-gray-600 mb-8">
              Le plus simple : commencer par un diagnostic. Ensuite, tout se fait sur devis.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button href="/booking" variant="primary" size="lg">
                Réserver un diagnostic
              </Button>
              <Button href="https://wa.me/+32456951445" variant="secondary" size="lg">
                WhatsApp
              </Button>
            </div>
          </Card>
        </div>
      </Section>
    </main>
  );
}

function HowStep({ n, title, text }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-vdAccent rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-white font-bold text-xl">{n}</span>
      </div>
      <h3 className="font-bold text-vdDark mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
}