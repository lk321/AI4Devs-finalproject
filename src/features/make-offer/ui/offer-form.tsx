'use client'

import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useHydrated } from '@/shared/lib/use-hydrated'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { HandCoins } from 'lucide-react'
import { toast } from 'sonner'
import { formatPrice } from '@/entities/listing'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { centsToEuro, euroToCents } from '../model/schema'
import { createOffer } from '../api/actions'

export function OfferForm({
  conversationId,
  listingPriceCents,
  hasPendingOffer,
}: {
  conversationId: string
  listingPriceCents: number
  hasPendingOffer: boolean
}) {
  const [open, setOpen] = useState(false)

  const schema = useMemo(
    () =>
      z.object({
        amount: z
          .number({ message: 'Indica un importe' })
          .positive('El importe debe ser mayor que cero')
          .max(centsToEuro(listingPriceCents), 'La oferta no puede superar el precio publicado'),
      }),
    [listingPriceCents],
  )

  const hydrated = useHydrated()
  const form = useForm<{ amount: number }>({
    resolver: zodResolver(schema),
    defaultValues: { amount: centsToEuro(listingPriceCents) },
  })

  async function onSubmit(values: { amount: number }) {
    const result = await createOffer({
      conversationId,
      amountCents: euroToCents(values.amount),
    })

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Oferta enviada')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <HandCoins className="size-4" aria-hidden />
          {hasPendingOffer ? 'Cambiar mi oferta' : 'Hacer una oferta'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Proponer un precio</DialogTitle>
          <DialogDescription>
            El anuncio está publicado a {formatPrice(listingPriceCents)}. Tu oferta no puede
            superarlo.
            {hasPendingOffer ? ' Tu oferta anterior quedará superada.' : ''}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form method="post" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Importe en euros</FormLabel>
                  <FormControl>
                    <Input
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      value={Number.isFinite(field.value) ? field.value : ''}
                      onChange={(event) => field.onChange(event.target.valueAsNumber)}
                      type="number"
                      min={0.01}
                      step={0.01}
                      max={centsToEuro(listingPriceCents)}
                      inputMode="decimal"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting || !hydrated}>
                {form.formState.isSubmitting ? 'Enviando…' : 'Enviar oferta'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
