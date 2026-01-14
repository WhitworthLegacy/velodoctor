import Section from "@/components/Section";
import Card from "@/components/Card";

export const metadata = {
  title: "Conditions | VeloDoctor",
  description: "Conditions generales de service VeloDoctor.",
};

export default function ConditionsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Section spacing="default" background="surface">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold text-vdDark">
            Conditions generales
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-600">
            Informations sur les prestations, devis et interventions.
          </p>
        </div>
      </Section>

      <Section spacing="default" background="white">
        <div className="space-y-6 max-w-3xl mx-auto">
          <Card hover={false}>
            <h2 className="text-xl font-bold text-vdDark">Prestations</h2>
            <p className="mt-3 text-sm text-gray-700">
              Les services incluent diagnostic, entretien et reparation de velos et trottinettes
              electriques, a domicile ou en atelier.
            </p>
          </Card>

          <Card hover={false}>
            <h2 className="text-xl font-bold text-vdDark">Devis et validation</h2>
            <p className="mt-3 text-sm text-gray-700">
              Un devis est propose avant intervention. La validation du devis declenche les travaux.
            </p>
          </Card>

          <Card hover={false}>
            <h2 className="text-xl font-bold text-vdDark">Annulation</h2>
            <p className="mt-3 text-sm text-gray-700">
              Merci de prevenir en cas d'annulation. Nous ferons le maximum pour replanifier
              rapidement.
            </p>
          </Card>
        </div>
      </Section>
    </main>
  );
}
