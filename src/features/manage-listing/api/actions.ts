'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, getSessionUser } from '@/shared/api/server'
import { MAX_PRICE_CENTS, type ListingStatus } from '@/entities/listing'
import {
  AUTHOR_ONLY,
  GENERIC_FAILURE,
  LISTING_GONE,
  NOT_SIGNED_IN,
  toUserMessage,
} from '../lib/errors'

export type ManageListingResult = { ok: true } | { error: string }

async function requireOwnership(id: string) {
  const user = await getSessionUser()
  if (!user) return { ok: false as const, error: NOT_SIGNED_IN }

  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select('id, seller_id, status')
    .eq('id', id)
    .maybeSingle()

  if (!data) return { ok: false as const, error: LISTING_GONE }
  if (data.seller_id !== user.id) return { ok: false as const, error: AUTHOR_ONLY }

  return { ok: true as const, supabase }
}

function refresh(id: string) {
  revalidatePath('/account/listings')
  revalidatePath('/search')
  revalidatePath(`/listings/${id}`)
}

async function changeStatus(id: string, status: ListingStatus): Promise<ManageListingResult> {
  const owned = await requireOwnership(id)
  if (!owned.ok) return { error: owned.error }

  const { error } = await owned.supabase.from('listings').update({ status }).eq('id', id)
  if (error) return { error: toUserMessage(error) ?? GENERIC_FAILURE }

  refresh(id)
  return { ok: true }
}

async function callRpc(
  id: string,
  name: 'release_reservation' | 'mark_listing_sold',
): Promise<ManageListingResult> {
  const owned = await requireOwnership(id)
  if (!owned.ok) return { error: owned.error }

  const { error } = await owned.supabase.rpc(name, { target_listing: id })
  if (error) return { error: toUserMessage(error) ?? GENERIC_FAILURE }

  refresh(id)
  return { ok: true }
}

export async function publishListing(id: string): Promise<ManageListingResult | void> {
  const result = await changeStatus(id, 'published')
  if ('error' in result) return result
  redirect(`/listings/${id}`)
}

export async function archiveListing(id: string) {
  return changeStatus(id, 'archived')
}

export async function releaseListingReservation(id: string) {
  return callRpc(id, 'release_reservation')
}

export async function markListingSold(id: string) {
  return callRpc(id, 'mark_listing_sold')
}

export async function updateListingPrice(
  id: string,
  priceCents: number,
): Promise<ManageListingResult> {
  if (!Number.isInteger(priceCents) || priceCents <= 0 || priceCents > MAX_PRICE_CENTS) {
    return { error: 'El precio debe ser mayor que cero y menor de 100.000 €' }
  }

  const owned = await requireOwnership(id)
  if (!owned.ok) return { error: owned.error }

  const { error } = await owned.supabase
    .from('listings')
    .update({ price_cents: priceCents })
    .eq('id', id)

  if (error) return { error: toUserMessage(error) ?? GENERIC_FAILURE }

  refresh(id)
  return { ok: true }
}
