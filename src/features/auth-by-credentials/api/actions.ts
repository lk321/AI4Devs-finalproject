'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/shared/api/server'
import { GENERIC_CREDENTIALS_ERROR, credentialsSchema, signUpSchema } from '@/entities/user'
import { safeNextPath } from '../model/next-path'
import { mapSignUpError } from '../model/auth-error'
import type { AuthActionResult } from '../model/types'

export async function signInAction(input: unknown, next?: string): Promise<AuthActionResult> {
  const parsed = credentialsSchema.safeParse(input)
  if (!parsed.success) return { error: GENERIC_CREDENTIALS_ERROR }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) return { error: GENERIC_CREDENTIALS_ERROR }

  redirect(safeNextPath(next))
}

export async function signUpAction(input: unknown): Promise<AuthActionResult> {
  const parsed = signUpSchema.safeParse(input)
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? GENERIC_CREDENTIALS_ERROR }

  const { email, password, alias, city } = parsed.data
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { alias, city } },
  })

  if (error) return { error: mapSignUpError(error.message) }
  if (!data.user) return { error: GENERIC_CREDENTIALS_ERROR }

  redirect(safeNextPath(null))
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
