'use client'

import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { useFilterActions, useFilterValue } from '../model/context'
import { hasInvalidPriceRange } from '../model/store'

function parseAmount(raw: string) {
  const value = Number(raw)
  if (raw.trim() === '' || Number.isNaN(value)) return undefined
  return Math.max(0, Math.trunc(value))
}

export function PriceFilter({ idPrefix }: { idPrefix: string }) {
  const min = useFilterValue('min')
  const max = useFilterValue('max')
  const { setValue } = useFilterActions()
  const invalid = hasInvalidPriceRange({ min, max })
  const messageId = `${idPrefix}-price-error`

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm leading-none font-medium">Precio (€)</legend>
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-min`} className="text-muted-foreground text-xs font-normal">
            Precio mínimo
          </Label>
          <Input
            id={`${idPrefix}-min`}
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="0"
            value={min ?? ''}
            aria-invalid={invalid}
            aria-describedby={invalid ? messageId : undefined}
            onChange={(event) => setValue('min', parseAmount(event.target.value))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-max`} className="text-muted-foreground text-xs font-normal">
            Precio máximo
          </Label>
          <Input
            id={`${idPrefix}-max`}
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Sin límite"
            value={max ?? ''}
            aria-invalid={invalid}
            aria-describedby={invalid ? messageId : undefined}
            onChange={(event) => setValue('max', parseAmount(event.target.value))}
          />
        </div>
      </div>
      {invalid ? (
        <p id={messageId} role="alert" className="text-destructive text-xs">
          El precio mínimo no puede superar al máximo: no se aplica el filtro de precio.
        </p>
      ) : null}
    </fieldset>
  )
}
