import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Repeat2 } from 'lucide-react'
import { getSessionUser } from '@/shared/api/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { DEFAULT_REDIRECT, SignUpForm, signUpAction } from '@/features/auth-by-credentials'

export async function SignUpPage() {
  if (await getSessionUser()) redirect(DEFAULT_REDIRECT)

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-10 sm:py-16">
      <Link href="/" className="text-primary flex items-center justify-center gap-2 font-semibold">
        <Repeat2 className="size-5" aria-hidden />
        Loop Market
      </Link>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crear cuenta</CardTitle>
          <CardDescription>
            Publica, negocia y cierra tus operaciones con una identidad que el resto reconoce.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm action={signUpAction} />
        </CardContent>
      </Card>
    </div>
  )
}
