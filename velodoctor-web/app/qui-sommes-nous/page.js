import Section from "@/components/Section";
import Button from "@/components/Button";

export const metadata = {
  title: "Qui sommes-nous | VeloDoctor",
  description:
    "L'histoire, la methode et la mission VeloDoctor pour la reparation de trottinettes et velos electriques a Bruxelles et en Belgique.",
};

export default function QuiSommesNousPage() {
  return (
    <main className="min-h-screen bg-white">
      <Section spacing="default" background="surface">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex rounded-full bg-vdPrimary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-vdPrimary">
            VeloDoctor
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold text-vdDark">
            Qui sommes-nous
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-600">
            Reparation, diagnostic et maintenance de trottinettes et velos electriques a Bruxelles
            et en Belgique, avec une exigence issue du B2B.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href="/booking" variant="primary" size="md">
              Prendre rendez-vous
            </Button>
            <Button href="/contact" variant="secondary" size="md">
              Nous contacter
            </Button>
          </div>
        </div>
      </Section>

      <Section spacing="default" background="white">
        <div className="space-y-10 max-w-4xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold text-vdDark">
              VeloDoctor - reparation de trottinettes et velos electriques a Bruxelles et en Belgique
            </h2>
            <p className="mt-3 text-sm md:text-base text-gray-700">
              VeloDoctor est un service specialise dans la reparation, le diagnostic et la maintenance
              professionnelle de trottinettes electriques et velos electriques, actif a Bruxelles et
              partout en Belgique. Depuis 2018, nous accompagnons la croissance de la mobilite
              electrique avec une approche issue du monde professionnel (B2B), aujourd'hui ouverte
              aux particuliers exigeants. Meme methode, memes standards, zero compromis sur la qualite.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-vdDark">
              Reparation de trottinettes et velos electriques a Bruxelles
            </h2>
            <p className="mt-3 text-sm md:text-base text-gray-700">
              Vous cherchez un reparateur de trottinette electrique a Bruxelles ? Un atelier fiable
              pour votre velo electrique en Belgique ? VeloDoctor intervient pour les trottinettes
              electriques toutes marques, les velos electriques urbains, VTC et cargos, pour
              particuliers et professionnels.
            </p>
            <p className="mt-3 text-sm md:text-base text-gray-700">
              Zone principale : Bruxelles. Interventions possibles dans toute la Belgique.
            </p>
            <p className="mt-3 text-sm md:text-base text-gray-700">
              Mots-cles cibles : reparation trottinette electrique Bruxelles, reparateur velo
              electrique Belgique, diagnostic trottinette electrique Bruxelles, atelier reparation
              mobilite electrique.
            </p>
            <p className="mt-3 text-sm md:text-base text-gray-700">
              Contactez-nous via velodoctor.be
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button href="/booking" variant="primary" size="md">
                Demander un diagnostic
              </Button>
              <Button href="/contact" variant="secondary" size="md">
                Poser une question
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-vdDark">Notre methode de reparation</h2>
            <p className="mt-3 text-sm md:text-base text-gray-700">
              Une methode issue du B2B, pensee pour durer. Chez VeloDoctor, on ne repare pas a la
              va-vite chez le client. Chaque vehicule suit un process clair et maitrise, identique
              a celui utilise pour les flottes professionnelles.
            </p>
            <ol className="mt-4 list-decimal pl-5 space-y-2 text-sm md:text-base text-gray-700">
              <li>Recuperation du vehicule, a domicile ou point convenu.</li>
              <li>Diagnostic complet en atelier : mecanique, electrique et securite.</li>
              <li>Identification des reparations necessaires, aucune intervention inutile.</li>
              <li>Devis clair et transparent.</li>
              <li>Reparation professionnelle avec pieces adaptees.</li>
              <li>Controles avant restitution.</li>
            </ol>
            <p className="mt-3 text-sm md:text-base text-gray-700">
              Si vous acceptez le devis, le diagnostic est offert.
            </p>
            <div className="mt-5">
              <Button href="/booking" variant="primary" size="md">
                Verifier la disponibilite
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-vdDark">Pourquoi choisir VeloDoctor</h2>
            <ul className="mt-4 list-disc pl-5 space-y-2 text-sm md:text-base text-gray-700">
              <li>Expertise depuis 2018.</li>
              <li>Methodes professionnelles B2B.</li>
              <li>Diagnostic reel en atelier.</li>
              <li>Devis transparents.</li>
              <li>Securite et durabilite avant tout.</li>
              <li>Service humain, clair et structure.</li>
            </ul>
            <p className="mt-3 text-sm md:text-base text-gray-700">
              Nous reparons moins, mais mieux.
            </p>
          </div>
        </div>
      </Section>

      <Section spacing="default" background="surface">
        <div className="space-y-10 max-w-4xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold text-vdDark">
              FAQ - reparation trottinette et velo electrique
            </h2>
            <div className="mt-4 space-y-4 text-sm md:text-base text-gray-700">
              <div>
                <p className="font-semibold text-vdDark">
                  Reparez-vous toutes les marques de trottinettes electriques ?
                </p>
                <p>Oui, nous intervenons sur la majorite des marques, selon la disponibilite des pieces.</p>
              </div>
              <div>
                <p className="font-semibold text-vdDark">Combien coute un diagnostic ?</p>
                <p>
                  Le diagnostic est payant uniquement si le devis est refuse. Si vous acceptez, il est offert.
                </p>
              </div>
              <div>
                <p className="font-semibold text-vdDark">Quels sont les delais de reparation ?</p>
                <p>
                  Ils varient selon la panne et les pieces a commander. Nous privilegions la qualite a la
                  precipitation.
                </p>
              </div>
              <div>
                <p className="font-semibold text-vdDark">Reparez-vous aussi les velos electriques ?</p>
                <p>Oui, moteurs, batteries, transmission, freins, controleurs et entretien general.</p>
              </div>
              <div>
                <p className="font-semibold text-vdDark">Faites-vous les reparations chez le client ?</p>
                <p>
                  Non. Les reparations sont realisees en atelier pour garantir securite et fiabilite.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-vdDark">
              Une presence active sur Instagram et TikTok
            </h2>
            <p className="mt-3 text-sm md:text-base text-gray-700">
              Nous partageons notre quotidien et notre expertise : reparations reelles, conseils,
              coulisses et pedagogie. La transparence fait partie de notre ADN.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm md:text-base">
              <a
                className="text-vdPrimary font-semibold hover:underline"
                href="https://instagram.com/velodoctor.be"
                rel="noreferrer"
                target="_blank"
              >
                Instagram
              </a>
              <a
                className="text-vdPrimary font-semibold hover:underline"
                href="https://tiktok.com/velodoctor.be"
                rel="noreferrer"
                target="_blank"
              >
                TikTok
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-vdDark">VeloDoctor, aujourd'hui et demain</h2>
            <p className="mt-3 text-sm md:text-base text-gray-700">
              Depuis 2018, VeloDoctor evolue avec un objectif constant : professionnaliser la reparation
              de la mobilite electrique en Belgique. En 2025, l'ouverture aux particuliers marque une
              nouvelle etape, sans jamais renier nos standards.
            </p>
            <p className="mt-3 text-sm md:text-base text-gray-700">
              Site officiel : https://velodoctor.be - Bruxelles et Belgique.
            </p>
          </div>
        </div>
      </Section>
    </main>
  );
}
