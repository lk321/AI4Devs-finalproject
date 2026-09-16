import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ImageOff } from 'lucide-react'
import { StatusBadge, formatPrice } from '@/entities/listing'
import { UserAvatar } from '@/entities/user'
import { Button } from '@/shared/ui/button'
import type { ThreadListing, ThreadParticipant } from '../model/types'

export function ThreadHeader({
  listing,
  counterpart,
}: {
  listing: ThreadListing
  counterpart: ThreadParticipant
}) {
  return (
    <header className="flex items-center gap-3 border-b p-4">
      <Button asChild variant="ghost" size="icon" className="lg:hidden">
        <Link href="/messages" aria-label="Volver a la bandeja">
          <ArrowLeft className="size-5" aria-hidden />
        </Link>
      </Button>

      <Link
        href={`/listings/${listing.id}`}
        className="bg-muted relative size-12 shrink-0 overflow-hidden rounded-md"
      >
        {listing.cover ? (
          <Image
            src={listing.cover.url}
            alt={listing.cover.alt}
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <ImageOff className="text-muted-foreground absolute inset-0 m-auto size-5" aria-hidden />
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/listings/${listing.id}`}
          className="block truncate font-medium hover:underline"
        >
          {listing.title}
        </Link>
        <p className="text-muted-foreground flex items-center gap-2 text-sm">
          <span>{formatPrice(listing.price_cents)}</span>
          <StatusBadge status={listing.status} />
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <UserAvatar alias={counterpart.alias} />
        <span className="hidden text-sm font-medium sm:inline">{counterpart.alias}</span>
      </div>
    </header>
  )
}
