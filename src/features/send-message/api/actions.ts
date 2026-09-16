'use server'

import { revalidatePath } from 'next/cache'
import { createClient, getSessionUser } from '@/shared/api/server'
import { messageSchema } from '../model/schema'

export async function sendMessage(input: unknown) {
  const parsed = messageSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const user = await getSessionUser()
  if (!user) return { error: 'Inicia sesión para escribir en la conversación' }

  const supabase = await createClient()
  const { error } = await supabase.from('messages').insert({
    conversation_id: parsed.data.conversationId,
    sender_id: user.id,
    body: parsed.data.body,
  })

  if (error) return { error: error.message }

  revalidatePath('/messages')
  revalidatePath(`/messages/${parsed.data.conversationId}`)
  return {}
}
