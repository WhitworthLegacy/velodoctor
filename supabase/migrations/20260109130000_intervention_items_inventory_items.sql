-- Align intervention_items.inventory_item_id FK -> inventory_items(id)

ALTER TABLE public.intervention_items
  DROP CONSTRAINT IF EXISTS intervention_items_inventory_item_id_fkey;

UPDATE public.intervention_items ii
SET inventory_item_id = NULL
WHERE inventory_item_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM public.inventory_items inv
    WHERE inv.id = ii.inventory_item_id
  );

ALTER TABLE public.intervention_items
  ADD CONSTRAINT intervention_items_inventory_item_id_fkey
  FOREIGN KEY (inventory_item_id)
  REFERENCES public.inventory_items(id)
  ON DELETE SET NULL;
