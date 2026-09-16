'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Star, Trash2 } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { moveImage, type DraftImage } from '../lib/images'

type Props = { images: DraftImage[]; onChange: (images: DraftImage[]) => void }

export function ImageGrid({ images, onChange }: Props) {
  const [dragging, setDragging] = useState<number | null>(null)

  if (!images.length) {
    return (
      <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
        Todavía no has añadido ninguna foto. La primera será la portada del anuncio.
      </p>
    )
  }

  const update = (index: number, patch: Partial<DraftImage>) =>
    onChange(images.map((image, position) => (position === index ? { ...image, ...patch } : image)))

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((image, index) => (
        <li
          key={image.url}
          draggable
          onDragStart={() => setDragging(index)}
          onDragEnd={() => setDragging(null)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => {
            if (dragging !== null) onChange(moveImage(images, dragging, index))
            setDragging(null)
          }}
          className={cn(
            'bg-card space-y-2 rounded-lg border p-2',
            dragging === index && 'opacity-50',
          )}
        >
          <div className="bg-muted relative aspect-square overflow-hidden rounded-md">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover"
            />
            {index === 0 ? (
              <span className="bg-primary text-primary-foreground absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-medium">
                Portada
              </span>
            ) : null}
          </div>

          <Label htmlFor={`alt-${index}`} className="text-xs font-normal">
            Texto alternativo
          </Label>
          <Input
            id={`alt-${index}`}
            value={image.alt}
            required
            onChange={(event) => update(index, { alt: event.target.value })}
            className="h-8 text-xs"
          />

          <div className="flex items-center justify-between gap-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-8"
              disabled={index === 0}
              aria-label={`Mover la foto ${index + 1} hacia atrás`}
              onClick={() => onChange(moveImage(images, index, index - 1))}
            >
              <ArrowLeft className="size-4" aria-hidden />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-8"
              disabled={index === images.length - 1}
              aria-label={`Mover la foto ${index + 1} hacia delante`}
              onClick={() => onChange(moveImage(images, index, index + 1))}
            >
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-8"
              disabled={index === 0}
              aria-label={`Usar la foto ${index + 1} como portada`}
              onClick={() => onChange(moveImage(images, index, 0))}
            >
              <Star className="size-4" aria-hidden />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="text-destructive size-8"
              aria-label={`Quitar la foto ${index + 1}`}
              onClick={() => onChange(images.filter((_, position) => position !== index))}
            >
              <Trash2 className="size-4" aria-hidden />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}
