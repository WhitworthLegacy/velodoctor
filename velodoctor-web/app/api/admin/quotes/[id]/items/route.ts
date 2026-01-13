import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/adminAuth";
import { applyCors } from "@/lib/cors";

export async function OPTIONS() {
  return applyCors(new NextResponse(null, { status: 204 }));
}

function toNumber(value: any) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const auth = await requireStaff(request);
  if ("error" in auth) {
    return auth.error;
  }

  const payload = await request.json().catch(() => ({}));
  const qty = toNumber(payload?.qty);
  const unitPrice = toNumber(payload?.unit_price);

  if (!payload?.label || qty == null || unitPrice == null) {
    return applyCors(NextResponse.json({ error: "Missing quote item fields" }, { status: 400 }));
  }

  const lineTotal = qty * unitPrice;

  const { data, error } = await auth.supabase
    .from("quote_items")
    .insert([
      {
        quote_id: id,
        kind: payload?.kind || "labor",
        inventory_item_id: payload?.inventory_item_id || null,
        label: String(payload.label),
        qty,
        unit_price: unitPrice,
        line_total: lineTotal,
      },
    ])
    .select("*")
    .single();

  if (error) {
    console.error("[admin] quote item create failed:", error);
    return applyCors(NextResponse.json({ error: "Failed to create quote item" }, { status: 500 }));
  }

  const { error: rpcError } = await auth.supabase.rpc("recalc_quote_totals", {
    p_quote_id: id,
  });

  if (rpcError) {
    console.error("[admin] quote totals recalc failed:", rpcError);
    return applyCors(NextResponse.json({ error: "Failed to recalc quote totals" }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ item: data }));
}
