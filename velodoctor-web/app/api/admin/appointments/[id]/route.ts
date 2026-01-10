import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireStaff } from "@/lib/adminAuth";

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
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[admin] appointment delete failed:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
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
    return NextResponse.json({ error: "Missing status" }, { status: 400 });
  }

  const { error } = await auth.supabase
    .from("appointments")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("[admin] appointment update failed:", error);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
