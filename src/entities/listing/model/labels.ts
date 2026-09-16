import type { ListingCondition, ListingStatus, OfferStatus } from './types'

export const CONDITION_LABELS: Record<ListingCondition, string> = {
  nuevo: 'Nuevo',
  como_nuevo: 'Como nuevo',
  bueno: 'Buen estado',
  aceptable: 'Aceptable',
  para_piezas: 'Para piezas',
}

export const STATUS_LABELS: Record<ListingStatus, string> = {
  draft: 'Borrador',
  published: 'Publicado',
  reserved: 'Reservado',
  sold: 'Vendido',
  archived: 'Archivado',
}

export const OFFER_STATUS_LABELS: Record<OfferStatus, string> = {
  pending: 'Pendiente',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
  superseded: 'Superada',
}

export const SORT_LABELS: Record<string, string> = {
  relevance: 'Relevancia',
  price_asc: 'Precio: de menor a mayor',
  price_desc: 'Precio: de mayor a menor',
  newest: 'Más recientes',
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100)
}

export function formatSince(iso: string | null) {
  if (!iso) return 'Sin publicar'
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (days < 1) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 30) return `Hace ${days} días`
  const months = Math.floor(days / 30)
  return months < 12 ? `Hace ${months} meses` : `Hace ${Math.floor(months / 12)} años`
}
