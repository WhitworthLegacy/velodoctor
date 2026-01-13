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

  const { searchParams } = new URL(request.url);
  const interventionId = searchParams.get("intervention_id");

  let query = auth.supabase.from("quotes").select("*").order("created_at", { ascending: false });
  if (interventionId) {
    query = query.eq("intervention_id", interventionId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[admin] quotes list failed:", error);
    return applyCors(NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ quotes: data || [] }));
}

export async function POST(request: NextRequest) {
  const auth = await requireStaff(request);
  if ("error" in auth) {
    return auth.error;
  }

  const payload = await request.json().catch(() => ({}));
  const { data, error } = await auth.supabase
    .from("quotes")
    .insert([payload])
    .select("*")
    .single();

  if (error) {
    console.error("[admin] quote create failed:", error);
    return applyCors(NextResponse.json({ error: "Failed to create quote" }, { status: 500 }));
  }

  return applyCors(NextResponse.json({ quote: data }));
}
