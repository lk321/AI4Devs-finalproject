import Link from 'next/link'
import { LockKeyhole } from 'lucide-react'
import { Button } from '@/shared/ui/button'

export function SignedOut() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-3 px-6 text-center">
      <LockKeyhole className="text-muted-foreground size-8" aria-hidden />
      <h1 className="text-xl font-semibold tracking-tight">Inicia sesión para ver tus mensajes</h1>
      <p className="text-muted-foreground text-sm text-pretty">
        Las conversaciones con compradores y vendedores son privadas: necesitas tu cuenta para
        abrirlas.
      </p>
      <Button asChild>
        <Link href="/login?next=/messages">Iniciar sesión</Link>
      </Button>
    </div>
  )
}
