import { z } from 'zod'
import type { OfferStatus } from '@/entities/listing'

export function buildOfferSchema(listingPriceCents: number) {
  return z.object({
    amountCents: z
      .number({ message: 'Indica un importe' })
      .int('El importe no admite fracciones de céntimo')
      .positive('El importe debe ser mayor que cero')
      .max(listingPriceCents, 'La oferta no puede superar el precio publicado'),
  })
}

export const offerActionSchema = z.object({
  conversationId: z.uuid(),
  amountCents: z.number().int(),
})

export function euroToCents(amount: number) {
  return Math.round(amount * 100)
}

export function centsToEuro(cents: number) {
  return cents / 100
}

export function latestPendingOffer<T extends { status: OfferStatus; created_at: string }>(
  offers: readonly T[],
) {
  const pending = offers.filter((offer) => offer.status === 'pending')
  if (pending.length === 0) return null
  return [...pending].sort((a, b) => b.created_at.localeCompare(a.created_at))[0]
}

export type OfferInput = z.infer<typeof offerActionSchema>
