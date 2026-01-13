import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

const APPOINTMENT_DURATION_MINUTES = 90;

/**
 * Normalize service type from UI strings.
 * Supported: "collecte" | "depot_atelier"
 */
function normalizeServiceType(value) {
  if (!value) return null;

  const normalized = value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (normalized.includes("collecte")) return "collecte";
  if (normalized.includes("atelier") || normalized.includes("depot")) return "depot_atelier";

  return null;
}

/**
 * Derive appointments.type from service_type to satisfy constraint:
 * type = 'pickup' | 'delivery'
 */
function deriveAppointmentType(normalizedServiceType) {
  return normalizedServiceType === "collecte" ? "pickup" : "delivery";
}

function buildBookingEmail({ appointment, customer }) {
  const scheduledAt = appointment?.scheduledAt || "";
  const serviceType = appointment?.serviceType || "";
  const address = appointment?.address || customer?.address || "";
  const vehicleInfo = customer?.vehicleType || "";
  const message = customer?.message || "";

  return `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
      <h3>Confirmation de rendez-vous ✅</h3>
      <p>Bonjour <strong>${customer?.name || "Client"}</strong>,</p>
      <p>Votre demande de rendez-vous a bien été enregistrée.</p>
      <div style="border-left: 4px solid #00ACC2; background: #ECFEFF; padding: 18px; border-radius: 6px; margin: 18px 0;">
        <div style="margin: 6px 0; font-size: 14px;"><strong>📅 Date & heure :</strong><br>${scheduledAt}</div>
        <div style="margin: 6px 0; font-size: 14px;"><strong>🛠 Service :</strong><br>${serviceType}</div>
        ${address ? `<div style="margin: 6px 0; font-size: 14px;"><strong>📍 Adresse :</strong><br>${address}</div>` : ""}
        ${vehicleInfo ? `<div style="margin: 6px 0; font-size: 14px;"><strong>🚲 Véhicule :</strong><br>${vehicleInfo}</div>` : ""}
        ${message ? `<div style="margin: 6px 0; font-size: 14px;"><strong>📝 Note :</strong><br>${message}</div>` : ""}
      </div>
      <div style="border-left: 4px solid #F59E0B; background: #FFF7ED; padding: 14px 16px; border-radius: 6px; margin: 18px 0; font-size: 14px; line-height: 1.55;">
        <strong>ℹ️ Diagnostic</strong><br>
        Le diagnostic est facturé <strong>45€</strong> et passe à <strong>0€</strong> si vous acceptez le devis de réparation.
      </div>
      <p style="font-size:14px; color:#4B5563;">
        Horaires : <strong>Lu-Sa 9:00 - 17:00</strong><br>
        Contact : <a href="mailto:trott@velodoctor.be" style="color:#00ACC2; text-decoration:none; font-weight:600;">trott@velodoctor.be</a>
      </p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 14px; color: #293133; border-left: 4px solid #00ACC2; padding-left: 15px;">
        <strong style="font-size: 16px;">L'équipe VeloDoctor</strong><br>
        <span style="color: #6C757D;">Expert en réparation de véhicule électrique</span>
        <br><br>
        <strong style="color: #00ACC2; font-style: italic;">VELODOCTOR ⚡</strong><br>
        📞 <a href="tel:+32456951445" style="color: #293133; text-decoration: none;">+32 456 95 14 45</a><br>
        🌐 <a href="https://velodoctor.be" style="color: #00ACC2; text-decoration: none;">velodoctor.be</a>
      </div>
    </div>
  `;
}

/**
 * Fetch appointments that overlap a slot.
 * We consider these statuses as "blocking" for availability:
 * - pending (someone booked but not processed yet)
 * - confirmed
 * - in_transit
 */
