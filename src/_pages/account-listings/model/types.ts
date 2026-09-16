import type { getSellerListings } from '@/entities/listing/index.server'

export type SellerListing = Awaited<ReturnType<typeof getSellerListings>>[number]
