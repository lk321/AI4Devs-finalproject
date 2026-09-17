import Link from 'next/link'
import { ArrowRight, ShieldCheck, Sparkles, Tag } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { ListingCard, searchParamsSchema } from '@/entities/listing'
import { searchListings } from '@/entities/listing/index.server'
import { CategoryRail } from './category-rail'

const CLAIMS = [
  {
    icon: Tag,
    title: 'Publica en minutos',
    body: 'Tres pasos, hasta ocho fotos y tu anuncio ya está en el catálogo.',
  },
  {
    icon: ShieldCheck,
    title: 'Identidad verificada',
    body: 'Cada perfil acumula valoraciones de operaciones realmente cerradas.',
  },
  {
    icon: Sparkles,
    title: 'Negocia y cierra aquí',
    body: 'Ofertas, reserva y venta quedan registradas en la conversación.',
  },
]

export async function HomePage() {
  const { items } = await searchListings(searchParamsSchema.parse({ sort: 'newest' }))

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-10 sm:py-14">
      <section className="space-y-6">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Lo que ya no usas vale para alguien que lo necesita
          </h1>
          <p className="text-muted-foreground text-lg text-pretty">
            Publica, negocia y cierra la venta en un solo sitio. Sin perseguir a nadie por chats
            sueltos.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/sell">
                Vender un artículo <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/search">Explorar el catálogo</Link>
            </Button>
          </div>
        </div>
        <CategoryRail />
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {CLAIMS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="bg-card rounded-xl border p-5">
            <Icon className="text-primary mb-3 size-5" aria-hidden />
            <h2 className="font-medium">{title}</h2>
            <p className="text-muted-foreground mt-1 text-sm">{body}</p>
          </div>
        ))}
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Recién publicado</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/search?sort=newest">
              Ver todo <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.slice(0, 8).map((listing, index) => (
            <ListingCard key={listing.id} listing={listing} priority={index < 4} />
          ))}
        </div>
      </section>
    </div>
  )
}
