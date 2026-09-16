import { z } from 'zod'

const email = z.email('Introduce un email válido')
const password = z.string().min(12, 'La contraseña necesita al menos 12 caracteres')

export const credentialsSchema = z.object({ email, password })

export const signUpSchema = z.object({
  email,
  password,
  alias: z
    .string()
    .trim()
    .min(3, 'El alias necesita al menos 3 caracteres')
    .max(24, 'El alias no puede superar 24 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Sólo letras, números y guion bajo'),
  city: z.string().trim().min(2, 'Elige tu ciudad'),
})

export type Credentials = z.infer<typeof credentialsSchema>
export type SignUpInput = z.infer<typeof signUpSchema>

export const GENERIC_CREDENTIALS_ERROR = 'Email o contraseña incorrectos'
