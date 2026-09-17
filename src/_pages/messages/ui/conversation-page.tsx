import { notFound } from 'next/navigation'
import { getSessionUser } from '@/shared/api/server'
import { ConversationThread } from '@/widgets/conversation-thread'
import { getConversationThread, getInbox, markConversationRead } from '../api/queries'
import { ConversationList } from './conversation-list'
import { SignedOut } from './signed-out'

export async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getSessionUser()
  if (!user) return <SignedOut />

  const thread = await getConversationThread(id)
  if (!thread) notFound()

  await markConversationRead(id, thread.buyer.id === user.id)
  const items = await getInbox(user.id)

  return (
    <div className="mx-auto grid w-full max-w-7xl flex-1 lg:grid-cols-[360px_1fr]">
      <div className="hidden min-h-0 lg:flex lg:flex-col">
        <ConversationList items={items} activeId={id} />
      </div>
      <ConversationThread data={thread} viewerId={user.id} />
    </div>
  )
}
