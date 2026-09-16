import type { ThreadMessage, ThreadOffer, TimelineEntry } from './types'

export function buildTimeline(
  messages: readonly ThreadMessage[],
  offers: readonly ThreadOffer[],
): TimelineEntry[] {
  const entries: TimelineEntry[] = [
    ...messages.map((message) => ({ kind: 'message' as const, at: message.created_at, message })),
    ...offers.map((offer) => ({ kind: 'offer' as const, at: offer.created_at, offer })),
  ]

  return entries.sort((a, b) => a.at.localeCompare(b.at))
}

export function formatMessageTime(iso: string) {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}
