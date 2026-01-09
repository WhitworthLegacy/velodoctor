import Link from 'next/link';
import Section from '@/components/Section';
import Card from '@/components/Card';
import Button from '@/components/Button';

export const metadata = {
  title: 'Zones desservies - Bruxelles | VeloDoctor',
  description:
    'VeloDoctor intervient dans toute la Région de Bruxelles-Capitale et les communes avoisinantes pour la réparation de vélos et trottinettes électriques.',
};

const COMMUNES = [
  'Anderlecht',
  'Auderghem',
  'Berchem-Sainte-Agathe',
  'Bruxelles-Ville',
  'Etterbeek',
  'Evere',
  'Forest',
  'Ganshoren',
  'Ixelles',
  'Jette',
  'Koekelberg',
  'Molenbeek-Saint-Jean',
  'Saint-Gilles',
  'Saint-Josse-ten-Noode',
  'Schaerbeek',
  'Uccle',
  'Watermael-Boitsfort',
  'Woluwe-Saint-Lambert',
  'Woluwe-Saint-Pierre',
];

export default function ZonesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Section spacing="default" background="surface">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-vdDark mb-4">
            Zones desservies à Bruxelles
          </h1>
          <p className="text-lg text-gray-600">
            Nous intervenons dans toutes les communes de la Région de Bruxelles-Capitale
            et les alentours pour la réparation de vélos et trottinettes électriques.
          </p>
        </div>
      </Section>

      <Section spacing="default" background="white">
        <div className="grid md:grid-cols-3 gap-4">
          {COMMUNES.map((commune) => (
            <Card key={commune} className="text-center">
              <p className="font-semibold text-vdDark">{commune}</p>
            </Card>
          ))}
        </div>
        <p className="text-center text-sm text-gray-600 mt-6">
          Besoin d&apos;une intervention hors Bruxelles ? Contactez-nous pour vérifier la zone.
        </p>
      </Section>

      <Section spacing="sm" background="surface">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="/booking" variant="primary" size="md">
            Prendre rendez-vous
          </Button>
          <Button href="/services" variant="secondary" size="md">
            Voir les services
          </Button>
          <Link href="/contact" className="text-sm text-vdPrimary hover:underline">
            Nous contacter
          </Link>
        </div>
      </Section>
    </main>
  );
}
