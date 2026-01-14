export default {
  slug: "/blog",
  seo: {
    title: "Blog VeloDoctor - Conseils vélo et trottinette électriques",
    description:
      "Guides pratiques, diagnostics et conseils pour vélos et trottinettes électriques à Bruxelles.",
  },
  h1: "Le blog VeloDoctor",
  layout: "raw",
  rawHtml: `
    <div class="max-w-5xl mx-auto space-y-10">
      <header class="rounded-3xl border border-vdBorder bg-vdSurface p-8 md:p-10">
        <span class="text-xs font-semibold uppercase tracking-[0.2em] text-vdPrimary">Blog VeloDoctor</span>
        <h1 class="mt-3 text-3xl md:text-5xl font-extrabold text-vdDark">
          Conseils et guides pour vélos et trottinettes électriques
        </h1>
        <p class="mt-4 text-base md:text-lg text-gray-600">
          Des contenus utiles, clairs et orientés action pour rouler en toute sérénité à Bruxelles.
        </p>
        <div class="mt-6">
          <a href="/booking" class="inline-flex items-center justify-center gap-2 rounded-lg bg-vdAccent px-8 py-2.5 text-base font-medium text-white shadow-vd-sm transition hover:brightness-95">
            Prendre rendez-vous
          </a>
        </div>
      </header>

      <section class="grid gap-6 md:grid-cols-2">
        <article class="rounded-2xl border border-vdBorder bg-white p-6 shadow-vd-sm transition hover:shadow-vd-md">
          <p class="text-xs text-gray-500">Guide pratique • 6 min</p>
          <h2 class="mt-2 text-xl font-bold text-vdDark">
            Entretien de vélo électrique à Bruxelles : le guide essentiel
          </h2>
          <p class="mt-3 text-gray-600">
            Batterie, freins, pneus, chaîne : la checklist simple pour garder votre VAE fiable toute l'année.
          </p>
          <div class="mt-5">
            <a class="text-sm font-semibold text-vdPrimary hover:underline" href="/blog/entretien-velo-electrique-bruxelles">
              Lire l'article
            </a>
          </div>
        </article>
      </section>
    </div>
  `,
  sections: [],
  faqs: [],
};
