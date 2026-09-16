import 'server-only'
import { createClient } from '@/shared/api/server'
import type { ConversationThreadData } from '@/widgets/conversation-thread'
import type { ImageRow, InboxRow, ThreadRow } from '../model/rows'
import type { InboxItem } from '../model/types'

const INBOX_SELECT = `
  id, listing_id, buyer_id, created_at,
  listing:listings(
    id, title, price_cents, status, seller_id,
    images:listing_images(url, alt, position),
    seller:profiles!listings_seller_id_fkey(id, alias, rating_average)
  ),
  buyer:profiles(id, alias, rating_average),
  messages(id, body, created_at, sender_id)
`

const THREAD_SELECT = `
  id, listing_id, buyer_id,
  listing:listings(
    id, title, price_cents, status, seller_id, buyer_id, sold_at, sold_price_cents,
    images:listing_images(url, alt, position),
    seller:profiles!listings_seller_id_fkey(id, alias, rating_average)
  ),
  buyer:profiles(id, alias, rating_average),
  messages(id, body, created_at, sender_id),
  offers(id, amount_cents, status, created_at, resolved_at, buyer_id)
`

function one<T>(value: T | T[]): T {
  return Array.isArray(value) ? value[0] : value
}

function coverOf(images: ImageRow[] | null) {
  const sorted = [...(images ?? [])].sort((a, b) => a.position - b.position)
  return sorted[0] ? { url: sorted[0].url, alt: sorted[0].alt } : null
}

export async function startConversation(listingId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('start_conversation', { target_listing: listingId })

  if (error) return { error: error.message }
  return { conversationId: data }
}

export async function markConversationRead(conversationId: string, isBuyer: boolean) {
  const supabase = await createClient()
  const readAt = new Date().toISOString()

  await supabase
    .from('conversations')
    .update(isBuyer ? { buyer_read_at: readAt } : { seller_read_at: readAt })
    .eq('id', conversationId)
}

export async function getInbox(viewerId: string): Promise<InboxItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('conversations')
    .select(INBOX_SELECT)
    .order('created_at', { referencedTable: 'messages', ascending: false })
    .limit(1, { referencedTable: 'messages' })

  const rows = (data ?? []) as unknown as InboxRow[]

  const counts = await Promise.all(
    rows.map(async (row) => {
      const { data: count } = await supabase.rpc('unread_count', { target_conversation: row.id })
      return count ?? 0
    }),
  )

  return rows
    .map((row, index) => {
      const last = row.messages?.[0] ?? null
      const isBuyer = row.buyer_id === viewerId
      const listing = one(row.listing)
      const seller = one(listing.seller)
      const buyer = one(row.buyer)

      return {
        id: row.id,
        listingId: listing.id,
        title: listing.title,
        cover: coverOf(listing.images),
        priceCents: listing.price_cents,
        status: listing.status,
        counterpartAlias: isBuyer ? seller.alias : buyer.alias,
        role: isBuyer ? ('buyer' as const) : ('seller' as const),
        lastMessage: last
          ? { body: last.body, createdAt: last.created_at, senderId: last.sender_id }
          : null,
        unreadCount: counts[index],
        sortedAt: last?.created_at ?? row.created_at,
      }
    })
    .sort((a, b) => b.sortedAt.localeCompare(a.sortedAt))
}

export async function getConversationThread(
  conversationId: string,
): Promise<ConversationThreadData | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('conversations')
    .select(THREAD_SELECT)
    .eq('id', conversationId)
    .order('created_at', { referencedTable: 'messages', ascending: true })
    .order('created_at', { referencedTable: 'offers', ascending: true })
    .maybeSingle()

  if (!data) return null

  const row = data as unknown as ThreadRow
  const listing = one(row.listing)
  const seller = one(listing.seller)

  const { data: reviews } = await supabase
    .from('reviews')
    .select('author_id')
    .eq('listing_id', row.listing_id)

  return {
    id: row.id,
    listing: {
      id: listing.id,
      title: listing.title,
      price_cents: listing.price_cents,
      status: listing.status,
      seller_id: listing.seller_id,
      buyer_id: listing.buyer_id,
      sold_at: listing.sold_at,
      sold_price_cents: listing.sold_price_cents,
      cover: coverOf(listing.images),
      seller,
    },
    buyer: one(row.buyer),
    messages: row.messages ?? [],
    offers: row.offers ?? [],
    reviewedAuthorIds: (reviews ?? []).map((review) => review.author_id),
  }
}
