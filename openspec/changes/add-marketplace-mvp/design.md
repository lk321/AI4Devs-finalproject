## Context

Proyecto nuevo, sin código heredado, con un único desarrollador y plazo de tres
entregas. La motivación está en `proposal.md - Why` y el comportamiento exigible
en `specs/`. Las restricciones que condicionan el diseño son: un solo despliegue
para front y back, tiempo de onboarding cero sobre infraestructura, y la regla
del proyecto de que ningún archivo supere 300 líneas y que el código se entienda
sin comentarios.

## Goals / Non-Goals

**Goals:**

- Una sola base de código TypeScript para UI, dominio y acceso a datos.
- Frontera de validación única: el mismo esquema zod valida el formulario en el
  cliente y la entrada en el servidor.
- Estructura donde la ubicación de un archivo se deduzca de a qué funcionalidad
  pertenece, no de qué tipo de artefacto es.
- Cada requirement de `specs/` es directamente traducible a un test.

**Non-Goals:**

- Separar el backend en un servicio propio antes de tener carga que lo exija.
- Abstraer el acceso a datos tras un repositorio genérico.
- Sistema de diseño propio: se parte de shadcn/ui tal cual.

## Decisions

### Next.js 16 con App Router como front y back

Server Components para leer datos sin exponer endpoints, Server Actions para las
mutaciones de formulario y Route Handlers sólo donde hace falta un contrato HTTP
público (autenticación, subida de imágenes, y la API documentada en el readme).

Alternativas descartadas: SPA con Vite más API Node separada, que duplica tipos
y despliegues; tRPC, que añade una capa de contrato que las Server Actions ya
cubren con tipado end-to-end.

### Feature-Sliced Design v2.1 en `src/`

Capas de mayor a menor: `_app`, `_pages`, `widgets`, `features`, `entities`,
`shared`. Las capas FSD `app` y `pages` se renombran a `_app` y `_pages` porque
`app/` en la raíz pertenece al App Router. `app/` contiene sólo routing y
reexporta: `export { SearchPage as default } from '@/_pages/search'`.

Cada slice expone su API pública en `index.ts` y nada importa rutas internas.
Un slice con código exclusivo de servidor añade `index.server.ts` para que el
grafo de cliente no arrastre Prisma ni secretos. Segmentos por slice: `ui`,
`model`, `api`, `lib`, `config`.

Reparto para este MVP:

- `entities/user`, `entities/listing`: modelo de dominio, esquemas zod y tarjetas
  de presentación reutilizables.
- `features/auth-by-credentials`, `features/create-listing`,
  `features/filter-listings`, `features/send-message`, `features/make-offer`:
  una intención de usuario cada una, con su formulario y su Server Action.
- `widgets/listing-catalog`, `widgets/conversation-thread`: composición de
  features y entidades en bloques de página.
- `shared/ui` alberga los componentes de shadcn/ui; `shared/api` el cliente
  Prisma; `shared/lib` utilidades sin dominio.

Alternativa descartada: agrupar por tipo (`components/`, `hooks/`, `services/`),
que dispersa una misma funcionalidad por todo el árbol y hace que el límite de
300 líneas se resuelva creando archivos sin cohesión.

### Estado: Context API primero, zustand por excepción

Context API cubre sesión y tema, que cambian poco y se leen en muchos sitios.
`zustand` sólo para el panel de filtros de búsqueda y la lista de seguimiento,
donde el estado cambia en cada pulsación y un Context provocaría rerenders de
todo el árbol suscrito. La verdad sobre los datos vive en el servidor: no se
replica el catálogo en un store de cliente.

### Prisma sobre PostgreSQL

El modelo tiene relaciones densas y consultas con varios filtros combinados, que
es donde un ORM relacional con tipos generados evita la mayor parte de los
errores. Las migraciones versionadas dan el camino de rollback.

Alternativa descartada: Drizzle, más ligero pero con menos herramienta de
migración asistida para un proyecto que se entrega en tres hitos.

### Validación en el borde con zod

Cada feature define su esquema en `model/`. `react-hook-form` lo consume vía
`@hookform/resolvers/zod` y la Server Action correspondiente vuelve a parsearlo
antes de tocar el dominio. El cliente nunca es la única barrera.

### TDD y pirámide de tests

Vitest y Testing Library para dominio y componentes; Playwright para los tres
recorridos críticos: publicar, buscar y cerrar una operación. Cada
`#### Scenario:` de `specs/` es el nombre de un test.

## Risks / Trade-offs

- **FSD añade fricción inicial en un equipo de una persona** → se limita a las
  seis capas y se prohíben las carpetas vacías "por si acaso"; un slice nace
  cuando hay código real que meter dentro.
- **Server Actions acopla la mutación a Next.js** → la lógica de dominio vive en
  `entities/*/model`, sin importar nada de Next; la Server Action sólo valida y
  delega.
- **El límite de 300 líneas puede empujar a fragmentar artificialmente** → se
  corta por segmento FSD (`ui`, `model`, `api`), nunca por número de líneas.
- **Sin pasarela de pago, la valoración es la única señal de confianza** → se
  refuerza con identidad verificada por email y reporte manual de anuncios.
- **La búsqueda por texto con `ILIKE` degrada al crecer el catálogo** → se
  aísla en `entities/listing/api` para poder sustituirla por búsqueda de texto
  completo de PostgreSQL sin tocar la UI.

## Migration Plan

Proyecto nuevo: no hay migración de datos. Despliegue en Vercel con base de
datos PostgreSQL gestionada; `prisma migrate deploy` en el paso de build y
semillas de categorías en el primer arranque. Rollback por reversión del
despliegue anterior más `prisma migrate resolve` sobre la última migración
aplicada.
