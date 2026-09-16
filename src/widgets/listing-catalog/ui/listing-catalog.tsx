import { TriangleAlert } from 'lucide-react'
import {
  ListingCard,
  PAGE_SIZE,
  type ListingSearchParams,
  type ListingSummary,
} from '@/entities/listing'
import { SortSelect } from '@/features/filter-listings'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { CatalogEmpty } from './catalog-empty'
import { CatalogPagination } from './catalog-pagination'

function summary(total: number) {
  if (total === 0) return 'Sin coincidencias'
  if (total === 1) return '1 anuncio encontrado'
  return `${total.toLocaleString('es-ES')} anuncios encontrados`
}

export function ListingCatalog({
  params,
  items,
  total,
  page,
  invalidPriceRange = false,
}: {
  params: ListingSearchParams
  items: ListingSummary[]
  total: number
  page: number
  invalidPriceRange?: boolean
}) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <section className="space-y-5" aria-label="Resultados de la búsqueda">
      {invalidPriceRange ? (
        <Alert variant="destructive">
          <TriangleAlert className="size-4" aria-hidden />
          <AlertDescription>
            El precio mínimo supera al máximo, así que no se ha aplicado el filtro de precio.
          </AlertDescription>
        </Alert>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-muted-foreground text-sm">
          {summary(total)}
        </p>
        <SortSelect />
      </div>
      {items.length === 0 ? (
        <CatalogEmpty />
      ) : (
        <>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((listing, index) => (
              <li key={listing.id}>
                <ListingCard listing={listing} priority={index < 3} />
              </li>
            ))}
          </ul>
          <CatalogPagination params={params} page={page} totalPages={totalPages} />
        </>
      )}
    </section>
  )
}
