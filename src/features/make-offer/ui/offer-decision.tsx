'use client'

import { useTransition } from 'react'
import { Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { resolveOffer } from '../api/actions'

export function OfferDecision({
  offerId,
  conversationId,
}: {
  offerId: string
  conversationId: string
}) {
  const [pending, startTransition] = useTransition()

  function decide(accept: boolean) {
    startTransition(async () => {
      const result = await resolveOffer(offerId, accept, conversationId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(accept ? 'Oferta aceptada, artículo reservado' : 'Oferta rechazada')
    })
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <Button type="button" size="sm" disabled={pending} onClick={() => decide(true)}>
        <Check className="size-4" aria-hidden />
        Aceptar
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => decide(false)}
      >
        <X className="size-4" aria-hidden />
        Rechazar
      </Button>
    </div>
  )
}
