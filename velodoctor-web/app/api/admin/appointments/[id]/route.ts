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
    .from("appointments")
    .select("*, clients(id, full_name, email, phone, address)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("[admin] appointment fetch failed:", error);
    return applyCors(NextResponse.json({ error: "Failed to fetch appointment" }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ appointment: data }));
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
    .from("appointments")
    .update({ status: "cancelled" })
    .eq("id", id);

  if (error) {
    console.error("[admin] appointment delete failed:", error);
    return applyCors(NextResponse.json({ error: "Failed to delete" }, { status: 500 }));
  }
  return applyCors(NextResponse.json({ success: true }));
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

  const body = await request.json().catch(() => ({}));
  const status = body?.status;
  if (!status) {
    return applyCors(NextResponse.json({ error: "Missing status" }, { status: 400 }));
  }

  const { error } = await auth.supabase
    .from("appointments")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("[admin] appointment update failed:", error);
    return applyCors(NextResponse.json({ error: "Failed to update appointment" }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ success: true }));
}
