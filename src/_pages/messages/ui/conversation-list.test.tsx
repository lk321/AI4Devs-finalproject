import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConversationList } from './conversation-list'
import type { InboxItem } from '../model/types'

vi.mock('next/navigation', () => ({ useRouter: () => ({ prefetch: vi.fn() }) }))

const base: InboxItem = {
  id: 'c1',
  listingId: 'l1',
  title: 'Bicicleta de montaña',
  cover: null,
  priceCents: 18000,
  status: 'published',
  counterpartAlias: 'carlos',
  role: 'buyer',
  lastMessage: { body: '¿Sigue disponible?', createdAt: '2026-09-15T10:00:00Z', senderId: 'x' },
  unreadCount: 0,
  sortedAt: '2026-09-15T10:00:00Z',
}

describe('Indicador de no leídos', () => {
  it('Indicador de no leídos: muestra el contador de mensajes sin leer', () => {
    render(<ConversationList items={[{ ...base, unreadCount: 3 }]} />)
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('mensajes sin leer', { exact: false })).toBeInTheDocument()
  })

  it('Indicador de no leídos: usa el singular con un solo mensaje sin leer', () => {
    render(<ConversationList items={[{ ...base, unreadCount: 1 }]} />)
    expect(screen.getByText('mensaje sin leer', { exact: false })).toBeInTheDocument()
  })

  it('Indicador de no leídos: no muestra contador cuando todo está leído', () => {
    render(<ConversationList items={[base]} />)
    expect(screen.queryByText('sin leer', { exact: false })).not.toBeInTheDocument()
  })

  it('Indicador de no leídos: suma el total de no leídos en la cabecera', () => {
    render(
      <ConversationList
        items={[
          { ...base, unreadCount: 2 },
          { ...base, id: 'c2', unreadCount: 3 },
        ]}
      />,
    )
    expect(screen.getByText('5 sin leer')).toBeInTheDocument()
  })
})

describe('Bandeja de conversaciones', () => {
  it('Primer mensaje: enlaza cada conversación con su hilo', () => {
    render(<ConversationList items={[base]} />)
    expect(screen.getByRole('link', { name: /Bicicleta de montaña/ })).toHaveAttribute(
      'href',
      '/messages/c1',
    )
  })

  it('muestra el estado vacío cuando no hay conversaciones', () => {
    render(<ConversationList items={[]} />)
    expect(screen.getByText('Tu bandeja está vacía')).toBeInTheDocument()
  })

  it('distingue el papel de comprador y de vendedor', () => {
    render(<ConversationList items={[{ ...base, role: 'seller' }]} />)
    expect(screen.getByText(/Comprador: carlos/)).toBeInTheDocument()
  })

  it('marca la conversación activa', () => {
    render(<ConversationList items={[base]} activeId="c1" />)
    expect(screen.getByRole('link', { name: /Bicicleta/ })).toHaveAttribute('aria-current', 'page')
  })
})
