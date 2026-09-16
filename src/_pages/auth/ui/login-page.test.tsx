import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

const getSessionUser = vi.fn()
const redirect = vi.fn()

vi.mock('@/shared/api/server', () => ({ getSessionUser, createClient: vi.fn() }))
vi.mock('next/navigation', () => ({ redirect }))

const received: { next?: string }[] = []

vi.mock('@/features/auth-by-credentials', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/auth-by-credentials')>()
  return {
    ...actual,
    LoginForm: (props: { next?: string }) => {
      received.push(props)
      return <div data-testid="login-form" />
    },
  }
})

const { LoginPage } = await import('./login-page')

async function renderPage(next?: string) {
  received.length = 0
  getSessionUser.mockResolvedValue(null)
  render(await LoginPage({ searchParams: Promise.resolve({ next }) }))
}

describe('LoginPage', () => {
  it('conserva la ruta de origen recibida en next', async () => {
    await renderPage('/sell?step=2')

    expect(screen.getByTestId('login-form')).toBeVisible()
    expect(received[0]?.next).toBe('/sell?step=2')
  })

  it('ignora un next externo y vuelve al catalogo', async () => {
    await renderPage('https://evil.test/phishing')

    expect(received[0]?.next).toBe('/search')
  })

  it('Retorno con sesion vigente no pide credenciales', async () => {
    getSessionUser.mockResolvedValue({ id: 'user-1' })
    await render(await LoginPage({ searchParams: Promise.resolve({ next: '/messages' }) }))

    expect(redirect).toHaveBeenCalledWith('/messages')
  })
})
