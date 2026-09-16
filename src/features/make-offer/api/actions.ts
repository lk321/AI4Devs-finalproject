'use server'

import { revalidatePath } from 'next/cache'
import { createClient, getSessionUser } from '@/shared/api/server'
import { buildOfferSchema, offerActionSchema } from '../model/schema'

async function refresh(conversationId: string, listingId?: string) {
  revalidatePath('/messages')
  revalidatePath(`/messages/${conversationId}`)
  if (listingId) revalidatePath(`/listings/${listingId}`)
  revalidatePath('/account/listings')
}

export async function createOffer(input: unknown) {
  const parsed = offerActionSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const user = await getSessionUser()
  if (!user) return { error: 'Inicia sesión para ofertar' }

  const supabase = await createClient()
  const { data: conversation } = await supabase
    .from('conversations')
    .select('id, buyer_id, listing:listings(id, price_cents, status)')
    .eq('id', parsed.data.conversationId)
    .maybeSingle()

  if (!conversation?.listing) return { error: 'La conversación no está disponible' }
  if (conversation.buyer_id !== user.id) return { error: 'Solo el comprador puede ofertar' }

  const amount = buildOfferSchema(conversation.listing.price_cents).safeParse({
    amountCents: parsed.data.amountCents,
  })
  if (!amount.success) return { error: amount.error.issues[0].message }

  const { error } = await supabase.from('offers').insert({
    conversation_id: conversation.id,
    buyer_id: user.id,
    amount_cents: amount.data.amountCents,
  })

  if (error) return { error: error.message }

  await refresh(conversation.id, conversation.listing.id)
  return {}
}

export async function resolveOffer(offerId: string, accept: boolean, conversationId: string) {
  const supabase = await createClient()
  const { error } = await supabase.rpc('resolve_offer', {
    target_offer: offerId,
    accept,
  })

  if (error) return { error: error.message }

  await refresh(conversationId)
  return {}
}

export async function releaseReservation(listingId: string, conversationId: string) {
  const supabase = await createClient()
  const { error } = await supabase.rpc('release_reservation', { target_listing: listingId })

  if (error) return { error: error.message }

  await refresh(conversationId, listingId)
  return {}
}

export async function markListingSold(listingId: string, conversationId: string) {
  const supabase = await createClient()
  const { error } = await supabase.rpc('mark_listing_sold', { target_listing: listingId })

  if (error) return { error: error.message }

  await refresh(conversationId, listingId)
  return {}
}
