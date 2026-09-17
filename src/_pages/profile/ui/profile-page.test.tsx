import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

const getProfileByAlias = vi.fn()
const getSellerListings = vi.fn()
const notFound = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND')
})

vi.mock('@/entities/user/index.server', () => ({ getProfileByAlias }))
vi.mock('@/entities/listing/index.server', () => ({ getSellerListings }))
vi.mock('next/navigation', () => ({ notFound }))

const { ProfilePage } = await import('./profile-page')

const profile = {
  id: 'user-1',
  alias: 'ana',
  city: 'Madrid',
  rating_average: 4.5,
  closed_deals: 7,
  created_at: '2026-01-10T10:00:00.000Z',
}

const listing = {
  id: 'listing-1',
  title: 'Bicicleta de montaña',
  price_cents: 18000,
  condition: 'bueno' as const,
  status: 'published' as const,
  city: 'Madrid',
  published_at: '2026-09-10T10:00:00.000Z',
  created_at: '2026-09-01T10:00:00.000Z',
  cover: null,
}

async function renderPage(alias = 'ana') {
  render(await ProfilePage({ params: Promise.resolve({ alias }) }))
}

describe('ProfilePage', () => {
  it('Consulta de perfil muestra alias, ciudad, antiguedad, valoracion, operaciones y anuncios', async () => {
    getProfileByAlias.mockResolvedValue(profile)
    getSellerListings.mockResolvedValue([listing])

    await renderPage()

    expect(screen.getByRole('heading', { level: 1, name: 'ana' })).toBeVisible()
    expect(screen.getAllByText(/Madrid/).length).toBeGreaterThan(0)
    expect(screen.getByText(/En Loop Market/)).toBeVisible()
    expect(screen.getByLabelText(/Valoración media 4.5 sobre 5/)).toBeVisible()
    expect(screen.getByText('7')).toBeVisible()
    expect(screen.getByText('Bicicleta de montaña')).toBeVisible()
  })

  it('no expone email ni telefono', async () => {
    getProfileByAlias.mockResolvedValue({ ...profile })
    getSellerListings.mockResolvedValue([])

    await renderPage()

    expect(document.body.textContent).not.toMatch(/@/)
    expect(document.body.textContent).not.toMatch(/\d{9}/)
  })

  it('oculta los anuncios que no son publicos', async () => {
    getProfileByAlias.mockResolvedValue(profile)
    getSellerListings.mockResolvedValue([
      listing,
      { ...listing, id: 'listing-2', title: 'Borrador privado', status: 'draft' as const },
    ])

    await renderPage()

    expect(screen.queryByText('Borrador privado')).toBeNull()
  })

  it('Perfil inexistente responde con la pagina de recurso no encontrado', async () => {
    getProfileByAlias.mockResolvedValue(null)

    await expect(renderPage('desconocida')).rejects.toThrow('NEXT_NOT_FOUND')
    expect(notFound).toHaveBeenCalled()
  })
})
