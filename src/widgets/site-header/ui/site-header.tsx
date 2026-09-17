import Link from 'next/link'
import { Suspense } from 'react'
import { Repeat2, Plus } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { SearchBox } from './search-box'
import { ThemeToggle } from './theme-toggle'
import { UserMenu } from './user-menu'

export function SiteHeader() {
  return (
    <header className="bg-background/85 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
          <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-lg">
            <Repeat2 className="size-4" aria-hidden />
          </span>
          <span className="hidden sm:inline">Loop Market</span>
        </Link>

        <Suspense fallback={<Skeleton className="h-11 flex-1" />}>
          <SearchBox className="flex-1" />
        </Suspense>

        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link href="/sell">
            <Plus className="size-4" aria-hidden /> Vender
          </Link>
        </Button>
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
