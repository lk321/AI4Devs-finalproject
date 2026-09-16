import { describe, expect, it } from 'vitest'
import { buildTimeline } from './timeline'
import type { ThreadMessage, ThreadOffer } from './types'

const messages: ThreadMessage[] = [
  { id: 'm1', body: 'Hola', created_at: '2026-09-01T10:00:00Z', sender_id: 'buyer' },
  { id: 'm2', body: 'Te lo dejo', created_at: '2026-09-01T12:00:00Z', sender_id: 'seller' },
]

const offers: ThreadOffer[] = [
  {
    id: 'o1',
    amount_cents: 8000,
    status: 'pending',
    created_at: '2026-09-01T11:00:00Z',
    resolved_at: null,
    buyer_id: 'buyer',
  },
]

describe('Envío y recepción', () => {
  it('Envío y recepción: ordena mensajes y ofertas cronológicamente', () => {
    const timeline = buildTimeline(messages, offers)
    expect(timeline.map((entry) => entry.at)).toEqual([
      '2026-09-01T10:00:00Z',
      '2026-09-01T11:00:00Z',
      '2026-09-01T12:00:00Z',
    ])
  })

  it('Envío y recepción: añade el último mensaje al final del hilo', () => {
    const timeline = buildTimeline(messages, offers)
    const last = timeline.at(-1)
    expect(last?.kind).toBe('message')
    expect(last?.kind === 'message' && last.message.body).toBe('Te lo dejo')
  })

  it('intercala la oferta entre los dos mensajes', () => {
    const timeline = buildTimeline(messages, offers)
    expect(timeline[1].kind).toBe('offer')
  })

  it('devuelve una lista vacía sin mensajes ni ofertas', () => {
    expect(buildTimeline([], [])).toEqual([])
  })
})
