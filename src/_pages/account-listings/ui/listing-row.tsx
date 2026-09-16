import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { StatusBadge, formatPrice, formatSince } from '@/entities/listing'
import { ListingActions } from '@/features/manage-listing'
import { Button } from '@/shared/ui/button'
import type { SellerListing } from '../model/types'

export function ListingRow({ listing }: { listing: SellerListing }) {
  return (
    <li className="bg-card flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center">
      <div className="bg-muted relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-lg sm:aspect-square sm:size-24">
        {listing.cover ? (
          <Image
            src={listing.cover.url}
            alt={listing.cover.alt}
            fill
            sizes="(max-width: 640px) 100vw, 96px"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={listing.status} />
          <span className="text-muted-foreground text-xs">
            {formatSince(listing.published_at ?? listing.created_at)}
          </span>
        </div>
        <h3 className="truncate font-medium">{listing.title}</h3>
        <p className="text-sm font-semibold">{formatPrice(listing.price_cents)}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ListingActions id={listing.id} status={listing.status} />
        <Button asChild size="sm" variant="ghost">
          <Link href={`/listings/${listing.id}`}>
            Ver
            <ExternalLink className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </li>
  )
}
