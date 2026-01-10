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