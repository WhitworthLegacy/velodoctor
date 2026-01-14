export default {
  slug: "/nl/blog",
  seo: {
    title: "VeloDoctor blog - Tips voor elektrische fietsen en steps",
    description:
      "Praktische gidsen, diagnosen en onderhoudstips voor elektrische fietsen en steps in Brussel.",
  },
  h1: "De VeloDoctor blog",
  layout: "raw",
  rawHtml: `
    <div class="max-w-5xl mx-auto space-y-10">
      <header class="rounded-3xl border border-vdBorder bg-vdSurface p-8 md:p-10">
        <span class="text-xs font-semibold uppercase tracking-[0.2em] text-vdPrimary">VeloDoctor blog</span>
        <h1 class="mt-3 text-3xl md:text-5xl font-extrabold text-vdDark">
          Tips en gidsen voor elektrische fietsen en steps
        </h1>
        <p class="mt-4 text-base md:text-lg text-gray-600">
          Heldere, actiegerichte content om zorgeloos te rijden in Brussel.
        </p>
        <div class="mt-6">
          <a href="/booking" class="inline-flex items-center justify-center gap-2 rounded-lg bg-vdAccent px-8 py-2.5 text-base font-medium text-white shadow-vd-sm transition hover:brightness-95">
            Afspraak maken
          </a>
        </div>
      </header>

      <section class="grid gap-6 md:grid-cols-2">
        <article class="rounded-2xl border border-vdBorder bg-white p-6 shadow-vd-sm transition hover:shadow-vd-md">
          <p class="text-xs text-gray-500">Praktische gids • 6 min</p>
          <h2 class="mt-2 text-xl font-bold text-vdDark">
            Onderhoud van elektrische fietsen in Brussel: de essentiële gids
          </h2>
          <p class="mt-3 text-gray-600">
            Batterij, remmen, banden, ketting: een eenvoudige checklist om het hele jaar betrouwbaar te blijven.
          </p>
          <div class="mt-5">
            <a class="text-sm font-semibold text-vdPrimary hover:underline" href="/nl/blog/onderhoud-elektrische-fiets-brussel">
              Lees het artikel
            </a>
          </div>
        </article>

        <article class="rounded-2xl border border-vdBorder bg-white p-6 shadow-vd-sm transition hover:shadow-vd-md">
          <p class="text-xs text-gray-500">Praktische gids • 7 min</p>
          <h2 class="mt-2 text-xl font-bold text-vdDark">
            Elektrische step reparatie in Brussel
          </h2>
          <p class="mt-3 text-gray-600">
            Veelvoorkomende defecten, onderhoud en tips om de levensduur van je step te verlengen.
          </p>
          <div class="mt-5">
            <a class="text-sm font-semibold text-vdPrimary hover:underline" href="/nl/blog/elektrische-step-reparatie-brussel">
              Lees het artikel
            </a>
          </div>
        </article>

        <article class="rounded-2xl border border-vdBorder bg-white p-6 shadow-vd-sm transition hover:shadow-vd-md">
          <p class="text-xs text-gray-500">Expert gids • 8 min</p>
          <h2 class="mt-2 text-xl font-bold text-vdDark">
            Batterij van elektrische fiets: de complete gids
          </h2>
          <p class="mt-3 text-gray-600">
            Alles over batterijen: werking, onderhoud, levensduur en vervanging.
          </p>
          <div class="mt-5">
            <a class="text-sm font-semibold text-vdPrimary hover:underline" href="/nl/blog/batterij-elektrische-fiets-gids">
              Lees het artikel
            </a>
          </div>
        </article>
      </section>
    </div>
  `,
  sections: [],
  faqs: [],
};
