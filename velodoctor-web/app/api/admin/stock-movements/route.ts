import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/adminAuth";
import { applyCors } from "@/lib/cors";

function parseLimit(raw: string | null) {
  const fallback = 50;
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return Math.min(Math.floor(value), 200);
}

export async function OPTIONS() {
  return applyCors(new NextResponse(null, { status: 204 }));
}

export async function GET(request: NextRequest) {
  const auth = await requireStaff(request);
  if ("error" in auth) {
    return auth.error;
  }

  const { searchParams } = new URL(request.url);
  const inventoryItemId = searchParams.get("inventory_item_id");
  const limit = parseLimit(searchParams.get("limit"));

  let query = auth.supabase
    .from("stock_movements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (inventoryItemId) {
    query = query.eq("inventory_item_id", inventoryItemId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[admin] stock movements list failed:", error);
    return applyCors(NextResponse.json({ error: "Failed to fetch stock movements" }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ movements: data || [] }));
}

export async function POST(request: NextRequest) {
  const auth = await requireStaff(request);
  if ("error" in auth) {
    return auth.error;
  }

  const payload = await request.json().catch(() => ({}));
  const inventoryItemId = payload?.inventory_item_id;
  const delta = Number(payload?.delta);

  if (!inventoryItemId) {
    return applyCors(NextResponse.json({ error: "Missing inventory_item_id" }, { status: 400 }));
  }
  if (!Number.isFinite(delta) || delta === 0) {
    return applyCors(NextResponse.json({ error: "Invalid delta" }, { status: 400 }));
  }

  const { data: item, error: itemError } = await auth.supabase
    .from("inventory_items")
    .select("id, quantity")
    .eq("id", inventoryItemId)
    .single();

  if (itemError || !item) {
    console.error("[admin] stock movement item lookup failed:", itemError);
    return applyCors(NextResponse.json({ error: "Inventory item not found" }, { status: 404 }));
  }

  const currentQty = Number(item.quantity ?? 0);
  const newQty = currentQty + delta;

  if (newQty < 0) {
    return applyCors(NextResponse.json({ error: "Insufficient stock" }, { status: 400 }));
  }

  const quantity = Math.abs(delta);
  const type = delta > 0 ? "IN" : "OUT";
  const notesParts = [payload?.reason, payload?.note].filter(Boolean);
  const notes = notesParts.length > 0 ? notesParts.join(" - ") : null;

  const { data: movement, error: insertError } = await auth.supabase
    .from("stock_movements")
    .insert([
      {
        inventory_item_id: inventoryItemId,
        type,
        quantity,
        notes,
      },
    ])
    .select("*")
    .single();

  if (insertError) {
    console.error("[admin] stock movement insert failed:", insertError);
    return applyCors(NextResponse.json({ error: "Failed to create stock movement" }, { status: 500 }));
  }

  const { data: updatedItem, error: updateError } = await auth.supabase
    .from("inventory_items")
    .update({ quantity: newQty })
    .eq("id", inventoryItemId)
    .select("*")
    .single();

  if (updateError) {
    console.error("[admin] stock movement update failed:", updateError);
    return applyCors(NextResponse.json({ error: "Failed to update inventory quantity" }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ success: true, movement, item: updatedItem }));
}
