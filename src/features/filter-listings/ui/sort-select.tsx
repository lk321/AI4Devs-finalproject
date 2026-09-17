'use client'

import { SORT_LABELS, SORT_OPTIONS, type ListingSearchParams } from '@/entities/listing'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { useFilterActions, useFilterValue } from '../model/context'

export function SortSelect() {
  const sort = useFilterValue('sort')
  const { setValue } = useFilterActions()

  return (
    <div className="flex items-center gap-2">
      <Label id="sort-label" className="text-muted-foreground shrink-0 text-xs font-normal">
        Ordenar por
      </Label>
      <Select
        value={sort}
        onValueChange={(value) => setValue('sort', value as ListingSearchParams['sort'])}
      >
        <SelectTrigger id="sort" aria-labelledby="sort-label" size="sm" className="w-[190px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {SORT_LABELS[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
