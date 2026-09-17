import { SearchX } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'

const SUGGESTIONS = [
  'Prueba con menos palabras o términos más generales.',
  'Amplía el rango de precio o quita el precio máximo.',
  'Marca más estados de conservación.',
  'Aumenta la distancia máxima o busca en toda España.',
]

export function CatalogEmpty() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center">
        <SearchX className="text-muted-foreground size-10" aria-hidden />
        <div className="space-y-1.5">
          <h3 className="text-lg font-medium">No hay anuncios que encajen con tu búsqueda</h3>
          <p className="text-muted-foreground text-sm">
            Amplía la búsqueda con alguna de estas ideas:
          </p>
        </div>
        <ul className="text-muted-foreground max-w-md space-y-1.5 text-sm">
          {SUGGESTIONS.map((suggestion) => (
            <li key={suggestion}>{suggestion}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
