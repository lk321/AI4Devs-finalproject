import { CatalogSkeleton } from '@/widgets/listing-catalog'
import { Skeleton } from '@/shared/ui/skeleton'

export function SearchLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:py-10">
      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
        <Skeleton className="hidden h-[540px] w-full rounded-xl lg:block" />
        <CatalogSkeleton count={9} />
      </div>
    </div>
  )
}
