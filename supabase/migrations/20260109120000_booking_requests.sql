create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending'
    check (status in ('pending','confirmed','converted','cancelled')),

  service_type text not null check (service_type in ('collecte','depot_atelier')),
  scheduled_date date not null,
  slot_time time not null,
  duration_minutes integer not null default 90,

  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  customer_address text,

  vehicle_type text,
  message text,

  -- links after ops conversion
  client_id uuid references public.clients(id) on delete set null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  appointment_id uuid references public.appointments(id) on delete set null
);

create index if not exists idx_booking_requests_status
  on public.booking_requests (status);

create index if not exists idx_booking_requests_date_slot
  on public.booking_requests (scheduled_date, slot_time);

alter table public.booking_requests enable row level security;

-- Keep it CLOSED by default (recommended).
-- Booking insert will be done via Next.js API route using SERVICE ROLE.