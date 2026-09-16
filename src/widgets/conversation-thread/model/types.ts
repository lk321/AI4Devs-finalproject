import type { ListingStatus, OfferStatus } from '@/entities/listing'

export type ThreadParticipant = {
  id: string
  alias: string
  rating_average: number | null
}

export type ThreadMessage = {
  id: string
  body: string
  created_at: string
  sender_id: string
}

export type ThreadOffer = {
  id: string
  amount_cents: number
  status: OfferStatus
  created_at: string
  resolved_at: string | null
  buyer_id: string
}

export type ThreadListing = {
  id: string
  title: string
  price_cents: number
  status: ListingStatus
  seller_id: string
  buyer_id: string | null
  sold_at: string | null
  sold_price_cents: number | null
  cover: { url: string; alt: string } | null
  seller: ThreadParticipant
}

export type ConversationThreadData = {
  id: string
  listing: ThreadListing
  buyer: ThreadParticipant
  messages: ThreadMessage[]
  offers: ThreadOffer[]
  reviewedAuthorIds: string[]
}

export type TimelineEntry =
  | { kind: 'message'; at: string; message: ThreadMessage }
  | { kind: 'offer'; at: string; offer: ThreadOffer }
