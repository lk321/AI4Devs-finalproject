import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { RootShell } from '@/_app'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'Loop Market', template: '%s · Loop Market' },
  description:
    'Marketplace de compraventa de artículos de segunda mano entre particulares: publica, negocia y cierra con constancia.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <RootShell>{children}</RootShell>
      </body>
    </html>
  )
}
