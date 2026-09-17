'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import type { CategoryTree } from '@/entities/listing'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/sheet'
import { FilterControls } from './filter-controls'
import { useActiveFilterCount } from '../model/use-active-filter-count'

export function ListingFilters({ categories }: { categories: CategoryTree[] }) {
  const [open, setOpen] = useState(false)
  const active = useActiveFilterCount()

  return (
    <>
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button type="button" variant="outline" className="w-full">
              <SlidersHorizontal className="size-4" aria-hidden />
              Filtrar
              {active > 0 ? (
                <Badge variant="secondary" className="ml-1">
                  {active} activos
                </Badge>
              ) : null}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filtrar resultados</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-8">
              <FilterControls categories={categories} idPrefix="mobile" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <aside
        aria-label="Filtros de búsqueda"
        className="bg-card hidden rounded-xl border p-5 lg:block"
      >
        <FilterControls categories={categories} idPrefix="desktop" />
      </aside>
    </>
  )
}
