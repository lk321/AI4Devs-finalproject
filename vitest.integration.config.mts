import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'

// Integración: contra Supabase local (`bun run db:start` + `db:reset`).
export default defineConfig(({ mode }) => ({
  test: {
    environment: 'node',
    include: ['tests/integration/**/*.test.ts'],
    env: loadEnv(mode, process.cwd(), ''),
    testTimeout: 15_000,
  },
}))
