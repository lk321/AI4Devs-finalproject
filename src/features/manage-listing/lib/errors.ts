export const AUTHOR_ONLY = 'Sólo el autor puede gestionar este anuncio'
export const NOT_SIGNED_IN = 'Inicia sesión para gestionar tus anuncios'
export const LISTING_GONE = 'Este anuncio ya no existe'
export const GENERIC_FAILURE = 'No hemos podido completar la operación. Inténtalo de nuevo'

export type DatabaseError = { code?: string; message: string }

const TRANSLATIONS: [RegExp, string][] = [
  [/transicion no permitida/i, 'Ese cambio de estado no está permitido para este anuncio'],
  [
    /precio de un anuncio reservado/i,
    'No puedes cambiar el precio con el anuncio reservado: libera la reserva antes',
  ],
  [/necesita al menos una imagen/i, 'Para publicar necesitas al menos una imagen'],
  [/solo el vendedor cierra la venta/i, AUTHOR_ONLY],
  [
    /primero debes aceptar una oferta/i,
    'Antes de cerrar la venta tienes que aceptar una oferta y reservar el artículo',
  ],
  [/no hay reserva que liberar/i, 'Este anuncio no tiene ninguna reserva activa'],
  [
    /listings_sold_coherence/i,
    'Falta el comprador de la operación: acepta una oferta antes de cerrar la venta',
  ],
  [/listings_price_range/i, 'El precio debe ser mayor que cero y menor de 100.000 €'],
]

export function toUserMessage(error: DatabaseError | null | undefined): string | null {
  if (!error) return null

  const match = TRANSLATIONS.find(([pattern]) => pattern.test(error.message))
  if (match) return match[1]

  return error.code === '42501' ? AUTHOR_ONLY : GENERIC_FAILURE
}
