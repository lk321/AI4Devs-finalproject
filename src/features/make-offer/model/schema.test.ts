import { describe, expect, it } from 'vitest'
import { buildOfferSchema, euroToCents, latestPendingOffer } from './schema'

const listingPriceCents = 10000

describe('Oferta de precio', () => {
  it('Oferta válida: acepta 80 € por un anuncio de 100 €', () => {
    const result = buildOfferSchema(listingPriceCents).safeParse({ amountCents: 8000 })
    expect(result.success).toBe(true)
  })

  it('Oferta válida: acepta una oferta igual al precio publicado', () => {
    const result = buildOfferSchema(listingPriceCents).safeParse({ amountCents: 10000 })
    expect(result.success).toBe(true)
  })

  it('Oferta superior al precio: rechaza un importe mayor que el publicado', () => {
    const result = buildOfferSchema(listingPriceCents).safeParse({ amountCents: 10001 })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toContain('no puede superar el precio')
  })

  it('Oferta superior al precio: rechaza un importe de cero', () => {
    const result = buildOfferSchema(listingPriceCents).safeParse({ amountCents: 0 })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toContain('mayor que cero')
  })

  it('Oferta superior al precio: rechaza un importe negativo', () => {
    const result = buildOfferSchema(listingPriceCents).safeParse({ amountCents: -100 })
    expect(result.success).toBe(false)
  })

  it('convierte euros a céntimos sin perder precisión', () => {
    expect(euroToCents(80)).toBe(8000)
    expect(euroToCents(80.55)).toBe(8055)
    expect(euroToCents(0.1)).toBe(10)
  })
})

describe('Nueva oferta sobre otra pendiente', () => {
  const offers = [
    { id: 'a', status: 'superseded' as const, created_at: '2026-09-01T10:00:00Z' },
    { id: 'b', status: 'pending' as const, created_at: '2026-09-02T10:00:00Z' },
    { id: 'c', status: 'rejected' as const, created_at: '2026-09-03T10:00:00Z' },
  ]

  it('Nueva oferta sobre otra pendiente: localiza la única oferta pendiente', () => {
    expect(latestPendingOffer(offers)?.id).toBe('b')
  })

  it('Nueva oferta sobre otra pendiente: no devuelve nada si ninguna está pendiente', () => {
    const resolved = offers.filter((offer) => offer.status !== 'pending')
    expect(latestPendingOffer(resolved)).toBeNull()
  })
})
