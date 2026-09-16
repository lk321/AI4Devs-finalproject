import { ListingCardSkeleton } from '@/entities/listing'
import { Skeleton } from '@/shared/ui/skeleton'

export function CatalogLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10">
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4 max-w-2xl" />
        <Skeleton className="h-6 w-1/2 max-w-md" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <ListingCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}
