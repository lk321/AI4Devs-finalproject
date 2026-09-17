import type { Database } from '@/shared/api/database.types'

export type ProfileRow = Database['public']['Tables']['profiles']['Row']

export type PublicProfile = Pick<
  ProfileRow,
  'id' | 'alias' | 'city' | 'rating_average' | 'closed_deals' | 'created_at'
>
