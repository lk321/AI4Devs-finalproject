import { Skeleton } from '@/shared/ui/skeleton'

function ListSkeleton() {
  return (
    <div className="flex min-h-0 flex-col border-r">
      <div className="border-b p-4">
        <Skeleton className="h-6 w-28" />
      </div>
      <div className="flex-1 space-y-px">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex gap-3 border-b p-3">
            <Skeleton className="size-14 shrink-0 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function MessagesLoading() {
  return (
    <div className="mx-auto grid w-full max-w-7xl flex-1 lg:grid-cols-[360px_1fr]">
      <ListSkeleton />
      <div className="hidden lg:block" />
    </div>
  )
}

export function ConversationLoading() {
  return (
    <div className="mx-auto grid w-full max-w-7xl flex-1 lg:grid-cols-[360px_1fr]">
      <div className="hidden lg:block">
        <ListSkeleton />
      </div>
      <div className="flex min-h-0 flex-col">
        <div className="flex items-center gap-3 border-b p-4">
          <Skeleton className="size-12 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex-1 space-y-4 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className={index % 2 ? 'ml-auto h-12 w-2/3' : 'h-12 w-2/3'} />
          ))}
        </div>
        <Skeleton className="m-4 h-24" />
      </div>
    </div>
  )
}
