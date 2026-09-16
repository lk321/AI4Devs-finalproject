'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { toQueryString, type ListingSearchParams } from '@/entities/listing'
import { Button } from '@/shared/ui/button'

function pageHref(params: ListingSearchParams, page: number) {
  const query = toQueryString({ ...params, page })
  return query ? `/search?${query}` : '/search'
}

function pageWindow(current: number, total: number) {
  const start = Math.max(1, Math.min(current - 2, total - 4))
  const end = Math.min(total, Math.max(current + 2, 5))
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

function StepButton({
  href,
  label,
  disabled,
  onPrefetch,
  children,
}: {
  href: string
  label: string
  disabled: boolean
  onPrefetch: () => void
  children: ReactNode
}) {
  if (disabled) {
    return (
      <Button type="button" variant="outline" size="sm" aria-label={label} disabled>
        {children}
      </Button>
    )
  }

  return (
    <Button asChild variant="outline" size="sm">
      <Link href={href} aria-label={label} onMouseEnter={onPrefetch}>
        {children}
      </Link>
    </Button>
  )
}

export function CatalogPagination({
  params,
  page,
  totalPages,
}: {
  params: ListingSearchParams
  page: number
  totalPages: number
}) {
  const router = useRouter()
  if (totalPages <= 1) return null

  const previous = Math.max(1, page - 1)
  const next = Math.min(totalPages, page + 1)

  return (
    <nav aria-label="Paginación de resultados" className="flex flex-wrap items-center gap-2">
      <StepButton
        href={pageHref(params, previous)}
        label="Página anterior"
        disabled={page === 1}
        onPrefetch={() => router.prefetch(pageHref(params, previous))}
      >
        <ChevronLeft className="size-4" aria-hidden />
        Anterior
      </StepButton>
      <ul className="flex items-center gap-1">
        {pageWindow(page, totalPages).map((target) => (
          <li key={target}>
            <Button asChild variant={target === page ? 'default' : 'ghost'} size="sm">
              <Link
                href={pageHref(params, target)}
                aria-current={target === page ? 'page' : undefined}
                aria-label={`Página ${target}`}
                onMouseEnter={() => router.prefetch(pageHref(params, target))}
              >
                {target}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
      <StepButton
        href={pageHref(params, next)}
        label="Página siguiente"
        disabled={page === totalPages}
        onPrefetch={() => router.prefetch(pageHref(params, next))}
      >
        Siguiente
        <ChevronRight className="size-4" aria-hidden />
      </StepButton>
    </nav>
  )
}
