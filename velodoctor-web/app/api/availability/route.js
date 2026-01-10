import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

const BRUSSELS_TIMEZONE = 'Europe/Brussels';
// Fixed time slots (times in HH:mm format)
const TIME_SLOTS = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30"];
const APPOINTMENT_DURATION_MINUTES = 90;

/**
 * Check if a time slot overlaps with an existing appointment
 * @param {Date} slotStart - The start time of the slot to check
 * @param {Array} existingAppointments - Array of existing appointments
 * @returns {object | null} - Overlapping appointment or null if none
 */
function findOverlappingAppointment(slotStart, existingAppointments) {
  const slotEnd = new Date(slotStart.getTime() + APPOINTMENT_DURATION_MINUTES * 60000);

  for (const appointment of existingAppointments) {
    const appointmentStart = new Date(appointment.scheduled_at);
    const appointmentEnd = new Date(appointmentStart.getTime() + appointment.duration_minutes * 60000);

    // Check for overlap: slot overlaps if it starts before appointment ends AND ends after appointment starts
    const overlaps = slotStart < appointmentEnd && slotEnd > appointmentStart;

    if (overlaps) {
      return appointment;
    }
  }

  return null;
}

/**
 * Convert a date string (YYYY-MM-DD) and time string (HH:mm) to a Date object in Europe/Brussels timezone
 */
function getTimeZoneOffsetMinutes(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date);

  const lookup = parts.reduce((acc, part) => {
    if (part.type !== 'literal') {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

  const localIso = `${lookup.year}-${lookup.month}-${lookup.day}T${lookup.hour}:${lookup.minute}:${lookup.second}Z`;
  const localDate = new Date(localIso);
  return (localDate.getTime() - date.getTime()) / 60000;
}

function createBrusselsDateTime(dateStr, timeStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);

  const utcGuess = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
  const offsetMinutes = getTimeZoneOffsetMinutes(utcGuess, BRUSSELS_TIMEZONE);
  return new Date(utcGuess.getTime() - offsetMinutes * 60000);
}

function getBrusselsDateString(date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: BRUSSELS_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const lookup = parts.reduce((acc, part) => {
    if (part.type !== 'literal') {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

  return `${lookup.year}-${lookup.month}-${lookup.day}`;
}

function formatBrusselsDateTime(date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BRUSSELS_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

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
 * GET /api/availability?date=YYYY-MM-DD
 * Returns available time slots for a given date
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');
    const serviceType = searchParams.get('serviceType') || searchParams.get('service_type');
    const debugMode = searchParams.get('debug') === '1';
    const normalizedServiceType = normalizeServiceType(serviceType);

    if (serviceType && !normalizedServiceType) {
      return NextResponse.json(
        { error: 'Invalid service type' },
        { status: 400 }
      );
    }

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
    const todayBrussels = getBrusselsDateString(new Date());
    const requestedDate = createBrusselsDateTime(dateStr, '12:00');
    const dayStart = createBrusselsDateTime(dateStr, '00:00');
    const dayEnd = createBrusselsDateTime(dateStr, '23:59');

    if (dateStr < todayBrussels) {
      return NextResponse.json(
        { error: 'Cannot check availability for past dates' },
        { status: 400 }
      );
    }

    if (requestedDate.getUTCDay() === 0) {
      return NextResponse.json({
        date: dateStr,
        availableSlots: [],
        allSlots: TIME_SLOTS,
        ...(debugMode
          ? {
              debug: {
                slots: TIME_SLOTS,
                slotsCount: TIME_SLOTS.length,
                dayStart: dayStart.toISOString(),
                dayEnd: dayEnd.toISOString(),
                dayStartBrussels: formatBrusselsDateTime(dayStart),
                dayEndBrussels: formatBrusselsDateTime(dayEnd),
                appointments: [],
                bookedIntervals: [],
                removedSlots: TIME_SLOTS.map((slot) => ({
                  slot,
                  reason: 'closed_on_sunday',
                })),
                availableSlots: [],
              },
            }
          : {}),
      });
    }

    // Fetch all appointments for the requested date
    // We need to get appointments that could overlap with any slot on this day
    const supabase = getSupabaseServerClient();

    let query = supabase
      .from('appointments')
      .select('id, scheduled_at, duration_minutes, status, service_type')
      .gte('scheduled_at', dayStart.toISOString())
      .lte('scheduled_at', dayEnd.toISOString())
      .in('status', ['pending', 'confirmed', 'in_transit']);

    if (normalizedServiceType) {
      const serviceTypeOptions = new Set([normalizedServiceType]);
      if (normalizedServiceType === 'collecte') {
        serviceTypeOptions.add('Collecte');
      }
      if (normalizedServiceType === 'depot_atelier') {
        serviceTypeOptions.add('atelier');
        serviceTypeOptions.add('Dépôt atelier');
      }
      if (serviceType) {
        serviceTypeOptions.add(serviceType);
      }
      query = query.in('service_type', Array.from(serviceTypeOptions));
    }

    const { data: appointments, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch appointments' },
        { status: 500 }
      );
    }

    const bookedIntervals = (appointments || []).map((appointment) => {
      const start = new Date(appointment.scheduled_at);
      const end = new Date(start.getTime() + appointment.duration_minutes * 60000);
      return {
        id: appointment.id,
        start: start.toISOString(),
        end: end.toISOString(),
        startBrussels: formatBrusselsDateTime(start),
        endBrussels: formatBrusselsDateTime(end),
        status: appointment.status,
        serviceType: appointment.service_type,
      };
    });

    // Check availability for each time slot
    const debugInfo = {
      slots: TIME_SLOTS,
      slotsCount: TIME_SLOTS.length,
      dayStart: dayStart.toISOString(),
      dayEnd: dayEnd.toISOString(),
      dayStartBrussels: formatBrusselsDateTime(dayStart),
      dayEndBrussels: formatBrusselsDateTime(dayEnd),
      appointments: appointments || [],
      bookedIntervals,
      removedSlots: [],
    };

    const availableSlots = [];
    for (const timeSlot of TIME_SLOTS) {
      const slotDateTime = createBrusselsDateTime(dateStr, timeSlot);
      const overlap = findOverlappingAppointment(slotDateTime, appointments || []);

      if (overlap) {
        if (debugMode) {
          debugInfo.removedSlots.push({
            slot: timeSlot,
            reason: 'overlaps_existing_appointment',
            appointment: overlap,
          });
        }
        continue;
      }

      availableSlots.push(timeSlot);
    }

    return NextResponse.json({
      date: dateStr,
      availableSlots,
      allSlots: TIME_SLOTS,
      ...(debugMode ? { debug: { ...debugInfo, availableSlots } } : {}),
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
