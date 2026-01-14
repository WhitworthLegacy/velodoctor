import blog from "./blog";
import nlBlog from "./nl-blog";
import blogEntretienVaeBruxelles from "./blog-entretien-vae-bruxelles";
import nlBlogOnderhoudVaeBrussel from "./nl-blog-onderhoud-vae-brussel";
import blogTrottinetteElectriqueBruxelles from "./blog-trottinette-electrique-bruxelles";
import nlBlogStepReparatieBrussel from "./nl-blog-step-reparatie-brussel";
import blogBatterieVeloElectrique from "./blog-batterie-velo-electrique";
import nlBlogBatterijFiets from "./nl-blog-batterij-fiets";
import zoneBruxelles from "./zone-bruxelles";
import nlZoneBrussel from "./nl-zone-brussel";

export const seoPages = [
  blog,
  nlBlog,
  blogEntretienVaeBruxelles,
  nlBlogOnderhoudVaeBrussel,
  blogTrottinetteElectriqueBruxelles,
  nlBlogStepReparatieBrussel,
  blogBatterieVeloElectrique,
  nlBlogBatterijFiets,
  zoneBruxelles,
  nlZoneBrussel,
];

export const normalizeSlug = (slug) => slug.replace(/^\/+|\/+$/g, "");

export const getSeoPage = (slug) => {
  const normalized = normalizeSlug(slug);
  return seoPages.find((page) => normalizeSlug(page.slug) === normalized) ?? null;
};
