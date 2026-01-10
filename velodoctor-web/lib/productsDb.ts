import { getSupabaseServerClient } from "@/lib/supabaseServer";

export type InventoryRow = {
  price_sell: number | null;
  quantity: number | null;
};

// Supabase peut renvoyer soit un objet, soit un array (même pour une FK 1-1)
type InventoryJoin = InventoryRow | InventoryRow[] | null;

export type DbProduct = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  inventory_items: InventoryJoin; // ✅ accepte les 2 formes
};

// ✅ Normalise toujours vers un InventoryRow | null
function normalizeInventory(inv: InventoryJoin): InventoryRow | null {
  if (!inv) return null;
  if (Array.isArray(inv)) return inv[0] ?? null;
  return inv;
}

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

/**
 * Returns all published products (listing).
 */
export async function fetchPublishedProducts(): Promise<
  Array<Omit<DbProduct, "inventory_items"> & { inventory_items: InventoryRow | null }>
> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((p: any) => ({
    id: String(p.id),
    slug: String(p.slug),
    title: String(p.title),
    description: p.description ?? null,
    cover_image_url: p.cover_image_url ?? null,
    is_published: !!p.is_published,
    seo_title: p.seo_title ?? null,
    seo_description: p.seo_description ?? null,
    inventory_items: normalizeInventory(p.inventory_items ?? null),
  }));
}

/**
 * Returns one product by slug (published only by default).
 */
export async function getDbProductBySlug(
  slug: string,
  opts?: { allowUnpublished?: boolean }
): Promise<(Omit<DbProduct, "inventory_items"> & { inventory_items: InventoryRow | null }) | null> {
  const supabase = getSupabaseServerClient();

  let query = supabase.from("products").select(PRODUCT_SELECT).eq("slug", slug);

  if (!opts?.allowUnpublished) query = query.eq("is_published", true);

  const { data, error } = await query.limit(1).maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const p: any = data;

  return {
    id: String(p.id),
    slug: String(p.slug),
    title: String(p.title),
    description: p.description ?? null,
    cover_image_url: p.cover_image_url ?? null,
    is_published: !!p.is_published,
    seo_title: p.seo_title ?? null,
    seo_description: p.seo_description ?? null,
    inventory_items: normalizeInventory(p.inventory_items ?? null),
  };
}