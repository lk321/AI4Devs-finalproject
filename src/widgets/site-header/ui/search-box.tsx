'use client'

import { useState, type FormEvent } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/shared/ui/input'

export function SearchBox({ className }: { className?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const committed = params.get('q') ?? ''
  const [term, setTerm] = useState(committed)
  const [synced, setSynced] = useState(committed)

  if (synced !== committed) {
    setSynced(committed)
    setTerm(committed)
  }

  function submit(event: FormEvent) {
    event.preventDefault()

    const next = new URLSearchParams(pathname === '/search' ? params.toString() : '')
    const trimmed = term.trim()

    if (trimmed) next.set('q', trimmed)
    else next.delete('q')
    next.delete('page')

    const query = next.toString()
    router.push(query ? `/search?${query}` : '/search', { scroll: false })
  }

  return (
    <form role="search" onSubmit={submit} className={className}>
      <label htmlFor="site-search" className="sr-only">
        Buscar artículos
      </label>
      <div className="relative">
        <Search
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden
        />
        <Input
          id="site-search"
          name="q"
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          onFocus={() => router.prefetch('/search')}
          placeholder="Busca bicicletas, portátiles, guitarras…"
          className="bg-background h-11 pl-9"
        />
      </div>
    </form>
  )
}
