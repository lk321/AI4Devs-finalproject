import { describe, expect, it } from 'vitest'
import { toListingSummary, type SellerListingRow } from './to-listing-summary'

const row: SellerListingRow = {
  id: 'listing-1',
  title: 'Bicicleta de montaña',
  price_cents: 18000,
  condition: 'bueno',
  status: 'published',
  city: 'Getafe',
  published_at: '2026-09-01T10:00:00.000Z',
  created_at: '2026-08-30T10:00:00.000Z',
  cover: { url: 'https://cdn.test/1.webp', alt: 'Bicicleta' },
}

describe('toListingSummary', () => {
  it('usa la ciudad y el estado del anuncio, no los del perfil', () => {
    const summary = toListingSummary(row)
    expect(summary.city).toBe('Getafe')
    expect(summary.condition).toBe('bueno')
    expect(summary.cover_url).toBe('https://cdn.test/1.webp')
    expect(summary.cover_alt).toBe('Bicicleta')
  })

  it('recurre a la fecha de creacion cuando no hay publicacion', () => {
    expect(toListingSummary({ ...row, published_at: null }).published_at).toBe(row.created_at)
  })

  it('tolera un anuncio sin imagenes', () => {
    const summary = toListingSummary({ ...row, cover: null })
    expect(summary.cover_url).toBe('')
    expect(summary.cover_alt).toBe(row.title)
  })
})
