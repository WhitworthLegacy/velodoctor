import { getSupabaseServerClient } from "@/lib/supabaseServer";

export type DbProduct = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  inventory_items: {
    price_sell: number | null;
    quantity: number | null;
  } | null;
};

export async function fetchPublishedProducts(): Promise<DbProduct[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      slug,
      title,
      description,
      cover_image_url,
      is_published,
      seo_title,
      seo_description,
      inventory_items:inventory_item_id (
        price_sell,
        quantity
      )
    `
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as DbProduct[];
}

/** ✅ NEW: fetch one product by slug (published only by default) */
export async function getDbProductBySlug(
  slug: string,
  opts?: { allowUnpublished?: boolean }
): Promise<DbProduct | null> {
  const supabase = getSupabaseServerClient();

  let query = supabase
    .from("products")
    .select(
      `
      id,
      slug,
      title,
      description,
      cover_image_url,
      is_published,
      seo_title,
      seo_description,
      inventory_items:inventory_item_id (
        price_sell,
        quantity
      )
    `
    )
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();

  if (!opts?.allowUnpublished) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || null) as DbProduct | null;
}