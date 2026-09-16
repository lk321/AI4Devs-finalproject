import type { ListingSummary } from '@/entities/listing'

export type SellerListingRow = {
  id: string
  title: string
  price_cents: number
  condition: ListingSummary['condition']
  status: ListingSummary['status']
  city: string
  published_at: string | null
  created_at: string
  cover: { url: string; alt: string | null } | null
}

export function toListingSummary(row: SellerListingRow): ListingSummary {
  return {
    id: row.id,
    title: row.title,
    price_cents: row.price_cents,
    condition: row.condition,
    status: row.status,
    city: row.city,
    published_at: row.published_at ?? row.created_at,
    cover_url: row.cover?.url ?? '',
    cover_alt: row.cover?.alt ?? row.title,
    distance_km: null as unknown as number,
    total_count: 0,
  }
}
