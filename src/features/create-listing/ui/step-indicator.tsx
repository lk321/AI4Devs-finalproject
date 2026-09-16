'use client'

import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { STEPS } from '../model/steps'

export function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-2 sm:gap-3" aria-label="Pasos de publicación">
      {STEPS.map((step, index) => {
        const done = index < current
        const active = index === current

        return (
          <li
            key={step.id}
            aria-current={active ? 'step' : undefined}
            className={cn(
              'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors',
              active && 'border-primary bg-primary/10 text-primary font-medium',
              done && 'text-muted-foreground',
              !active && !done && 'text-muted-foreground border-dashed',
            )}
          >
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded-full text-xs',
                active ? 'bg-primary text-primary-foreground' : 'bg-muted',
              )}
              aria-hidden
            >
              {done ? <Check className="size-3" /> : index + 1}
            </span>
            {step.label}
          </li>
        )
      })}
    </ol>
  )
}
