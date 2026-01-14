import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireStaff } from "@/lib/adminAuth";
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

  const { data, error } = await auth.supabase
    .from("inventory_items")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("[admin] inventory item fetch failed:", error);
    return applyCors(NextResponse.json({ error: "Failed to fetch inventory item" }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ item: data }));
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
    .from("inventory_items")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("[admin] inventory item update failed:", error);
    return applyCors(NextResponse.json({ error: "Failed to update inventory item" }, { status: 500 }));
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

  const { error } = await auth.supabase
    .from("inventory_items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[admin] inventory item delete failed:", error);
    return applyCors(NextResponse.json({ error: "Failed to delete inventory item" }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ success: true }));
}
