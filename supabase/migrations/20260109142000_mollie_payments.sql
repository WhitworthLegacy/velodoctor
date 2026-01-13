-- Mollie checkout support (orders + idempotence)

alter table orders
  add column if not exists mollie_payment_id text unique,
  add column if not exists mollie_order_id text unique,
  add column if not exists mollie_status text,
  add column if not exists mollie_checkout_url text;

create table if not exists mollie_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_id text not null unique,
  event_type text not null,
  processed boolean not null default false
);

create index if not exists idx_mollie_events_created_at on mollie_events(created_at);
