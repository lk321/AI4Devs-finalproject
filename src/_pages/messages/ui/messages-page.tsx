import { redirect } from 'next/navigation'
import { MessagesSquare, TriangleAlert } from 'lucide-react'
import { getSessionUser } from '@/shared/api/server'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { getInbox, startConversation } from '../api/queries'
import { ConversationList } from './conversation-list'
import { SignedOut } from './signed-out'

export async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ listing?: string }>
}) {
  const { listing } = await searchParams
  const user = await getSessionUser()
  if (!user) return <SignedOut />

  let startError: string | null = null
  let conversationId: string | null = null

  if (listing) {
    const result = await startConversation(listing)
    if (result.error) startError = result.error
    else conversationId = result.conversationId ?? null
  }

  if (conversationId) redirect(`/messages/${conversationId}`)

  const items = await getInbox(user.id)

  return (
    <div className="mx-auto grid w-full max-w-7xl flex-1 lg:grid-cols-[360px_1fr]">
      <div className="flex min-h-0 flex-col">
        {startError ? (
          <Alert variant="destructive" className="m-4 w-auto">
            <TriangleAlert className="size-4" aria-hidden />
            <AlertTitle>No se ha podido abrir la conversación</AlertTitle>
            <AlertDescription>{startError}</AlertDescription>
          </Alert>
        ) : null}
        <ConversationList items={items} />
      </div>

      <div className="hidden flex-col items-center justify-center gap-2 p-10 text-center lg:flex">
        <MessagesSquare className="text-muted-foreground size-10" aria-hidden />
        <p className="font-medium">Elige una conversación</p>
        <p className="text-muted-foreground max-w-sm text-sm text-pretty">
          Aquí verás el hilo completo con sus mensajes, las ofertas y el estado de la operación.
        </p>
      </div>
    </div>
  )
}
