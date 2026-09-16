import { acceptsMessages } from '@/entities/listing'
import { MessageForm } from '@/features/send-message'
import { buildTimeline } from '../model/timeline'
import type { ConversationThreadData } from '../model/types'
import { ThreadActions } from './thread-actions'
import { ThreadHeader } from './thread-header'
import { ThreadTimeline } from './thread-timeline'

const CLOSED_REASON: Record<string, string> = {
  sold: 'La operación está cerrada: este anuncio ya no admite mensajes',
  archived: 'El anuncio está archivado y ya no admite mensajes',
  draft: 'El anuncio todavía no está publicado',
}

export function ConversationThread({
  data,
  viewerId,
}: {
  data: ConversationThreadData
  viewerId: string
}) {
  const { listing, buyer } = data
  const isSeller = viewerId === listing.seller_id
  const counterpart = isSeller ? buyer : listing.seller

  const aliasById = {
    [listing.seller_id]: listing.seller.alias,
    [buyer.id]: buyer.alias,
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ThreadHeader listing={listing} counterpart={counterpart} />
      <ThreadTimeline
        entries={buildTimeline(data.messages, data.offers)}
        viewerId={viewerId}
        aliasById={aliasById}
      />
      <ThreadActions data={data} viewerId={viewerId} />
      <MessageForm
        conversationId={data.id}
        disabled={!acceptsMessages(listing.status)}
        disabledReason={CLOSED_REASON[listing.status]}
      />
    </div>
  )
}
