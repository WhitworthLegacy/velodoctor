import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/adminAuth";
import { applyCors } from "@/lib/cors";

export async function OPTIONS() {
  return applyCors(new NextResponse(null, { status: 204 }));
}

export async function GET(request: NextRequest) {
  const auth = await requireStaff(request);
  if ("error" in auth) {
    return auth.error;
  }

  const { data, error } = await auth.supabase
    .from("inventory_items")
    .select("*, products(cover_image_url, title, slug)")
    .order("name", { ascending: true });

  if (error) {
    console.error("[admin] inventory items list failed:", error);
    return applyCors(NextResponse.json({ error: "Failed to fetch inventory items" }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ items: data || [] }));
}

export async function POST(request: NextRequest) {
  const auth = await requireStaff(request);
  if ("error" in auth) {
    return auth.error;
  }

  const payload = await request.json().catch(() => ({}));
  const { data, error } = await auth.supabase
    .from("inventory_items")
    .insert([payload])
    .select("*")
    .single();

  if (error) {
    console.error("[admin] inventory item create failed:", error);
    return applyCors(NextResponse.json({ error: "Failed to create inventory item" }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ item: data }));
}