async function checkSlotAvailability(supabaseAdmin, scheduledAtIso) {
  const slotStart = new Date(scheduledAtIso);
  if (isNaN(slotStart.getTime())) throw new Error("Invalid scheduledAt");

  const slotEnd = new Date(slotStart.getTime() + APPOINTMENT_DURATION_MINUTES * 60000);

  // Expand bounds to catch overlaps even if appointment starts slightly earlier
  const checkStart = new Date(slotStart.getTime() - APPOINTMENT_DURATION_MINUTES * 60000);
  const checkEnd = new Date(slotEnd.getTime() + APPOINTMENT_DURATION_MINUTES * 60000);

  const { data: appointments, error } = await supabaseAdmin
    .from("appointments")
    .select("scheduled_at, duration_minutes, status")
    .gte("scheduled_at", checkStart.toISOString())
    .lte("scheduled_at", checkEnd.toISOString())
    .in("status", ["pending", "confirmed", "in_transit"]);

  if (error) {
    console.error("[booking] availability check error:", error);
    throw new Error("Failed to check availability");
  }

  for (const appointment of appointments || []) {
    const apptStart = new Date(appointment.scheduled_at);
    const apptEnd = new Date(apptStart.getTime() + (appointment.duration_minutes || APPOINTMENT_DURATION_MINUTES) * 60000);

    const overlaps = slotStart < apptEnd && slotEnd > apptStart;
    if (overlaps) return false;
  }

  return true;
}

/**
 * Create or reuse a client.
 * Strategy:
 * 1) if email provided: try match by email
 * 2) else if phone provided: try match by phone
 * If found, update missing fields.
 */
async function upsertClient(supabaseAdmin, payload) {
  const fullName = (payload.customerName || "").trim();
  const email = (payload.customerEmail || "").trim() || null;
  const phone = (payload.customerPhone || "").trim() || null;
  const address = (payload.customerAddress || "").trim() || null;
  const notes = (payload.message || "").trim() || null;
  const vehicleInfo = (payload.vehicleType || "").trim() || null;

  // Try find existing
  let existing = null;

  if (email) {
    const { data, error } = await supabaseAdmin
      .from("clients")
      .select("id, full_name, email, phone, address, notes, vehicle_info")
      .eq("email", email)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[booking] find client by email error:", error);
      throw new Error("Failed to lookup client");
    }
    existing = data || null;
  } else if (phone) {
    const { data, error } = await supabaseAdmin
      .from("clients")
      .select("id, full_name, email, phone, address, notes, vehicle_info")
      .eq("phone", phone)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[booking] find client by phone error:", error);
      throw new Error("Failed to lookup client");
    }
    existing = data || null;
  }

  // Insert new
  if (!existing) {
    const { data: created, error: createError } = await supabaseAdmin
      .from("clients")
      .insert([
        {
          full_name: fullName,
          email,
          phone,
          address,
          notes,
          vehicle_info: vehicleInfo,
          source: "booking",
          crm_stage: "reception",
        },
      ])
      .select("id")
      .single();

    if (createError) {
      console.error("[booking] create client error:", createError);
      throw new Error("Failed to create client");
    }

    return created.id;
  }

  // Update existing with non-empty values (don’t wipe)
  const updatePatch = {
    full_name: fullName || existing.full_name,
    email: email || existing.email,
    phone: phone || existing.phone,
    address: address || existing.address,
    notes: notes || existing.notes,
    vehicle_info: vehicleInfo || existing.vehicle_info,
    source: existing.source || "booking",
    crm_stage: existing.crm_stage || "reception",
  };

  const { error: updateError } = await supabaseAdmin
    .from("clients")
    .update(updatePatch)
    .eq("id", existing.id);

  if (updateError) {
    console.error("[booking] update client error:", updateError);
    throw new Error("Failed to update client");
  }

  return existing.id;
}

/**
 * POST /api/booking
 * Body:
 * {
 *   serviceType: "Collecte" | "Dépôt atelier" (or normalized)
 *   scheduledAt: ISO string
 *   customerName: string
 *   customerEmail?: string
 *   customerPhone: string
 *   customerAddress?: string (required if collecte)
 *   vehicleType?: string
 *   message?: string
 * }
 */
