import { describe, expect, it } from 'vitest'
import { canViewListing } from './access'

describe('Consulta pública', () => {
  it('cualquier visitante ve un anuncio publicado', () => {
    expect(canViewListing('published', 'seller-1', null)).toBe(true)
  })

  it('cualquier visitante ve un anuncio reservado o vendido', () => {
    expect(canViewListing('reserved', 'seller-1', null)).toBe(true)
    expect(canViewListing('sold', 'seller-1', null)).toBe(true)
  })
})

describe('Anuncio no visible', () => {
  it('un borrador ajeno no es visible', () => {
    expect(canViewListing('draft', 'seller-1', 'otro')).toBe(false)
  })

  it('un anuncio archivado ajeno no es visible', () => {
    expect(canViewListing('archived', 'seller-1', 'otro')).toBe(false)
  })

  it('el autor si ve su borrador y su anuncio archivado', () => {
    expect(canViewListing('draft', 'seller-1', 'seller-1')).toBe(true)
    expect(canViewListing('archived', 'seller-1', 'seller-1')).toBe(true)
  })
})
