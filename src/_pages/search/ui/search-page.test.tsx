import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PAGE_SIZE, type CategoryTree, type ListingSummary } from '@/entities/listing'
import { getCategoryTree, searchListings } from '@/entities/listing/index.server'
import { SearchPage } from './search-page'

globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/search',
}))

vi.mock('@/entities/listing/index.server', () => ({
  getCategoryTree: vi.fn(),
  searchListings: vi.fn(),
  getListingDetail: vi.fn(),
  getSellerListings: vi.fn(),
}))

const CATEGORIES: CategoryTree[] = [{ id: '1', slug: 'deporte', name: 'Deporte', children: [] }]

function listing(index: number, total: number): ListingSummary {
  return {
    id: `listing-${index}`,
    title: `Bicicleta ${index}`,
    price_cents: 12000,
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

function page(items: number, total: number, pageNumber: number) {
  return {
    items: Array.from({ length: items }, (_, index) => listing(index, total)),
    total,
    page: pageNumber,
    pageSize: PAGE_SIZE,
  }
}

async function renderPage(raw: Record<string, string>) {
  render(await SearchPage({ params: Promise.resolve({}), searchParams: Promise.resolve(raw) }))
}

beforeEach(() => {
  vi.mocked(getCategoryTree).mockResolvedValue(CATEGORIES)
  vi.mocked(searchListings).mockReset()
})

describe('SearchPage', () => {
  it('muestra la última página existente cuando la pedida está fuera de rango', async () => {
    vi.mocked(searchListings)
      .mockResolvedValueOnce(page(0, 0, 9))
      .mockResolvedValueOnce(page(PAGE_SIZE, 60, 1))
      .mockResolvedValueOnce(page(12, 60, 3))

    await renderPage({ page: '9' })

    expect(vi.mocked(searchListings).mock.calls.at(-1)?.[0].page).toBe(3)
    expect(screen.getByText('60 anuncios encontrados')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Página 3' })).toHaveAttribute('aria-current', 'page')
  })

  it('ignora el filtro de precio e informa del rango inválido', async () => {
    vi.mocked(searchListings).mockResolvedValue(page(3, 3, 1))

    await renderPage({ min: '30000', max: '10000' })

    const [args] = vi.mocked(searchListings).mock.calls[0]
    expect(args.min).toBeUndefined()
    expect(args.max).toBeUndefined()
    expect(screen.getByText(/no se ha aplicado el filtro de precio/i)).toBeInTheDocument()
  })

  it('reproduce la búsqueda recibida por la URL', async () => {
    vi.mocked(searchListings).mockResolvedValue(page(2, 2, 1))

    await renderPage({ q: 'bicicleta', category: 'deporte', condition: 'nuevo', sort: 'price_asc' })

    const [args] = vi.mocked(searchListings).mock.calls[0]
    expect(args).toMatchObject({
      q: 'bicicleta',
      category: 'deporte',
      condition: ['nuevo'],
      sort: 'price_asc',
      page: 1,
    })
    expect(screen.getByLabelText('Buscar')).toHaveValue('bicicleta')
    expect(screen.getByLabelText('Nuevo')).toBeChecked()
    expect(screen.getByRole('combobox', { name: 'Ordenar por' })).toHaveTextContent(
      'Precio: de menor a mayor',
    )
  })
})
