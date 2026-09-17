import { HandCoins, MessagesSquare } from 'lucide-react'
import { OFFER_STATUS_LABELS, formatPrice } from '@/entities/listing'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/cn'
import { formatMessageTime } from '../model/timeline'
import type { TimelineEntry } from '../model/types'

const OFFER_BADGE = {
  pending: 'secondary',
  accepted: 'default',
  rejected: 'destructive',
  superseded: 'outline',
} as const

export function ThreadTimeline({
  entries,
  viewerId,
  aliasById,
}: {
  entries: TimelineEntry[]
  viewerId: string
  aliasById: Record<string, string>
}) {
  if (entries.length === 0) {
    return (
      <div
        role="log"
        aria-live="polite"
        aria-label="Mensajes de la conversación"
        className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-12 text-center"
      >
        <MessagesSquare className="text-muted-foreground size-8" aria-hidden />
        <p className="font-medium">Todavía no hay mensajes</p>
        <p className="text-muted-foreground text-sm">
          Escribe el primero y empieza a negociar el artículo.
        </p>
      </div>
    )
  }

  return (
    <ol
      role="log"
      aria-live="polite"
      aria-label="Mensajes de la conversación"
      className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-5"
    >
      {entries.map((entry) =>
        entry.kind === 'message' ? (
          <MessageBubble
            key={`message-${entry.message.id}`}
            entry={entry}
            viewerId={viewerId}
            aliasById={aliasById}
          />
        ) : (
          <OfferEntry
            key={`offer-${entry.offer.id}`}
            entry={entry}
            viewerId={viewerId}
            aliasById={aliasById}
          />
        ),
      )}
    </ol>
  )
}

function MessageBubble({
  entry,
  viewerId,
  aliasById,
}: {
  entry: Extract<TimelineEntry, { kind: 'message' }>
  viewerId: string
  aliasById: Record<string, string>
}) {
  const mine = entry.message.sender_id === viewerId
  const author = mine ? 'Tú' : (aliasById[entry.message.sender_id] ?? 'Participante')

  return (
    <li className={cn('flex flex-col gap-1', mine ? 'items-end' : 'items-start')}>
      <div className="text-muted-foreground flex items-baseline gap-2 text-xs">
        <span className="font-medium">{author}</span>
        <time dateTime={entry.message.created_at}>
          {formatMessageTime(entry.message.created_at)}
        </time>
      </div>
      <p
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2 text-sm wrap-anywhere whitespace-pre-wrap sm:max-w-[70%]',
          mine ? 'bg-primary text-primary-foreground' : 'bg-muted',
        )}
      >
        {entry.message.body}
      </p>
    </li>
  )
}

function OfferEntry({
  entry,
  viewerId,
  aliasById,
}: {
  entry: Extract<TimelineEntry, { kind: 'offer' }>
  viewerId: string
  aliasById: Record<string, string>
}) {
  const mine = entry.offer.buyer_id === viewerId
  const author = mine ? 'Tú' : (aliasById[entry.offer.buyer_id] ?? 'El comprador')

  return (
    <li className="flex flex-col items-center gap-1">
      <div className="bg-card w-full max-w-sm rounded-xl border p-4 text-center">
        <div className="text-muted-foreground flex items-center justify-center gap-2 text-xs">
          <HandCoins className="size-4" aria-hidden />
          <span>{author} ofreció</span>
        </div>
        <p className="mt-1 text-xl font-semibold">{formatPrice(entry.offer.amount_cents)}</p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <Badge variant={OFFER_BADGE[entry.offer.status]}>
            {OFFER_STATUS_LABELS[entry.offer.status]}
          </Badge>
          <time className="text-muted-foreground text-xs" dateTime={entry.offer.created_at}>
            {formatMessageTime(entry.offer.created_at)}
          </time>
        </div>
      </div>
    </li>
  )
}
