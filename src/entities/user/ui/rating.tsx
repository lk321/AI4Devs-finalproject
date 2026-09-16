import { Star } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export function Rating({ value, className }: { value: number | null; className?: string }) {
  if (value === null) {
    return <span className={cn('text-muted-foreground text-xs', className)}>Sin valoraciones</span>
  }

  return (
    <span
      className={cn('inline-flex items-center gap-1 text-xs font-medium', className)}
      aria-label={`Valoración media ${value} sobre 5`}
    >
      <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden />
      {value.toFixed(2)}
    </span>
  )
}
