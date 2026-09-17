'use server'

import { revalidatePath } from 'next/cache'
import { createClient, getSessionUser } from '@/shared/api/server'
import { reviewErrorMessage, reviewSchema } from '../model/schema'

export async function submitReview(input: unknown, conversationId: string) {
  const parsed = reviewSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const user = await getSessionUser()
  if (!user) return { error: 'Inicia sesión para valorar la operación' }

  const supabase = await createClient()
  const { error } = await supabase.from('reviews').insert({
    listing_id: parsed.data.listingId,
    author_id: user.id,
    subject_id: parsed.data.subjectId,
    score: parsed.data.score,
    comment: parsed.data.comment?.length ? parsed.data.comment : null,
  })

  if (error) return { error: reviewErrorMessage(error) }

  revalidatePath('/messages')
  revalidatePath(`/messages/${conversationId}`)
  revalidatePath(`/listings/${parsed.data.listingId}`)
  return {}
}
