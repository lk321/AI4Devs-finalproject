'use client'

import { Search } from 'lucide-react'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { useFilterActions, useFilterValue } from '../model/context'

export function TermFilter({ idPrefix }: { idPrefix: string }) {
  const q = useFilterValue('q')
  const { setValue } = useFilterActions()
  const id = `${idPrefix}-term`

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Buscar</Label>
      <div className="relative">
        <Search
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden
        />
        <Input
          id={id}
          type="search"
          value={q}
          placeholder="Bicicleta, portátil, guitarra…"
          className="pl-9"
          onChange={(event) => setValue('q', event.target.value)}
        />
      </div>
    </div>
  )
}
