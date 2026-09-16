import { describe, expect, it } from 'vitest'
import { DEFAULT_REDIRECT, safeNextPath } from './next-path'

describe('safeNextPath', () => {
  it('conserva la ruta de origen', () => {
    expect(safeNextPath('/sell?step=2')).toBe('/sell?step=2')
  })

  it('ignora un next externo', () => {
    expect(safeNextPath('https://evil.test/phishing')).toBe(DEFAULT_REDIRECT)
  })

  it('ignora un next relativo al protocolo', () => {
    expect(safeNextPath('//evil.test')).toBe(DEFAULT_REDIRECT)
    expect(safeNextPath('/\\evil.test')).toBe(DEFAULT_REDIRECT)
  })

  it('usa el catalogo cuando no hay next', () => {
    expect(safeNextPath(undefined)).toBe(DEFAULT_REDIRECT)
    expect(safeNextPath('')).toBe(DEFAULT_REDIRECT)
  })
})
