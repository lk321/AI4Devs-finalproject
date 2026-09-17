import { ListingCardSkeleton, PAGE_SIZE } from '@/entities/listing'
import { Skeleton } from '@/shared/ui/skeleton'

export function CatalogSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-5">
      <Skeleton className="h-5 w-40" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: Math.min(count, PAGE_SIZE) }, (_, index) => (
          <ListingCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}
