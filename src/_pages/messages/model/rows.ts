import type { ListingStatus, OfferStatus } from '@/entities/listing'

export type ImageRow = { url: string; alt: string; position: number }

export type ParticipantRow = { id: string; alias: string; rating_average: number | null }

export type MessageRow = { id: string; body: string; created_at: string; sender_id: string }

export type OfferRow = {
  id: string
  amount_cents: number
  status: OfferStatus
  created_at: string
  resolved_at: string | null
  buyer_id: string
}

export type InboxRow = {
  id: string
  listing_id: string
  buyer_id: string
  created_at: string
  listing: {
    id: string
    title: string
    price_cents: number
    status: ListingStatus
    seller_id: string
    images: ImageRow[]
    seller: ParticipantRow
  }
  buyer: ParticipantRow
  messages: MessageRow[]
}

export type ThreadRow = {
  id: string
  listing_id: string
  buyer_id: string
  listing: {
    id: string
    title: string
    price_cents: number
    status: ListingStatus
    seller_id: string
    buyer_id: string | null
    sold_at: string | null
    sold_price_cents: number | null
    images: ImageRow[]
    seller: ParticipantRow
  }
  buyer: ParticipantRow
  messages: MessageRow[]
  offers: OfferRow[]
}
