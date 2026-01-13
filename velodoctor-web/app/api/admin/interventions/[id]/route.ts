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

  const { data, error } = await auth.supabase
    .from("interventions")
    .select(
      "*, vehicles(id, brand, model, type, license_plate, vin, clients(id, full_name, email, phone))"
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("[admin] intervention fetch failed:", error);
    return applyCors(NextResponse.json({ error: "Failed to fetch intervention" }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ intervention: data }));
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
    .from("interventions")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("[admin] intervention update failed:", error);
    return applyCors(NextResponse.json({ error: "Failed to update intervention" }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ intervention: data }));
}
