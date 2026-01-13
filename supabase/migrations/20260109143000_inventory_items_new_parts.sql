-- Seed new inventory items (parts list)

insert into public.inventory_items (name, price_sell, quantity, min_threshold, price_buy)
select v.name, v.price_sell, 0, 5, 0
from (
  values
    ('Pneu 10x2.5-6.5', 34.99),
    ('Pneu 8x2.125', 30.00),
    ('Pneu 10.2.75-6.5', 45.00),
    ('Pneu 10.2.75-6.5 Tubeless', 49.00),
    ('Pneu 20x4', 50.00),
    ('Pneu 8x3 increvable', 39.00),
    ('Pneu 10x2.5-6.5 increvable', 44.00),
    ('Pneu 60/70-6.5', 49.99),
    ('Pneu 26"', 59.00),
    ('Chaine anti-vol', 25.00),
    ('Chambre a air 26"', 20.00),
    ('Cable de freins', 20.00),
    ('Chambre a air 8.5x3', 15.00),
    ('Chambre a air 60/70-6.5', 15.00),
    ('Chambre a air 20x4', 24.95),
    ('Plaquettes de frein RT006', 15.00),
    ('Plaquettes de freins Magura', 15.00),
    ('Display Kukirin', 70.00),
    ('CS001 plaquettes resine 20mm (Xiaomi)', 15.00),
    ('Ecran S866 avec connecteur', 40.00)
) as v(name, price_sell)
where not exists (
  select 1
  from public.inventory_items ii
  where ii.name = v.name
);
