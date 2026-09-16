import { beforeEach, describe, expect, it, vi } from 'vitest'

const state = {
  user: null as { id: string } | null,
  category: null as { id: string } | null,
  listingError: null as { code: string; message: string } | null,
  imagesError: null as { code: string; message: string } | null,
  updateError: null as { code: string; message: string } | null,
}

const calls = {
  listingInserts: [] as Record<string, unknown>[],
  imageInserts: [] as Record<string, unknown>[][],
  listingUpdates: [] as Record<string, unknown>[],
}

const supabase = {
  from(table: string) {
    if (table === 'categories') {
      return {
        select: () => ({
          eq: () => ({ maybeSingle: async () => ({ data: state.category, error: null }) }),
        }),
      }
    }
    if (table === 'listing_images') {
      return {
        insert: async (rows: Record<string, unknown>[]) => {
          calls.imageInserts.push(rows)
          return { error: state.imagesError }
        },
      }
    }
    return {
      insert: (values: Record<string, unknown>) => {
        calls.listingInserts.push(values)
        return {
          select: () => ({
            single: async () => ({
              data: state.listingError ? null : { id: 'listing-1' },
              error: state.listingError,
            }),
          }),
        }
      },
      update: (values: Record<string, unknown>) => {
        calls.listingUpdates.push(values)
        return { eq: async () => ({ error: state.updateError }) }
      },
    }
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

const { redirect } = await import('next/navigation')
const { createListingAction } = await import('./actions')

const draft = {
  title: 'Bicicleta de montaña',
  description: 'Bicicleta revisada en taller con ruedas nuevas y frenos de disco.',
  categorySlug: 'bicicletas',
  condition: 'bueno',
  priceCents: 18000,
  city: 'Madrid',
  images: [{ url: 'https://cdn.test/1.webp', alt: 'Bicicleta de perfil', bytes: 400000 }],
}

beforeEach(() => {
  state.user = { id: 'seller-1' }
  state.category = { id: 'cat-1' }
  state.listingError = null
  state.imagesError = null
  state.updateError = null
  calls.listingInserts = []
  calls.imageInserts = []
  calls.listingUpdates = []
  vi.mocked(redirect).mockClear()
})

describe('Alta correcta', () => {
  it('guarda el anuncio en estado draft y lleva a su detalle', async () => {
    await expect(createListingAction(draft)).rejects.toThrow('NEXT_REDIRECT:/listings/listing-1')
    expect(calls.listingInserts[0]).toMatchObject({
      status: 'draft',
      seller_id: 'seller-1',
      category_id: 'cat-1',
      price_cents: 18000,
      city: 'Madrid',
    })
    expect(calls.listingInserts[0].latitude).toBeTypeOf('number')
    expect(calls.listingUpdates).toHaveLength(0)
  })

  it('asocia las imagenes en el orden elegido y usa la primera como portada', async () => {
    const images = [
      { url: 'https://cdn.test/a.webp', alt: 'portada', bytes: 100 },
      { url: 'https://cdn.test/b.webp', alt: 'trasera', bytes: 100 },
    ]
    await expect(createListingAction({ ...draft, images })).rejects.toThrow('NEXT_REDIRECT')
    expect(calls.imageInserts[0]).toEqual([
      { listing_id: 'listing-1', url: images[0].url, alt: 'portada', bytes: 100, position: 0 },
      { listing_id: 'listing-1', url: images[1].url, alt: 'trasera', bytes: 100, position: 1 },
    ])
  })

  it('toma el vendedor de la sesion y nunca del formulario', async () => {
    await expect(createListingAction({ ...draft, sellerId: 'intruso' })).rejects.toThrow(
      'NEXT_REDIRECT',
    )
    expect(calls.listingInserts[0].seller_id).toBe('seller-1')
  })
})

describe('Campos inválidos', () => {
  it('rechaza un titulo de menos de 5 caracteres', async () => {
    const result = await createListingAction({ ...draft, title: 'Bici' })
    expect(result?.error).toMatch(/título/i)
    expect(calls.listingInserts).toHaveLength(0)
  })

  it('rechaza una descripcion demasiado corta', async () => {
    const result = await createListingAction({ ...draft, description: 'Corta' })
    expect(result?.error).toBeTruthy()
    expect(calls.listingInserts).toHaveLength(0)
  })
})

describe('Precio manipulado en el envío', () => {
  it('rechaza un precio negativo enviado sin pasar por el formulario', async () => {
    const result = await createListingAction({ ...draft, priceCents: -500 })
    expect(result?.error).toMatch(/precio/i)
    expect(calls.listingInserts).toHaveLength(0)
  })

  it('rechaza un precio de 100.000 euros o mas', async () => {
    const result = await createListingAction({ ...draft, priceCents: 10_000_000 })
    expect(result?.error).toBeTruthy()
    expect(calls.listingInserts).toHaveLength(0)
  })
})

describe('Límite superado', () => {
  it('rechaza nueve imagenes enviadas al servidor', async () => {
    const images = Array.from({ length: 9 }, (_, index) => ({
      url: `https://cdn.test/${index}.webp`,
      alt: `foto ${index}`,
      bytes: 1000,
    }))
    const result = await createListingAction({ ...draft, images })
    expect(result?.error).toMatch(/8 imágenes/)
    expect(calls.listingInserts).toHaveLength(0)
  })

  it('rechaza un anuncio sin imagenes', async () => {
    const result = await createListingAction({ ...draft, images: [] })
    expect(result?.error).toMatch(/al menos una imagen/i)
    expect(calls.listingInserts).toHaveLength(0)
  })
})

describe('Visitante sin sesión', () => {
  it('redirige al inicio de sesion sin persistir nada', async () => {
    state.user = null
    await expect(createListingAction(draft)).rejects.toThrow('NEXT_REDIRECT')
    expect(vi.mocked(redirect).mock.calls[0][0]).toMatch(/^\/login/)
    expect(calls.listingInserts).toHaveLength(0)
  })
})

describe('Publicación', () => {
  it('publica el borrador completo despues de guardar las imagenes', async () => {
    await expect(createListingAction(draft, { publish: true })).rejects.toThrow('NEXT_REDIRECT')
    expect(calls.imageInserts).toHaveLength(1)
    expect(calls.listingUpdates).toEqual([{ status: 'published' }])
  })

  it('devuelve el mensaje del disparador si la publicacion falla', async () => {
    state.updateError = {
      code: '23514',
      message: 'un anuncio publicado necesita al menos una imagen',
    }
    const result = await createListingAction(draft, { publish: true })
    expect(result?.error).toMatch(/al menos una imagen/)
  })
})

describe('Categoría inexistente', () => {
  it('rechaza el alta si la categoria no existe', async () => {
    state.category = null
    const result = await createListingAction(draft)
    expect(result?.error).toMatch(/categor/i)
    expect(calls.listingInserts).toHaveLength(0)
  })
})
