import { Skeleton } from '@/shared/ui/skeleton'

export function AccountListingsSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-xl sm:h-28" />
        ))}
      </div>
    </div>
  )
}
