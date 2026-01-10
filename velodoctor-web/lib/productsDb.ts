import { getSupabaseServerClient } from "@/lib/supabaseServer";

export type InventoryRow = {
  price_sell: number | null;
  quantity: number | null;
};

export type DbProduct = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  seo_title: string | null;
  seo_description: string | null;

  // Supabase peut renvoyer objet ou array
  inventory_items: InventoryRow | InventoryRow[] | null;
};

const PRODUCT_SELECT = `
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
`;

function normalizeInventory(inv: DbProduct["inventory_items"]): InventoryRow | null {
  if (!inv) return null;
  return Array.isArray(inv) ? (inv[0] ?? null) : inv;
}

export async function fetchPublishedProducts(): Promise<(DbProduct & { _inv: InventoryRow | null })[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((p: any) => ({
    ...(p as DbProduct),
    _inv: normalizeInventory((p as DbProduct).inventory_items),
  }));
}

export async function getDbProductBySlug(
  slug: string,
  opts?: { allowUnpublished?: boolean }
): Promise<(DbProduct & { _inv: InventoryRow | null }) | null> {
  const supabase = getSupabaseServerClient();

  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug);

  if (!opts?.allowUnpublished) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query.maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const p = data as DbProduct;
  return { ...p, _inv: normalizeInventory(p.inventory_items) };
}