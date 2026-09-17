import 'server-only'
import { createClient } from '@/shared/api/server'
import type { PublicProfile } from '../model/types'

const PUBLIC_FIELDS = 'id, alias, city, rating_average, closed_deals, created_at'

export async function getProfileByAlias(alias: string): Promise<PublicProfile | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select(PUBLIC_FIELDS)
    .eq('alias', alias)
    .maybeSingle()
  return data
}

export async function getCurrentProfile(): Promise<PublicProfile | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select(PUBLIC_FIELDS)
    .eq('id', user.id)
    .maybeSingle()
  return data
}
