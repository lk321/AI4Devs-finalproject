'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/shared/lib/cn'

type GalleryImage = { url: string; alt: string }

export function ListingGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [active, setActive] = useState(0)
  const cover = images[active] ?? images[0]

  return (
    <div className="space-y-3">
      <div className="bg-muted relative aspect-4/3 overflow-hidden rounded-xl">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt || title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
        ) : (
          <span className="text-muted-foreground absolute inset-0 grid place-items-center text-sm">
            Este anuncio no tiene fotos
          </span>
        )}
      </div>

      {images.length > 1 ? (
        <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {images.map((image, index) => (
            <li key={image.url}>
              <button
                type="button"
                aria-label={`Ver la foto ${index + 1} de ${images.length}`}
                aria-current={index === active ? 'true' : undefined}
                onClick={() => setActive(index)}
                className={cn(
                  'bg-muted focus-visible:ring-ring relative aspect-square w-full overflow-hidden rounded-md border transition focus-visible:ring-2 focus-visible:outline-none',
                  index === active ? 'border-primary' : 'border-transparent opacity-70',
                )}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `${title}, foto ${index + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
