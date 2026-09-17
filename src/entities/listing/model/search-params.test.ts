import { describe, expect, it } from 'vitest'
import { countActiveFilters, parseSearchParams, toQueryString } from './search-params'

describe('parseSearchParams', () => {
  it('aplica los valores por defecto', () => {
    const params = parseSearchParams({})
    expect(params.sort).toBe('relevance')
    expect(params.page).toBe(1)
  })

  it('ignora el rango cuando el minimo supera al maximo', () => {
    const params = parseSearchParams({ min: '300', max: '100' })
    expect(params.min).toBeUndefined()
    expect(params.max).toBeUndefined()
    expect(params.invalidPriceRange).toBe(true)
  })

  it('acepta condiciones separadas por coma', () => {
    const params = parseSearchParams({ condition: 'nuevo,bueno' })
    expect(params.condition).toEqual(['nuevo', 'bueno'])
  })

  it('cae en relevancia con un orden desconocido', () => {
    expect(parseSearchParams({ sort: 'inventado' }).sort).toBe('relevance')
  })
})

describe('toQueryString', () => {
  it('omite los valores por defecto', () => {
    expect(toQueryString({ sort: 'relevance', page: 1 })).toBe('')
  })

  it('serializa filtros activos', () => {
    const query = toQueryString({ q: 'bici', min: 5000, condition: ['nuevo'], page: 2 })
    expect(query).toContain('q=bici')
    expect(query).toContain('min=5000')
    expect(query).toContain('condition=nuevo')
    expect(query).toContain('page=2')
  })

  it('cuenta los filtros activos sin contar el texto', () => {
    expect(
      countActiveFilters(parseSearchParams({ q: 'bici', category: 'deporte', min: '100' })),
    ).toBe(2)
  })
})
