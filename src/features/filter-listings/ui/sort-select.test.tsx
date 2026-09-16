import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { parseSearchParams } from '@/entities/listing'
import { FilterStoreProvider } from '../model/store-provider'
import { SortSelect } from './sort-select'

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, push: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/search',
}))

Element.prototype.hasPointerCapture ??= () => false
Element.prototype.setPointerCapture ??= () => {}
Element.prototype.releasePointerCapture ??= () => {}
Element.prototype.scrollIntoView ??= () => {}

function renderSort(raw: Record<string, string> = {}) {
  return render(
    <FilterStoreProvider params={parseSearchParams(raw)}>
      <SortSelect />
    </FilterStoreProvider>,
  )
}

beforeEach(() => replace.mockClear())

describe('SortSelect', () => {
  it('cae en relevancia con un orden desconocido en la URL', () => {
    renderSort({ sort: 'inventado' })
    expect(screen.getByRole('combobox', { name: 'Ordenar por' })).toHaveTextContent('Relevancia')
  })

  it('ordena por precio de menor a mayor', async () => {
    const user = userEvent.setup()
    renderSort()

    await user.click(screen.getByRole('combobox', { name: 'Ordenar por' }))
    await user.click(await screen.findByRole('option', { name: 'Precio: de menor a mayor' }))

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith('/search?sort=price_asc', { scroll: false }),
    )
  })
})
