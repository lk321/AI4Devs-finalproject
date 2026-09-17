import { beforeAll, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@/shared/api/browser', () => ({ createClient: () => ({ storage: { from: () => ({}) } }) }))
vi.mock('../api/actions', () => ({ createListingAction: vi.fn(async () => undefined) }))

const { CreateListingForm } = await import('./create-listing-form')

const categories = [
  {
    id: 'root-1',
    slug: 'deporte',
    name: 'Deporte',
    children: [{ id: 'child-1', slug: 'bicicletas', name: 'Bicicletas' }],
  },
]

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Element.prototype.scrollIntoView = vi.fn()
  Element.prototype.hasPointerCapture = vi.fn(() => false)
  Element.prototype.releasePointerCapture = vi.fn()
  Element.prototype.setPointerCapture = vi.fn()
})

describe('Campos inválidos', () => {
  it('no avanza de paso y senala cada campo en error', async () => {
    const user = userEvent.setup()
    render(<CreateListingForm categories={categories} />)

    await user.click(screen.getByRole('button', { name: /continuar/i }))

    expect(await screen.findByText(/El título necesita al menos 5 caracteres/)).toBeInTheDocument()
    expect(screen.getByText(/al menos 20 caracteres/)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /fotos del artículo/i })).not.toBeInTheDocument()
    expect(screen.getByRole('listitem', { current: 'step' })).toHaveTextContent(/artículo/i)
  })

  it('no avanza con un titulo de menos de 5 caracteres', async () => {
    const user = userEvent.setup()
    render(<CreateListingForm categories={categories} />)

    await user.type(screen.getByLabelText(/título/i), 'Bici')
    await user.type(
      screen.getByLabelText(/descripción/i),
      'Bicicleta revisada en taller con ruedas nuevas.',
    )
    await user.click(screen.getByRole('button', { name: /continuar/i }))

    expect(await screen.findByText(/El título necesita al menos 5 caracteres/)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /fotos del artículo/i })).not.toBeInTheDocument()
  })
})

describe('Paso a paso', () => {
  it('avanza a las fotos cuando el articulo es valido', async () => {
    const user = userEvent.setup()
    render(<CreateListingForm categories={categories} />)

    await user.type(screen.getByLabelText(/título/i), 'Bicicleta de montaña')
    await user.type(
      screen.getByLabelText(/descripción/i),
      'Bicicleta revisada en taller con ruedas nuevas y frenos de disco.',
    )
    await user.click(screen.getByRole('combobox', { name: /categoría/i }))
    await user.click(await screen.findByRole('option', { name: 'Bicicletas' }))
    await user.click(screen.getByRole('radio', { name: /buen estado/i }))
    await user.click(screen.getByRole('button', { name: /continuar/i }))

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /fotos del artículo/i })).toBeInTheDocument(),
    )
    expect(screen.getByRole('listitem', { current: 'step' })).toHaveTextContent(/fotos/i)
  })
})
