import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Repeat2 } from 'lucide-react'
import { getSessionUser } from '@/shared/api/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { LoginForm, safeNextPath, signInAction } from '@/features/auth-by-credentials'

export async function LoginPage({ searchParams }: { searchParams?: Promise<{ next?: string }> }) {
  const { next } = (await searchParams) ?? {}
  const target = safeNextPath(next)

  if (await getSessionUser()) redirect(target)

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-10 sm:py-16">
      <Link href="/" className="text-primary flex items-center justify-center gap-2 font-semibold">
        <Repeat2 className="size-5" aria-hidden />
        Loop Market
      </Link>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Entrar</CardTitle>
          <CardDescription>Accede con tu email y tu contraseña.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm action={signInAction} next={target} />
        </CardContent>
      </Card>
    </div>
  )
}
