import { createStore } from 'zustand/vanilla'
import {
  countActiveFilters,
  type ListingCondition,
  type ListingSearchParams,
} from '@/entities/listing'

export const DEFAULT_DISTANCE_KM = 25

export type FilterValues = {
  q: string
  category: string
  min: number | undefined
  max: number | undefined
  condition: ListingCondition[]
  city: string
  distance: number | undefined
  sort: ListingSearchParams['sort']
}

export type FilterActions = {
  setValue: <K extends keyof FilterValues>(key: K, value: FilterValues[K]) => void
  setCity: (city: string) => void
  toggleCondition: (condition: ListingCondition) => void
  clear: () => void
}

export type FilterState = { values: FilterValues; actions: FilterActions }

export const EMPTY_VALUES: FilterValues = {
  q: '',
  category: '',
  min: undefined,
  max: undefined,
  condition: [],
  city: '',
  distance: undefined,
  sort: 'relevance',
}

export function toFilterValues(params: ListingSearchParams): FilterValues {
  return {
    q: params.q ?? '',
    category: params.category ?? '',
    min: params.min === undefined ? undefined : params.min / 100,
    max: params.max === undefined ? undefined : params.max / 100,
    condition: params.condition ?? [],
    city: params.city ?? '',
    distance: params.distance,
    sort: params.sort,
  }
}

export function toFilterParams(values: FilterValues): Partial<ListingSearchParams> {
  return {
    q: values.q.trim() || undefined,
    category: values.category || undefined,
    min: values.min === undefined ? undefined : Math.round(values.min * 100),
    max: values.max === undefined ? undefined : Math.round(values.max * 100),
    condition: values.condition.length ? values.condition : undefined,
    city: values.city || undefined,
    distance: values.city ? values.distance : undefined,
    sort: values.sort,
  }
}

export function hasInvalidPriceRange(values: Pick<FilterValues, 'min' | 'max'>) {
  return values.min !== undefined && values.max !== undefined && values.min > values.max
}

export function activeFilterCount(values: FilterValues) {
  return countActiveFilters(toFilterParams(values) as ListingSearchParams)
}

export function createFilterStore(initial: FilterValues) {
  return createStore<FilterState>()((set) => ({
    values: initial,
    actions: {
      setValue: (key, value) => set((state) => ({ values: { ...state.values, [key]: value } })),
      setCity: (city) =>
        set((state) => ({
          values: {
            ...state.values,
            city,
            distance: city ? (state.values.distance ?? DEFAULT_DISTANCE_KM) : undefined,
          },
        })),
      toggleCondition: (condition) =>
        set((state) => ({
          values: {
            ...state.values,
            condition: state.values.condition.includes(condition)
              ? state.values.condition.filter((item) => item !== condition)
              : [...state.values.condition, condition],
          },
        })),
      clear: () => set({ values: EMPTY_VALUES }),
    },
  }))
}

export type FilterStore = ReturnType<typeof createFilterStore>
