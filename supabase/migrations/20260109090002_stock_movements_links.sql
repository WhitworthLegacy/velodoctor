-- 002_stock_movements_links.sql

-- Ajouts (NULLABLE pour compat)
alter table stock_movements
  add column if not exists inventory_item_id uuid,
  add column if not exists client_id uuid,
  add column if not exists intervention_id uuid,
  add column if not exists tech_id uuid,
  add column if not exists notes text;

-- FK (défensif)
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'fk_stock_movements_inventory_item'
  ) then
    alter table stock_movements
      add constraint fk_stock_movements_inventory_item
      foreign key (inventory_item_id) references inventory_items(id) on delete set null;
  end if;

  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'fk_stock_movements_client'
  ) then
    alter table stock_movements
      add constraint fk_stock_movements_client
      foreign key (client_id) references clients(id) on delete set null;
  end if;

  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'fk_stock_movements_intervention'
  ) then
    alter table stock_movements
      add constraint fk_stock_movements_intervention
      foreign key (intervention_id) references interventions(id) on delete set null;
  end if;

  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'fk_stock_movements_tech'
  ) then
    alter table stock_movements
      add constraint fk_stock_movements_tech
      foreign key (tech_id) references profiles(id) on delete set null;
  end if;
end $$;

-- Backfill: inventory_item_id depuis item_id (si item_id pointe déjà inventory_items)
-- On fait un backfill "safe" : seulement si l'id existe dans inventory_items
update stock_movements sm
set inventory_item_id = sm.item_id
where sm.inventory_item_id is null
  and exists (select 1 from inventory_items ii where ii.id = sm.item_id);

create index if not exists idx_stock_movements_inventory_item_id on stock_movements(inventory_item_id);
create index if not exists idx_stock_movements_client_id on stock_movements(client_id);
create index if not exists idx_stock_movements_intervention_id on stock_movements(intervention_id);
create index if not exists idx_stock_movements_created_at on stock_movements(created_at);