'use client'

import { RotateCcw } from 'lucide-react'
import type { CategoryTree } from '@/entities/listing'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { useFilterActions } from '../model/context'
import { CategoryFilter } from './category-filter'
import { ConditionFilter } from './condition-filter'
import { LocationFilter } from './location-filter'
import { PriceFilter } from './price-filter'
import { TermFilter } from './term-filter'

export function FilterControls({
  categories,
  idPrefix,
}: {
  categories: CategoryTree[]
  idPrefix: string
}) {
  const { clear } = useFilterActions()

  return (
    <div className="space-y-5">
      <TermFilter idPrefix={idPrefix} />
      <Separator />
      <CategoryFilter categories={categories} idPrefix={idPrefix} />
      <Separator />
      <PriceFilter idPrefix={idPrefix} />
      <Separator />
      <ConditionFilter idPrefix={idPrefix} />
      <Separator />
      <LocationFilter idPrefix={idPrefix} />
      <Button type="button" variant="ghost" size="sm" className="w-full" onClick={clear}>
        <RotateCcw className="size-4" aria-hidden />
        Limpiar filtros
      </Button>
    </div>
  )
}
