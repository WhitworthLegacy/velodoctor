-- Include super_admin in staff role checks
create or replace function public.is_staff()
returns boolean
language sql stable
as $$
  select public.current_role() in ('admin','super_admin','manager','dispatch','tech','driver','support')
$$;
