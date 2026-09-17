export const DEFAULT_REDIRECT = '/search'

export function safeNextPath(next: string | null | undefined): string {
  if (typeof next !== 'string' || next.length === 0) return DEFAULT_REDIRECT
  if (!next.startsWith('/')) return DEFAULT_REDIRECT
  if (next.startsWith('//') || next.startsWith('/\\')) return DEFAULT_REDIRECT
  return next
}
