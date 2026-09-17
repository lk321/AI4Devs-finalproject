import { MAX_IMAGES } from '@/entities/listing'

export const BUCKET = 'listing-images'
export const ACCEPTED_IMAGE_TYPES: readonly string[] = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const IMAGE_ACCEPT_ATTRIBUTE = ACCEPTED_IMAGE_TYPES.join(',')

export type DraftImage = { url: string; alt: string; bytes: number }

type FileLike = { name: string; type: string; size: number }
type Validation = { ok: true } | { ok: false; message: string }

export function validateImageFile(file: FileLike, currentCount: number): Validation {
  if (currentCount >= MAX_IMAGES) {
    return { ok: false, message: `Puedes subir un máximo de ${MAX_IMAGES} imágenes por anuncio` }
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return { ok: false, message: `«${file.name}» no vale: admitimos JPG, PNG o WebP` }
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, message: `«${file.name}» supera el límite de 5 MB por imagen` }
  }
  return { ok: true }
}

export function buildImagePath(userId: string, fileName: string) {
  const extension = (fileName.split('.').pop() ?? 'jpg').toLowerCase()
  return `${userId}/${crypto.randomUUID()}.${extension}`
}

export function moveImage<T>(images: T[], from: number, to: number): T[] {
  const outOfRange = (index: number) => index < 0 || index >= images.length
  if (from === to || outOfRange(from) || outOfRange(to)) return images

  const next = [...images]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}
