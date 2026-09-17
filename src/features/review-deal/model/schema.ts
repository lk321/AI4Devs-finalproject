import { z } from 'zod'
import type { ListingStatus } from '@/entities/listing'

export const MAX_REVIEW_COMMENT = 500
export const REVIEW_WINDOW_DAYS = 30

const WINDOW_MS = REVIEW_WINDOW_DAYS * 86_400_000

export const reviewSchema = z.object({
  listingId: z.uuid(),
  subjectId: z.uuid(),
  score: z
    .number({ message: 'Elige una puntuación' })
    .int('La puntuación debe ser un número entero')
    .min(1, 'La puntuación mínima es 1 estrella')
    .max(5, 'La puntuación máxima es 5 estrellas'),
  comment: z
    .string()
    .trim()
    .max(MAX_REVIEW_COMMENT, `El comentario no puede superar ${MAX_REVIEW_COMMENT} caracteres`)
    .optional(),
})

export type ReviewInput = z.infer<typeof reviewSchema>

export type ReviewEligibility = {
  listingStatus: ListingStatus
  soldAt: string | null
  viewerId: string
  sellerId: string
  buyerId: string | null
  reviewedAuthorIds: readonly string[]
  now?: Date
}

export function canReview(input: ReviewEligibility): { allowed: boolean; reason?: string } {
  if (input.listingStatus !== 'sold' || !input.soldAt) {
    return { allowed: false, reason: 'La operación aún no está cerrada' }
  }

  if (input.viewerId !== input.sellerId && input.viewerId !== input.buyerId) {
    return { allowed: false, reason: 'Solo valoran quienes participaron en la operación' }
  }

  if (input.reviewedAuthorIds.includes(input.viewerId)) {
    return { allowed: false, reason: 'Ya has valorado esta operación' }
  }

  const now = input.now ?? new Date()
  if (now.getTime() - new Date(input.soldAt).getTime() > WINDOW_MS) {
    return { allowed: false, reason: `El plazo de ${REVIEW_WINDOW_DAYS} días ya ha vencido` }
  }

  return { allowed: true }
}

export function reviewSubjectId(input: {
  viewerId: string
  sellerId: string
  buyerId: string | null
}) {
  return input.viewerId === input.sellerId ? input.buyerId : input.sellerId
}

export function reviewErrorMessage(error: { code?: string; message: string }) {
  if (error.code === '23505') return 'Ya has valorado esta operación'
  if (error.code === '42501') {
    return `No puedes valorar: la operación debe estar cerrada, debes haber participado y no pueden haber pasado más de ${REVIEW_WINDOW_DAYS} días`
  }
  if (error.code === '23514') return 'La puntuación o el comentario están fuera de rango'
  return error.message
}
