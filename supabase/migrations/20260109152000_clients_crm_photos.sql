alter table public.clients
add column if not exists crm_photos text[] not null default '{}'::text[];
