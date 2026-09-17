import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mensajes',
  description: 'Conversaciones con compradores y vendedores de Loop Market.',
}

export { MessagesPage as default } from '@/_pages/messages'
