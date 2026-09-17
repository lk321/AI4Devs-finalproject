import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const LAYERS = ['shared', 'entities', 'features', 'widgets', '_pages', '_app']

const above = (layer) =>
  LAYERS.slice(LAYERS.indexOf(layer) + 1).map((upper) => ({
    group: [`@/${upper}`, `@/${upper}/*`, `@/${upper}/**`],
    message: `Feature-Sliced Design: "${layer}" no puede importar de "${upper}".`,
  }))

const layerBoundaries = LAYERS.slice(0, -1).map((layer) => ({
  files: [`src/${layer}/**/*.{ts,tsx}`],
  rules: {
    'no-restricted-imports': ['error', { patterns: above(layer) }],
  },
}))

const publicApiOnly = {
  files: ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '@/entities/*/*',
              '@/features/*/*',
              '@/widgets/*/*',
              '@/_pages/*/*',
              '!@/*/*/index.server',
            ],
            message: 'Feature-Sliced Design: importa el índice público del slice, no sus internos.',
          },
        ],
      },
    ],
  },
}

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  publicApiOnly,
  ...layerBoundaries,
  {
    files: ['app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/entities/**', '@/features/**', '@/widgets/**'],
              message: 'Las rutas sólo componen desde "@/_pages" y "@/_app".',
            },
          ],
        },
      ],
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'supabase/**', 'types/**']),
])

export default eslintConfig
