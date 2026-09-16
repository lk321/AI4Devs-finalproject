export type DatabaseError = { code?: string; message: string }

const TRANSLATIONS: [RegExp, string][] = [
  [/necesita al menos una imagen/i, 'Para publicar necesitas al menos una imagen'],
  [/listings_price_range/i, 'El precio debe ser mayor que cero y menor de 100.000 €'],
  [/listings_title_length/i, 'El título debe tener entre 5 y 80 caracteres'],
  [/listings_description_length/i, 'La descripción debe tener entre 20 y 2000 caracteres'],
  [/listing_images_size_limit/i, 'Cada imagen debe pesar menos de 5 MB'],
  [/row-level security/i, 'No tienes permiso para publicar este anuncio'],
]

export function toSaveErrorMessage(error: DatabaseError | null | undefined): string | null {
  if (!error) return null
  const match = TRANSLATIONS.find(([pattern]) => pattern.test(error.message))
  return match ? match[1] : 'No hemos podido guardar el anuncio. Inténtalo de nuevo'
}
