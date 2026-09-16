import { PAGE_SIZE, parseSearchParams } from '@/entities/listing'
import { getCategoryTree, searchListings } from '@/entities/listing/index.server'
import { FilterStoreProvider, ListingFilters } from '@/features/filter-listings'
import { ListingCatalog } from '@/widgets/listing-catalog'

async function resolveResults(params: ReturnType<typeof parseSearchParams>) {
  const result = await searchListings(params)
  if (result.items.length > 0 || params.page === 1) return result

  const first = await searchListings({ ...params, page: 1 })
  const lastPage = Math.max(1, Math.ceil(first.total / PAGE_SIZE))
  if (lastPage === 1) return first
  return searchListings({ ...params, page: lastPage })
}

export async function SearchPage({ searchParams }: PageProps<'/search'>) {
  const raw = await searchParams
  const params = parseSearchParams(raw)
  const [categories, result] = await Promise.all([getCategoryTree(), resolveResults(params)])

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:py-10">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Catálogo</h1>
        <p className="text-muted-foreground text-sm">
          Acota por categoría, precio, estado y cercanía. La URL guarda tu búsqueda para
          compartirla.
        </p>
      </header>
      <FilterStoreProvider params={params}>
        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
          <ListingFilters categories={categories} />
          <ListingCatalog
            params={params}
            items={result.items}
            total={result.total}
            page={result.page}
            invalidPriceRange={params.invalidPriceRange}
          />
        </div>
      </FilterStoreProvider>
    </div>
  )
}
