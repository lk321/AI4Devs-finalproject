'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Archive, BadgeCheck, RotateCcw, Rocket } from 'lucide-react'
import { toast } from 'sonner'
import type { ListingStatus } from '@/entities/listing'
import { Button } from '@/shared/ui/button'
import {
  archiveListing,
  markListingSold,
  publishListing,
  releaseListingReservation,
} from '../api/actions'
import type { ManageListingResult } from '../api/actions'
import { ConfirmButton } from './confirm-button'

type Props = { id: string; status: ListingStatus }

export function ListingActions({ id, status }: Props) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const run = (action: () => Promise<ManageListingResult>, success: string) =>
    startTransition(async () => {
      const result = await action()
      if ('error' in result) {
        toast.error(result.error)
        return
      }
      toast.success(success)
    })

  if (status === 'archived') {
    return <p className="text-muted-foreground text-sm">Este anuncio está archivado.</p>
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === 'draft' ? (
        <Button
          type="button"
          size="sm"
          disabled={pending}
          onMouseEnter={() => router.prefetch(`/listings/${id}`)}
          onClick={() =>
            startTransition(async () => {
              const result = await publishListing(id)
              if (result && 'error' in result) toast.error(result.error)
            })
          }
        >
          <Rocket className="size-4" aria-hidden />
          Publicar
        </Button>
      ) : null}

      {status === 'reserved' ? (
        <>
          <ConfirmButton
            label="Marcar vendido"
            title="¿Cerrar la venta?"
            description="El anuncio pasará a vendido y podrás valorar a la otra parte."
            confirmLabel="Marcar como vendido"
            icon={<BadgeCheck className="size-4" aria-hidden />}
            disabled={pending}
            onConfirm={() => run(() => markListingSold(id), 'Venta cerrada')}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => run(() => releaseListingReservation(id), 'Reserva liberada')}
          >
            <RotateCcw className="size-4" aria-hidden />
            Liberar reserva
          </Button>
        </>
      ) : null}

      {status === 'published' || status === 'sold' ? (
        <ConfirmButton
          label="Archivar"
          title="¿Archivar el anuncio?"
          description="Dejará de aparecer en el catálogo y en las búsquedas."
          confirmLabel="Archivar"
          icon={<Archive className="size-4" aria-hidden />}
          disabled={pending}
          onConfirm={() => run(() => archiveListing(id), 'Anuncio archivado')}
        />
      ) : null}
    </div>
  )
}