export async function POST(request) {
  try {
    const supabaseAdmin = getSupabaseServerClient();
    const body = await request.json();

    // Required fields
    const required = ["serviceType", "scheduledAt", "customerName", "customerPhone"];
    for (const f of required) {
      if (!body?.[f]) {
        return NextResponse.json({ error: `Missing required field: ${f}` }, { status: 400 });
      }
    }

    const normalizedServiceType = normalizeServiceType(body.serviceType);
    if (!normalizedServiceType) {
      return NextResponse.json(
        { error: 'Invalid service type. Must be "collecte" or "depot_atelier"' },
        { status: 400 }
      );
    }

    if (normalizedServiceType === "collecte" && !body.customerAddress) {
      return NextResponse.json({ error: 'Address is required for "Collecte" service' }, { status: 400 });
    }

    const scheduledAt = new Date(body.scheduledAt);
    if (isNaN(scheduledAt.getTime())) {
      return NextResponse.json({ error: "Invalid datetime format for scheduledAt" }, { status: 400 });
    }

    if (scheduledAt < new Date()) {
      return NextResponse.json({ error: "Cannot book appointments in the past" }, { status: 400 });
    }

    // Check slot availability (blocks pending/confirmed/in_transit)
    const available = await checkSlotAvailability(supabaseAdmin, body.scheduledAt);
    if (!available) {
      return NextResponse.json(
        { error: "This time slot is no longer available. Please select another slot." },
        { status: 409 }
      );
    }

    // Upsert client (this is what feeds your CRM)
    const clientId = await upsertClient(supabaseAdmin, body);

    // Create appointment
    const appointmentType = deriveAppointmentType(normalizedServiceType);

    const { data: appt, error: apptError } = await supabaseAdmin
      .from("appointments")
      .insert([
        {
          client_id: clientId,
          scheduled_at: body.scheduledAt,
          duration_minutes: APPOINTMENT_DURATION_MINUTES,
          service_type: normalizedServiceType,
          type: appointmentType,
          status: "pending",
          address: body.customerAddress || null,
        },
      ])
      .select("id, client_id, scheduled_at, duration_minutes, service_type, status, type, address")
      .single();

    if (apptError) {
      console.error("[booking] create appointment error:", apptError);
      return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
    }

    // Email notification via Resend (optional)
    try {
      const resendKey = process.env.RESEND_API_KEY;
      if (!resendKey) {
        console.warn("[booking] RESEND_API_KEY not set -> no email sent");
      } else if (body.customerEmail) {
        const resend = new Resend(resendKey);
        const payload = {
          appointment: {
            id: appt.id,
            clientId: appt.client_id,
            serviceType: appt.service_type,
            scheduledAt: appt.scheduled_at,
            type: appt.type,
            address: appt.address,
          },
          customer: {
            name: body.customerName,
            email: body.customerEmail || null,
            phone: body.customerPhone || null,
            address: body.customerAddress || null,
            vehicleType: body.vehicleType || null,
            message: body.message || null,
          },
        };
        const html = buildBookingEmail(payload);

        const primaryFrom = "VeloDoctor <trott@velodoctor.be>";
        const fallbackFrom = "VeloDoctor <velodoctor.be@gmail.com>";

        try {
          await resend.emails.send({
            from: primaryFrom,
            to: body.customerEmail,
            subject: "Confirmation de votre rendez-vous VeloDoctor ✅",
            html,
            replyTo: fallbackFrom,
          });
        } catch (sendError) {
          console.warn("[booking] Resend primary sender failed, retrying fallback:", sendError);
          await resend.emails.send({
            from: fallbackFrom,
            to: body.customerEmail,
            subject: "Confirmation de votre rendez-vous VeloDoctor ✅",
            html,
            replyTo: fallbackFrom,
          });
        }
      }
    } catch (emailError) {
      console.error("[booking] email notification error:", emailError);
      // Don't fail booking
    }

    return NextResponse.json(
      {
        success: true,
        appointment: appt,
        client: { id: clientId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[booking] unhandled error:", error);
    return NextResponse.json(
      { error: "Failed to create appointment", details: String(error?.message || error) },
      { status: 500 }
    );
  }
}
