import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catálogo · Loop Market',
  description: 'Busca artículos de segunda mano por categoría, precio, estado y cercanía.',
}

export { SearchPage as default } from '@/_pages/search'
