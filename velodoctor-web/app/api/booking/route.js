import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

const APPOINTMENT_DURATION_MINUTES = 90;

function normalizeServiceType(value) {
  if (!value) return null;
  const normalized = value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  if (normalized.includes('collecte')) {
    return 'collecte';
  }
  if (normalized.includes('atelier') || normalized.includes('depot')) {
    return 'depot_atelier';
  }

  return null;
}

/**
 * Check if a time slot overlaps with existing appointments
 */
async function checkSlotAvailability(supabaseAdmin, scheduledAt) {
  const slotStart = new Date(scheduledAt);
  const slotEnd = new Date(slotStart.getTime() + APPOINTMENT_DURATION_MINUTES * 60000);

  // Get the date range to check (expand by 90 minutes before and after)
  const checkStart = new Date(slotStart.getTime() - APPOINTMENT_DURATION_MINUTES * 60000);
  const checkEnd = new Date(slotEnd.getTime() + APPOINTMENT_DURATION_MINUTES * 60000);

  // Fetch appointments that could potentially overlap
  const { data: appointments, error } = await supabaseAdmin
    .from('appointments')
    .select('scheduled_at, duration_minutes')
    .gte('scheduled_at', checkStart.toISOString())
    .lte('scheduled_at', checkEnd.toISOString())
    .in('status', ['confirmed', 'active']);

  if (error) {
    console.error('Error checking availability:', error);
    throw new Error('Failed to check availability');
  }

  // Check for overlaps
  for (const appointment of appointments || []) {
    const appointmentStart = new Date(appointment.scheduled_at);
    const appointmentEnd = new Date(appointmentStart.getTime() + appointment.duration_minutes * 60000);

    const overlaps = slotStart < appointmentEnd && slotEnd > appointmentStart;

    if (overlaps) {
      return false;
    }
  }

  return true;
}

/**
 * POST /api/booking
 * Creates a new appointment in Supabase
 *
 * Body:
 * {
 *   serviceType: "Collecte" | "Dépôt atelier",
 *   scheduledAt: ISO datetime string,
 *   customerName: string,
 *   customerEmail: string,
 *   customerPhone: string,
 *   customerAddress?: string, (required for "Collecte")
 *   vehicleType?: string,
 *   message?: string
 * }
 */
export async function POST(request) {
  try {
    const supabaseAdmin = getSupabaseServerClient();
    const body = await request.json();
    const normalizedServiceType = normalizeServiceType(body.serviceType);

    // Validate required fields
    const requiredFields = ['serviceType', 'scheduledAt', 'customerName', 'customerEmail', 'customerPhone'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate service type
    if (!normalizedServiceType) {
      return NextResponse.json(
        { error: 'Invalid service type. Must be "collecte" or "depot_atelier"' },
        { status: 400 }
      );
    }

    // Validate address is provided for "Collecte"
    if (normalizedServiceType === 'collecte' && !body.customerAddress) {
      return NextResponse.json(
        { error: 'Address is required for "Collecte" service' },
        { status: 400 }
      );
    }

    // Validate datetime format
    const scheduledAt = new Date(body.scheduledAt);
    if (isNaN(scheduledAt.getTime())) {
      return NextResponse.json(
        { error: 'Invalid datetime format for scheduledAt' },
        { status: 400 }
      );
    }

    // Check if date is in the past
    const now = new Date();
    if (scheduledAt < now) {
      return NextResponse.json(
        { error: 'Cannot book appointments in the past' },
        { status: 400 }
      );
    }

    // Check slot availability
    const isAvailable = await checkSlotAvailability(supabaseAdmin, body.scheduledAt);
    if (!isAvailable) {
      return NextResponse.json(
        { error: 'This time slot is no longer available. Please select another slot.' },
        { status: 409 }
      );
    }

    // Create appointment in Supabase
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .insert([
        {
          service_type: normalizedServiceType,
          scheduled_at: body.scheduledAt,
          duration_minutes: APPOINTMENT_DURATION_MINUTES,
          customer_name: body.customerName,
          customer_email: body.customerEmail,
          customer_phone: body.customerPhone,
          customer_address: body.customerAddress || null,
          vehicle_type: body.vehicleType || null,
          message: body.message || null,
          status: 'pending',
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to create appointment' },
        { status: 500 }
      );
    }

    // Send email notifications via Google Apps Script
    try {
      const webhookUrl = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;

      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            appointment: {
              id: data.id,
              serviceType: data.service_type,
              scheduledAt: data.scheduled_at,
            },
            customer: {
              name: body.customerName,
              email: body.customerEmail,
              phone: body.customerPhone,
              address: body.customerAddress || null,
              vehicleType: body.vehicleType || null,
              message: body.message || null,
            }
          })
        });
      }
    } catch (emailError) {
      // Log error but don't fail the booking
      console.error('Email notification error:', emailError);
    }

    // Return sanitized appointment data (exclude sensitive fields if needed)
    return NextResponse.json({
      success: true,
      appointment: {
        id: data.id,
        serviceType: data.service_type,
        scheduledAt: data.scheduled_at,
        status: data.status,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Supabase booking insert error:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment', details: error },
      { status: 500 }
    );
  }
    

  
}
