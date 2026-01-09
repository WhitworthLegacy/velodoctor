# VeloDoctor Booking System

## Overview

The VeloDoctor booking system allows customers to book repair appointments through a 4-step wizard interface. The system uses fixed time slots and checks availability against the existing Supabase project used by `velodoctor-admin`.

## Key Features

- **Fixed Time Slots**: 7 daily slots at 90-minute intervals
- **Real-time Availability**: Checks Supabase for slot conflicts
- **4-Step Booking Flow**: Service type → Date → Time → Contact details
- **Overlap Prevention**: Server-side validation prevents double bookings
- **Timezone Support**: All times in Europe/Brussels (UTC+1/+2)

---

## Time Slots Configuration

**Fixed Slots (90-minute duration each):**
- 09:00 - 10:30
- 10:30 - 12:00
- 12:00 - 13:30
- 13:30 - 15:00
- 15:00 - 16:30
- 16:30 - 18:00
- 18:00 - 19:30

Slots are defined in:
- `/app/api/availability/route.js` (line 6)
- `/app/api/booking/route.js` (line 10)

---

## Database Schema

### Appointments Table

Apply the migration in your existing Supabase project (do not create a new project for `velodoctor-web`):

`supabase/migrations/20260109101000_appointments_booking.sql`

**Key Columns:**
- `id`: UUID (primary key)
- `service_type`: 'Collecte' or 'Dépôt atelier'
- `scheduled_at`: TIMESTAMPTZ (start time in Europe/Brussels)
- `duration_minutes`: INTEGER (default 90)
- `customer_name`, `customer_email`, `customer_phone`
- `customer_address`: TEXT (required for 'Collecte' service)
- `vehicle_type`, `message`: Optional fields
- `status`: 'pending', 'confirmed', 'completed', 'cancelled'

**Indexes:**
- `idx_appointments_scheduled_at`: For fast availability queries
- `idx_appointments_status`: For filtering by status

**RLS Policies:**
- Availability checks use a public SELECT policy when needed
- Writes happen server-side via Next.js API routes using the service role key

---

## API Routes

All Supabase access happens in Next.js server routes (never directly from the client).

### GET /api/availability

**Purpose**: Check which time slots are available for a given date.

**Query Parameters:**
- `date` (required): Date in YYYY-MM-DD format

**Response:**
```json
{
  "date": "2026-01-15",
  "availableSlots": ["09:00", "12:00", "15:00"],
  "allSlots": ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00"]
}
```

**Error Codes:**
- `400`: Invalid date format or missing parameter
- `500`: Database error

**Logic:**
1. Validates date parameter (YYYY-MM-DD format)
2. Prevents checking past dates
3. Fetches all appointments for the requested date
4. Checks each slot for overlaps with existing appointments
5. Returns only available slots

**Overlap Detection:**
- A slot is unavailable if it overlaps with any existing appointment
- Overlap occurs when: `slotStart < appointmentEnd AND slotEnd > appointmentStart`

---

### POST /api/booking

**Purpose**: Create a new appointment (server-side only).

**Request Body:**
```json
{
  "serviceType": "Collecte",
  "scheduledAt": "2026-01-15T09:00:00+01:00",
  "customerName": "Jean Dupont",
  "customerEmail": "jean@example.com",
  "customerPhone": "+32 XXX XX XX XX",
  "customerAddress": "Rue Example 123, 1000 Bruxelles",
  "vehicleType": "Vélo électrique",
  "message": "Problème avec la batterie"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "appointment": {
    "id": "uuid-here",
    "serviceType": "Collecte",
    "scheduledAt": "2026-01-15T09:00:00+01:00",
    "status": "pending"
  }
}
```

**Error Codes:**
- `400`: Missing required fields or invalid data
- `409`: Time slot no longer available (conflict)
- `500`: Database error

**Validation:**
1. Checks all required fields are present
2. Validates `serviceType` is 'Collecte' or 'Dépôt atelier'
3. Requires `customerAddress` for 'Collecte' service
4. Validates `scheduledAt` is a valid future datetime
5. Re-checks slot availability (prevents race conditions)
6. Inserts appointment using Supabase service role key (server-side only)
7. Sends email notifications via Google Apps Script webhook

**Email Notifications:**
After successful booking creation, the API automatically sends:
- **Admin notification**: Email to VeloDoctor with full booking details
- **Customer confirmation**: Professional confirmation email with appointment summary

---

## Booking Flow (User Experience)

### Step 1: Service Type
User chooses between:
- **Collecte à domicile**: We pick up, repair, and return the bike
- **Dépôt à l'atelier**: Customer drops off at workshop

### Step 2: Date Selection
- Standard HTML date picker
- Minimum date: today
- Automatically fetches available slots when date is selected

### Step 3: Time Slot Selection
- Displays available slots as clickable buttons
- Shows loading spinner while fetching availability
- If no slots available: prompts user to choose another date
- Selected slot is highlighted in blue

