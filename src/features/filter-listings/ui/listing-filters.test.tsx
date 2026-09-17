import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { parseSearchParams, type CategoryTree } from '@/entities/listing'
import { FilterStoreProvider } from '../model/store-provider'
import { useFilterValue } from '../model/context'
import { ListingFilters } from './listing-filters'

globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver

const { replace, prefetch } = vi.hoisted(() => ({ replace: vi.fn(), prefetch: vi.fn() }))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, push: vi.fn(), prefetch }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/search',
}))

const CATEGORIES: CategoryTree[] = [
  {
    id: '1',
    slug: 'deporte',
    name: 'Deporte',
    children: [{ id: '2', slug: 'bicicletas', name: 'Bicicletas' }],
  },
  { id: '3', slug: 'tecnologia', name: 'Tecnología', children: [] },
]

const cardRender = vi.fn()

function ResultsProbe() {
  const condition = useFilterValue('condition')
  cardRender(condition.length)
  return <output data-testid="probe">{condition.length}</output>
}

function renderFilters(raw: Record<string, string> = {}, withProbe = false) {
  return render(
    <FilterStoreProvider params={parseSearchParams(raw)}>
      <ListingFilters categories={CATEGORIES} />
      {withProbe ? <ResultsProbe /> : null}
    </FilterStoreProvider>,
  )
}

beforeEach(() => {
  replace.mockClear()
  cardRender.mockClear()
})

describe('ListingFilters', () => {
  it('marca los filtros recibidos por la URL', () => {
    renderFilters({
      q: 'bici',
      category: 'bicicletas',
      min: '5000',
      max: '20000',
      condition: 'nuevo,como_nuevo',
      city: 'Madrid',
      distance: '25',
    })

    expect(screen.getByLabelText('Precio mínimo')).toHaveValue(50)
    expect(screen.getByLabelText('Precio máximo')).toHaveValue(200)
    expect(screen.getByLabelText('Nuevo')).toBeChecked()
    expect(screen.getByLabelText('Como nuevo')).toBeChecked()
    expect(screen.getByLabelText('Aceptable')).not.toBeChecked()
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '25')
    expect(screen.getByRole('button', { name: /Filtrar/ })).toHaveTextContent('5 activos')
  })

  it('escribe los filtros en la URL al cambiarlos', async () => {
    const user = userEvent.setup()
    renderFilters()

    await user.click(screen.getByLabelText('Como nuevo'))

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith('/search?condition=como_nuevo', { scroll: false }),
    )
  })

  it('no lleva el precio a la URL en cada pulsacion', async () => {
    const user = userEvent.setup()
    renderFilters()

    await user.type(screen.getByLabelText('Precio mínimo'), '150')
    expect(replace).not.toHaveBeenCalled()

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith('/search?min=15000', { scroll: false }),
    )
    expect(replace).toHaveBeenCalledTimes(1)
  })

  it('el panel ya no duplica el buscador de la cabecera', () => {
    renderFilters({ q: 'bici' })

    expect(screen.queryByLabelText('Buscar')).not.toBeInTheDocument()
  })

  it('conserva el termino de busqueda al cambiar otro filtro', async () => {
    const user = userEvent.setup()
    renderFilters({ q: 'bici' })

    await user.click(screen.getByLabelText('Como nuevo'))

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith('/search?q=bici&condition=como_nuevo', {
        scroll: false,
      }),
    )
  })

  it('no aplica el rango de precio con el mínimo mayor que el máximo', async () => {
    const user = userEvent.setup()
    renderFilters()

    await user.type(screen.getByLabelText('Precio mínimo'), '300')
    await user.type(screen.getByLabelText('Precio máximo'), '100')

    expect(screen.getByRole('alert')).toHaveTextContent(/no se aplica el filtro de precio/i)
    expect(screen.getByLabelText('Precio mínimo')).toHaveAttribute('aria-invalid', 'true')
    expect(parseSearchParams({ min: '30000', max: '10000' }).min).toBeUndefined()
    expect(parseSearchParams({ min: '30000', max: '10000' }).invalidPriceRange).toBe(true)
  })

  it('limpia los filtros y deja la URL sin parámetros', async () => {
    const user = userEvent.setup()
    renderFilters({ q: 'bici', category: 'deporte', condition: 'nuevo', sort: 'newest' })

    await user.click(screen.getByRole('button', { name: /Limpiar filtros/ }))

    await waitFor(() => expect(replace).toHaveBeenCalledWith('/search', { scroll: false }))
  })

  it('cambiar un filtro no rerenderiza las tarjetas de resultado', async () => {
    const user = userEvent.setup()
    renderFilters({}, true)

    const before = cardRender.mock.calls.length
    expect(before).toBeGreaterThan(0)

    await user.type(screen.getByLabelText('Precio mínimo'), '50')
    await waitFor(() => expect(replace).toHaveBeenCalled())
    expect(cardRender).toHaveBeenCalledTimes(before)

    await user.click(screen.getByLabelText('Nuevo'))
    expect(cardRender).toHaveBeenCalledTimes(before + 1)
  })
})
