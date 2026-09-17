create extension if not exists citext with schema extensions;
create extension if not exists unaccent with schema extensions;

create type public.listing_condition as enum ('nuevo', 'como_nuevo', 'bueno', 'aceptable', 'para_piezas');
create type public.listing_status as enum ('draft', 'published', 'reserved', 'sold', 'archived');
create type public.offer_status as enum ('pending', 'accepted', 'rejected', 'superseded');

create or replace function public.immutable_unaccent(value text)
returns text language sql immutable parallel safe strict as $$
  select extensions.unaccent('extensions.unaccent'::regdictionary, value)
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  alias extensions.citext not null unique,
  city text not null,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  rating_average numeric(3, 2),
  closed_deals integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_alias_format check (alias ~ '^[a-zA-Z0-9_]{3,24}$'),
  constraint profiles_rating_range check (rating_average is null or rating_average between 1 and 5)
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  parent_id uuid references public.categories (id) on delete cascade,
  position integer not null default 0
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles (id) on delete cascade,
  category_id uuid not null references public.categories (id),
  title text not null,
  description text not null,
  price_cents integer not null,
  condition public.listing_condition not null,
  status public.listing_status not null default 'draft',
  city text not null,
  latitude numeric(9, 6) not null,
  longitude numeric(9, 6) not null,
  published_at timestamptz,
  sold_at timestamptz,
  buyer_id uuid references public.profiles (id) on delete set null,
  sold_price_cents integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (
    to_tsvector('spanish', public.immutable_unaccent(title || ' ' || description))
  ) stored,
  constraint listings_title_length check (char_length(title) between 5 and 80),
  constraint listings_description_length check (char_length(description) between 20 and 2000),
  constraint listings_price_range check (price_cents > 0 and price_cents < 10000000),
  constraint listings_buyer_not_seller check (buyer_id is null or buyer_id <> seller_id),
  constraint listings_sold_coherence check (
    status <> 'sold'
    or (buyer_id is not null and sold_at is not null and sold_price_cents is not null)
  )
);

create index listings_catalog_idx on public.listings (status, published_at desc);
create index listings_category_price_idx on public.listings (category_id, price_cents);
create index listings_seller_idx on public.listings (seller_id, status);
create index listings_search_idx on public.listings using gin (search_vector);

create table public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  url text not null,
  alt text not null,
  position integer not null,
  bytes integer not null,
  constraint listing_images_position_range check (position between 0 and 7),
  constraint listing_images_size_limit check (bytes > 0 and bytes <= 5242880),
  unique (listing_id, position)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  buyer_read_at timestamptz,
  seller_read_at timestamptz,
  created_at timestamptz not null default now(),
  unique (listing_id, buyer_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  constraint messages_body_length check (char_length(body) between 1 and 1000)
);

create index messages_thread_idx on public.messages (conversation_id, created_at);

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  amount_cents integer not null,
  status public.offer_status not null default 'pending',
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  constraint offers_amount_positive check (amount_cents > 0)
);

create unique index offers_single_pending_idx
  on public.offers (conversation_id)
  where status = 'pending';

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  subject_id uuid not null references public.profiles (id) on delete cascade,
  score smallint not null,
  comment text,
  created_at timestamptz not null default now(),
  constraint reviews_score_range check (score between 1 and 5),
  constraint reviews_comment_length check (comment is null or char_length(comment) <= 500),
  constraint reviews_author_not_subject check (author_id <> subject_id),
  unique (listing_id, author_id)
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-images',
  'listing-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
);
