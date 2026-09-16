import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus } from 'lucide-react'
import { getSessionUser } from '@/shared/api/server'
import { Button } from '@/shared/ui/button'
import { STATUS_LABELS, type ListingStatus } from '@/entities/listing'
import { getSellerListings } from '@/entities/listing/index.server'
import { ListingRow } from './listing-row'
import type { SellerListing } from '../model/types'

const GROUPS: ListingStatus[] = ['draft', 'published', 'reserved', 'sold', 'archived']

export async function AccountListingsPage() {
  const user = await getSessionUser()
  if (!user) redirect('/login?next=%2Faccount%2Flistings')

  const listings = (await getSellerListings(user.id)) as SellerListing[]

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Mis anuncios</h1>
          <p className="text-muted-foreground">
            {listings.length === 0
              ? 'Todavía no has publicado nada.'
              : `${listings.length} anuncios en total.`}
          </p>
        </div>
        <Button asChild>
          <Link href="/sell">
            <Plus className="size-4" aria-hidden />
            Publicar artículo
          </Link>
        </Button>
      </header>

      {listings.length === 0 ? (
        <p className="text-muted-foreground rounded-xl border border-dashed p-10 text-center text-sm">
          Empieza publicando el primer artículo que ya no uses.
        </p>
      ) : null}

      {GROUPS.map((status) => {
        const group = listings.filter((listing) => listing.status === status)
        if (!group.length) return null

        return (
          <section key={status} className="space-y-3">
            <h2 className="text-lg font-medium tracking-tight">
              {STATUS_LABELS[status]}
              <span className="text-muted-foreground ml-2 text-sm font-normal">{group.length}</span>
            </h2>
            <ul className="space-y-3">
              {group.map((listing) => (
                <ListingRow key={listing.id} listing={listing} />
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
