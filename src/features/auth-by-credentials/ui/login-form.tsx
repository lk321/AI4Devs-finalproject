'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useHydrated } from '@/shared/lib/use-hydrated'
import { credentialsSchema, type Credentials } from '@/entities/user'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import type { SignInAction } from '../model/types'

export function LoginForm({ action, next }: { action: SignInAction; next?: string }) {
  const form = useForm<Credentials>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  })

  const rootError = form.formState.errors.root?.message
  const hydrated = useHydrated()
  const pending = form.formState.isSubmitting || !hydrated

  async function onSubmit(values: Credentials) {
    form.clearErrors('root')
    const result = await action(values, next)
    if (result?.error) form.setError('root', { message: result.error })
  }

  return (
    <Form {...form}>
      <form method="post" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {rootError ? (
          <Alert variant="destructive" role="alert">
            <AlertDescription>{rootError}</AlertDescription>
          </Alert>
        ) : null}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" placeholder="tu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          Entrar
        </Button>

        <p className="text-muted-foreground text-center text-sm">
          ¿Aún no tienes cuenta?{' '}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            Crear cuenta
          </Link>
        </p>
      </form>
    </Form>
  )
}
