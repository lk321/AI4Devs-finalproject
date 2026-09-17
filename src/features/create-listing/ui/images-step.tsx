'use client'

import { useRef, useState, type ChangeEvent } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { ImagePlus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { MAX_IMAGES, type ListingDraft } from '@/entities/listing'
import { useSession } from '@/entities/user'
import { createClient } from '@/shared/api/browser'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { FormField, FormItem, FormMessage } from '@/shared/ui/form'
import { Label } from '@/shared/ui/label'
import { BUCKET, IMAGE_ACCEPT_ATTRIBUTE, buildImagePath, validateImageFile } from '../lib/images'
import type { DraftImage } from '../lib/images'
import { ImageGrid } from './image-grid'

export function ImagesStep({ form }: { form: UseFormReturn<ListingDraft> }) {
  const profile = useSession()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (!files.length) return

    if (!profile) {
      toast.error('Inicia sesión para subir fotos')
      return
    }

    const current = form.getValues('images') ?? []
    const accepted: DraftImage[] = []
    setUploading(true)

    const supabase = createClient()
    const title = form.getValues('title').trim() || 'Artículo en venta'

    for (const file of files) {
      const check = validateImageFile(file, current.length + accepted.length)
      if (!check.ok) {
        toast.error(check.message)
        continue
      }

      const path = buildImagePath(profile.id, file.name)
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type })

      if (error) {
        toast.error(`No hemos podido subir «${file.name}»`)
        continue
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      accepted.push({
        url: data.publicUrl,
        alt: `${title}, foto ${current.length + accepted.length + 1}`,
        bytes: file.size,
      })
    }

    setUploading(false)
    if (!accepted.length) return

    form.setValue('images', [...current, ...accepted], { shouldValidate: true, shouldDirty: true })
    toast.success(accepted.length === 1 ? 'Foto añadida' : `${accepted.length} fotos añadidas`)
  }

  return (
    <FormField
      control={form.control}
      name="images"
      render={({ field }) => (
        <FormItem className="space-y-4">
          {!profile ? (
            <Alert variant="destructive">
              <AlertTitle>Sesión necesaria</AlertTitle>
              <AlertDescription>Inicia sesión para subir las fotos del anuncio.</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <Label htmlFor="listing-images" className="sr-only">
              Añadir fotos del artículo
            </Label>
            <input
              ref={inputRef}
              id="listing-images"
              type="file"
              multiple
              className="sr-only"
              accept={IMAGE_ACCEPT_ATTRIBUTE}
              onChange={handleFiles}
            />
            <Button
              type="button"
              variant="outline"
              disabled={uploading || field.value.length >= MAX_IMAGES}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <ImagePlus className="size-4" aria-hidden />
              )}
              Añadir fotos
            </Button>
            <p className="text-muted-foreground text-sm" aria-live="polite">
              {field.value.length} de {MAX_IMAGES} · JPG, PNG o WebP hasta 5 MB
            </p>
          </div>

          <ImageGrid
            images={field.value}
            onChange={(images) => form.setValue('images', images, { shouldValidate: true })}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