### Step 4: Contact Details
**Required fields:**
- Name, email, phone
- Address (only if "Collecte" was selected)

**Optional fields:**
- Vehicle type (Vélo électrique, Vélo classique, Trottinette électrique)
- Message (describe the problem)

**Submit:**
- Validates all required fields
- Sends POST request to `/api/booking`
- Shows success screen with confirmation details

---

## Environment Variables

Create a local `.env.local` (not committed) with credentials for the same Supabase project as admin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Security Notes:**
- `NEXT_PUBLIC_*` variables are exposed to the client
- `SUPABASE_SERVICE_ROLE_KEY` is server-side only (NEVER expose to client)
- The service role key bypasses RLS and should only be used in API routes

---

## Timezone Handling

All times are stored and handled in **Europe/Brussels** timezone (UTC+1 in winter, UTC+2 in summer).

**Implementation:**
- Date input from user is assumed to be in Brussels time
- ISO strings constructed with `+01:00` offset (see `/app/booking/page.js` line 101)
- Supabase stores as `TIMESTAMPTZ` (automatically handles DST)

**Note:** For production, consider using a library like `date-fns-tz` or `luxon` for proper timezone handling across DST transitions.

---

## Overlap Prevention Logic

The system prevents double bookings using this algorithm:

```javascript
// Two appointments overlap if:
slotStart < appointmentEnd AND slotEnd > appointmentStart

// Example:
// Slot:        09:00 -------- 10:30
// Appointment:     09:30 -------- 11:00
// Result: OVERLAP (slot unavailable)

// Slot:        09:00 -------- 10:30
// Appointment:               10:30 -------- 12:00
// Result: NO OVERLAP (slot available)
```

**Why it works:**
- If slot starts before appointment ends AND slot ends after appointment starts = overlap
- Edge-to-edge bookings (10:30 slot, 10:30 appointment) do NOT overlap

**Implementation locations:**
- Client-side preview: `/app/api/availability/route.js` (line 27)
- Server-side validation: `/app/api/booking/route.js` (line 20)

---

## Testing the System

### 1. Setup Supabase (shared DB)
```bash
# 1. Use the existing Supabase project (same as velodoctor-admin)
# 1b. Do NOT create a new Supabase project for velodoctor-web
# 2. Run supabase/migrations/20260109101000_appointments_booking.sql
# 3. Add environment variables to .env.local
```

### 2. Test Availability API
```bash
curl "http://localhost:3000/api/availability?date=2026-01-15"
```

### 3. Test Booking API
```bash
curl -X POST http://localhost:3000/api/booking \
  -H "Content-Type: application/json" \
  -d '{
    "serviceType": "Collecte",
    "scheduledAt": "2026-01-15T09:00:00+01:00",
    "customerName": "Test User",
    "customerEmail": "test@example.com",
    "customerPhone": "+32 123 45 67 89",
    "customerAddress": "Test Address"
  }'
```

### 4. Test Overlap Prevention
1. Book slot 09:00 on a date
2. Try to book 09:00 again → Should get 409 conflict error
3. Check availability for that date → 09:00 should not appear

---

## Troubleshooting

### "Failed to fetch appointments" error
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Verify RLS policy allows public SELECT on appointments table

### "Failed to create appointment" error
- Check `SUPABASE_SERVICE_ROLE_KEY` is set (server-side only)
- Verify service role key has INSERT permissions

### Slots not showing as booked
- Check appointment `status` is 'pending' or 'confirmed' (not 'cancelled')
- Verify `scheduled_at` timestamp is correct (Europe/Brussels timezone)

### Timezone issues
- All times should include timezone offset: `2026-01-15T09:00:00+01:00`
- Browser date inputs automatically use local timezone - handle conversion if needed

---

## Future Improvements

**Recommended enhancements:**

1. **Email Notifications**: Send confirmation emails using Resend or SendGrid
2. **Admin Dashboard**: View/manage appointments in velodoctor-admin
3. **SMS Reminders**: Send reminders 24h before appointment
4. **Calendar Integration**: Allow customers to add to Google/Apple Calendar
5. **Recurring Appointments**: Support regular maintenance schedules
6. **Timezone Library**: Use `date-fns-tz` for robust DST handling
7. **Rate Limiting**: Add rate limiting to prevent API abuse
8. **Webhook Integration**: Notify external systems of new bookings

---

## File Structure

```
velodoctor-web/
├── app/
│   ├── api/
│   │   ├── availability/
│   │   │   └── route.js          # GET availability for date
│   │   └── booking/
│   │       └── route.js          # POST create appointment
│   └── booking/
│       └── page.js               # 4-step booking wizard UI
├── ../supabase/migrations/20260109101000_appointments_booking.sql  # Shared DB migration
└── BOOKING_SYSTEM.md             # This documentation
```

---

## Support

For questions or issues with the booking system, contact the development team or create an issue in the project repository.
