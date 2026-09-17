'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useHydrated } from '@/shared/lib/use-hydrated'
import { useForm, useWatch } from 'react-hook-form'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group'
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
import { cn } from '@/shared/lib/cn'
import { MAX_REVIEW_COMMENT, reviewSchema, type ReviewInput } from '../model/schema'
import { submitReview } from '../api/actions'

const SCORES = [1, 2, 3, 4, 5] as const

export function ReviewDialog({
  listingId,
  subjectId,
  subjectAlias,
  conversationId,
}: {
  listingId: string
  subjectId: string
  subjectAlias: string
  conversationId: string
}) {
  const [open, setOpen] = useState(false)

  const hydrated = useHydrated()
  const form = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { listingId, subjectId, score: 5, comment: '' },
  })

  const comment = useWatch({ control: form.control, name: 'comment' }) ?? ''

  async function onSubmit(values: ReviewInput) {
    const result = await submitReview(values, conversationId)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success('Valoración registrada')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm">
          <Star className="size-4" aria-hidden />
          Valorar a {subjectAlias}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Valorar la operación</DialogTitle>
          <DialogDescription>
            Solo puedes valorar una vez y durante los 30 días siguientes al cierre.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form method="post" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Puntuación</FormLabel>
                  <FormControl>
                    <RadioGroup
                      className="flex gap-1"
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      {SCORES.map((score) => (
                        <FormItem key={score} className="flex items-center">
                          <FormControl>
                            <RadioGroupItem value={String(score)} className="sr-only" />
                          </FormControl>
                          <FormLabel
                            className={cn(
                              'cursor-pointer rounded-md p-1',
                              score <= field.value ? 'text-amber-500' : 'text-muted-foreground',
                            )}
                          >
                            <Star
                              className={cn('size-6', score <= field.value && 'fill-current')}
                              aria-hidden
                            />
                            <span className="sr-only">
                              {score} {score === 1 ? 'estrella' : 'estrellas'}
                            </span>
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentario (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      maxLength={MAX_REVIEW_COMMENT}
                      placeholder="Cuenta cómo fue la operación"
                    />
                  </FormControl>
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {comment.length} / {MAX_REVIEW_COMMENT}
                  </span>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting || !hydrated}>
                {form.formState.isSubmitting ? 'Enviando…' : 'Enviar valoración'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
