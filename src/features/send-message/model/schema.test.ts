import { describe, expect, it } from 'vitest'
import { MAX_MESSAGE_LENGTH, messageSchema } from './schema'

const conversationId = '3f6c6f7a-1f28-4a4f-9a0e-0b1c2d3e4f50'

describe('Mensajes', () => {
  it('Envío y recepción: acepta un mensaje válido', () => {
    const result = messageSchema.safeParse({ conversationId, body: 'Sigue disponible?' })
    expect(result.success).toBe(true)
  })

  it('Mensaje vacío: rechaza un cuerpo sin contenido', () => {
    const result = messageSchema.safeParse({ conversationId, body: '   ' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toContain('Escribe un mensaje')
  })

  it('Mensaje vacío: rechaza más de 1000 caracteres', () => {
    const result = messageSchema.safeParse({
      conversationId,
      body: 'a'.repeat(MAX_MESSAGE_LENGTH + 1),
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toContain('1000')
  })

  it('Mensaje vacío: acepta exactamente 1000 caracteres', () => {
    const result = messageSchema.safeParse({
      conversationId,
      body: 'a'.repeat(MAX_MESSAGE_LENGTH),
    })
    expect(result.success).toBe(true)
  })
})
