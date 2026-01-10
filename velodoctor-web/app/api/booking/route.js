import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

const APPOINTMENT_DURATION_MINUTES = 90;

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
 * Check if a time slot overlaps with existing confirmed appointments.
 * NOTE: your DB status values are: pending, confirmed, in_transit, done, cancelled
 */
async function checkSlotAvailability(supabase, scheduledAtIso) {
  const slotStart = new Date(scheduledAtIso);
  const slotEnd = new Date(slotStart.getTime() + APPOINTMENT_DURATION_MINUTES * 60000);

  // Range extended by duration to catch overlaps
  const checkStart = new Date(slotStart.getTime() - APPOINTMENT_DURATION_MINUTES * 60000);
  const checkEnd = new Date(slotEnd.getTime() + APPOINTMENT_DURATION_MINUTES * 60000);

  const { data: appointments, error } = await supabase
    .from("appointments")
    .select("scheduled_at, duration_minutes, status")
    .gte("scheduled_at", checkStart.toISOString())
    .lte("scheduled_at", checkEnd.toISOString())
    .in("status", ["confirmed", "in_transit"]); // statuses that should block the slot

  if (error) {
    console.error("Error checking availability:", error);
    throw new Error("Failed to check availability");
  }

  for (const appointment of appointments || []) {
    const aStart = new Date(appointment.scheduled_at);
    const aEnd = new Date(aStart.getTime() + (appointment.duration_minutes ?? APPOINTMENT_DURATION_MINUTES) * 60000);

    const overlaps = slotStart < aEnd && slotEnd > aStart;
    if (overlaps) return false;
  }

  return true;
}

/**
 * POST /api/booking
 * Body:
 * {
 *   serviceType: "Collecte" | "Dépôt atelier",
 *   scheduledAt: ISO datetime string,
 *   customerName: string,
 *   customerEmail: string,
 *   customerPhone: string,
 *   customerAddress?: string, (required for collecte)
 *   vehicleType?: string,
 *   message?: string
 * }
 */
export async function POST(request) {
  try {
    const supabase = getSupabaseServerClient();
    const body = await request.json();

    const normalizedServiceType = normalizeServiceType(body.serviceType);

    // Validate required fields
    const requiredFields = ["serviceType", "scheduledAt", "customerName", "customerEmail", "customerPhone"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    if (!normalizedServiceType) {
      return NextResponse.json(
        { error: 'Invalid service type. Must include "collecte" or "depot/atelier"' },
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

    // Check slot availability
    const isAvailable = await checkSlotAvailability(supabase, body.scheduledAt);
    if (!isAvailable) {
      return NextResponse.json(
        { error: "This time slot is no longer available. Please select another slot." },
        { status: 409 }
      );
    }

    // 1) Create / upsert client (by email)
    // NOTE: clients.full_name is NOT NULL in your schema
    const clientPayload = {
      full_name: body.customerName,
      email: body.customerEmail,
      phone: body.customerPhone,
      address: body.customerAddress || null,
      notes: body.message || null,
      vehicle_info: body.vehicleType || null,
      source: "booking",
      crm_stage: "reception",
    };

    // Try find client by email (unique not enforced, so we pick first)
    const { data: existingClient, error: existingClientError } = await supabase
      .from("clients")
      .select("id")
      .eq("email", body.customerEmail)
      .limit(1)
      .maybeSingle();

    if (existingClientError) {
      console.error("Supabase client lookup error:", existingClientError);
      return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
    }

    let clientId = existingClient?.id || null;

    if (!clientId) {
      const { data: newClient, error: createClientError } = await supabase
        .from("clients")
        .insert([clientPayload])
        .select("id")
        .single();

      if (createClientError) {
        console.error("Supabase client insert error:", createClientError);
        return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
      }

      clientId = newClient.id;
    } else {
      // optional: keep client info fresh
      const { error: updateClientError } = await supabase
        .from("clients")
        .update(clientPayload)
        .eq("id", clientId);

      if (updateClientError) {
        console.warn("Supabase client update warning:", updateClientError);
      }
    }

    // 2) Create appointment (ONLY columns that exist in your DB)
    const appointmentPayload = {
      client_id: clientId,
      scheduled_at: body.scheduledAt,
      duration_minutes: APPOINTMENT_DURATION_MINUTES,
      service_type: normalizedServiceType,
      address: body.customerAddress || null,
      status: "pending",
      type: normalizedServiceType === "collecte" ? "pickup" : null, // respects constraint type_check
    };

    const { data: appt, error: apptError } = await supabase
      .from("appointments")
      .insert([appointmentPayload])
      .select("id, scheduled_at, status, service_type, client_id")
      .single();

    if (apptError) {
      console.error("Supabase appointment insert error:", apptError);
      return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
    }

    // 3) Send email via Apps Script webhook (best effort)
    try {
      const webhookUrl = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appointment: {
              id: appt.id,
              serviceType: appt.service_type,
              scheduledAt: appt.scheduled_at,
              status: appt.status,
            },
            customer: {
              name: body.customerName,
              email: body.customerEmail,
              phone: body.customerPhone,
              address: body.customerAddress || null,
              vehicleType: body.vehicleType || null,
              message: body.message || null,
            },
          }),
        });
      } else {
        console.warn("[booking] GOOGLE_APPS_SCRIPT_WEBHOOK_URL is missing, email not sent");
      }
    } catch (emailError) {
      console.error("Email notification error:", emailError);
    }

    // ✅ Return
    return NextResponse.json(
      {
        success: true,
        appointment: {
          id: appt.id,
          clientId: appt.client_id,
          serviceType: appt.service_type,
          scheduledAt: appt.scheduled_at,
          status: appt.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}