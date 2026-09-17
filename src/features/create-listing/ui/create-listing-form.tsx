'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Loader2, Rocket, Save } from 'lucide-react'
import { toast } from 'sonner'
import { listingDraftSchema, type CategoryTree, type ListingDraft } from '@/entities/listing'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/shared/ui/card'
import { Form } from '@/shared/ui/form'
import { createListingAction } from '../api/actions'
import { EMPTY_DRAFT, STEPS } from '../model/steps'
import { ImagesStep } from './images-step'
import { ItemStep } from './item-step'
import { PriceStep } from './price-step'
import { StepIndicator } from './step-indicator'

export function CreateListingForm({ categories }: { categories: CategoryTree[] }) {
  const [step, setStep] = useState(0)
  const [pending, startTransition] = useTransition()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const mounted = useRef(false)

  const form = useForm<ListingDraft>({
    resolver: zodResolver(listingDraftSchema),
    mode: 'onTouched',
    defaultValues: EMPTY_DRAFT as unknown as ListingDraft,
  })

  useEffect(() => {
    if (mounted.current) headingRef.current?.focus()
    mounted.current = true
  }, [step])

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  async function goNext() {
    const valid = await form.trigger(current.fields)
    if (valid) setStep((value) => value + 1)
  }

  function submit(publish: boolean) {
    return form.handleSubmit((values) =>
      startTransition(async () => {
        const result = await createListingAction(values, { publish })
        if (result?.error) toast.error(result.error)
      }),
    )
  }

  return (
    <Form {...form}>
      <form method="post" className="space-y-6" onSubmit={(event) => event.preventDefault()}>
        <StepIndicator current={step} />

        <Card>
          <CardHeader>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="text-xl font-semibold tracking-tight outline-none"
            >
              {current.heading}
            </h2>
            <CardDescription>{current.hint}</CardDescription>
          </CardHeader>
          <CardContent>
            {current.id === 'item' ? <ItemStep form={form} categories={categories} /> : null}
            {current.id === 'images' ? <ImagesStep form={form} /> : null}
            {current.id === 'price' ? <PriceStep form={form} categories={categories} /> : null}
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            disabled={step === 0 || pending}
            onClick={() => setStep((value) => value - 1)}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Atrás
          </Button>

          {isLast ? (
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="outline" disabled={pending} onClick={submit(false)}>
                <Save className="size-4" aria-hidden />
                Guardar borrador
              </Button>
              <Button type="button" disabled={pending} onClick={submit(true)}>
                {pending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Rocket className="size-4" aria-hidden />
                )}
                Publicar anuncio
              </Button>
            </div>
          ) : (
            <Button type="button" onClick={goNext}>
              Continuar
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
