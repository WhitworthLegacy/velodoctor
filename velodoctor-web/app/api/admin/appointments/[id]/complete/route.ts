import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/adminAuth";
import { applyCors } from "@/lib/cors";

export async function OPTIONS() {
  return applyCors(new NextResponse(null, { status: 204 }));
}

export async function POST(
  request: NextRequest,
  ctx: { params: { id: string } }
) {
  const { id } = ctx.params;

  const auth = await requireStaff(request);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    // 1) Récupérer le RDV (si besoin)
    const { data: appt, error: apptErr } = await auth.supabase
      .from("appointments")
      .select("id, client_id")
      .eq("id", id)
      .maybeSingle();

    if (apptErr) {
      console.error("[complete] fetch appointment failed:", apptErr);
      return applyCors(
        NextResponse.json({ error: "Failed to fetch appointment" }, { status: 500 })
      );
    }
    if (!appt) {
      return applyCors(
        NextResponse.json({ error: "Appointment not found" }, { status: 404 })
      );
    }

    // 2) Marquer le RDV comme terminé (adapte le status si ton enum est différent)
    const { error: updErr } = await auth.supabase
      .from("appointments")
      .update({ status: "done" })
      .eq("id", id);

    if (updErr) {
      console.error("[complete] update appointment failed:", updErr);
      return applyCors(
        NextResponse.json({ error: "Failed to complete appointment" }, { status: 500 })
      );
    }

    // 3) Optionnel: avancer le client dans le CRM (si ton app le veut)
    // Exemple: passage en "atelier" ou autre (adapte selon tes colonnes)
    // await auth.supabase.from("clients").update({ crm_stage: "atelier" }).eq("id", appt.client_id);

    return applyCors(NextResponse.json({ success: true }));
  } catch (e) {
    console.error("[complete] unexpected error:", e);
    return applyCors(
      NextResponse.json({ error: "Failed to complete appointment" }, { status: 500 })
    );
  }
}
