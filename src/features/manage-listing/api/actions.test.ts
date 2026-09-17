import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ListingStatus } from '@/entities/listing'

type DbError = { code: string; message: string }

const state = {
  user: null as { id: string } | null,
  listing: null as { id: string; seller_id: string; status: ListingStatus } | null,
  updateError: null as DbError | null,
  rpcError: null as DbError | null,
}

const calls = {
  updates: [] as Record<string, unknown>[],
  rpc: [] as [string, Record<string, unknown>][],
}

const supabase = {
  from: () => ({
    select: () => ({
      eq: () => ({ maybeSingle: async () => ({ data: state.listing, error: null }) }),
    }),
    update: (values: Record<string, unknown>) => {
      calls.updates.push(values)
      return { eq: async () => ({ error: state.updateError }) }
    },
  }),
  rpc: async (name: string, args: Record<string, unknown>) => {
    calls.rpc.push([name, args])
    return { error: state.rpcError }
  },
}

vi.mock('@/shared/api/server', () => ({
  createClient: async () => supabase,
  getSessionUser: async () => state.user,
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

vi.mock('next/navigation', () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`)
  }),
}))

const { AUTHOR_ONLY } = await import('../lib/errors')
const {
  archiveListing,
  markListingSold,
  publishListing,
  releaseListingReservation,
  updateListingPrice,
} = await import('./actions')

beforeEach(() => {
  state.user = { id: 'seller-1' }
  state.listing = { id: 'listing-1', seller_id: 'seller-1', status: 'published' }
  state.updateError = null
  state.rpcError = null
  calls.updates = []
  calls.rpc = []
})

describe('Transición permitida', () => {
  it('archiva un anuncio publicado', async () => {
    const result = await archiveListing('listing-1')
    expect(result).toEqual({ ok: true })
    expect(calls.updates).toEqual([{ status: 'archived' }])
  })

  it('publica un borrador y lleva a su detalle', async () => {
    state.listing = { id: 'listing-1', seller_id: 'seller-1', status: 'draft' }
    await expect(publishListing('listing-1')).rejects.toThrow('NEXT_REDIRECT:/listings/listing-1')
    expect(calls.updates).toEqual([{ status: 'published' }])
  })
})

describe('Transición no permitida', () => {
  it('muestra como mensaje de usuario el error del disparador', async () => {
    state.listing = { id: 'listing-1', seller_id: 'seller-1', status: 'draft' }
    state.updateError = { code: '23514', message: 'transicion no permitida: draft -> archived' }
    const result = await archiveListing('listing-1')
    expect(result).toEqual({ error: 'Ese cambio de estado no está permitido para este anuncio' })
  })
})

describe('Edición por un tercero', () => {
  it('rechaza a quien no es el autor y no aplica cambios', async () => {
    state.listing = { id: 'listing-1', seller_id: 'otro-vendedor', status: 'published' }
    expect(await archiveListing('listing-1')).toEqual({ error: AUTHOR_ONLY })
    expect(await updateListingPrice('listing-1', 5000)).toEqual({ error: AUTHOR_ONLY })
    expect(await markListingSold('listing-1')).toEqual({ error: AUTHOR_ONLY })
    expect(calls.updates).toHaveLength(0)
    expect(calls.rpc).toHaveLength(0)
  })

  it('rechaza a un visitante sin sesion', async () => {
    state.user = null
    const result = await archiveListing('listing-1')
    expect(result).toEqual({ error: 'Inicia sesión para gestionar tus anuncios' })
    expect(calls.updates).toHaveLength(0)
  })
})

describe('Edición por el autor', () => {
  it('actualiza el precio de un anuncio publicado', async () => {
    const result = await updateListingPrice('listing-1', 15000)
    expect(result).toEqual({ ok: true })
    expect(calls.updates).toEqual([{ price_cents: 15000 }])
  })

  it('rechaza un precio invalido antes de tocar la base', async () => {
    const result = await updateListingPrice('listing-1', -100)
    expect('error' in result && result.error).toMatch(/precio/i)
    expect(calls.updates).toHaveLength(0)
  })
})

describe('Precio bloqueado durante la reserva', () => {
  it('indica que hay que liberar la reserva', async () => {
    state.listing = { id: 'listing-1', seller_id: 'seller-1', status: 'reserved' }
    state.updateError = {
      code: '23514',
      message: 'no se puede cambiar el precio de un anuncio reservado',
    }
    const result = await updateListingPrice('listing-1', 15000)
    expect('error' in result && result.error).toMatch(/libera la reserva/i)
  })
})

describe('Anuncio vendido', () => {
  it('cierra la venta con mark_listing_sold', async () => {
    state.listing = { id: 'listing-1', seller_id: 'seller-1', status: 'reserved' }
    const result = await markListingSold('listing-1')
    expect(result).toEqual({ ok: true })
    expect(calls.rpc).toEqual([['mark_listing_sold', { target_listing: 'listing-1' }]])
  })

  it('traduce el error de cierre sin oferta aceptada', async () => {
    state.listing = { id: 'listing-1', seller_id: 'seller-1', status: 'reserved' }
    state.rpcError = { code: '23514', message: 'primero debes aceptar una oferta' }
    const result = await markListingSold('listing-1')
    expect('error' in result && result.error).toMatch(/aceptar una oferta/)
  })

  it('libera la reserva con release_reservation', async () => {
    state.listing = { id: 'listing-1', seller_id: 'seller-1', status: 'reserved' }
    const result = await releaseListingReservation('listing-1')
    expect(result).toEqual({ ok: true })
    expect(calls.rpc).toEqual([['release_reservation', { target_listing: 'listing-1' }]])
  })
})

describe('Anuncio inexistente', () => {
  it('avisa cuando el anuncio ya no existe', async () => {
    state.listing = null
    const result = await archiveListing('listing-1')
    expect('error' in result && result.error).toMatch(/ya no existe/)
  })
})
