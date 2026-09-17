'use client'

import { CONDITION_LABELS, LISTING_CONDITIONS } from '@/entities/listing'
import { Checkbox } from '@/shared/ui/checkbox'
import { Label } from '@/shared/ui/label'
import { useFilterActions, useFilterValue } from '../model/context'

export function ConditionFilter({ idPrefix }: { idPrefix: string }) {
  const condition = useFilterValue('condition')
  const { toggleCondition } = useFilterActions()

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm leading-none font-medium">Estado de conservación</legend>
      <div className="space-y-2.5 pt-2">
        {LISTING_CONDITIONS.map((value) => {
          const id = `${idPrefix}-condition-${value}`
          return (
            <div key={value} className="flex items-center gap-2.5">
              <Checkbox
                id={id}
                checked={condition.includes(value)}
                onCheckedChange={() => toggleCondition(value)}
              />
              <Label htmlFor={id} className="font-normal">
                {CONDITION_LABELS[value]}
              </Label>
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}
