import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import { cn } from '@/shared/lib/cn'

export function UserAvatar({ alias, className }: { alias: string; className?: string }) {
  return (
    <Avatar className={cn('size-9', className)}>
      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold uppercase">
        {alias.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  )
}
