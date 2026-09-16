import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conversación',
  description: 'Mensajes, ofertas y estado de la operación.',
}

export { ConversationPage as default } from '@/_pages/messages'
