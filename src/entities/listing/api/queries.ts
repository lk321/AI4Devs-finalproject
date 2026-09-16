import 'server-only'
import { createClient } from '@/shared/api/server'
import { findCity } from '../model/cities'
import { PAGE_SIZE, type ListingSearchParams } from '../model/search-params'
import type { CategoryTree, ListingDetail, ListingSummary } from '../model/types'

export async function searchListings(params: ListingSearchParams) {
  const supabase = await createClient()
  const origin = findCity(params.city)

  const { data, error } = await supabase.rpc('search_listings', {
    search_term: params.q,
    category_slug: params.category,
    min_price: params.min,
    max_price: params.max,
    conditions: params.condition,
    origin_lat: origin?.lat,
    origin_lng: origin?.lng,
    max_distance_km: origin ? params.distance : undefined,
    sort_by: params.sort,
    page_number: params.page,
    page_size: PAGE_SIZE,
  })

  if (error) throw error

  const items = (data ?? []) as ListingSummary[]
  return { items, total: items[0]?.total_count ?? 0, page: params.page, pageSize: PAGE_SIZE }
}

export async function getListingDetail(id: string): Promise<ListingDetail | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select(
      '*, images:listing_images(url, alt, position), category:categories(slug, name), seller:profiles!listings_seller_id_fkey(id, alias, city, rating_average, closed_deals)',
    )
    .eq('id', id)
    .maybeSingle()

  if (!data) return null

  return {
    ...data,
    images: [...data.images].sort((a, b) => a.position - b.position),
  } as ListingDetail
}

export async function getCategoryTree(): Promise<CategoryTree[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('id, slug, name, parent_id, position')
    .order('position')

  const rows = data ?? []
  return rows
    .filter((row) => row.parent_id === null)
    .map((root) => ({
      id: root.id,
      slug: root.slug,
      name: root.name,
      children: rows
        .filter((child) => child.parent_id === root.id)
        .map(({ id, slug, name }) => ({ id, slug, name })),
    }))
}

export async function getSellerListings(sellerId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select(
      'id, title, price_cents, status, published_at, created_at, images:listing_images(url, alt, position)',
    )
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })

  return (data ?? []).map((row) => ({
    ...row,
    cover: [...row.images].sort((a, b) => a.position - b.position)[0] ?? null,
  }))
}
