import { z } from 'zod'
import type { ListingCondition, ListingStatus } from './types'

export const LISTING_CONDITIONS = [
  'nuevo',
  'como_nuevo',
  'bueno',
  'aceptable',
  'para_piezas',
] as const satisfies readonly ListingCondition[]

export const MAX_PRICE_CENTS = 9_999_999
export const MAX_IMAGES = 8

export const listingDraftSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'El título necesita al menos 5 caracteres')
    .max(80, 'El título no puede superar 80 caracteres'),
  description: z
    .string()
    .trim()
    .min(20, 'Describe el artículo con al menos 20 caracteres')
    .max(2000, 'La descripción no puede superar 2000 caracteres'),
  categorySlug: z.string().min(1, 'Elige una categoría'),
  condition: z.enum(LISTING_CONDITIONS, { message: 'Indica el estado del artículo' }),
  priceCents: z
    .number({ message: 'Indica un precio' })
    .int('El precio no admite fracciones de céntimo')
    .positive('El precio debe ser mayor que cero')
    .max(MAX_PRICE_CENTS, 'El precio debe ser menor de 100.000 €'),
  city: z.string().trim().min(2, 'Indica la ciudad').max(80),
  images: z
    .array(z.object({ url: z.url(), alt: z.string().min(1), bytes: z.number().int().positive() }))
    .min(1, 'Sube al menos una imagen')
    .max(MAX_IMAGES, `No puedes subir más de ${MAX_IMAGES} imágenes`),
})

export type ListingDraft = z.infer<typeof listingDraftSchema>

const TRANSITIONS: Record<ListingStatus, ListingStatus[]> = {
  draft: ['published'],
  published: ['reserved', 'archived'],
  reserved: ['sold', 'published'],
  sold: ['archived'],
  archived: [],
}

export function canTransition(from: ListingStatus, to: ListingStatus) {
  return TRANSITIONS[from].includes(to)
}

export function isPubliclyVisible(status: ListingStatus) {
  return status === 'published' || status === 'reserved' || status === 'sold'
}

export function acceptsMessages(status: ListingStatus) {
  return status === 'published' || status === 'reserved'
}
