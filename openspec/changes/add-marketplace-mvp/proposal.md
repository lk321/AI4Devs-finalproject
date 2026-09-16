## Why

Vender un artículo usado entre particulares hoy se reparte entre grupos de
mensajería, foros y apps generalistas: el vendedor no sabe si su anuncio llegó a
alguien y el comprador no distingue una oferta real de una estafa. Loop Market
concentra publicación, búsqueda y contacto en un único flujo con identidad
verificada y estado de operación explícito.

## What Changes

- Registro e inicio de sesión con email y contraseña, sesión persistente y
  perfil público mínimo (alias, ciudad, antigüedad, valoración media).
- Publicación de artículos en tres pasos con hasta ocho fotos, precio,
  categoría, estado de conservación y ubicación aproximada.
- Ciclo de vida del anuncio: `draft`, `published`, `reserved`, `sold`,
  `archived`, con transiciones controladas por el vendedor.
- Búsqueda por texto, categoría, rango de precio, estado y distancia, con
  resultados paginados y filtros compartibles por URL.
- Conversación por anuncio entre comprador y vendedor, con oferta de precio
  opcional y aceptación explícita.
- Cierre de operación: la aceptación de una oferta reserva el artículo y genera
  la valoración mutua una vez marcado como vendido.

## Capabilities

### New Capabilities

- `identity/user-auth`: registro, inicio y cierre de sesión, sesión persistente
  y datos públicos del perfil.
- `marketplace/listings`: creación, edición, publicación y ciclo de vida de los
  anuncios, incluida la gestión de imágenes.
- `marketplace/search`: búsqueda y filtrado del catálogo publicado, orden y
  paginación de resultados.
- `marketplace/transactions`: conversaciones por anuncio, ofertas, reserva,
  cierre de venta y valoración mutua.

### Modified Capabilities

Ninguna: es la primera entrega del producto.

## Non-goals

- Pasarela de pago y custodia del dinero: el pago se acuerda fuera de la
  plataforma en el MVP.
- Logística y envíos.
- Aplicaciones móviles nativas.
- Promoción de pago, destacados y publicidad.
- Moderación automática de contenido: sólo reporte manual diferido.

## Impact

- Base de datos nueva en PostgreSQL gestionada con Prisma: `User`, `Listing`,
  `ListingImage`, `Category`, `Conversation`, `Message`, `Offer`, `Review`.
- Capas FSD nuevas en `src/`: entidades `user` y `listing`; features
  `auth-by-credentials`, `create-listing`, `filter-listings`, `send-message`,
  `make-offer`; widgets de catálogo y de conversación.
- Rutas en `app/`: `/`, `/search`, `/listings/[id]`, `/sell`, `/messages`,
  `/profile/[alias]` y los Route Handlers de autenticación y subida de imágenes.
- Dependencias nuevas: `prisma`, `@prisma/client`, `zod`, `react-hook-form`,
  `@hookform/resolvers`, `zustand`, `lucide-react`, `shadcn/ui`, `vitest`,
  `@testing-library/react`, `@playwright/test`, `lefthook`, `prettier`.
