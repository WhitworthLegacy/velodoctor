-- Helper: get current user's role from profiles
create or replace function public.current_role()
returns text
language sql stable
as $$
  select role from profiles where id = auth.uid()
$$;

create or replace function public.is_staff()
returns boolean
language sql stable
as $$
  select public.current_role() in ('admin','manager','dispatch','tech','driver','support')
$$;

-- Enable RLS on core tables
alter table profiles enable row level security;
alter table clients enable row level security;
alter table vehicles enable row level security;
alter table interventions enable row level security;
alter table intervention_items enable row level security;
alter table appointments enable row level security;

alter table inventory_items enable row level security;
alter table stock_movements enable row level security;

alter table quotes enable row level security;
alter table quote_items enable row level security;

alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table stripe_events enable row level security;

-- Profiles policies
drop policy if exists "profiles read own" on profiles;
create policy "profiles read own"
on profiles for select
using (auth.uid() = id);

drop policy if exists "profiles staff read all" on profiles;
create policy "profiles staff read all"
on profiles for select
using (public.is_staff());

-- Generic: staff can read/write everything (v1 simple)
-- You can harden later (driver/tech restrictions)
do $$
declare t text;
begin
  foreach t in array array[
    'clients','vehicles','interventions','intervention_items','appointments',
    'inventory_items','stock_movements','quotes','quote_items',
    'products','orders','order_items','stripe_events'
  ]
  loop
    execute format('drop policy if exists "%s staff rw" on %I;', t, t);
    execute format($pol$
      create policy "%s staff rw"
      on %I for all
      using (public.is_staff())
      with check (public.is_staff());
    $pol$, t, t);
  end loop;
end $$;