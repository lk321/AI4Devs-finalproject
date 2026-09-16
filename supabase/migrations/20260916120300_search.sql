create or replace function public.distance_km(
  lat_a numeric, lng_a numeric, lat_b numeric, lng_b numeric
) returns numeric language sql immutable parallel safe as $$
  select round((6371 * acos(least(1, greatest(-1,
    cos(radians(lat_a)) * cos(radians(lat_b)) * cos(radians(lng_b) - radians(lng_a))
    + sin(radians(lat_a)) * sin(radians(lat_b))
  ))))::numeric, 1)
$$;

create or replace function public.search_listings(
  search_term text default null,
  category_slug text default null,
  min_price integer default null,
  max_price integer default null,
  conditions public.listing_condition[] default null,
  origin_lat numeric default null,
  origin_lng numeric default null,
  max_distance_km integer default null,
  sort_by text default 'relevance',
  page_number integer default 1,
  page_size integer default 24
)
returns table (
  id uuid,
  title text,
  price_cents integer,
  condition public.listing_condition,
  status public.listing_status,
  city text,
  distance_km numeric,
  cover_url text,
  cover_alt text,
  published_at timestamptz,
  total_count bigint
)
language sql stable set search_path = public as $$
  with query as (
    select case
      when search_term is null or btrim(search_term) = '' then null
      else websearch_to_tsquery('spanish', public.immutable_unaccent(search_term))
    end as ts
  ),
  filtered as (
    select
      l.*,
      case
        when origin_lat is null or origin_lng is null then null
        else public.distance_km(origin_lat, origin_lng, l.latitude, l.longitude)
      end as distance,
      case when (select ts from query) is null then 0
           else ts_rank(l.search_vector, (select ts from query)) end as rank
    from public.listings l
    join public.categories c on c.id = l.category_id
    where l.status in ('published', 'reserved')
      and ((select ts from query) is null or l.search_vector @@ (select ts from query))
      and (category_slug is null or c.slug = category_slug or c.parent_id = (
        select id from public.categories where slug = category_slug
      ))
      and (min_price is null or l.price_cents >= min_price)
      and (max_price is null or l.price_cents <= max_price)
      and (conditions is null or l.condition = any (conditions))
  ),
  scoped as (
    select * from filtered
    where max_distance_km is null or distance is null or distance <= max_distance_km
  )
  select
    s.id,
    s.title,
    s.price_cents,
    s.condition,
    s.status,
    s.city,
    s.distance,
    img.url,
    img.alt,
    s.published_at,
    count(*) over () as total_count
  from scoped s
  left join lateral (
    select url, alt from public.listing_images
    where listing_id = s.id order by position limit 1
  ) img on true
  order by
    case when sort_by = 'price_asc' then s.price_cents end asc,
    case when sort_by = 'price_desc' then s.price_cents end desc,
    case when sort_by = 'newest' then s.published_at end desc,
    case when sort_by = 'relevance' then s.rank end desc,
    s.published_at desc
  limit greatest(page_size, 1)
  offset greatest(page_number - 1, 0) * greatest(page_size, 1)
$$;
