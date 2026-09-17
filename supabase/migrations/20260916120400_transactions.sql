create or replace function public.start_conversation(target_listing uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  listing public.listings%rowtype;
  conversation_id uuid;
begin
  select * into listing from public.listings where id = target_listing;

  if listing.id is null then
    raise exception 'anuncio no encontrado' using errcode = 'no_data_found';
  end if;

  if listing.seller_id = auth.uid() then
    raise exception 'el vendedor no puede conversar con su propio anuncio'
      using errcode = 'insufficient_privilege';
  end if;

  if listing.status not in ('published', 'reserved') then
    raise exception 'el anuncio ya no admite mensajes' using errcode = 'check_violation';
  end if;

  insert into public.conversations (listing_id, buyer_id)
  values (target_listing, auth.uid())
  on conflict (listing_id, buyer_id) do update set listing_id = excluded.listing_id
  returning id into conversation_id;

  return conversation_id;
end;
$$;

create or replace function public.resolve_offer(target_offer uuid, accept boolean)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_listing uuid;
  v_seller uuid;
  v_buyer uuid;
  v_amount integer;
begin
  select l.id, l.seller_id, o.buyer_id, o.amount_cents
  into v_listing, v_seller, v_buyer, v_amount
  from public.offers o
  join public.conversations c on c.id = o.conversation_id
  join public.listings l on l.id = c.listing_id
  where o.id = target_offer and o.status = 'pending';

  if v_listing is null then
    raise exception 'oferta no encontrada o ya resuelta' using errcode = 'no_data_found';
  end if;

  if v_seller <> auth.uid() then
    raise exception 'solo el vendedor resuelve la oferta' using errcode = 'insufficient_privilege';
  end if;

  update public.offers
  set status = (case when accept then 'accepted' else 'rejected' end)::public.offer_status,
      resolved_at = now()
  where id = target_offer;

  if accept then
    update public.offers o
    set status = 'superseded', resolved_at = now()
    from public.conversations c
    where o.conversation_id = c.id
      and c.listing_id = v_listing
      and o.status = 'pending'
      and o.id <> target_offer;

    update public.listings
    set status = 'reserved', buyer_id = v_buyer, sold_price_cents = v_amount
    where id = v_listing;
  end if;
end;
$$;

create or replace function public.release_reservation(target_listing uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (
    select 1 from public.listings
    where id = target_listing and seller_id = auth.uid() and status = 'reserved'
  ) then
    raise exception 'no hay reserva que liberar' using errcode = 'check_violation';
  end if;

  update public.listings
  set status = 'published', sold_price_cents = null
  where id = target_listing;
end;
$$;

create or replace function public.mark_listing_sold(target_listing uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  listing public.listings%rowtype;
begin
  select * into listing from public.listings where id = target_listing;

  if listing.seller_id <> auth.uid() then
    raise exception 'solo el vendedor cierra la venta' using errcode = 'insufficient_privilege';
  end if;

  if listing.status <> 'reserved' then
    raise exception 'primero debes aceptar una oferta' using errcode = 'check_violation';
  end if;

  update public.listings
  set status = 'sold', sold_at = now()
  where id = target_listing;
end;
$$;

create or replace function public.unread_count(target_conversation uuid)
returns integer language sql stable security definer set search_path = public as $$
  select count(*)::integer
  from public.messages m
  join public.conversations c on c.id = m.conversation_id
  join public.listings l on l.id = c.listing_id
  where m.conversation_id = target_conversation
    and m.sender_id <> auth.uid()
    and m.created_at > coalesce(
      case when auth.uid() = c.buyer_id then c.buyer_read_at else c.seller_read_at end,
      'epoch'::timestamptz
    )
$$;
