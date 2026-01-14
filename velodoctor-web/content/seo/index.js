import blog from "./blog";
import nlBlog from "./nl-blog";
import blogEntretienVaeBruxelles from "./blog-entretien-vae-bruxelles";
import nlBlogOnderhoudVaeBrussel from "./nl-blog-onderhoud-vae-brussel";
import zoneBruxelles from "./zone-bruxelles";
import nlZoneBrussel from "./nl-zone-brussel";

export const seoPages = [
  blog,
  nlBlog,
  blogEntretienVaeBruxelles,
  nlBlogOnderhoudVaeBrussel,
  zoneBruxelles,
  nlZoneBrussel,
];

export const normalizeSlug = (slug) => slug.replace(/^\/+|\/+$/g, "");

export const getSeoPage = (slug) => {
  const normalized = normalizeSlug(slug);
  return seoPages.find((page) => normalizeSlug(page.slug) === normalized) ?? null;
};
