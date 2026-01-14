import Section from "@/components/Section";
import Card from "@/components/Card";

export const metadata = {
  title: "Mentions legales | VeloDoctor",
  description: "Informations legales et contact pour VeloDoctor.",
};

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Section spacing="default" background="surface">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold text-vdDark">
            Mentions legales
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-600">
            Informations obligatoires sur l'editeur et l'hebergeur du site.
          </p>
        </div>
      </Section>

      <Section spacing="default" background="white">
        <div className="space-y-6 max-w-3xl mx-auto">
          <Card hover={false}>
            <h2 className="text-xl font-bold text-vdDark">Editeur</h2>
            <p className="mt-3 text-sm text-gray-700">
              VeloDoctor
              <br />
              Email :{" "}
              <a className="text-vdPrimary hover:underline" href="mailto:trott@velodoctor.be">
                trott@velodoctor.be
              </a>
            </p>
          </Card>

          <Card hover={false}>
            <h2 className="text-xl font-bold text-vdDark">Hebergement</h2>
            <p className="mt-3 text-sm text-gray-700">
              Hebergeur du site : informations a completer si necessaire.
            </p>
          </Card>

          <Card hover={false}>
            <h2 className="text-xl font-bold text-vdDark">Propriete intellectuelle</h2>
            <p className="mt-3 text-sm text-gray-700">
              Le contenu du site (textes, visuels, marques) est protege. Toute reproduction
              sans autorisation est interdite.
            </p>
          </Card>
        </div>
      </Section>
    </main>
  );
}
