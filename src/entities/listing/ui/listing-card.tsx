import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { CONDITION_LABELS, formatPrice, formatSince } from '../model/labels'
import { StatusBadge } from './status-badge'
import type { ListingSummary } from '../model/types'

export function ListingCard({
  listing,
  priority,
}: {
  listing: ListingSummary
  priority?: boolean
}) {
  return (
    <Card className="group overflow-hidden py-0 transition-shadow focus-within:shadow-lg hover:shadow-lg">
      <Link href={`/listings/${listing.id}`} className="block focus:outline-none">
        <div className="bg-muted relative aspect-4/3 overflow-hidden">
          {listing.cover_url ? (
            <Image
              src={listing.cover_url}
              alt={listing.cover_alt ?? listing.title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : null}
          {listing.status !== 'published' ? (
            <StatusBadge status={listing.status} className="absolute top-3 left-3 shadow-sm" />
          ) : null}
        </div>
        <CardContent className="space-y-1.5 p-4">
          <p className="text-lg font-semibold tracking-tight">{formatPrice(listing.price_cents)}</p>
          <h3 className="line-clamp-2 text-sm leading-snug font-medium">{listing.title}</h3>
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" aria-hidden />
              {listing.city}
              {listing.distance_km !== null ? ` · ${listing.distance_km} km` : ''}
            </span>
            <span aria-hidden>·</span>
            <span>{CONDITION_LABELS[listing.condition]}</span>
            <span aria-hidden>·</span>
            <span>{formatSince(listing.published_at)}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
