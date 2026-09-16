import { GENERIC_CREDENTIALS_ERROR } from '@/entities/user'

export const ALIAS_TAKEN_ERROR = 'Ese alias no está disponible'

const ALIAS_HINTS = [
  'alias',
  'duplicate key',
  'unique constraint',
  'already exists',
  'database error saving new user',
  'unexpected_failure',
]

export function mapSignUpError(message: string | null | undefined): string {
  const normalized = (message ?? '').toLowerCase()
  if (normalized.includes('already registered') || normalized.includes('user already exists')) {
    return GENERIC_CREDENTIALS_ERROR
  }
  if (ALIAS_HINTS.some((hint) => normalized.includes(hint))) return ALIAS_TAKEN_ERROR
  return GENERIC_CREDENTIALS_ERROR
}
