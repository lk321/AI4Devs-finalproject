'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ImageOff } from 'lucide-react'
import { StatusBadge, formatPrice, formatSince } from '@/entities/listing'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/cn'
import type { InboxItem } from '../model/types'

export function ConversationListItem({ item, active }: { item: InboxItem; active?: boolean }) {
  const router = useRouter()
  const href = `/messages/${item.id}`

  return (
    <li>
      <Link
        href={href}
        onMouseEnter={() => router.prefetch(href)}
        onFocus={() => router.prefetch(href)}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'hover:bg-accent focus-visible:ring-ring flex gap-3 border-b p-3 transition-colors focus-visible:ring-2 focus-visible:outline-none',
          active && 'bg-accent',
        )}
      >
        <div className="bg-muted relative size-14 shrink-0 overflow-hidden rounded-md">
          {item.cover ? (
            <Image
              src={item.cover.url}
              alt={item.cover.alt}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <ImageOff
              className="text-muted-foreground absolute inset-0 m-auto size-5"
              aria-hidden
            />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate font-medium">{item.title}</p>
            {item.unreadCount > 0 ? (
              <Badge className="shrink-0 tabular-nums">
                {item.unreadCount}
                <span className="sr-only">
                  {item.unreadCount === 1 ? ' mensaje sin leer' : ' mensajes sin leer'}
                </span>
              </Badge>
            ) : null}
          </div>

          <p className="text-muted-foreground truncate text-xs">
            {item.role === 'buyer' ? 'Vendedor' : 'Comprador'}: {item.counterpartAlias} ·{' '}
            {formatPrice(item.priceCents)}
          </p>

          <p className="text-muted-foreground truncate text-sm">
            {item.lastMessage?.body ?? 'Sin mensajes todavía'}
          </p>

          <div className="flex items-center gap-2">
            <StatusBadge status={item.status} />
            <span className="text-muted-foreground text-xs">{formatSince(item.sortedAt)}</span>
          </div>
        </div>
      </Link>
    </li>
  )
}
