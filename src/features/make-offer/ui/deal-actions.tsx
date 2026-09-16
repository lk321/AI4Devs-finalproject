'use client'

import { useTransition } from 'react'
import { BadgeCheck, Undo2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { markListingSold, releaseReservation } from '../api/actions'

export function DealActions({
  listingId,
  conversationId,
}: {
  listingId: string
  conversationId: string
}) {
  const [pending, startTransition] = useTransition()

  function run(action: 'sold' | 'release') {
    startTransition(async () => {
      const result =
        action === 'sold'
          ? await markListingSold(listingId, conversationId)
          : await releaseReservation(listingId, conversationId)

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success(action === 'sold' ? 'Venta cerrada' : 'Reserva liberada')
    })
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" size="sm" disabled={pending} onClick={() => run('sold')}>
        <BadgeCheck className="size-4" aria-hidden />
        Marcar como vendido
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => run('release')}
      >
        <Undo2 className="size-4" aria-hidden />
        Liberar reserva
      </Button>
    </div>
  )
}
