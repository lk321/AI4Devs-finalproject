import { describe, expect, it } from 'vitest'
import { AUTHOR_ONLY, GENERIC_FAILURE, toUserMessage } from './errors'

describe('Transición no permitida', () => {
  it('traduce el error del disparador a un mensaje de usuario', () => {
    const message = toUserMessage({
      code: '23514',
      message: 'transicion no permitida: draft -> sold',
    })
    expect(message).toBe('Ese cambio de estado no está permitido para este anuncio')
  })
})

describe('Precio bloqueado durante la reserva', () => {
  it('pide liberar la reserva antes de cambiar el precio', () => {
    const message = toUserMessage({
      code: '23514',
      message: 'no se puede cambiar el precio de un anuncio reservado',
    })
    expect(message).toMatch(/libera la reserva/i)
  })
})

describe('Borrador incompleto', () => {
  it('indica que falta una imagen para publicar', () => {
    const message = toUserMessage({
      code: '23514',
      message: 'un anuncio publicado necesita al menos una imagen',
    })
    expect(message).toMatch(/al menos una imagen/)
  })
})

describe('Anuncio vendido', () => {
  it('pide aceptar una oferta antes de cerrar la venta', () => {
    expect(toUserMessage({ code: '23514', message: 'primero debes aceptar una oferta' })).toMatch(
      /aceptar una oferta/,
    )
  })

  it('traduce la falta de comprador al cerrar la venta', () => {
    expect(
      toUserMessage({
        code: '23514',
        message:
          'new row for relation "listings" violates check constraint "listings_sold_coherence"',
      }),
    ).toMatch(/comprador/i)
  })
})

describe('toUserMessage', () => {
  it('devuelve null sin error', () => {
    expect(toUserMessage(null)).toBeNull()
  })

  it('usa el mensaje de autoria ante un error de privilegios', () => {
    expect(toUserMessage({ code: '42501', message: 'solo el vendedor cierra la venta' })).toBe(
      AUTHOR_ONLY,
    )
  })

  it('usa un mensaje generico ante un error desconocido', () => {
    expect(toUserMessage({ code: 'XX000', message: 'connection reset' })).toBe(GENERIC_FAILURE)
  })
})
