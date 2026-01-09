import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Fixed time slots (times in HH:mm format)
const TIME_SLOTS = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00"];
const APPOINTMENT_DURATION_MINUTES = 90;

// Initialize Supabase client (read-only for availability checking)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Check if a time slot overlaps with an existing appointment
 * @param {Date} slotStart - The start time of the slot to check
 * @param {Array} existingAppointments - Array of existing appointments
 * @returns {boolean} - True if slot is available, false if it overlaps
 */
function isSlotAvailable(slotStart, existingAppointments) {
  const slotEnd = new Date(slotStart.getTime() + APPOINTMENT_DURATION_MINUTES * 60000);

  for (const appointment of existingAppointments) {
    const appointmentStart = new Date(appointment.scheduled_at);
    const appointmentEnd = new Date(appointmentStart.getTime() + appointment.duration_minutes * 60000);

    // Check for overlap: slot overlaps if it starts before appointment ends AND ends after appointment starts
    const overlaps = slotStart < appointmentEnd && slotEnd > appointmentStart;

    if (overlaps) {
      return false;
    }
  }

  return true;
}

/**
 * Convert a date string (YYYY-MM-DD) and time string (HH:mm) to a Date object in Europe/Brussels timezone
 */
function createBrusselsDateTime(dateStr, timeStr) {
  // Parse the date and time in local format
  const [hours, minutes] = timeStr.split(':').map(Number);

  // Create date in ISO format for Brussels timezone
  // We'll use the date string as-is and assume it's already in Brussels time
  const isoString = `${dateStr}T${timeStr}:00+01:00`; // Brussels is UTC+1 (or UTC+2 in summer)

  return new Date(isoString);
}

/**
 * GET /api/availability?date=YYYY-MM-DD
 * Returns available time slots for a given date
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');

    // Validate date parameter
    if (!dateStr) {
      return NextResponse.json(
        { error: 'Date parameter is required (format: YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Check if date is in the past
    const requestedDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (requestedDate < today) {
      return NextResponse.json(
        { error: 'Cannot check availability for past dates' },
        { status: 400 }
      );
    }

    // Fetch all appointments for the requested date
    // We need to get appointments that could overlap with any slot on this day
    const dayStart = `${dateStr}T00:00:00`;
    const dayEnd = `${dateStr}T23:59:59`;

    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('scheduled_at, duration_minutes')
      .gte('scheduled_at', dayStart)
      .lte('scheduled_at', dayEnd)
      .in('status', ['pending', 'confirmed']); // Only check non-cancelled appointments

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch appointments' },
        { status: 500 }
      );
    }

    // Check availability for each time slot
    const availableSlots = TIME_SLOTS.filter(timeSlot => {
      const slotDateTime = createBrusselsDateTime(dateStr, timeSlot);
      return isSlotAvailable(slotDateTime, appointments || []);
    });

    return NextResponse.json({
      date: dateStr,
      availableSlots,
      allSlots: TIME_SLOTS,
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
