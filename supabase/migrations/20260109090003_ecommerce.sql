-- 003_ecommerce.sql

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  inventory_item_id uuid not null unique references inventory_items(id) on delete restrict,

  slug text not null unique,
  title text not null,
  description text,
  is_published boolean not null default false,

  seo_title text,
  seo_description text,

  cover_image_url text
);

create index if not exists idx_products_is_published on products(is_published);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  client_id uuid references clients(id) on delete set null,

  status text not null default 'pending', -- pending|paid|failed|fulfilled|cancelled|refunded
  currency text not null default 'EUR',
  total numeric not null default 0,

  stripe_payment_intent_id text unique,
  stripe_checkout_session_id text unique,

  email text,
  shipping_address text
);

create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created_at on orders(created_at);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  inventory_item_id uuid not null references inventory_items(id) on delete restrict,

  qty integer not null default 1,
  unit_price numeric not null default 0,
  line_total numeric not null default 0
);

create index if not exists idx_order_items_order_id on order_items(order_id);

-- Idempotence webhooks Stripe
create table if not exists stripe_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_id text not null unique,
  event_type text not null,
  processed boolean not null default false
);