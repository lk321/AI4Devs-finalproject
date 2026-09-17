'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, MessagesSquare, Package, UserRound } from 'lucide-react'
import { createClient } from '@/shared/api/browser'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { UserAvatar, useSession } from '@/entities/user'

export function UserMenu() {
  const profile = useSession()
  const router = useRouter()

  if (!profile) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/login">Entrar</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/signup">Crear cuenta</Link>
        </Button>
      </div>
    )
  }

  async function signOut() {
    await createClient().auth.signOut()
    router.refresh()
    router.push('/')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Menú de ${profile.alias}`}>
          <UserAvatar alias={profile.alias} className="size-8" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem asChild>
          <Link href={`/profile/${profile.alias}`}>
            <UserRound className="size-4" aria-hidden /> Mi perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/listings">
            <Package className="size-4" aria-hidden /> Mis anuncios
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/messages">
            <MessagesSquare className="size-4" aria-hidden /> Mensajes
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={signOut}>
          <LogOut className="size-4" aria-hidden /> Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
