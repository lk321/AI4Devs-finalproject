<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Loop Market

Marketplace de compraventa de artículos de segunda mano entre particulares.
Monolito Next.js: UI, dominio y acceso a datos en una sola base de código
TypeScript.

> **Estado del repositorio (entrega 1):** sólo documentación y
> especificaciones. El código de aplicación y las dependencias llegan en la
> entrega 2, momento en el que los comandos y rutas descritos aquí pasan a ser
> ejecutables.

## Comandos

```bash
bun install          # dependencias
bun run dev          # servidor de desarrollo
bun run build        # build de producción
bun run lint         # eslint
bun run format       # prettier --write
bun run typecheck    # tsc --noEmit
bun run test         # vitest
bun run test:watch   # vitest --watch
bun run test:e2e     # playwright
bun run db:start     # supabase start (Docker)
bun run db:reset     # migraciones + semillas
bun run db:types     # tipos TypeScript desde el esquema
```

`bun` es el gestor de paquetes. No uses `npm` ni `yarn`: romperían `bun.lock`.

## Stack

| Área | Elección |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Lenguaje | TypeScript estricto, React 19 |
| Estilos | Tailwind CSS v4 |
| Componentes | shadcn/ui sobre Radix, iconos de lucide-react |
| Formularios | react-hook-form + zod (`@hookform/resolvers`) |
| Estado | Context API; zustand sólo cuando el rerender importa |
| Datos | Supabase (PostgreSQL 17, Auth, Storage) |
| Tests | Vitest + Testing Library (Playwright en la entrega 3) |
| Hooks de git | lefthook + commitlint |

Antes de escribir código que toque una librería, consulta su documentación
actual. Para Next.js, la fuente es `node_modules/next/dist/docs/`.

## Arquitectura: Feature-Sliced Design

El código vive en `src/`. Las capas FSD `app` y `pages` se renombran a `_app` y
`_pages` porque `app/` en la raíz pertenece al App Router.

```
app/                  # routing del App Router: sólo re-exporta
src/
  _app/               # providers, estilos globales, configuración de arranque
  _pages/             # composición de una pantalla completa
  widgets/            # bloques autónomos de UI que componen features
  features/           # una intención de usuario con su formulario y su acción
  entities/           # objetos de negocio: modelo, esquemas, tarjetas
  shared/             # ui, api, lib y config sin dominio
```

Reglas que no se negocian:

- Una capa sólo importa de capas **estrictamente inferiores**. El orden es
  `_app > _pages > widgets > features > entities > shared`.
- Dos slices de la misma capa **nunca** se importan entre sí. Si necesitan
  compartir algo, baja ese algo a una capa inferior.
- Cada slice expone su API pública en `index.ts`. Nadie importa rutas internas
  de otro slice.
- Código exclusivo de servidor (cliente de Supabase con cookies, secretos) se
  exporta por `index.server.ts`, no por `index.ts`.
- Segmentos dentro de un slice: `ui`, `model`, `api`, `lib`, `config`.
- Una ruta de `app/` no contiene lógica:
  `export { SearchPage as default } from '@/_pages/search'`.
- `proxy.ts` (el antiguo `middleware.ts` de Next.js 15) e `instrumentation.ts`
  viven en la raíz, no en `src/`.

Un slice se crea cuando hay código real que meter dentro. Nada de carpetas
vacías preparadas para el futuro.

## Código

- **Sin comentarios ni docstrings.** Si un bloque necesita explicación, el
  problema es el nombre o la estructura. Extrae y renombra en vez de comentar.
  La única excepción es un `TODO` con enlace a una tarea abierta.
- **Ningún archivo supera las 300 líneas.** Al llegar al límite, corta por
  segmento FSD, nunca por número de líneas.
- **No dupliques.** Antes de escribir un helper, busca en `shared/lib` y en
  `entities/*/model`.
- **Sin abstracciones especulativas:** ni interfaces con una sola
  implementación, ni factorías para un solo producto, ni configuración para un
  valor que nunca cambia.
- Nombres en inglés en el código, textos de interfaz en español.
- `export function` con nombre; nada de `export default` fuera de las rutas de
  `app/`.
- Server Component por defecto. `'use client'` sólo en el componente que
  realmente necesita estado, efecto o evento, y lo más abajo posible del árbol.
- La lógica de dominio vive en `entities/*/model` y no importa nada de Next: la
  Server Action valida y delega.

## Validación

Cada feature define su esquema zod en `model/`. Ese mismo esquema lo consume el
formulario vía `@hookform/resolvers/zod` y lo vuelve a parsear la Server Action
antes de tocar el dominio. **El cliente nunca es la única barrera.**

## Tests

TDD: primero el test que falla, luego el código mínimo que lo pasa.

- Cada `#### Scenario:` de `openspec/` es el nombre de un test.
- Unidad e integración con Vitest y Testing Library, junto al código que
  prueban: `features/create-listing/model/schema.test.ts`.
- E2E con Playwright sólo para los recorridos críticos: publicar, buscar y
  cerrar una operación.
- Se prueba comportamiento observable, no detalles de implementación. Consulta
  por rol accesible, no por clase CSS.

## Especificaciones

El trabajo se planifica con OpenSpec antes de tocar código.

```bash
openspec list                          # cambios en curso
openspec show <change>                 # detalle de un cambio
openspec validate <change> --strict    # comprobar artefactos
```

Un cambio nuevo se propone con `/opsx:propose` y se implementa con
`/opsx:apply`. No implementes un comportamiento que no esté en un spec.

## Git

- Conventional commits en inglés, en minúsculas, máximo 50 caracteres en el
  asunto: `feat(listings): add price range filter`.
- Nunca añadas trailers de coautoría ni menciones a herramientas en el mensaje.
- Una rama por entrega: `feature/entrega-1-AO`, `feature/entrega-2-AO`,
  `final-project-AO`.
- `lefthook` ejecuta lint y formato en `pre-commit`, typecheck y tests en
  `pre-push`, y commitlint en `commit-msg`. No uses `--no-verify`.

## Seguridad

- Sesión en cookie `httpOnly`, `secure`, `sameSite=lax`, emitida por Supabase
  Auth y refrescada en `proxy.ts`.
- Las contraseñas las gestiona Supabase Auth: la aplicación nunca las ve.
- **RLS activo en todas las tablas.** Una consulta no autorizada devuelve vacío,
  no datos ajenos. Si añades una tabla, añade sus políticas en la misma
  migración.
- Toda mutación comprueba autoría antes de escribir, en la base de datos
  (`security definer`) además de en el código.
- Errores de autenticación genéricos: no revelan si el email existe.
- Los secretos se leen de variables de entorno validadas con zod al arrancar.
  `.env*` nunca se commitea.
