import { notFound } from 'next/navigation'
import { CalendarDays, MapPin, PackageSearch } from 'lucide-react'
import { getProfileByAlias } from '@/entities/user/index.server'
import { Rating, UserAvatar } from '@/entities/user'
import { getSellerListings } from '@/entities/listing/index.server'
import { ListingCard, formatSince, isPubliclyVisible } from '@/entities/listing'
import { Card, CardContent } from '@/shared/ui/card'
import { Separator } from '@/shared/ui/separator'
import { toListingSummary } from '../model/to-listing-summary'

export async function ProfilePage({ params }: { params: Promise<{ alias: string }> }) {
  const { alias } = await params
  const profile = await getProfileByAlias(decodeURIComponent(alias))

  if (!profile) notFound()

  const rows = await getSellerListings(profile.id)
  const listings = rows
    .filter((row) => isPubliclyVisible(row.status))
    .map((row) => toListingSummary(row))

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10">
      <Card>
        <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <UserAvatar alias={profile.alias} className="size-16 text-base" />
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">{profile.alias}</h1>
              <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" aria-hidden />
                  {profile.city}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="size-3.5" aria-hidden />
                  En Loop Market {formatSince(profile.created_at).toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium">Valoración</p>
              <Rating value={profile.rating_average} className="text-sm" />
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Operaciones cerradas</p>
              <p className="text-muted-foreground text-sm">{profile.closed_deals}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-5">
        <h2 className="text-xl font-semibold tracking-tight">
          Anuncios publicados ({listings.length})
        </h2>
        {listings.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center gap-3 rounded-xl border border-dashed py-14 text-sm">
            <PackageSearch className="size-6" aria-hidden />
            <p>{profile.alias} todavía no tiene anuncios publicados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {listings.map((listing, index) => (
              <ListingCard key={listing.id} listing={listing} priority={index < 4} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
