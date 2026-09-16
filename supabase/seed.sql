insert into public.categories (id, slug, name, parent_id, position) values
  ('11111111-0000-4000-8000-000000000001', 'tecnologia', 'Tecnología', null, 1),
  ('11111111-0000-4000-8000-000000000002', 'hogar', 'Hogar', null, 2),
  ('11111111-0000-4000-8000-000000000003', 'deporte', 'Deporte', null, 3),
  ('11111111-0000-4000-8000-000000000004', 'musica', 'Música', null, 4),
  ('11111111-0000-4000-8000-000000000005', 'moda', 'Moda', null, 5),
  ('22222222-0000-4000-8000-000000000001', 'moviles', 'Móviles', '11111111-0000-4000-8000-000000000001', 1),
  ('22222222-0000-4000-8000-000000000002', 'ordenadores', 'Ordenadores', '11111111-0000-4000-8000-000000000001', 2),
  ('22222222-0000-4000-8000-000000000003', 'muebles', 'Muebles', '11111111-0000-4000-8000-000000000002', 1),
  ('22222222-0000-4000-8000-000000000004', 'bicicletas', 'Bicicletas', '11111111-0000-4000-8000-000000000003', 1),
  ('22222222-0000-4000-8000-000000000005', 'instrumentos', 'Instrumentos', '11111111-0000-4000-8000-000000000004', 1);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
select
  '00000000-0000-0000-0000-000000000000',
  seed.id,
  'authenticated',
  'authenticated',
  seed.email,
  extensions.crypt('loopmarket123', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('alias', seed.alias, 'city', seed.city),
  now() - (seed.days || ' days')::interval,
  now()
from (values
  ('33333333-0000-4000-8000-000000000001'::uuid, 'ana@loop.test', 'ana_ruiz', 'Madrid', 420),
  ('33333333-0000-4000-8000-000000000002'::uuid, 'carlos@loop.test', 'carlos_vega', 'Alcobendas', 180),
  ('33333333-0000-4000-8000-000000000003'::uuid, 'lucia@loop.test', 'lucia_mor', 'Barcelona', 95)
) as seed (id, email, alias, city, days);

insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
select
  u.id::text,
  u.id,
  jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
  'email',
  now(), now(), now()
from auth.users u;

update public.profiles set latitude = 40.4168, longitude = -3.7038 where city = 'Madrid';
update public.profiles set latitude = 40.5473, longitude = -3.6416 where city = 'Alcobendas';
update public.profiles set latitude = 41.3874, longitude = 2.1686 where city = 'Barcelona';

insert into public.listings (
  id, seller_id, category_id, title, description, price_cents, condition, status,
  city, latitude, longitude, published_at
)
values
  ('44444444-0000-4000-8000-000000000001', '33333333-0000-4000-8000-000000000001', '22222222-0000-4000-8000-000000000004',
   'Bicicleta de montaña 27,5 pulgadas', 'Bicicleta de montaña con cuadro de aluminio, 21 velocidades y frenos de disco. Revisada en taller el mes pasado, ruedas nuevas.',
   18000, 'bueno', 'published', 'Madrid', 40.4168, -3.7038, now() - interval '4 days'),
  ('44444444-0000-4000-8000-000000000002', '33333333-0000-4000-8000-000000000001', '22222222-0000-4000-8000-000000000005',
   'Guitarra acústica con funda', 'Guitarra acústica de tapa de abeto, cuerdas recién cambiadas. Incluye funda acolchada y cejilla. Suena redonda y afina estable.',
   12500, 'como_nuevo', 'published', 'Madrid', 40.4168, -3.7038, now() - interval '9 days'),
  ('44444444-0000-4000-8000-000000000003', '33333333-0000-4000-8000-000000000002', '22222222-0000-4000-8000-000000000002',
   'Portátil 14 pulgadas 16GB RAM', 'Portátil de 14 pulgadas con 16GB de RAM y 512GB SSD. Batería con ciclo bajo, teclado impecable. Se entrega con cargador original.',
   42000, 'bueno', 'published', 'Alcobendas', 40.5473, -3.6416, now() - interval '2 days'),
  ('44444444-0000-4000-8000-000000000004', '33333333-0000-4000-8000-000000000002', '22222222-0000-4000-8000-000000000001',
   'Móvil 128GB libre de operador', 'Teléfono de 128GB liberado, pantalla sin arañazos y carcasa con marcas mínimas de uso. Incluye caja original y cable.',
   21000, 'aceptable', 'published', 'Alcobendas', 40.5473, -3.6416, now() - interval '12 days'),
  ('44444444-0000-4000-8000-000000000005', '33333333-0000-4000-8000-000000000002', '22222222-0000-4000-8000-000000000003',
   'Escritorio de roble macizo', 'Escritorio de roble macizo de 140x70 cm con dos cajones. Muy estable, ideal para teletrabajo. Se desmonta para el transporte.',
   15000, 'bueno', 'published', 'Alcobendas', 40.5473, -3.6416, now() - interval '20 days'),
  ('44444444-0000-4000-8000-000000000006', '33333333-0000-4000-8000-000000000003', '22222222-0000-4000-8000-000000000004',
   'Bicicleta urbana plegable', 'Bicicleta urbana plegable de 20 pulgadas, perfecta para combinar con transporte público. Plegado rápido y bolsa incluida.',
   24000, 'como_nuevo', 'published', 'Barcelona', 41.3874, 2.1686, now() - interval '1 day'),
  ('44444444-0000-4000-8000-000000000007', '33333333-0000-4000-8000-000000000003', '22222222-0000-4000-8000-000000000005',
   'Piano digital 88 teclas', 'Piano digital de 88 teclas contrapesadas con soporte y pedal. Sonido de cola muestreado, salida de auriculares para ensayar de noche.',
   55000, 'bueno', 'published', 'Barcelona', 41.3874, 2.1686, now() - interval '6 days'),
  ('44444444-0000-4000-8000-000000000008', '33333333-0000-4000-8000-000000000001', '11111111-0000-4000-8000-000000000005',
   'Chaqueta de cuero talla M', 'Chaqueta de cuero auténtico talla M, forro interior intacto y cremalleras originales. Apenas usada dos temporadas.',
   8000, 'bueno', 'published', 'Madrid', 40.4168, -3.7038, now() - interval '15 days');

insert into public.listing_images (listing_id, url, alt, position, bytes)
select
  l.id,
  'https://images.unsplash.com/photo-' || img.photo || '?auto=format&fit=crop&w=1200&q=70',
  l.title,
  0,
  420000
from public.listings l
join (values
  ('44444444-0000-4000-8000-000000000001'::uuid, '1485965120184-e220f721d03e'),
  ('44444444-0000-4000-8000-000000000002'::uuid, '1510915361894-db8b60106cb1'),
  ('44444444-0000-4000-8000-000000000003'::uuid, '1496181133206-80ce9b88a853'),
  ('44444444-0000-4000-8000-000000000004'::uuid, '1511707171634-5f897ff02aa9'),
  ('44444444-0000-4000-8000-000000000005'::uuid, '1518455027359-f3f8164ba6bd'),
  ('44444444-0000-4000-8000-000000000006'::uuid, '1532298229144-0ec0c57515c7'),
  ('44444444-0000-4000-8000-000000000007'::uuid, '1520523839897-bd0b52f945a0'),
  ('44444444-0000-4000-8000-000000000008'::uuid, '1551028719-00167b16eac5')
) as img (listing_id, photo) on img.listing_id = l.id;
