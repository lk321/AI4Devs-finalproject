import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/cn'
import { STATUS_LABELS } from '../model/labels'
import type { ListingStatus } from '../model/types'

const TONES: Record<ListingStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  published: 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400',
  reserved: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  sold: 'bg-slate-900/10 text-slate-700 dark:text-slate-300',
  archived: 'bg-muted text-muted-foreground',
}

export function StatusBadge({ status, className }: { status: ListingStatus; className?: string }) {
  return (
    <Badge variant="secondary" className={cn('border-0 font-medium', TONES[status], className)}>
      {STATUS_LABELS[status]}
    </Badge>
  )
}
