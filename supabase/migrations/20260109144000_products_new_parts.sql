-- Publish new shop products linked to inventory items

insert into public.products (inventory_item_id, slug, title, is_published)
select ii.id, v.slug, v.title, true
from (
  values
    ('Pneu 10x2.5-6.5', 'pneu-10x2-5-6-5', 'Pneu 10x2.5-6.5'),
    ('Pneu 8x2.125', 'pneu-8x2-125', 'Pneu 8x2.125'),
    ('Pneu 10.2.75-6.5', 'pneu-10-2-75-6-5', 'Pneu 10.2.75-6.5'),
    ('Pneu 10.2.75-6.5 Tubeless', 'pneu-10-2-75-6-5-tubeless', 'Pneu 10.2.75-6.5 Tubeless'),
    ('Pneu 20x4', 'pneu-20x4', 'Pneu 20x4'),
    ('Pneu 8x3 increvable', 'pneu-8x3-increvable', 'Pneu 8x3 increvable'),
    ('Pneu 10x2.5-6.5 increvable', 'pneu-10x2-5-6-5-increvable', 'Pneu 10x2.5-6.5 increvable'),
    ('Pneu 60/70-6.5', 'pneu-60-70-6-5', 'Pneu 60/70-6.5'),
    ('Pneu 26"', 'pneu-26', 'Pneu 26"'),
    ('Chaine anti-vol', 'chaine-anti-vol', 'Chaine anti-vol'),
    ('Chambre a air 26"', 'chambre-a-air-26', 'Chambre a air 26"'),
    ('Cable de freins', 'cable-de-freins', 'Cable de freins'),
    ('Chambre a air 8.5x3', 'chambre-a-air-8-5x3', 'Chambre a air 8.5x3'),
    ('Chambre a air 60/70-6.5', 'chambre-a-air-60-70-6-5', 'Chambre a air 60/70-6.5'),
    ('Chambre a air 20x4', 'chambre-a-air-20x4', 'Chambre a air 20x4'),
    ('Plaquettes de frein RT006', 'plaquettes-de-frein-rt006', 'Plaquettes de frein RT006'),
    ('Plaquettes de freins Magura', 'plaquettes-de-freins-magura', 'Plaquettes de freins Magura'),
    ('Display Kukirin', 'display-kukirin', 'Display Kukirin'),
    ('CS001 plaquettes resine 20mm (Xiaomi)', 'cs001-plaquettes-resine-20mm-xiaomi', 'CS001 plaquettes resine 20mm (Xiaomi)'),
    ('Ecran S866 avec connecteur', 'ecran-s866-avec-connecteur', 'Ecran S866 avec connecteur')
) as v(name, slug, title)
join public.inventory_items ii on ii.name = v.name
where not exists (
  select 1
  from public.products p
  where p.inventory_item_id = ii.id
);
