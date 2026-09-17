'use client'

import Image from 'next/image'
import { MapPin } from 'lucide-react'
import {
  CONDITION_LABELS,
  formatPrice,
  type CategoryTree,
  type ListingDraft,
} from '@/entities/listing'
import { Badge } from '@/shared/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'

type Props = { draft: ListingDraft; categories: CategoryTree[] }

function categoryName(categories: CategoryTree[], slug: string) {
  for (const root of categories) {
    const child = root.children.find((item) => item.slug === slug)
    if (child) return `${root.name} · ${child.name}`
  }
  return 'Sin categoría'
}

export function ListingPreview({ draft, categories }: Props) {
  const cover = draft.images?.[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Vista previa</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-[minmax(0,240px)_1fr]">
        <div className="bg-muted relative aspect-4/3 overflow-hidden rounded-lg">
          {cover ? (
            <Image src={cover.url} alt={cover.alt} fill sizes="240px" className="object-cover" />
          ) : (
            <span className="text-muted-foreground absolute inset-0 grid place-items-center text-xs">
              Sin fotos
            </span>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-semibold tracking-tight">
            {draft.priceCents ? formatPrice(draft.priceCents) : 'Sin precio'}
          </p>
          <h3 className="text-lg font-medium">{draft.title || 'Sin título'}</h3>
          <div className="flex flex-wrap items-center gap-2">
            {draft.condition ? (
              <Badge variant="secondary">{CONDITION_LABELS[draft.condition]}</Badge>
            ) : null}
            <Badge variant="outline">{categoryName(categories, draft.categorySlug)}</Badge>
            {draft.city ? (
              <span className="text-muted-foreground inline-flex items-center gap-1 text-sm">
                <MapPin className="size-3.5" aria-hidden />
                {draft.city}
              </span>
            ) : null}
          </div>
          <p className="text-muted-foreground text-sm whitespace-pre-line">
            {draft.description || 'Sin descripción'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
