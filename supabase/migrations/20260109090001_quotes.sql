-- 001_quotes.sql

create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  intervention_id uuid not null unique references interventions(id) on delete cascade,

  status text not null default 'draft', -- draft|sent|accepted|rejected|expired
  currency text not null default 'EUR',

  labor_total numeric not null default 0,
  parts_total numeric not null default 0,
  total numeric not null default 0,

  sent_at timestamptz,
  accepted_at timestamptz,
  rejected_at timestamptz,

  pdf_url text,
  notes text
);

create index if not exists idx_quotes_intervention_id on quotes(intervention_id);
create index if not exists idx_quotes_status on quotes(status);

create table if not exists quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quotes(id) on delete cascade,

  kind text not null, -- labor|part|fee|discount
  inventory_item_id uuid references inventory_items(id) on delete set null,

  label text not null,
  qty integer not null default 1,
  unit_price numeric not null default 0,
  line_total numeric not null default 0
);

create index if not exists idx_quote_items_quote_id on quote_items(quote_id);
create index if not exists idx_quote_items_inventory_item_id on quote_items(inventory_item_id);

-- Backfill minimal: créer un quote "draft" pour les interventions qui ont déjà quote_amount
insert into quotes (intervention_id, status, total, parts_total)
select i.id, 'draft', coalesce(i.quote_amount, 0), coalesce(i.quote_amount, 0)
from interventions i
left join quotes q on q.intervention_id = i.id
where q.id is null and i.quote_amount is not null;