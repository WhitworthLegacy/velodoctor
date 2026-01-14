import { notFound } from "next/navigation";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { getSeoPage, normalizeSlug, seoPages } from "@/content/seo";

export const generateStaticParams = () =>
  seoPages.map((page) => ({
    slug: normalizeSlug(page.slug).split("/"),
  }));

export const generateMetadata = ({ params }) => {
  const slug = params.slug.join("/");
  const page = getSeoPage(slug);
  if (!page) return {};
  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: {
      canonical: `https://velodoctor.be/${normalizeSlug(page.slug)}`,
    },
  };
};

const isArticleSlug = (value) => {
  const candidate = normalizeSlug(value);
  if (candidate === "blog" || candidate === "nl/blog") return false;
  return candidate.startsWith("blog/") || candidate.startsWith("nl/blog/");
};

export default function SeoPage({ params }) {
  const slug = params.slug.join("/");
  const page = getSeoPage(slug);

  if (!page) {
    notFound();
  }

  const normalized = normalizeSlug(page.slug);
  const isNl = normalized.startsWith("nl/");
  const ctaPrimary = isNl ? "Afspraak maken" : "Prendre rendez-vous";
  const ctaSecondary = isNl ? "Onze diensten" : "Voir les services";
  const ctaFinal = isNl ? "Controleer beschikbaarheid" : "Verifier la disponibilite";
  const reservationHref = "/booking";
  const relatedTitle = isNl ? "Verder lezen" : "A lire ensuite";

  const articlePages = seoPages.filter((item) => isArticleSlug(item.slug));
  const localeArticles = articlePages.filter((item) => {
    const candidate = normalizeSlug(item.slug);
    return isNl ? candidate.startsWith("nl/") : !candidate.startsWith("nl/");
  });
  const relatedArticles = localeArticles
    .filter((item) => normalizeSlug(item.slug) !== normalized)
    .slice(0, 3);

  if (page.layout === "raw" && page.rawHtml) {
    return (
      <main className="min-h-screen bg-white">
        <Section spacing="default" background="white">
          <div className="seo-raw" dangerouslySetInnerHTML={{ __html: page.rawHtml }} />
        </Section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Section spacing="default" background="surface">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex rounded-full bg-vdPrimary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-vdPrimary">
            VeloDoctor
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold text-vdDark">
            {page.h1}
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-600">
            {page.seo.description}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href={reservationHref} variant="primary" size="md">
              {ctaPrimary}
            </Button>
            <Button href="/services" variant="secondary" size="md">
              {ctaSecondary}
            </Button>
          </div>
        </div>
      </Section>

      <Section spacing="default" background="white">
        <div className="space-y-6">
          {(page.sections ?? []).map((section) => (
            <Card key={section.heading || section.html} hover={false} padding="lg">
              {section.heading && (
                <h2 className="text-2xl font-bold text-vdDark">{section.heading}</h2>
              )}
              <div
                className="seo-content mt-3 text-sm md:text-base text-gray-700"
                dangerouslySetInnerHTML={{ __html: section.html }}
              />
            </Card>
          ))}
        </div>
      </Section>

      {(page.faqs ?? []).length > 0 && (
        <Section spacing="default" background="surface">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-center text-2xl font-bold text-vdDark">FAQ</h2>
            <div className="mt-6 space-y-3">
              {(page.faqs ?? []).map((item) => (
                <details
                  key={item.question}
                  className="rounded-2xl border border-vdBorder bg-white px-5 py-4 shadow-vd-sm"
                >
                  <summary className="cursor-pointer font-semibold text-vdDark">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm text-gray-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Section>
      )}

      <Section spacing="sm" background="surface">
        <Card className="text-center" hover={false} padding="lg">
          <h2 className="text-2xl md:text-3xl font-bold text-vdDark">
            {isNl ? "Klaar om je afspraak te plannen?" : "Pret a planifier votre rendez-vous ?"}
          </h2>
          <p className="mt-3 text-sm md:text-base text-gray-600">
            {isNl
              ? "Snelle reactie, beschikbaarheid in enkele klikken."
              : "Reponse rapide, disponibilite en quelques clics."}
          </p>
          <div className="mt-5 flex justify-center">
            <Button href={reservationHref} variant="primary" size="md">
              {ctaFinal}
            </Button>
          </div>
        </Card>
      </Section>

      {isArticleSlug(page.slug) && relatedArticles.length > 0 && (
        <Section spacing="default" background="white">
          <div>
            <h2 className="text-center text-2xl font-bold text-vdDark">{relatedTitle}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {relatedArticles.map((item) => (
                <a
                  key={item.slug}
                  href={`/${normalizeSlug(item.slug)}`}
                  className="block"
                >
                  <Card className="h-full" hover={true}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-vdPrimary">
                      VeloDoctor
                    </p>
                    <h3 className="mt-3 text-lg font-bold text-vdDark">{item.h1}</h3>
                    <p className="mt-3 text-sm text-gray-600">{item.seo.description}</p>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </Section>
      )}
    </main>
  );
}
