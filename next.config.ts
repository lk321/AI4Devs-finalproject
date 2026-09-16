import type { NextConfig } from 'next'

const supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321')

const nextConfig: NextConfig = {
  turbopack: { root: import.meta.dirname },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      {
        protocol: supabaseHost.protocol.replace(':', '') as 'http' | 'https',
        hostname: supabaseHost.hostname,
        port: supabaseHost.port,
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
