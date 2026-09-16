import { describe, expect, it } from 'vitest'
import { canTransition, listingDraftSchema } from './schema'

const validDraft = {
  title: 'Bicicleta de montaña',
  description: 'Bicicleta revisada en taller con ruedas nuevas y frenos de disco.',
  categorySlug: 'bicicletas',
  condition: 'bueno' as const,
  priceCents: 18000,
  city: 'Madrid',
  images: [{ url: 'https://cdn.test/1.webp', alt: 'Bicicleta', bytes: 400000 }],
}

describe('listingDraftSchema', () => {
  it('acepta un borrador completo', () => {
    expect(listingDraftSchema.safeParse(validDraft).success).toBe(true)
  })

  it('rechaza titulo corto', () => {
    const result = listingDraftSchema.safeParse({ ...validDraft, title: 'Bici' })
    expect(result.success).toBe(false)
  })

  it('rechaza precio negativo', () => {
    expect(listingDraftSchema.safeParse({ ...validDraft, priceCents: -1 }).success).toBe(false)
  })

  it('rechaza precio de 100.000 euros o mas', () => {
    expect(listingDraftSchema.safeParse({ ...validDraft, priceCents: 10_000_000 }).success).toBe(
      false,
    )
  })

  it('rechaza mas de 8 imagenes', () => {
    const images = Array.from({ length: 9 }, (_, index) => ({
      url: `https://cdn.test/${index}.webp`,
      alt: 'foto',
      bytes: 1000,
    }))
    expect(listingDraftSchema.safeParse({ ...validDraft, images }).success).toBe(false)
  })

  it('rechaza un borrador sin imagenes', () => {
    expect(listingDraftSchema.safeParse({ ...validDraft, images: [] }).success).toBe(false)
  })
})

describe('canTransition', () => {
  it('permite publicar un borrador', () => {
    expect(canTransition('draft', 'published')).toBe(true)
  })

  it('rechaza pasar de borrador a vendido', () => {
    expect(canTransition('draft', 'sold')).toBe(false)
  })

  it('permite liberar una reserva', () => {
    expect(canTransition('reserved', 'published')).toBe(true)
  })

  it('no permite salir de archivado', () => {
    expect(canTransition('archived', 'published')).toBe(false)
  })
})
