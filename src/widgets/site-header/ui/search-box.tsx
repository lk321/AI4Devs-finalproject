'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Input } from '@/shared/ui/input'

export function SearchBox({ className }: { className?: string }) {
  const router = useRouter()
  const params = useSearchParams()
  const [term, setTerm] = useState(params.get('q') ?? '')

  function submit(event: FormEvent) {
    event.preventDefault()
    const next = new URLSearchParams()
    if (term.trim()) next.set('q', term.trim())
    router.push(`/search?${next.toString()}`)
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
