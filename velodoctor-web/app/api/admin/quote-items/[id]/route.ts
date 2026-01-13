import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireStaff } from "@/lib/adminAuth";
import { applyCors } from "@/lib/cors";

export async function OPTIONS() {
  return applyCors(new NextResponse(null, { status: 204 }));
}

function toNumber(value: any) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
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

  const { data: existing, error: fetchError } = await auth.supabase
    .from("quote_items")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    console.error("[admin] quote item lookup failed:", fetchError);
    return applyCors(NextResponse.json({ error: "Quote item not found" }, { status: 404 }));
  }

  const qty = payload?.qty == null ? existing.qty : toNumber(payload?.qty);
  const unitPrice = payload?.unit_price == null ? existing.unit_price : toNumber(payload?.unit_price);

  if (qty == null || unitPrice == null) {
    return applyCors(NextResponse.json({ error: "Invalid quote item values" }, { status: 400 }));
  }

  const lineTotal = qty * unitPrice;

  const updatePayload = {
    ...payload,
    qty,
    unit_price: unitPrice,
    line_total: lineTotal,
  };

  const { data, error } = await auth.supabase
    .from("quote_items")
    .update(updatePayload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("[admin] quote item update failed:", error);
    return applyCors(NextResponse.json({ error: "Failed to update quote item" }, { status: 500 }));
  }

  const { error: rpcError } = await auth.supabase.rpc("recalc_quote_totals", {
    p_quote_id: existing.quote_id,
  });

  if (rpcError) {
    console.error("[admin] quote totals recalc failed:", rpcError);
    return applyCors(NextResponse.json({ error: "Failed to recalc quote totals" }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ item: data }));
}

export async function DELETE(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const auth = await requireAdmin(request);
  if ("error" in auth) {
    return auth.error;
  }

  const { data: existing, error: fetchError } = await auth.supabase
    .from("quote_items")
    .select("id, quote_id")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    console.error("[admin] quote item lookup failed:", fetchError);
    return applyCors(NextResponse.json({ error: "Quote item not found" }, { status: 404 }));
  }

  const { error } = await auth.supabase.from("quote_items").delete().eq("id", id);

  if (error) {
    console.error("[admin] quote item delete failed:", error);
    return applyCors(NextResponse.json({ error: "Failed to delete quote item" }, { status: 500 }));
  }

  const { error: rpcError } = await auth.supabase.rpc("recalc_quote_totals", {
    p_quote_id: existing.quote_id,
  });

  if (rpcError) {
    console.error("[admin] quote totals recalc failed:", rpcError);
    return applyCors(NextResponse.json({ error: "Failed to recalc quote totals" }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ success: true }));
}
