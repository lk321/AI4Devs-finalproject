import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GENERIC_CREDENTIALS_ERROR } from '@/entities/user'
import { LoginForm } from './login-form'

function setup(action = vi.fn().mockResolvedValue(undefined), next?: string) {
  const user = userEvent.setup()
  render(<LoginForm action={action} next={next} />)
  return { user, action }
}

async function fill(user: ReturnType<typeof userEvent.setup>, password: string) {
  await user.type(screen.getByLabelText('Email'), 'ana@loop.test')
  await user.type(screen.getByLabelText('Contraseña'), password)
  await user.click(screen.getByRole('button', { name: 'Entrar' }))
}

describe('LoginForm', () => {
  it('Credenciales incorrectas muestra un error generico sin revelar el campo fallido', async () => {
    const action = vi.fn().mockResolvedValue({ error: GENERIC_CREDENTIALS_ERROR })
    const { user } = setup(action)

    await fill(user, 'loopmarket123')

    expect(await screen.findByRole('alert')).toHaveTextContent(GENERIC_CREDENTIALS_ERROR)
  })

  it('rechaza una contrasena de menos de 12 caracteres antes de llamar al servidor', async () => {
    const { user, action } = setup()

    await fill(user, 'corta')

    expect(await screen.findByText('La contraseña necesita al menos 12 caracteres')).toBeVisible()
    expect(action).not.toHaveBeenCalled()
  })

  it('Credenciales correctas envia la ruta de origen a la accion', async () => {
    const action = vi.fn().mockResolvedValue(undefined)
    const { user } = setup(action, '/sell')

    await fill(user, 'loopmarket123')

    expect(action).toHaveBeenCalledWith(
      { email: 'ana@loop.test', password: 'loopmarket123' },
      '/sell',
    )
  })
})
