-- Link product cover images to local public assets

update public.products
set cover_image_url = v.cover_image_url
from (
  values
    ('pneu-10x2-5-6-5', '/pieces/Pneu 10 pouces.png'),
    ('pneu-8x2-125', '/pieces/Pneu 8x2.125.png'),
    ('pneu-10-2-75-6-5', '/pieces/Pneu 10.2.75-6.5.png'),
    ('pneu-10-2-75-6-5-tubeless', '/pieces/Pneu 10.2.75-6.5 Tubeless.png'),
    ('pneu-20x4', '/pieces/Chambre a air 20x4.png'),
    ('pneu-8x3-increvable', '/pieces/Pneu 8x3 increvable.png'),
    ('pneu-10x2-5-6-5-increvable', '/pieces/Pneu 10x2.5-6.5 increvable.png'),
    ('pneu-60-70-6-5', '/pieces/Pneu 60_70-6.5.png'),
    ('pneu-26', '/pieces/Pneu 26.png'),
    ('chaine-anti-vol', '/pieces/Chaine anti-vol.png'),
    ('chambre-a-air-26', '/pieces/Chambre a air 26.png'),
    ('cable-de-freins', '/pieces/Cable de freins.png'),
    ('chambre-a-air-8-5x3', '/pieces/Chambre à air 8.5 x3.png'),
    ('chambre-a-air-60-70-6-5', '/pieces/Chambre a air 60_70-6.5.png'),
    ('chambre-a-air-20x4', '/pieces/Chambre a air 20x4.png'),
    ('plaquettes-de-frein-rt006', '/pieces/Plaquettes de frein RT006.png'),
    ('plaquettes-de-freins-magura', '/pieces/Plaquettes freins Magura.png'),
    ('display-kukirin', '/pieces/Display Kukirin.png'),
    ('cs001-plaquettes-resine-20mm-xiaomi', '/pieces/CS001 plaquettes resine 20mm (Xiaomi).png'),
    ('ecran-s866-avec-connecteur', '/pieces/Ecran S866 avec connecteur.png')
) as v(slug, cover_image_url)
where public.products.slug = v.slug;
