import type { Database } from '@/shared/api/database.types'

export type ListingCondition = Database['public']['Enums']['listing_condition']
export type ListingStatus = Database['public']['Enums']['listing_status']
export type OfferStatus = Database['public']['Enums']['offer_status']

export type ListingRow = Database['public']['Tables']['listings']['Row']
export type ListingImageRow = Database['public']['Tables']['listing_images']['Row']
export type CategoryRow = Database['public']['Tables']['categories']['Row']

export type ListingSummary = Database['public']['Functions']['search_listings']['Returns'][number]

export type ListingDetail = ListingRow & {
  images: Pick<ListingImageRow, 'url' | 'alt' | 'position'>[]
  category: Pick<CategoryRow, 'slug' | 'name'>
  seller: {
    id: string
    alias: string
    city: string
    rating_average: number | null
    closed_deals: number
  }
}

export type CategoryTree = Pick<CategoryRow, 'id' | 'slug' | 'name'> & {
  children: Pick<CategoryRow, 'id' | 'slug' | 'name'>[]
}
