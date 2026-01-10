import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/adminAuth";
import { applyCors } from "@/lib/cors";

export async function OPTIONS() {
  return applyCors(new NextResponse(null, { status: 204 }));
}

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    const auth = await requireStaff(request);
    if ("error" in auth) {
      return auth.error;
    }

    const { data: appt, error: apptErr } = await auth.supabase
      .from("appointments")
      .update({ status: "done" })
      .eq("id", id)
      .select("id, client_id")
      .single();

    if (apptErr || !appt) {
      console.error("[complete] appointment update error:", apptErr);
      return applyCors(NextResponse.json({ error: "Failed to complete appointment" }, { status: 500 }));
    }

    if (appt.client_id) {
      const { error: clientErr } = await auth.supabase
        .from("clients")
        .update({ crm_stage: "cloture" })
        .eq("id", appt.client_id);

      if (clientErr) {
        console.error("[complete] client stage update error:", clientErr);
      }
    }

    return applyCors(NextResponse.json({ success: true }));
  } catch (e: any) {
    console.error("[complete] error:", e);
    return applyCors(NextResponse.json({ error: "Internal server error" }, { status: 500 }));
  }
}
