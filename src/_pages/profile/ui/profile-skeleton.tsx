import { ListingCardSkeleton } from '@/entities/listing'
import { Card, CardContent } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'

export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10">
      <Card>
        <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <Skeleton className="size-16 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[0, 1, 2].map((slot) => (
              <div key={slot} className="space-y-2">
                <Skeleton className="h-6 w-14" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="space-y-5">
        <Skeleton className="h-7 w-48" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((slot) => (
            <ListingCardSkeleton key={slot} />
          ))}
        </div>
      </div>
    </div>
  )
}
