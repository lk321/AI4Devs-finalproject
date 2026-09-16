create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

create trigger listings_touch before update on public.listings
  for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, alias, city)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'alias', 'user_' || left(new.id::text, 8)),
    coalesce(new.raw_user_meta_data ->> 'city', 'Madrid')
  );
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.enforce_listing_transition()
returns trigger language plpgsql as $$
declare
  allowed boolean;
begin
  if new.status = old.status then
    if old.status = 'reserved' and new.price_cents <> old.price_cents then
      raise exception 'no se puede cambiar el precio de un anuncio reservado'
        using errcode = 'check_violation';
    end if;
    return new;
  end if;

  allowed := (old.status, new.status) in (
    ('draft', 'published'),
    ('published', 'reserved'),
    ('published', 'archived'),
    ('reserved', 'sold'),
    ('reserved', 'published'),
    ('sold', 'archived')
  );

  if not allowed then
    raise exception 'transicion no permitida: % -> %', old.status, new.status
      using errcode = 'check_violation';
  end if;

  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;

  if new.status = 'published' then
    new.buyer_id := null;
  end if;

  return new;
end;
$$;

create trigger listings_transition before update on public.listings
  for each row execute function public.enforce_listing_transition();

create or replace function public.require_listing_images()
returns trigger language plpgsql as $$
begin
  if new.status = 'published' and old.status = 'draft'
     and not exists (select 1 from public.listing_images where listing_id = new.id) then
    raise exception 'un anuncio publicado necesita al menos una imagen'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger listings_require_images before update on public.listings
  for each row execute function public.require_listing_images();

create or replace function public.enforce_offer_rules()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  listing public.listings%rowtype;
begin
  select l.* into listing
  from public.conversations c
  join public.listings l on l.id = c.listing_id
  where c.id = new.conversation_id;

  if listing.status not in ('published', 'reserved') then
    raise exception 'el anuncio no admite ofertas' using errcode = 'check_violation';
  end if;

  if new.amount_cents > listing.price_cents then
    raise exception 'la oferta no puede superar el precio publicado'
      using errcode = 'check_violation';
  end if;

  update public.offers
  set status = 'superseded', resolved_at = now()
  where conversation_id = new.conversation_id and status = 'pending';

  return new;
end;
$$;

create trigger offers_rules before insert on public.offers
  for each row execute function public.enforce_offer_rules();

create or replace function public.recalculate_rating()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.profiles p
  set rating_average = (
    select round(avg(r.score)::numeric, 2) from public.reviews r where r.subject_id = new.subject_id
  )
  where p.id = new.subject_id;
  return new;
end;
$$;

create trigger reviews_recalculate after insert on public.reviews
  for each row execute function public.recalculate_rating();

create or replace function public.count_closed_deals()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'sold' and old.status <> 'sold' then
    update public.profiles set closed_deals = closed_deals + 1
    where id in (new.seller_id, new.buyer_id);
  end if;
  return new;
end;
$$;

create trigger listings_count_deals after update on public.listings
  for each row execute function public.count_closed_deals();
