import { isPubliclyVisible, type ListingStatus } from '@/entities/listing'

export function canViewListing(
  status: ListingStatus,
  sellerId: string,
  viewerId: string | null | undefined,
) {
  return isPubliclyVisible(status) || sellerId === viewerId
}
