import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBox } from './search-box'

const { push, prefetch, params, pathname } = vi.hoisted(() => ({
  push: vi.fn(),
  prefetch: vi.fn(),
  params: { current: new URLSearchParams() },
  pathname: { current: '/' },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace: vi.fn(), prefetch }),
  useSearchParams: () => params.current,
  usePathname: () => pathname.current,
}))

beforeEach(() => {
  push.mockClear()
  params.current = new URLSearchParams()
  pathname.current = '/'
})

const input = () => screen.getByLabelText('Buscar artículos')

describe('SearchBox', () => {
  it('no consulta el servidor mientras se escribe', async () => {
    const user = userEvent.setup()
    render(<SearchBox />)

    await user.type(input(), 'bicicleta')

    expect(push).not.toHaveBeenCalled()
  })

  it('busca al enviar el formulario', async () => {
    const user = userEvent.setup()
    render(<SearchBox />)

    await user.type(input(), 'bicicleta{Enter}')

    expect(push).toHaveBeenCalledExactlyOnceWith('/search?q=bicicleta', { scroll: false })
  })

  it('recorta los espacios del termino', async () => {
    const user = userEvent.setup()
    render(<SearchBox />)

    await user.type(input(), '  guitarra  {Enter}')

    expect(push).toHaveBeenCalledWith('/search?q=guitarra', { scroll: false })
  })

  it('sigue visible en el catalogo y conserva los filtros activos', async () => {
    const user = userEvent.setup()
    pathname.current = '/search'
    params.current = new URLSearchParams('category=deporte&condition=nuevo&page=3')
    render(<SearchBox />)

    await user.type(input(), 'bici{Enter}')

    expect(push).toHaveBeenCalledWith('/search?category=deporte&condition=nuevo&q=bici', {
      scroll: false,
    })
  })

  it('vaciar el campo quita el termino de la URL', async () => {
    const user = userEvent.setup()
    pathname.current = '/search'
    params.current = new URLSearchParams('q=bici&category=deporte')
    render(<SearchBox />)

    await user.clear(input())
    await user.type(input(), '{Enter}')

    expect(push).toHaveBeenCalledWith('/search?category=deporte', { scroll: false })
  })

  it('refleja el termino que llega por la URL', () => {
    pathname.current = '/search'
    params.current = new URLSearchParams('q=piano')
    render(<SearchBox />)

    expect(input()).toHaveValue('piano')
  })
})
