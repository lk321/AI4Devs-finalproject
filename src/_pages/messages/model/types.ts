import type { ListingStatus } from '@/entities/listing'

export type InboxItem = {
  id: string
  listingId: string
  title: string
  cover: { url: string; alt: string } | null
  priceCents: number
  status: ListingStatus
  counterpartAlias: string
  role: 'buyer' | 'seller'
  lastMessage: { body: string; createdAt: string; senderId: string } | null
  unreadCount: number
  sortedAt: string
}
