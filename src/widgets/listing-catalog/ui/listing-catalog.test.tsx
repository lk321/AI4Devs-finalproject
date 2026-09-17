import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { parseSearchParams, type ListingSummary } from '@/entities/listing'
import { FilterStoreProvider } from '@/features/filter-listings'
import { ListingCatalog } from './listing-catalog'

const { prefetch } = vi.hoisted(() => ({ prefetch: vi.fn() }))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn(), prefetch }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/search',
}))

function listing(index: number, total: number): ListingSummary {
  return {
    id: `listing-${index}`,
    title: `Bicicleta ${index}`,
    price_cents: 12000 + index,
    city: 'Madrid',
    condition: 'bueno',
    status: 'published',
    published_at: '2026-09-01T10:00:00.000Z',
    cover_url: '',
    cover_alt: '',
    distance_km: 0,
    total_count: total,
  }
}

function renderCatalog(raw: Record<string, string>, total: number, count: number) {
  const params = parseSearchParams(raw)
  return render(
    <FilterStoreProvider params={params}>
      <ListingCatalog
        params={params}
        items={Array.from({ length: count }, (_, index) => listing(index, total))}
        total={total}
        page={params.page}
        invalidPriceRange={params.invalidPriceRange}
      />
    </FilterStoreProvider>,
  )
}

beforeEach(() => prefetch.mockClear())

describe('ListingCatalog', () => {
  it('anuncia el total de coincidencias en una región aria-live', () => {
    renderCatalog({}, 60, 24)
    const live = screen.getByText('60 anuncios encontrados')
    expect(live).toHaveAttribute('aria-live', 'polite')
  })

  it('muestra un estado vacío con sugerencias cuando no hay resultados', () => {
    renderCatalog({ q: 'algoquenoexiste' }, 0, 0)
    expect(screen.getByText(/No hay anuncios que encajen/i)).toBeInTheDocument()
    expect(screen.getByText(/Amplía la búsqueda/i)).toBeInTheDocument()
    expect(screen.getByText(/Aumenta la distancia máxima/i)).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: /Paginación/ })).not.toBeInTheDocument()
  })

  it('pagina en bloques de 24 y marca la página actual', () => {
    renderCatalog({ page: '2' }, 60, 24)

    expect(screen.getAllByRole('listitem').filter((item) => item.querySelector('h3'))).toHaveLength(
      24,
    )
    expect(screen.getByRole('link', { name: 'Página 2' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Página 1' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', { name: 'Página 3' })).toHaveAttribute('href', '/search?page=3')
    expect(screen.queryByRole('link', { name: 'Página 4' })).not.toBeInTheDocument()
  })

  it('deshabilita los extremos de la paginación', () => {
    renderCatalog({}, 60, 24)
    expect(screen.getByRole('button', { name: 'Página anterior' })).toBeDisabled()
    expect(screen.getByRole('link', { name: 'Página siguiente' })).toHaveAttribute(
      'href',
      '/search?page=2',
    )
  })

  it('conserva los filtros en los enlaces de paginación', () => {
    renderCatalog({ q: 'bici', category: 'deporte', page: '2' }, 60, 24)
    expect(screen.getByRole('link', { name: 'Página 3' })).toHaveAttribute(
      'href',
      '/search?q=bici&category=deporte&page=3',
    )
  })

  it('prefetch de la página al pasar el ratón por el control', async () => {
    const user = userEvent.setup()
    renderCatalog({ page: '2' }, 60, 24)

    await user.hover(screen.getByRole('link', { name: 'Página 3' }))
    expect(prefetch).toHaveBeenCalledWith('/search?page=3')
  })
})
