import Link from 'next/link'
import { Inbox, Search } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import type { InboxItem } from '../model/types'
import { ConversationListItem } from './conversation-list-item'

export function ConversationList({ items, activeId }: { items: InboxItem[]; activeId?: string }) {
  const unread = items.reduce((total, item) => total + item.unreadCount, 0)

  return (
    <div className="flex h-full min-h-0 flex-col border-r">
      <div className="flex items-baseline justify-between gap-2 border-b p-4">
        <h1 className="text-lg font-semibold tracking-tight">Mensajes</h1>
        {unread > 0 ? (
          <span className="text-muted-foreground text-sm tabular-nums">{unread} sin leer</span>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
          <Inbox className="text-muted-foreground size-8" aria-hidden />
          <p className="font-medium">Tu bandeja está vacía</p>
          <p className="text-muted-foreground text-sm text-pretty">
            Cuando escribas a un vendedor o alguien pregunte por uno de tus anuncios, la
            conversación aparecerá aquí.
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href="/search">
              <Search className="size-4" aria-hidden />
              Explorar el catálogo
            </Link>
          </Button>
        </div>
      ) : (
        <ol className="min-h-0 flex-1 overflow-y-auto">
          {items.map((item) => (
            <ConversationListItem key={item.id} item={item} active={item.id === activeId} />
          ))}
        </ol>
      )}
    </div>
  )
}
