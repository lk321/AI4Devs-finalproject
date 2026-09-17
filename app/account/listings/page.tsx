import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mis anuncios',
  description: 'Gestiona el estado de los artículos que has publicado.',
}

export { AccountListingsPage as default } from '@/_pages/account-listings'
