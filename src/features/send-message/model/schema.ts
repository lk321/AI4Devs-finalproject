import { z } from 'zod'

export const MAX_MESSAGE_LENGTH = 1000

export const messageSchema = z.object({
  conversationId: z.uuid(),
  body: z
    .string()
    .trim()
    .min(1, 'Escribe un mensaje antes de enviarlo')
    .max(MAX_MESSAGE_LENGTH, `El mensaje no puede superar ${MAX_MESSAGE_LENGTH} caracteres`),
})

export type MessageInput = z.infer<typeof messageSchema>
