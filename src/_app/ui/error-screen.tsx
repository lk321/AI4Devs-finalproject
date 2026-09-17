'use client'

import { AlertTriangle } from 'lucide-react'
import { Button } from '@/shared/ui/button'

export function ErrorScreen({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <AlertTriangle className="text-destructive size-10" aria-hidden />
      <h1 className="text-2xl font-semibold tracking-tight">Algo se ha roto</h1>
      <p className="text-muted-foreground text-sm">
        No hemos podido cargar esta página. Vuelve a intentarlo en un momento.
      </p>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  )
}
