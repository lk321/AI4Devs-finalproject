import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThreadTimeline } from './thread-timeline'
import { buildTimeline } from '../model/timeline'
import type { ThreadMessage, ThreadOffer } from '../model/types'

const aliasById = { buyer: 'ana', seller: 'carlos' }

const messages: ThreadMessage[] = [
  { id: 'm1', body: '¿Sigue disponible?', created_at: '2026-09-01T10:00:00Z', sender_id: 'buyer' },
  { id: 'm2', body: 'Sí, lo está', created_at: '2026-09-01T12:00:00Z', sender_id: 'seller' },
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

function renderTimeline(viewerId: string) {
  return render(
    <ThreadTimeline
      entries={buildTimeline(messages, offers)}
      viewerId={viewerId}
      aliasById={aliasById}
    />,
  )
}

describe('Mensajes', () => {
  it('Envío y recepción: muestra cada mensaje con su autor y su fecha', () => {
    renderTimeline('buyer')
    expect(screen.getByText('¿Sigue disponible?')).toBeInTheDocument()
    expect(screen.getByText('Sí, lo está')).toBeInTheDocument()
    expect(screen.getByText('carlos')).toBeInTheDocument()
    expect(screen.getAllByText('Tú').length).toBeGreaterThan(0)
  })

  it('Envío y recepción: expone el hilo como registro accesible', () => {
    renderTimeline('buyer')
    const log = screen.getByRole('log', { name: 'Mensajes de la conversación' })
    expect(log).toHaveAttribute('aria-live', 'polite')
  })

  it('Envío y recepción: ordena las entradas cronológicamente', () => {
    renderTimeline('buyer')
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(items[0]).toHaveTextContent('¿Sigue disponible?')
    expect(items[2]).toHaveTextContent('Sí, lo está')
  })

  it('muestra el estado vacío cuando no hay mensajes', () => {
    render(<ThreadTimeline entries={[]} viewerId="buyer" aliasById={aliasById} />)
    expect(screen.getByText('Todavía no hay mensajes')).toBeInTheDocument()
  })
})

describe('Oferta de precio', () => {
  it('Oferta válida: muestra la oferta en el hilo con su importe y su estado', () => {
    renderTimeline('seller')
    expect(screen.getByText('80 €')).toBeInTheDocument()
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
  })

  it('Rechazo del vendedor: muestra la etiqueta de oferta rechazada', () => {
    const rejected: ThreadOffer[] = [{ ...offers[0], status: 'rejected' }]
    render(
      <ThreadTimeline
        entries={buildTimeline([], rejected)}
        viewerId="seller"
        aliasById={aliasById}
      />,
    )
    expect(screen.getByText('Rechazada')).toBeInTheDocument()
  })

  it('Nueva oferta sobre otra pendiente: muestra la anterior como superada', () => {
    const superseded: ThreadOffer[] = [
      { ...offers[0], id: 'o0', status: 'superseded', amount_cents: 7000 },
      offers[0],
    ]
    render(
      <ThreadTimeline
        entries={buildTimeline([], superseded)}
        viewerId="seller"
        aliasById={aliasById}
      />,
    )
    expect(screen.getByText('Superada')).toBeInTheDocument()
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
  })
})
