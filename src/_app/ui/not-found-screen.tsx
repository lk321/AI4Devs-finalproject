import Link from 'next/link'
import { SearchX } from 'lucide-react'
import { Button } from '@/shared/ui/button'

export function NotFoundScreen() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <SearchX className="text-muted-foreground size-10" aria-hidden />
      <h1 className="text-2xl font-semibold tracking-tight">Aquí no hay nada</h1>
      <p className="text-muted-foreground text-sm">
        El anuncio o el perfil que buscas ya no está disponible.
      </p>
      <Button asChild>
        <Link href="/search">Volver al catálogo</Link>
      </Button>
    </div>
  )
}
