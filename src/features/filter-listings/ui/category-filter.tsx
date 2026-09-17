'use client'

import type { CategoryTree } from '@/entities/listing'
import { Label } from '@/shared/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { useFilterActions, useFilterValue } from '../model/context'

const ALL = '__all__'

export function CategoryFilter({
  categories,
  idPrefix,
}: {
  categories: CategoryTree[]
  idPrefix: string
}) {
  const category = useFilterValue('category')
  const { setValue } = useFilterActions()
  const labelId = `${idPrefix}-category-label`

  return (
    <div className="space-y-2">
      <Label id={labelId}>Categoría</Label>
      <Select
        value={category || ALL}
        onValueChange={(value) => setValue('category', value === ALL ? '' : value)}
      >
        <SelectTrigger id={`${idPrefix}-category`} aria-labelledby={labelId} className="w-full">
          <SelectValue placeholder="Todas las categorías" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Todas las categorías</SelectItem>
          {categories.map((root) => (
            <SelectGroup key={root.id}>
              <SelectLabel>{root.name}</SelectLabel>
              <SelectItem value={root.slug}>Todo en {root.name}</SelectItem>
              {root.children.map((child) => (
                <SelectItem key={child.id} value={child.slug} className="pl-8">
                  {child.name}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
