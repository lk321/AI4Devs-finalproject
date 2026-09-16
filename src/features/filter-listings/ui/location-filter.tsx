'use client'

import { CITIES } from '@/entities/listing'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Slider } from '@/shared/ui/slider'
import { DEFAULT_DISTANCE_KM } from '../model/store'
import { useFilterActions, useFilterValue } from '../model/context'

const ANYWHERE = '__anywhere__'

export function LocationFilter({ idPrefix }: { idPrefix: string }) {
  const city = useFilterValue('city')
  const distance = useFilterValue('distance')
  const { setCity, setValue } = useFilterActions()
  const cityLabelId = `${idPrefix}-city-label`
  const distanceLabelId = `${idPrefix}-distance-label`

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label id={cityLabelId}>Ciudad</Label>
        <Select
          value={city || ANYWHERE}
          onValueChange={(value) => setCity(value === ANYWHERE ? '' : value)}
        >
          <SelectTrigger id={`${idPrefix}-city`} aria-labelledby={cityLabelId} className="w-full">
            <SelectValue placeholder="Toda España" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANYWHERE}>Toda España</SelectItem>
            {CITIES.map((option) => (
              <SelectItem key={option.name} value={option.name}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-3" role="group" aria-labelledby={distanceLabelId}>
        <div className="flex items-baseline justify-between gap-2">
          <Label id={distanceLabelId}>Distancia máxima</Label>
          <span className="text-muted-foreground text-xs tabular-nums">
            {city ? `${distance ?? DEFAULT_DISTANCE_KM} km` : 'Elige una ciudad'}
          </span>
        </div>
        <Slider
          min={1}
          max={500}
          step={1}
          disabled={!city}
          value={[distance ?? DEFAULT_DISTANCE_KM]}
          onValueChange={([value]) => setValue('distance', value)}
        />
      </div>
    </div>
  )
}
