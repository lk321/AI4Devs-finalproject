'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, getSessionUser } from '@/shared/api/server'
import { findCity, listingDraftSchema } from '@/entities/listing'
import { toSaveErrorMessage } from '../lib/errors'

export type CreateListingResult = { error: string } | undefined

const SAVE_FAILED = 'No hemos podido guardar el anuncio. Inténtalo de nuevo'

export async function createListingAction(
  input: unknown,
  options?: { publish?: boolean },
): Promise<CreateListingResult> {
  const user = await getSessionUser()
  if (!user) redirect('/login?next=%2Fsell')

  const parsed = listingDraftSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const draft = parsed.data
  const city = findCity(draft.city)
  if (!city) return { error: 'Elige una ciudad de la lista' }

  const supabase = await createClient()
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', draft.categorySlug)
    .maybeSingle()

  if (!category) return { error: 'Esa categoría ya no está disponible' }

  const { data: listing, error } = await supabase
    .from('listings')
    .insert({
      seller_id: user.id,
      category_id: category.id,
      title: draft.title,
      description: draft.description,
      price_cents: draft.priceCents,
      condition: draft.condition,
      status: 'draft',
      city: city.name,
      latitude: city.lat,
      longitude: city.lng,
    })
    .select('id')
    .single()

  if (error || !listing) return { error: toSaveErrorMessage(error) ?? SAVE_FAILED }

  const { error: imagesError } = await supabase.from('listing_images').insert(
    draft.images.map((image, position) => ({
      listing_id: listing.id,
      url: image.url,
      alt: image.alt,
      bytes: image.bytes,
      position,
    })),
  )

  if (imagesError) return { error: 'No hemos podido guardar las imágenes del anuncio' }

  if (options?.publish) {
    const { error: publishError } = await supabase
      .from('listings')
      .update({ status: 'published' })
      .eq('id', listing.id)

    if (publishError) return { error: toSaveErrorMessage(publishError) ?? SAVE_FAILED }
  }

  revalidatePath('/account/listings')
  revalidatePath('/search')
  redirect(`/listings/${listing.id}`)
}
