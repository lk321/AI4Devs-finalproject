import { describe, expect, it } from 'vitest'
import { parseSearchParams, toQueryString } from '@/entities/listing'
import {
  DEFAULT_DISTANCE_KM,
  activeFilterCount,
  createFilterStore,
  hasInvalidPriceRange,
  toFilterParams,
  toFilterValues,
} from './store'

describe('toFilterValues', () => {
  it('marca los filtros recibidos por la URL', () => {
    const values = toFilterValues(
      parseSearchParams({
        q: 'bici',
        category: 'bicicletas',
        min: '5000',
        max: '20000',
        condition: 'nuevo,bueno',
        city: 'Madrid',
        distance: '25',
        sort: 'price_asc',
      }),
    )

    expect(values).toEqual({
      q: 'bici',
      category: 'bicicletas',
      min: 50,
      max: 200,
      condition: ['nuevo', 'bueno'],
      city: 'Madrid',
      distance: 25,
      sort: 'price_asc',
    })
  })

  it('cae en relevancia con un orden desconocido', () => {
    expect(toFilterValues(parseSearchParams({ sort: 'inventado' })).sort).toBe('relevance')
  })
})

describe('toFilterParams', () => {
  it('convierte el precio de euros a céntimos', () => {
    const values = toFilterValues(parseSearchParams({}))
    const params = toFilterParams({ ...values, min: 50, max: 200 })
    expect(params.min).toBe(5000)
    expect(params.max).toBe(20000)
  })

  it('descarta la distancia cuando no hay ciudad', () => {
    const values = toFilterValues(parseSearchParams({}))
    expect(toFilterParams({ ...values, distance: 25 }).distance).toBeUndefined()
  })

  it('reproduce la misma URL de la que parte', () => {
    const query = 'category=deporte&condition=nuevo&city=Madrid&distance=25&sort=price_asc'
    const params = parseSearchParams(Object.fromEntries(new URLSearchParams(query)))
    const rebuilt = toQueryString(toFilterParams(toFilterValues(params)))
    expect(Object.fromEntries(new URLSearchParams(rebuilt))).toEqual(
      Object.fromEntries(new URLSearchParams(query)),
    )
  })
})

describe('createFilterStore', () => {
  const initial = toFilterValues(parseSearchParams({}))

  it('alterna los estados de conservación sin perder los anteriores', () => {
    const store = createFilterStore(initial)
    store.getState().actions.toggleCondition('nuevo')
    store.getState().actions.toggleCondition('bueno')
    expect(store.getState().values.condition).toEqual(['nuevo', 'bueno'])
    store.getState().actions.toggleCondition('nuevo')
    expect(store.getState().values.condition).toEqual(['bueno'])
  })

  it('aplica una distancia por defecto al elegir ciudad y la retira al quitarla', () => {
    const store = createFilterStore(initial)
    store.getState().actions.setCity('Madrid')
    expect(store.getState().values.distance).toBe(DEFAULT_DISTANCE_KM)
    store.getState().actions.setCity('')
    expect(store.getState().values.distance).toBeUndefined()
  })

  it('conserva la referencia de los campos que no cambian', () => {
    const store = createFilterStore({ ...initial, condition: ['nuevo'] })
    const before = store.getState().values.condition
    store.getState().actions.setValue('q', 'bici')
    expect(store.getState().values.condition).toBe(before)
  })

  it('no aplica el rango de precio con el mínimo mayor que el máximo', () => {
    const store = createFilterStore(initial)
    store.getState().actions.setValue('min', 300)
    store.getState().actions.setValue('max', 100)
    expect(hasInvalidPriceRange(store.getState().values)).toBe(true)
    expect(parseSearchParams({ min: '30000', max: '10000' }).min).toBeUndefined()
  })

  it('limpia todos los filtros', () => {
    const store = createFilterStore(
      toFilterValues(parseSearchParams({ q: 'bici', category: 'deporte', sort: 'newest' })),
    )
    store.getState().actions.clear()
    expect(toQueryString(toFilterParams(store.getState().values))).toBe('')
    expect(activeFilterCount(store.getState().values)).toBe(0)
  })
})
