'use client'

import { createContext, use, type ReactNode } from 'react'
import type { PublicProfile } from './types'

const SessionContext = createContext<PublicProfile | null>(null)

export function SessionProvider({
  profile,
  children,
}: {
  profile: PublicProfile | null
  children: ReactNode
}) {
  return <SessionContext value={profile}>{children}</SessionContext>
}

export function useSession() {
  return use(SessionContext)
}
