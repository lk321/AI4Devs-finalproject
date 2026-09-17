import { describe, expect, it } from 'vitest'
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  buildImagePath,
  moveImage,
  validateImageFile,
} from './images'

const jpeg = { name: 'foto.jpg', type: 'image/jpeg', size: 2_000_000 }

describe('Subida válida', () => {
  it('acepta tres imagenes jpeg de 2 MB', () => {
    expect(validateImageFile(jpeg, 0).ok).toBe(true)
    expect(validateImageFile(jpeg, 1).ok).toBe(true)
    expect(validateImageFile(jpeg, 2).ok).toBe(true)
  })

  it('acepta los tres formatos admitidos', () => {
    for (const type of ACCEPTED_IMAGE_TYPES) {
      expect(validateImageFile({ ...jpeg, type }, 0).ok).toBe(true)
    }
  })

  it('guarda el objeto bajo la carpeta del usuario', () => {
    expect(buildImagePath('user-9', 'foto.JPG').startsWith('user-9/')).toBe(true)
    expect(buildImagePath('user-9', 'foto.JPG').endsWith('.jpg')).toBe(true)
  })
})

describe('Formato no permitido', () => {
  it('rechaza un archivo que no es jpeg, png ni webp', () => {
    const result = validateImageFile({ name: 'manual.pdf', type: 'application/pdf', size: 1000 }, 0)
    expect(result.ok).toBe(false)
    expect(result.ok === false && result.message).toMatch(/JPG, PNG o WebP/)
  })

  it('rechaza un archivo de mas de 5 MB', () => {
    const result = validateImageFile({ ...jpeg, size: MAX_IMAGE_BYTES + 1 }, 0)
    expect(result.ok).toBe(false)
    expect(result.ok === false && result.message).toMatch(/5 MB/)
  })
})

describe('Límite superado', () => {
  it('impide anadir la novena imagen', () => {
    const result = validateImageFile(jpeg, 8)
    expect(result.ok).toBe(false)
    expect(result.ok === false && result.message).toMatch(/8 imágenes/)
  })
})

describe('Reordenación', () => {
  const images = [
    { url: 'a', alt: 'a', bytes: 1 },
    { url: 'b', alt: 'b', bytes: 1 },
    { url: 'c', alt: 'c', bytes: 1 },
  ]

  it('la imagen movida a la primera posicion pasa a ser la portada', () => {
    expect(moveImage(images, 2, 0).map((image) => image.url)).toEqual(['c', 'a', 'b'])
  })

  it('ignora destinos fuera de rango', () => {
    expect(moveImage(images, 0, -1)).toEqual(images)
    expect(moveImage(images, 0, 3)).toEqual(images)
  })
})
