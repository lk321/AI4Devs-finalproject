import type { ListingDraft } from '@/entities/listing'

export type StepId = 'item' | 'images' | 'price'

export type Step = {
  id: StepId
  label: string
  heading: string
  hint: string
  fields: (keyof ListingDraft)[]
}

export const STEPS: Step[] = [
  {
    id: 'item',
    label: 'Artículo',
    heading: 'Cuéntanos qué vendes',
    hint: 'Un título claro y una descripción honesta multiplican las visitas.',
    fields: ['title', 'description', 'categorySlug', 'condition'],
  },
  {
    id: 'images',
    label: 'Fotos',
    heading: 'Fotos del artículo',
    hint: 'De 1 a 8 fotos. La primera es la portada del anuncio.',
    fields: ['images'],
  },
  {
    id: 'price',
    label: 'Precio',
    heading: 'Precio y ubicación',
    hint: 'Revisa la vista previa antes de publicar.',
    fields: ['priceCents', 'city'],
  },
]

export const EMPTY_DRAFT = {
  title: '',
  description: '',
  categorySlug: '',
  city: '',
  images: [],
}
