import type { ReactNode } from 'react'
import { getCurrentProfile } from '@/entities/user/index.server'
import { SiteHeader } from '@/widgets/site-header'
import { AppProviders } from '../providers/app-providers'

export async function RootShell({ children }: { children: ReactNode }) {
  const profile = await getCurrentProfile()

  return (
    <AppProviders profile={profile}>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <footer className="text-muted-foreground border-t py-8 text-center text-xs">
        Loop Market · Proyecto final AI4Devs
      </footer>
    </AppProviders>
  )
}
