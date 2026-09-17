import Link from 'next/link'
import { PackageOpen } from 'lucide-react'
import { Button } from '@/shared/ui/button'

export function ListingNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <PackageOpen className="text-muted-foreground size-10" aria-hidden />
      <h1 className="text-2xl font-semibold tracking-tight">Este anuncio no está disponible</h1>
      <p className="text-muted-foreground text-sm">
        Puede que se haya retirado, que todavía sea un borrador de su autor o que el enlace no sea
        correcto.
      </p>
      <Button asChild>
        <Link href="/search">Explorar el catálogo</Link>
      </Button>
    </div>
  )
}
