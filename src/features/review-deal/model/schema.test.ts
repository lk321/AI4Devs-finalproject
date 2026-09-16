import { describe, expect, it } from 'vitest'
import { MAX_REVIEW_COMMENT, canReview, reviewErrorMessage, reviewSchema } from './schema'

const listingId = '0f1e2d3c-4b5a-4c6d-8e9f-0a1b2c3d4e5f'
const subjectId = '11112222-3333-4444-8555-666677778888'
const seller = 'aaaa1111-2222-4333-8444-555566667777'
const buyer = '11112222-3333-4444-8555-666677778888'

const valid = { listingId, subjectId, score: 5, comment: 'Todo perfecto' }

describe('Valoración mutua', () => {
  it('Valoración dentro de plazo: acepta 5 estrellas con comentario', () => {
    expect(reviewSchema.safeParse(valid).success).toBe(true)
  })

  it('Valoración dentro de plazo: acepta sin comentario', () => {
    const result = reviewSchema.safeParse({ listingId, subjectId, score: 4 })
    expect(result.success).toBe(true)
  })

  it('rechaza un comentario de más de 500 caracteres', () => {
    const result = reviewSchema.safeParse({ ...valid, comment: 'a'.repeat(MAX_REVIEW_COMMENT + 1) })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toContain('500')
  })

  it('acepta un comentario de exactamente 500 caracteres', () => {
    const result = reviewSchema.safeParse({ ...valid, comment: 'a'.repeat(MAX_REVIEW_COMMENT) })
    expect(result.success).toBe(true)
  })

  it('rechaza una puntuación por encima de 5', () => {
    const result = reviewSchema.safeParse({ ...valid, score: 6 })
    expect(result.success).toBe(false)
  })

  it('rechaza una puntuación por debajo de 1', () => {
    const result = reviewSchema.safeParse({ ...valid, score: 0 })
    expect(result.success).toBe(false)
  })

  it('rechaza una puntuación con decimales', () => {
    const result = reviewSchema.safeParse({ ...valid, score: 4.5 })
    expect(result.success).toBe(false)
  })
})

describe('Ventana de valoración', () => {
  const soldAt = '2026-09-10T10:00:00Z'
  const base = {
    listingStatus: 'sold' as const,
    soldAt,
    viewerId: buyer,
    sellerId: seller,
    buyerId: buyer,
    reviewedAuthorIds: [] as string[],
  }

  it('Valoración dentro de plazo: permite valorar al día siguiente del cierre', () => {
    expect(canReview({ ...base, now: new Date('2026-09-11T10:00:00Z') }).allowed).toBe(true)
  })

  it('Valoración duplicada: rechaza al autor que ya valoró', () => {
    const result = canReview({
      ...base,
      reviewedAuthorIds: [buyer],
      now: new Date('2026-09-11T10:00:00Z'),
    })
    expect(result.allowed).toBe(false)
    expect(result.reason).toContain('Ya has valorado')
  })

  it('Plazo vencido: rechaza pasados más de 30 días', () => {
    const result = canReview({ ...base, now: new Date('2026-10-12T10:00:00Z') })
    expect(result.allowed).toBe(false)
    expect(result.reason).toContain('30 días')
  })

  it('Operación no cerrada: rechaza un anuncio que no está vendido', () => {
    const result = canReview({
      ...base,
      listingStatus: 'reserved',
      soldAt: null,
      now: new Date('2026-09-11T10:00:00Z'),
    })
    expect(result.allowed).toBe(false)
    expect(result.reason).toContain('cerrada')
  })

  it('rechaza a quien no participó en la operación', () => {
    const result = canReview({
      ...base,
      viewerId: '99998888-7777-4666-8555-444433332222',
      now: new Date('2026-09-11T10:00:00Z'),
    })
    expect(result.allowed).toBe(false)
  })
})

describe('Errores de la base de datos', () => {
  it('Valoración duplicada: traduce la violación de unicidad', () => {
    expect(reviewErrorMessage({ code: '23505', message: 'duplicate key' })).toContain(
      'Ya has valorado',
    )
  })

  it('Plazo vencido: traduce la violación de la política de acceso', () => {
    expect(reviewErrorMessage({ code: '42501', message: 'row-level security' })).toContain(
      '30 días',
    )
  })

  it('traduce una violación de restricción de rango', () => {
    expect(reviewErrorMessage({ code: '23514', message: 'check constraint' })).toContain(
      'puntuación',
    )
  })
})
