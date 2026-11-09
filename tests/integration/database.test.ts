import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { beforeAll, describe, expect, it } from 'vitest'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const PASSWORD = 'loopmarket123'
const CARLOS_LISTING = '44444444-0000-4000-8000-000000000003'
const ANA_LISTING = '44444444-0000-4000-8000-000000000001'

async function login(email: string) {
  const db = createClient(url, key, { auth: { persistSession: false } })
  const { error } = await db.auth.signInWithPassword({ email, password: PASSWORD })
  expect(error).toBeNull()
  return db
}

describe('base de datos (Supabase local)', () => {
  let ana: SupabaseClient
  let carlos: SupabaseClient
  const anon = createClient(url, key, { auth: { persistSession: false } })

  beforeAll(async () => {
    ana = await login('ana@loop.test')
    carlos = await login('carlos@loop.test')
  })

  it('la clave pública lee anuncios publicados', async () => {
    const { data, error } = await anon.from('listings').select('id').eq('status', 'published')
    expect(error).toBeNull()
    expect(data!.length).toBeGreaterThanOrEqual(7)
  })

  it('el email del perfil no sale de la base', async () => {
    const { data } = await anon.from('profiles').select('*').limit(1)
    expect(Object.keys(data?.[0] ?? {})).not.toContain('email')
  })

  it('RLS: sin sesión no se puede publicar', async () => {
    const { error } = await anon
      .from('listings')
      .insert({ title: 'Anuncio anónimo', price_cents: 100 })
    expect(error).not.toBeNull()
  })

  it('CHECK: un precio negativo se rechaza', async () => {
    const { error } = await ana.from('listings').update({ price_cents: -5 }).eq('id', ANA_LISTING)
    expect(error).not.toBeNull()
  })

  it('un usuario no modifica el anuncio de otro', async () => {
    const { data } = await carlos
      .from('listings')
      .update({ title: 'Anuncio secuestrado' })
      .eq('id', ANA_LISTING)
      .select()
    expect(data ?? []).toHaveLength(0)
  })

  it('el vendedor no puede abrir conversación sobre su propio anuncio', async () => {
    const { error } = await ana.rpc('start_conversation', { target_listing: ANA_LISTING })
    expect(error?.message).toMatch(/propio anuncio/)
  })

  it('transición inválida: published → draft se rechaza', async () => {
    const { error } = await carlos
      .from('listings')
      .update({ status: 'draft' })
      .eq('id', CARLOS_LISTING)
    expect(error).not.toBeNull()
  })

  it('un no vendedor no puede marcar como vendido', async () => {
    const { error } = await carlos.rpc('mark_listing_sold', { target_listing: ANA_LISTING })
    expect(error).not.toBeNull()
  })

  it('la búsqueda ignora tildes y mayúsculas', async () => {
    const { data, error } = await anon.rpc('search_listings', { search_term: 'PORTATIL' })
    expect(error).toBeNull()
    expect(JSON.stringify(data)).toContain('Portátil')
  })
})
