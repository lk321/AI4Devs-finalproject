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

### Supabase sobre PostgreSQL

Supabase aporta en un solo servicio las tres piezas que el MVP necesita fuera de
la aplicación: PostgreSQL con migraciones versionadas, autenticación con sesión
gestionada y almacenamiento de imágenes. El CLI levanta el stack completo en
local con Docker, así que el entorno de desarrollo es el mismo que el de
producción.

Las invariantes viven en la base de datos, no sólo en el código:

- Restricciones `CHECK` y únicas para precio, longitudes, una sola oferta
  `pending` por conversación y una sola valoración por operación y autor.
- Disparadores para las transiciones de estado del anuncio, el bloqueo de precio
  durante la reserva, la sustitución de ofertas y el recálculo de la valoración
  media.
- Funciones `security definer` (`start_conversation`, `resolve_offer`,
  `mark_listing_sold`, `release_reservation`) para las operaciones que deben ser
  atómicas y comprobar autoría.
- **Row Level Security activo en todas las tablas**: aunque la clave pública
  llegue al navegador, la base de datos sólo devuelve lo que la política permite.

Alternativa descartada: Prisma contra una PostgreSQL propia, que obligaría a
resolver aparte autenticación y almacenamiento de imágenes, y dejaría la
autorización enteramente en el código de aplicación.

### Autenticación con Supabase Auth

Sesión en cookie gestionada por `@supabase/ssr`, refrescada en `proxy.ts` (el
antiguo middleware, renombrado en Next.js 16). `supabase/config.toml` fija
`minimum_password_length = 12`, `timebox = "720h"` (30 días) y
`sign_in_sign_ups = 10` peticiones por IP cada 5 minutos.

El hash de contraseña lo gestiona Supabase Auth (bcrypt), no la aplicación: se
sustituye la decisión de Argon2id propio de la entrega 1 por no implementar
criptografía a mano.

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
- **La búsqueda combina texto, filtros y distancia** → se resuelve en una única
  función SQL `search_listings` con índice GIN sobre `tsvector`, de modo que la
  UI recibe ya la página ordenada y el total.
- **RLS mal escrita abre la base de datos** → cada política se acompaña de un
  test de integración que comprueba el caso negativo, no sólo el positivo.

## Migration Plan

Proyecto nuevo: no hay migración de datos. Despliegue en Vercel apuntando a un
proyecto Supabase gestionado; `supabase db push` aplica las migraciones y
`supabase/seed.sql` carga las categorías. Rollback por reversión del despliegue
anterior en Vercel más una migración correctiva en Supabase.
