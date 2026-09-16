import Link from 'next/link'
import { Bike, Guitar, Laptop, type LucideIcon, Shirt, Sofa } from 'lucide-react'

const CATEGORIES: { slug: string; label: string; icon: LucideIcon }[] = [
  { slug: 'tecnologia', label: 'Tecnología', icon: Laptop },
  { slug: 'hogar', label: 'Hogar', icon: Sofa },
  { slug: 'deporte', label: 'Deporte', icon: Bike },
  { slug: 'musica', label: 'Música', icon: Guitar },
  { slug: 'moda', label: 'Moda', icon: Shirt },
]

export function CategoryRail() {
  return (
    <nav aria-label="Categorías" className="flex flex-wrap gap-3">
      {CATEGORIES.map(({ slug, label, icon: Icon }) => (
        <Link
          key={slug}
          href={`/search?category=${slug}`}
          className="bg-card hover:border-primary/60 hover:bg-accent/40 flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
        >
          <Icon className="text-primary size-4" aria-hidden />
          {label}
        </Link>
      ))}
    </nav>
  )
}
