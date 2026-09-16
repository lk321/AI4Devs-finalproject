import { z } from 'zod'
import { LISTING_CONDITIONS } from './schema'

export const SORT_OPTIONS = ['relevance', 'price_asc', 'price_desc', 'newest'] as const
export const PAGE_SIZE = 24

const optionalInt = z.coerce.number().int().nonnegative().optional().catch(undefined)

export const searchParamsSchema = z.object({
  q: z.string().trim().max(80).optional().catch(undefined),
  category: z.string().trim().optional().catch(undefined),
  min: optionalInt,
  max: optionalInt,
  condition: z.array(z.enum(LISTING_CONDITIONS)).optional().catch(undefined),
  city: z.string().trim().optional().catch(undefined),
  distance: z.coerce.number().int().min(1).max(500).optional().catch(undefined),
  sort: z.enum(SORT_OPTIONS).catch('relevance'),
  page: z.coerce.number().int().min(1).catch(1),
})

export type ListingSearchParams = z.infer<typeof searchParamsSchema>

export function parseSearchParams(raw: Record<string, string | string[] | undefined>) {
  const condition = raw.condition
  const parsed = searchParamsSchema.parse({
    ...raw,
    condition: condition
      ? Array.isArray(condition)
        ? condition
        : condition.split(',')
      : undefined,
  })

  if (parsed.min !== undefined && parsed.max !== undefined && parsed.min > parsed.max) {
    return { ...parsed, min: undefined, max: undefined, invalidPriceRange: true as const }
  }

  return { ...parsed, invalidPriceRange: false as const }
}

export function toQueryString(params: Partial<ListingSearchParams>) {
  const search = new URLSearchParams()
  const entries: [string, unknown][] = [
    ['q', params.q],
    ['category', params.category],
    ['min', params.min],
    ['max', params.max],
    ['condition', params.condition?.length ? params.condition.join(',') : undefined],
    ['city', params.city],
    ['distance', params.distance],
    ['sort', params.sort === 'relevance' ? undefined : params.sort],
    ['page', params.page && params.page > 1 ? params.page : undefined],
  ]

  for (const [key, value] of entries) {
    if (value !== undefined && value !== '' && value !== null) search.set(key, String(value))
  }

  return search.toString()
}

export function countActiveFilters(params: ListingSearchParams) {
  return [
    params.category,
    params.min,
    params.max,
    params.condition?.length ? params.condition : undefined,
    params.distance,
  ].filter((value) => value !== undefined).length
}
