import { getSupabaseServerClient } from "@/lib/supabaseServer";

export type DbInventory = {
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

  // Supabase may return object OR array depending on relationship shape
  inventory_items: DbInventory | DbInventory[] | null;
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

function normalizeInventory(inv: DbInventory | DbInventory[] | null): DbInventory | null {
  if (!inv) return null;
  if (Array.isArray(inv)) return inv[0] ?? null;
  return inv;
}

function normalizeProduct(row: any): DbProduct {
  return {
    id: String(row?.id ?? ""),
    slug: String(row?.slug ?? ""),
    title: String(row?.title ?? ""),
    description: row?.description ?? null,
    cover_image_url: row?.cover_image_url ?? null,
    is_published: Boolean(row?.is_published),
    seo_title: row?.seo_title ?? null,
    seo_description: row?.seo_description ?? null,
    inventory_items: normalizeInventory(row?.inventory_items ?? null),
  };
}

/**
 * Returns all published products (listing).
 */
export async function fetchPublishedProducts(): Promise<DbProduct[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (Array.isArray(data) ? data : []).map(normalizeProduct);
}

/**
 * Returns one product by slug (published only by default).
 */
export async function getDbProductBySlug(
  slug: string,
  opts?: { allowUnpublished?: boolean }
): Promise<DbProduct | null> {
  const supabase = getSupabaseServerClient();

  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug);

  if (!opts?.allowUnpublished) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query.limit(1).maybeSingle();
  if (error) throw error;

  return data ? normalizeProduct(data) : null;
}