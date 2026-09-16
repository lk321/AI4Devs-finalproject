alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.offers enable row level security;
alter table public.reviews enable row level security;

create or replace function public.is_listing_participant(target_conversation uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.conversations c
    join public.listings l on l.id = c.listing_id
    where c.id = target_conversation
      and auth.uid() in (c.buyer_id, l.seller_id)
  )
$$;

create policy "perfiles visibles para todos" on public.profiles
  for select using (true);

create policy "cada usuario crea su perfil" on public.profiles
  for insert with check (auth.uid() = id);

create policy "cada usuario edita su perfil" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "categorias visibles para todos" on public.categories
  for select using (true);

create policy "anuncios publicos visibles" on public.listings
  for select using (status in ('published', 'reserved', 'sold') or auth.uid() = seller_id);

create policy "el vendedor crea sus anuncios" on public.listings
  for insert with check (auth.uid() = seller_id);

create policy "el vendedor edita sus anuncios" on public.listings
  for update using (auth.uid() = seller_id) with check (auth.uid() = seller_id);

create policy "el vendedor borra sus anuncios" on public.listings
  for delete using (auth.uid() = seller_id);

create policy "imagenes visibles con su anuncio" on public.listing_images
  for select using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (l.status in ('published', 'reserved', 'sold') or l.seller_id = auth.uid())
    )
  );

create policy "el vendedor gestiona sus imagenes" on public.listing_images
  for all using (
    exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = auth.uid())
  ) with check (
    exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = auth.uid())
  );

create policy "conversaciones solo para participantes" on public.conversations
  for select using (
    auth.uid() = buyer_id
    or exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = auth.uid())
  );

create policy "el comprador abre la conversacion" on public.conversations
  for insert with check (
    auth.uid() = buyer_id
    and exists (
      select 1 from public.listings l
      where l.id = listing_id
        and l.seller_id <> auth.uid()
        and l.status in ('published', 'reserved')
    )
  );

create policy "los participantes marcan lectura" on public.conversations
  for update using (public.is_listing_participant(id))
  with check (public.is_listing_participant(id));

create policy "mensajes solo para participantes" on public.messages
  for select using (public.is_listing_participant(conversation_id));

create policy "los participantes escriben" on public.messages
  for insert with check (
    auth.uid() = sender_id and public.is_listing_participant(conversation_id)
  );

create policy "ofertas solo para participantes" on public.offers
  for select using (public.is_listing_participant(conversation_id));

create policy "el comprador oferta" on public.offers
  for insert with check (
    auth.uid() = buyer_id
    and exists (select 1 from public.conversations c where c.id = conversation_id and c.buyer_id = auth.uid())
  );

create policy "el vendedor resuelve la oferta" on public.offers
  for update using (
    exists (
      select 1
      from public.conversations c
      join public.listings l on l.id = c.listing_id
      where c.id = conversation_id and l.seller_id = auth.uid()
    )
  );

create policy "valoraciones visibles para todos" on public.reviews
  for select using (true);

create policy "solo valora quien participo" on public.reviews
  for insert with check (
    auth.uid() = author_id
    and exists (
      select 1 from public.listings l
      where l.id = listing_id
        and l.status = 'sold'
        and l.sold_at > now() - interval '30 days'
        and auth.uid() in (l.seller_id, l.buyer_id)
        and subject_id in (l.seller_id, l.buyer_id)
    )
  );

create policy "imagenes de anuncio legibles" on storage.objects
  for select using (bucket_id = 'listing-images');

create policy "usuarios autenticados suben imagenes" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'listing-images' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "cada usuario borra sus imagenes" on storage.objects
  for delete to authenticated using (
    bucket_id = 'listing-images' and (storage.foldername(name))[1] = auth.uid()::text
  );
