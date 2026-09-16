import { beforeAll, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GENERIC_CREDENTIALS_ERROR } from '@/entities/user'
import { ALIAS_TAKEN_ERROR } from '../model/auth-error'
import { SignUpForm } from './signup-form'

beforeAll(() => {
  Element.prototype.hasPointerCapture = () => false
  Element.prototype.setPointerCapture = () => undefined
  Element.prototype.releasePointerCapture = () => undefined
  Element.prototype.scrollIntoView = () => undefined
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

function setup(action = vi.fn().mockResolvedValue(undefined)) {
  const user = userEvent.setup({ pointerEventsCheck: 0 })
  render(<SignUpForm action={action} />)
  return { user, action }
}

type User = ReturnType<typeof userEvent.setup>

async function fill(
  user: User,
  { alias = 'nueva_vecina', password = 'loopmarket123', city = true } = {},
) {
  await user.type(screen.getByLabelText('Email'), 'nueva@loop.test')
  await user.type(screen.getByLabelText('Alias'), alias)
  await user.type(screen.getByLabelText('Contraseña'), password)
  if (city) {
    await user.click(screen.getByRole('combobox', { name: 'Ciudad' }))
    await user.click(await screen.findByRole('option', { name: 'Madrid' }))
  }
  await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))
}

describe('SignUpForm', () => {
  it('Registro correcto envia email, alias, ciudad y contrasena', async () => {
    const { user, action } = setup()

    await fill(user)

    expect(action).toHaveBeenCalledWith({
      email: 'nueva@loop.test',
      alias: 'nueva_vecina',
      city: 'Madrid',
      password: 'loopmarket123',
    })
  })

  it('Alias ya en uso muestra el aviso junto al campo alias', async () => {
    const action = vi.fn().mockResolvedValue({ error: ALIAS_TAKEN_ERROR })
    const { user } = setup(action)

    await fill(user)

    const message = await screen.findByText(ALIAS_TAKEN_ERROR)
    expect(screen.getByLabelText('Alias')).toHaveAccessibleDescription(
      expect.stringContaining(ALIAS_TAKEN_ERROR),
    )
    expect(message).toBeVisible()
  })

  it('Email ya registrado muestra el error generico de credenciales', async () => {
    const action = vi.fn().mockResolvedValue({ error: GENERIC_CREDENTIALS_ERROR })
    const { user } = setup(action)

    await fill(user)

    expect(await screen.findByRole('alert')).toHaveTextContent(GENERIC_CREDENTIALS_ERROR)
  })

  it('Contrasena debil no llega al servidor', async () => {
    const { user, action } = setup()

    await fill(user, { password: 'loop12345' })

    expect(await screen.findByText('La contraseña necesita al menos 12 caracteres')).toBeVisible()
    expect(action).not.toHaveBeenCalled()
  })

  it('rechaza un alias con caracteres no permitidos', async () => {
    const { user, action } = setup()

    await fill(user, { alias: 'ana maria!' })

    expect(await screen.findByText('Sólo letras, números y guion bajo')).toBeVisible()
    expect(action).not.toHaveBeenCalled()
  })
})
