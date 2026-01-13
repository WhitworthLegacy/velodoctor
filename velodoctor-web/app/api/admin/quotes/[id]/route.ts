import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/adminAuth";
import { applyCors } from "@/lib/cors";

export async function OPTIONS() {
  return applyCors(new NextResponse(null, { status: 204 }));
}

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const auth = await requireStaff(request);
  if ("error" in auth) {
    return auth.error;
  }

  const { data: quote, error: quoteError } = await auth.supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (quoteError) {
    console.error("[admin] quote fetch failed:", quoteError);
    return applyCors(NextResponse.json({ error: "Failed to fetch quote" }, { status: 500 }));
  }

  const { data: items, error: itemsError } = await auth.supabase
    .from("quote_items")
    .select("*, inventory_items(id, name, price_sell)")
    .eq("quote_id", id)
    .order("created_at", { ascending: true });

  if (itemsError) {
    console.error("[admin] quote items fetch failed:", itemsError);
    return applyCors(NextResponse.json({ error: "Failed to fetch quote items" }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ quote, items: items || [] }));
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const auth = await requireStaff(request);
  if ("error" in auth) {
    return auth.error;
  }

  const payload = await request.json().catch(() => ({}));
  const { data, error } = await auth.supabase
    .from("quotes")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("[admin] quote update failed:", error);
    return applyCors(NextResponse.json({ error: "Failed to update quote" }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ quote: data }));
}
