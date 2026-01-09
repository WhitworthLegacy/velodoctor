create or replace function public.recalc_quote_totals(p_quote_id uuid)
returns void
language plpgsql
as $$
declare
  v_labor numeric := 0;
  v_parts numeric := 0;
  v_total numeric := 0;
begin
  select
    coalesce(sum(case when kind='labor' then line_total end),0),
    coalesce(sum(case when kind='part' then line_total end),0),
    coalesce(sum(line_total),0)
  into v_labor, v_parts, v_total
  from quote_items
  where quote_id = p_quote_id;

  update quotes
  set labor_total = v_labor,
      parts_total = v_parts,
      total = v_total
  where id = p_quote_id;
end;
$$;