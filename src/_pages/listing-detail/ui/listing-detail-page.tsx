import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarDays, MapPin, MessageCircle, Tag } from 'lucide-react'
import { getSessionUser } from '@/shared/api/server'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { Separator } from '@/shared/ui/separator'
import {
  CONDITION_LABELS,
  StatusBadge,
  acceptsMessages,
  formatPrice,
  formatSince,
} from '@/entities/listing'
import { getListingDetail } from '@/entities/listing/index.server'
import { ProfileSummary } from '@/entities/user'
import { getProfileByAlias } from '@/entities/user/index.server'
import { ListingActions } from '@/features/manage-listing'
import { canViewListing } from '../model/access'
import { ListingGallery } from './listing-gallery'

export async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [listing, user] = await Promise.all([getListingDetail(id), getSessionUser()])

  if (!listing || !canViewListing(listing.status, listing.seller_id, user?.id)) notFound()

  const seller = await getProfileByAlias(listing.seller.alias)
  const isOwner = listing.seller_id === user?.id

  return (
    <article className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <ListingGallery images={listing.images} title={listing.title} />

        <div className="space-y-5">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={listing.status} />
              <Badge variant="outline" className="gap-1">
                <Tag className="size-3" aria-hidden />
                {listing.category.name}
              </Badge>
              <Badge variant="secondary">{CONDITION_LABELS[listing.condition]}</Badge>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              {listing.title}
            </h1>
            <p className="text-3xl font-semibold tracking-tight">
              {formatPrice(listing.price_cents)}
            </p>
            <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-4" aria-hidden />
                {listing.city}
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="size-4" aria-hidden />
                {formatSince(listing.published_at ?? listing.created_at)}
              </span>
            </div>
          </div>

          {isOwner ? (
            <Card>
              <CardContent className="space-y-3">
                <p className="text-sm font-medium">Gestiona tu anuncio</p>
                <ListingActions id={listing.id} status={listing.status} />
              </CardContent>
            </Card>
          ) : acceptsMessages(listing.status) ? (
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={`/messages?listing=${listing.id}`}>
                <MessageCircle className="size-4" aria-hidden />
                Contactar con {listing.seller.alias}
              </Link>
            </Button>
          ) : (
            <Alert>
              <AlertTitle>Este anuncio ya no admite mensajes</AlertTitle>
              <AlertDescription>
                El vendedor cerró la operación o retiró el artículo del catálogo.
              </AlertDescription>
            </Alert>
          )}

          <Separator />

          <section className="space-y-2">
            <h2 className="font-medium">Descripción</h2>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </section>

          {seller ? (
            <section className="space-y-2">
              <h2 className="font-medium">Vendedor</h2>
              <ProfileSummary profile={seller} />
            </section>
          ) : null}
        </div>
      </div>
    </article>
  )
}
