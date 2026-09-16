import { describe, expect, it } from 'vitest'
import { GENERIC_CREDENTIALS_ERROR } from '@/entities/user'
import { ALIAS_TAKEN_ERROR, mapSignUpError } from './auth-error'

describe('mapSignUpError', () => {
  it('Email ya registrado responde con el error generico de credenciales', () => {
    expect(mapSignUpError('User already registered')).toBe(GENERIC_CREDENTIALS_ERROR)
  })

  it('Alias ya en uso indica que el alias no esta disponible', () => {
    expect(
      mapSignUpError('duplicate key value violates unique constraint "profiles_alias_key"'),
    ).toBe(ALIAS_TAKEN_ERROR)
    expect(mapSignUpError('Database error saving new user')).toBe(ALIAS_TAKEN_ERROR)
  })

  it('no filtra el detalle de un fallo desconocido', () => {
    expect(mapSignUpError('smtp timeout')).toBe(GENERIC_CREDENTIALS_ERROR)
  })
})
