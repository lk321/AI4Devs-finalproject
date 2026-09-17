'use client'

import type { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from '@/shared/ui/tooltip'
import { Toaster } from '@/shared/ui/sonner'
import { SessionProvider } from '@/entities/user'
import type { PublicProfile } from '@/entities/user'

export function AppProviders({
  profile,
  children,
}: {
  profile: PublicProfile | null
  children: ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SessionProvider profile={profile}>
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
        <Toaster position="top-center" richColors />
      </SessionProvider>
    </ThemeProvider>
  )
}
