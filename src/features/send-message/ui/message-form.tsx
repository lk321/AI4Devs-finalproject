'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { SendHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { MAX_MESSAGE_LENGTH, messageSchema, type MessageInput } from '../model/schema'
import { sendMessage } from '../api/actions'

export function MessageForm({
  conversationId,
  disabled,
  disabledReason,
}: {
  conversationId: string
  disabled?: boolean
  disabledReason?: string
}) {
  const form = useForm<MessageInput>({
    resolver: zodResolver(messageSchema),
    defaultValues: { conversationId, body: '' },
  })

  const body = useWatch({ control: form.control, name: 'body' }) ?? ''
  const pending = form.formState.isSubmitting

  async function onSubmit(values: MessageInput) {
    const result = await sendMessage(values)
    if (result.error) {
      toast.error(result.error)
      return
    }
    form.reset({ conversationId, body: '' })
  }

  if (disabled) {
    return (
      <p className="text-muted-foreground border-t px-4 py-4 text-sm">
        {disabledReason ?? 'Esta conversación ya no admite mensajes'}
      </p>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 border-t p-4">
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Mensaje</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  maxLength={MAX_MESSAGE_LENGTH}
                  placeholder="Escribe tu mensaje"
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground text-xs tabular-nums">
            {body.length} / {MAX_MESSAGE_LENGTH}
          </span>
          <Button type="submit" size="sm" disabled={pending}>
            <SendHorizontal className="size-4" aria-hidden />
            {pending ? 'Enviando…' : 'Enviar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
