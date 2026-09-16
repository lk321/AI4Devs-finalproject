import { describe, expect, it } from 'vitest'
import { credentialsSchema, signUpSchema } from '@/entities/user'

const validSignUp = {
  email: 'nueva@loop.test',
  password: 'loopmarket123',
  alias: 'nueva_vecina',
  city: 'Madrid',
}

describe('signUpSchema', () => {
  it('Registro correcto acepta email, alias, ciudad y contrasena validos', () => {
    expect(signUpSchema.safeParse(validSignUp).success).toBe(true)
  })

  it('Contrasena debil rechaza menos de 12 caracteres', () => {
    const result = signUpSchema.safeParse({ ...validSignUp, password: 'loop12345' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toContain('12 caracteres')
  })

  it('rechaza un alias con caracteres no permitidos', () => {
    expect(signUpSchema.safeParse({ ...validSignUp, alias: 'ana maría!' }).success).toBe(false)
    expect(signUpSchema.safeParse({ ...validSignUp, alias: 'ab' }).success).toBe(false)
  })

  it('rechaza un email invalido', () => {
    expect(signUpSchema.safeParse({ ...validSignUp, email: 'nueva@' }).success).toBe(false)
  })
})

describe('credentialsSchema', () => {
  it('acepta email y contrasena validos', () => {
    expect(
      credentialsSchema.safeParse({ email: 'ana@loop.test', password: 'loopmarket123' }).success,
    ).toBe(true)
  })

  it('rechaza una contrasena de menos de 12 caracteres', () => {
    expect(credentialsSchema.safeParse({ email: 'ana@loop.test', password: 'corta' }).success).toBe(
      false,
    )
  })
})
