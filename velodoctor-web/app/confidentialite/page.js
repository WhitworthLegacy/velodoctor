import Section from "@/components/Section";
import Card from "@/components/Card";

export const metadata = {
  title: "Confidentialite | VeloDoctor",
  description: "Politique de confidentialite VeloDoctor.",
};

export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen bg-white">
      <Section spacing="default" background="surface">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold text-vdDark">
            Politique de confidentialite
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-600">
            Comment nous collectons, utilisons et protegens vos donnees.
          </p>
        </div>
      </Section>

      <Section spacing="default" background="white">
        <div className="space-y-6 max-w-3xl mx-auto">
          <Card hover={false}>
            <h2 className="text-xl font-bold text-vdDark">Donnees collectees</h2>
            <p className="mt-3 text-sm text-gray-700">
              Nous collectons les informations necessaires a la prise de rendez-vous et au suivi
              (nom, contact, details techniques).
            </p>
          </Card>

          <Card hover={false}>
            <h2 className="text-xl font-bold text-vdDark">Utilisation</h2>
            <p className="mt-3 text-sm text-gray-700">
              Les donnees sont utilisees pour planifier l'intervention, communiquer avec vous,
              et ameliorer nos services.
            </p>
          </Card>

          <Card hover={false}>
            <h2 className="text-xl font-bold text-vdDark">Vos droits</h2>
            <p className="mt-3 text-sm text-gray-700">
              Vous pouvez demander l'acces, la rectification ou la suppression de vos donnees
              en ecrivant a{" "}
              <a className="text-vdPrimary hover:underline" href="mailto:trott@velodoctor.be">
                trott@velodoctor.be
              </a>
              .
            </p>
          </Card>
        </div>
      </Section>
    </main>
  );
}
