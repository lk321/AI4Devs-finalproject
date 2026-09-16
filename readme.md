## Índice

0. [Ficha del proyecto](#0-ficha-del-proyecto)
1. [Descripción general del producto](#1-descripción-general-del-producto)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Especificación de la API](#4-especificación-de-la-api)
5. [Historias de usuario](#5-historias-de-usuario)
6. [Tickets de trabajo](#6-tickets-de-trabajo)
7. [Pull requests](#7-pull-requests)

---

## 0. Ficha del proyecto

### **0.1. Tu nombre completo:**

Antonio Orozco

### **0.2. Nombre del proyecto:**

Loop Market

### **0.3. Descripción breve del proyecto:**

Marketplace de compraventa de artículos de segunda mano entre particulares. Loop
Market reúne en un único flujo la publicación del anuncio, la búsqueda del
comprador, la negociación del precio y el cierre de la operación, con identidad
verificada y reputación construida sobre operaciones reales.

### **0.4. URL del proyecto:**

Pendiente de despliegue. Se publicará en Vercel durante la entrega 3.

> Puede ser pública o privada, en cuyo caso deberás compartir los accesos de manera segura. Puedes enviarlos a [alvaro@lidr.co](mailto:alvaro@lidr.co) usando algún servicio como [onetimesecret](https://onetimesecret.com/).

### 0.5. URL o archivo comprimido del repositorio

https://github.com/lk321/AI4Devs-finalproject

> Puedes tenerlo alojado en público o en privado, en cuyo caso deberás compartir los accesos de manera segura. Puedes enviarlos a [alvaro@lidr.co](mailto:alvaro@lidr.co) usando algún servicio como [onetimesecret](https://onetimesecret.com/). También puedes compartir por correo un archivo zip con el contenido

---

## 1. Descripción general del producto

### **1.1. Objetivo:**

Vender un artículo usado entre particulares está hoy repartido entre grupos de
mensajería, foros y aplicaciones generalistas. El vendedor publica sin saber si
su anuncio ha llegado a alguien, y el comprador no tiene forma de distinguir una
oferta real de un intento de estafa. La negociación se pierde en conversaciones
sueltas y, cuando la operación se cierra, no queda rastro que sirva a la
siguiente.

Loop Market resuelve ese recorrido completo en un solo sitio:

- **Para quien vende**, un anuncio publicado en menos de tres minutos, con
  estado explícito (publicado, reservado, vendido) y un historial que acredita
  que cumple.
- **Para quien compra**, un catálogo filtrable por lo que de verdad decide la
  compra (precio, estado del artículo y cercanía) y un perfil de vendedor con
  valoraciones de operaciones cerradas, no de promesas.
- **Para ambos**, la negociación dentro de la plataforma, con la oferta aceptada
  registrada como acuerdo y una valoración mutua que alimenta la reputación.

El valor diferencial no es el catálogo, es el **cierre trazable**: cada
operación deja constancia y esa constancia es lo que hace confiable la
siguiente.

### **1.2. Características y funcionalidades principales:**

| # | Funcionalidad | Descripción |
| --- | --- | --- |
| 1 | Registro e inicio de sesión | Alta con email, alias y contraseña. Sesión persistente de 30 días en cookie `httpOnly`. Errores genéricos que no revelan si un email existe. |
| 2 | Perfil público | Alias, ciudad, antigüedad, valoración media, operaciones cerradas y anuncios publicados. Nunca expone email ni teléfono. |
| 3 | Publicación de anuncios | Formulario de tres pasos: artículo, fotos y precio. Hasta 8 imágenes con portada reordenable. Guardado como borrador en cualquier momento. |
| 4 | Ciclo de vida del anuncio | Estados `draft`, `published`, `reserved`, `sold`, `archived` con transiciones controladas. El precio queda bloqueado mientras el artículo está reservado. |
| 5 | Búsqueda y filtrado | Texto libre insensible a acentos y mayúsculas, más filtros de categoría, rango de precio, estado de conservación y distancia. Orden por relevancia, precio o fecha. |
| 6 | Búsqueda compartible | Término, filtros, orden y página viajan en la URL: la misma dirección reproduce exactamente el mismo resultado. |
| 7 | Conversación por anuncio | Un hilo único por anuncio y comprador, con indicador de mensajes sin leer y acceso limitado a los dos participantes. |
| 8 | Ofertas y reserva | El comprador propone un importe; aceptar la oferta reserva el artículo y deja el resto de ofertas superadas. La reserva se puede liberar. |
| 9 | Cierre y valoración | El vendedor marca la venta registrando comprador, importe y fecha. Ambas partes se valoran una vez, dentro de los 30 días siguientes. |

**Fuera del alcance del MVP:** pasarela de pago y custodia del dinero, logística
y envíos, aplicaciones móviles nativas, anuncios destacados de pago y moderación
automática de contenido.

### **1.3. Diseño y experiencia de usuario:**

El material visual (capturas del recorrido completo y videotutorial) se entrega
en la **entrega 3**, junto con la aplicación desplegada. En esta entrega se
documenta el recorrido previsto:

```
Aterrizaje (/)
    catálogo destacado + buscador
        │
        ├── Búsqueda (/search) ──── filtros laterales, resultados paginados
        │        │
        │        └── Detalle (/listings/[id]) ── galería, precio, vendedor
        │                 │
        │                 └── "Contactar" ──► Conversación (/messages/[id])
        │                            │
        │                            └── Oferta ─► Aceptar ─► Reservado
        │                                                        │
        │                                                        └── Vendido ─► Valoración
        │
        └── Vender (/sell) ── paso 1 artículo · paso 2 fotos · paso 3 precio ─► Publicado
```

Tres decisiones de experiencia guían el diseño:

1. **El anuncio antes que la cuenta.** El formulario de venta se puede empezar
   sin sesión; las credenciales se piden en el último paso, cuando el usuario ya
   ha invertido esfuerzo.
2. **Los filtros en la URL.** Una búsqueda es un enlace: se comparte, se guarda
   en favoritos y sobrevive a la recarga.
3. **El estado siempre visible.** Publicado, reservado y vendido se muestran con
   el mismo indicador en el catálogo, en el detalle y en la conversación, para
   que nadie escriba a un artículo que ya no está disponible.

### **1.4. Instrucciones de instalación:**

**Requisitos:** Bun 1.4 o superior, PostgreSQL 16 o superior (local o en Docker)
y Git.

```bash
# 1. Clonar el repositorio
git clone https://github.com/lk321/AI4Devs-finalproject.git
cd AI4Devs-finalproject

# 2. Instalar dependencias (lefthook se instala solo en el postinstall)
bun install

# 3. Configurar el entorno
cp .env.example .env
# Editar .env:
#   DATABASE_URL="postgresql://user:password@localhost:5432/loop_market"
#   AUTH_SECRET="<cadena aleatoria de 32+ caracteres>"

# 4. Levantar la base de datos (opcional, si no hay PostgreSQL local)
docker compose up -d db

# 5. Aplicar migraciones y semillas de categorías
bun run db:migrate
bun run db:seed

# 6. Arrancar
bun run dev          # http://localhost:3000
```

**Comprobaciones de calidad:**

```bash
bun run lint         # eslint
bun run format       # prettier --write
bun run typecheck    # tsc --noEmit
bun run test         # vitest (unidad e integración)
bun run test:e2e     # playwright (extremo a extremo)
```

> La instalación descrita corresponde al estado objetivo del proyecto. En esta
> entrega 1 el repositorio contiene únicamente la documentación técnica y las
> especificaciones; el código se incorpora en la entrega 2.

---

## 2. Arquitectura del Sistema

### **2.1. Diagrama de arquitectura:**

```mermaid
flowchart TB
    subgraph Cliente["Navegador"]
        RSC["React Server Components<br/>(HTML transmitido)"]
        CC["Client Components<br/>react-hook-form · zod · zustand"]
    end

    subgraph Vercel["Vercel — Next.js 16"]
        direction TB
        Router["App Router<br/>app/ · routing y re-export"]
        Pages["_pages · widgets<br/>composición de pantalla"]
        Features["features<br/>Server Actions + formularios"]
        Entities["entities<br/>dominio + esquemas zod"]
        Shared["shared<br/>ui · api · lib · config"]
        Handlers["Route Handlers<br/>/api/auth · /api/uploads · /api/listings"]
    end

    subgraph Datos["Persistencia"]
        PG[("PostgreSQL<br/>Neon")]
        Blob[("Blob Storage<br/>imágenes")]
    end

    RSC --> Router
    CC -- "Server Action" --> Features
    CC -- "fetch" --> Handlers
    Router --> Pages --> Features --> Entities --> Shared
    Handlers --> Entities
    Entities -- "Prisma Client" --> PG
    Features -- "upload" --> Blob
```

**Patrón:** monolito modular con **Feature-Sliced Design v2.1** en el interior.
Front y back comparten proceso y tipos; la separación no es física, es de capas,
y el linter la vigila.

**Por qué esta arquitectura.** El producto es un CRUD con reglas de negocio
concentradas en el ciclo de vida del anuncio y en la negociación. Separar el
backend en un servicio propio antes de tener carga que lo exija duplicaría tipos,
despliegues y contratos sin ganar nada. Next.js 16 permite leer datos desde
Server Components sin exponer endpoints y mutar con Server Actions con tipado de
extremo a extremo, así que la API HTTP queda reservada para lo que de verdad
necesita un contrato público.

FSD aporta lo que al App Router le falta: el App Router organiza **rutas**, no
**funcionalidades**. Con FSD, la respuesta a "¿dónde está el código de publicar
un anuncio?" es una sola carpeta, y la regla de importación descendente hace
imposible el ciclo entre módulos.

**Beneficios:**

- Un solo despliegue, un solo `tsconfig`, un solo conjunto de tipos.
- Alta cohesión: una funcionalidad completa cabe en un directorio.
- Dependencias dirigidas: `_app > _pages > widgets > features > entities >
  shared`, sin ciclos posibles.
- Menos JavaScript en el cliente: Server Components por defecto, `'use client'`
  sólo en las hojas del árbol que lo necesitan.

**Sacrificios asumidos:**

- **Acoplamiento a Next.js.** Las Server Actions son específicas del framework.
  Se mitiga manteniendo la lógica de dominio en `entities/*/model`, sin ningún
  import de Next: la Server Action valida y delega.
- **Escalado conjunto.** No se puede escalar la lectura del catálogo por separado
  de la mensajería.
- **Curva de entrada de FSD.** Convenciones que hay que aprender antes de
  escribir el primer archivo; a cambio, dejan de discutirse en cada revisión.
- **Vendor lock-in parcial** con Vercel para el despliegue y el almacenamiento de
  imágenes.

### **2.2. Descripción de componentes principales:**

| Componente | Tecnología | Responsabilidad |
| --- | --- | --- |
| **App Router** (`app/`) | Next.js 16 | Routing, layouts, metadatos y streaming. No contiene lógica: re-exporta desde `_pages`. |
| **Capa `_pages`** | React 19 Server Components | Compone una pantalla completa a partir de widgets y features. Resuelve los datos del servidor. |
| **Capa `widgets`** | React 19 | Bloques autónomos reutilizables: catálogo de resultados, hilo de conversación, cabecera. |
| **Capa `features`** | Server Actions + react-hook-form + zod | Una intención de usuario por slice: autenticarse, publicar, filtrar, ofertar, mensajear. |
| **Capa `entities`** | TypeScript + zod + Prisma Client | Objetos de negocio (`user`, `listing`) con su modelo, sus invariantes y su acceso a datos. |
| **Capa `shared`** | shadcn/ui, lucide-react, Tailwind v4 | Componentes sin dominio, cliente Prisma, utilidades y configuración. |
| **Route Handlers** | Next.js 16 | Contratos HTTP públicos: autenticación, subida de imágenes y la API documentada en §4. |
| **Estado de cliente** | Context API + zustand | Context para sesión y tema; zustand para el panel de filtros, donde cada pulsación cambia el estado. |
| **Persistencia** | PostgreSQL 16 + Prisma | Esquema, migraciones versionadas y consultas tipadas. |
| **Almacenamiento de imágenes** | Blob storage | Imágenes de anuncios servidas por CDN y optimizadas por `next/image`. |
| **Calidad** | ESLint, Prettier, lefthook, commitlint | Lint y formato en `pre-commit`, typecheck y tests en `pre-push`, formato de commit en `commit-msg`. |
| **Tests** | Vitest, Testing Library, Playwright | Unidad e integración junto al código; E2E sobre los tres recorridos críticos. |

### **2.3. Descripción de alto nivel del proyecto y estructura de ficheros**

```
.
├── app/                        # App Router: SOLO routing, re-exporta _pages
│   ├── (marketing)/page.tsx
│   ├── search/page.tsx
│   ├── listings/[id]/page.tsx
│   ├── sell/page.tsx
│   ├── messages/[id]/page.tsx
│   └── api/
│       ├── auth/[...route]/route.ts
│       ├── listings/route.ts
│       └── uploads/route.ts
├── src/
│   ├── _app/                   # providers, estilos globales, arranque
│   ├── _pages/                 # una carpeta por pantalla
│   │   ├── home/
│   │   ├── search/
│   │   ├── listing-detail/
│   │   └── sell/
│   ├── widgets/
│   │   ├── listing-catalog/
│   │   ├── conversation-thread/
│   │   └── site-header/
│   ├── features/
│   │   ├── auth-by-credentials/
│   │   ├── create-listing/
│   │   ├── filter-listings/
│   │   ├── send-message/
│   │   └── make-offer/
│   ├── entities/
│   │   ├── user/
│   │   │   ├── model/          # tipos, esquemas zod, invariantes
│   │   │   ├── api/            # consultas Prisma
│   │   │   ├── ui/             # tarjeta de perfil, avatar
│   │   │   └── index.ts
│   │   └── listing/
│   └── shared/
│       ├── ui/                 # shadcn/ui
│       ├── api/                # cliente Prisma
│       ├── lib/                # utilidades sin dominio
│       └── config/             # entorno validado con zod
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── e2e/                        # Playwright
├── openspec/                   # especificaciones del producto
│   ├── config.yaml
│   └── changes/add-marketplace-mvp/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/
├── AGENTS.md                   # instrucciones para asistentes de código
├── lefthook.yml
└── readme.md
```

**Patrón: Feature-Sliced Design v2.1.** Tres conceptos:

- **Capas** (vertical): `_app`, `_pages`, `widgets`, `features`, `entities`,
  `shared`. Las capas FSD `app` y `pages` se renombran con guion bajo porque
  `app/` en la raíz pertenece al App Router.
- **Slices** (horizontal): división por dominio dentro de una capa
  (`listing`, `user`, `create-listing`…).
- **Segmentos** (técnico): dentro de un slice, `ui`, `model`, `api`, `lib`,
  `config`.

**Reglas de importación:**

1. Una capa sólo importa de capas **estrictamente inferiores**.
2. Dos slices de la misma capa **nunca** se importan entre sí.
3. Todo slice expone su API pública por `index.ts`; nadie accede a rutas
   internas.
4. El código exclusivo de servidor se exporta por `index.server.ts`, para que el
   grafo de cliente no arrastre Prisma ni secretos.

Las reglas 1 y 2 están aplicadas por ESLint: violarlas rompe el build.

### **2.4. Infraestructura y despliegue**

```mermaid
flowchart LR
    Dev["Local<br/>bun run dev"] -- push --> GH["GitHub<br/>feature/entrega-N-AO"]
    GH --> CI["GitHub Actions<br/>lint · typecheck · test · e2e"]
    CI -- "PR verde" --> Prev["Vercel Preview<br/>URL por PR"]
    Prev -- "merge a main" --> Prod["Vercel Production"]
    Prod --> Mig["prisma migrate deploy"]
    Mig --> PG[("PostgreSQL gestionada")]
    Prod --> Blob[("Blob Storage")]
```

**Proceso de despliegue:**

1. Cada `push` a una rama de entrega dispara el pipeline: `lint`, `typecheck`,
   `test` y `test:e2e`. Los hooks de `lefthook` ya han ejecutado lint y formato
   en local, así que el pipeline rara vez falla por estilo.
2. Vercel genera un **despliegue de vista previa** por Pull Request, con su
   propia URL y su rama de base de datos, para revisar el cambio funcionando.
3. El merge a `main` promociona a producción. El paso de build ejecuta
   `prisma migrate deploy`, que aplica sólo las migraciones pendientes.
4. **Rollback:** promoción del despliegue anterior en Vercel y, si la migración
   fue destructiva, `prisma migrate resolve` sobre la última migración aplicada.

**Entornos:** `local` (PostgreSQL en Docker), `preview` (rama de base de datos
efímera por PR) y `production`. Los secretos viven en las variables de entorno de
Vercel y se validan con zod al arrancar: si falta una, la aplicación no levanta.

### **2.5. Seguridad**

| Práctica | Implementación |
| --- | --- |
| **Contraseñas** | Hash Argon2id con sal por usuario. Nunca se registran en logs ni se devuelven en ninguna respuesta. |
| **Sesión** | Cookie `httpOnly`, `secure`, `sameSite=lax`, 30 días. Inaccesible desde JavaScript, lo que anula el robo de sesión por XSS. |
| **Enumeración de cuentas** | El error de inicio de sesión es idéntico para email inexistente y contraseña incorrecta: *"email o contraseña incorrectos"*. |
| **Fuerza bruta** | Más de 10 intentos fallidos desde la misma IP en 15 minutos bloquean nuevos intentos durante 15 minutos. |
| **Validación de entrada** | Esquema zod único por feature: lo usa el formulario en cliente y lo vuelve a parsear la Server Action en servidor. El cliente nunca es la única barrera. Un precio negativo enviado a mano se rechaza en el servidor. |
| **Autorización** | Toda mutación comprueba autoría antes de escribir: editar un anuncio ajeno o aceptar una oferta de la que no eres vendedor devuelve error de autorización, no un 404 genérico que dé pistas. |
| **Acceso a conversaciones** | Sólo los dos participantes pueden leer un hilo; el resto recibe error de autorización. |
| **Inyección SQL** | Consultas parametrizadas por Prisma. No se construye SQL por concatenación. |
| **Subida de archivos** | Lista blanca de tipos (JPEG, PNG, WebP), 5 MB por archivo, máximo 8 por anuncio. El tipo se verifica por contenido, no por extensión. |
| **Datos personales** | El perfil público expone alias, ciudad y reputación. Email y teléfono no salen nunca de la base de datos. |
| **Secretos** | Variables de entorno validadas con zod al arrancar. `.env*` está en `.gitignore`. |
| **Cabeceras** | CSP, `X-Content-Type-Options`, `Referrer-Policy` y HSTS desde el middleware. |

### **2.6. Tests**

La especificación es la fuente de los tests: cada `#### Scenario:` de
`openspec/changes/add-marketplace-mvp/specs/` da nombre a un test.

**Unidad (Vitest).** Invariantes de dominio sin tocar la base de datos:

- El esquema de anuncio rechaza títulos de menos de 5 caracteres, precios no
  positivos y precios de 100.000 € o más.
- La máquina de estados acepta `published → reserved` y rechaza `draft → sold`.
- La regla de ofertas marca como `superseded` la anterior cuando llega una nueva.

**Componente (Testing Library).** Comportamiento observable por rol accesible,
nunca por clase CSS:

- El formulario de publicación no avanza de paso con campos inválidos y muestra
  cada error junto a su control.
- Cambiar un filtro de búsqueda no rerenderiza las tarjetas de resultado
  (verificación de la elección de zustand frente a Context).

**Integración.** Contra una base de datos real en Docker:

- La inserción de un email o un alias duplicado falla por restricción única.
- Una segunda conversación del mismo comprador sobre el mismo anuncio reutiliza
  el hilo existente.
- Aceptar una oferta reserva el anuncio y marca el resto como `superseded` en la
  misma transacción.

**Extremo a extremo (Playwright).** Los tres recorridos críticos:

1. **Publicar:** registrarse, completar los tres pasos con dos imágenes,
   publicar y ver el anuncio en el catálogo.
2. **Buscar:** filtrar por categoría y rango de precio, recargar la página y
   comprobar que los filtros se conservan.
3. **Cerrar:** contactar, ofertar, aceptar la oferta, marcar como vendido y
   valorar.

**Seguridad.** Casos negativos como tests de primera clase: precio negativo
enviado sin pasar por el formulario, edición de un anuncio ajeno y lectura de una
conversación en la que no se participa.

---

## 3. Modelo de Datos

### **3.1. Diagrama del modelo de datos:**

```mermaid
erDiagram
    USER ||--o{ LISTING : "publica"
    USER ||--o{ CONVERSATION : "inicia como comprador"
    USER ||--o{ MESSAGE : "escribe"
    USER ||--o{ OFFER : "propone"
    USER ||--o{ REVIEW : "emite"
    USER ||--o{ REVIEW : "recibe"
    CATEGORY ||--o{ LISTING : "clasifica"
    CATEGORY ||--o{ CATEGORY : "contiene"
    LISTING ||--o{ LISTING_IMAGE : "muestra"
    LISTING ||--o{ CONVERSATION : "origina"
    LISTING ||--o| REVIEW : "cierra con"
    CONVERSATION ||--o{ MESSAGE : "contiene"
    CONVERSATION ||--o{ OFFER : "registra"

    USER {
        uuid id PK
        citext email UK "NOT NULL"
        citext alias UK "NOT NULL, 3-24 car."
        varchar password_hash "NOT NULL, Argon2id"
        varchar city "NOT NULL"
        decimal latitude "NULL, 9,6"
        decimal longitude "NULL, 9,6"
        numeric rating_average "NULL, 3,2 (1.00-5.00)"
        integer closed_deals "NOT NULL, default 0"
        timestamptz created_at "NOT NULL, default now()"
        timestamptz updated_at "NOT NULL"
    }

    CATEGORY {
        uuid id PK
        varchar slug UK "NOT NULL"
        varchar name "NOT NULL"
        uuid parent_id FK "NULL, autorreferencia"
        integer position "NOT NULL, default 0"
    }

    LISTING {
        uuid id PK
        uuid seller_id FK "NOT NULL, USER.id"
        uuid category_id FK "NOT NULL, CATEGORY.id"
        varchar title "NOT NULL, 5-80 car."
        text description "NOT NULL, 20-2000 car."
        integer price_cents "NOT NULL, > 0 y < 10000000"
        listing_condition condition "NOT NULL, enum"
        listing_status status "NOT NULL, default draft"
        varchar city "NOT NULL"
        decimal latitude "NOT NULL, 9,6"
        decimal longitude "NOT NULL, 9,6"
        timestamptz published_at "NULL"
        timestamptz sold_at "NULL"
        uuid buyer_id FK "NULL, USER.id"
        integer sold_price_cents "NULL"
        timestamptz created_at "NOT NULL, default now()"
        timestamptz updated_at "NOT NULL"
    }

    LISTING_IMAGE {
        uuid id PK
        uuid listing_id FK "NOT NULL, LISTING.id, ON DELETE CASCADE"
        varchar url "NOT NULL"
        varchar alt "NOT NULL"
        integer position "NOT NULL, UK(listing_id, position)"
        integer bytes "NOT NULL, <= 5242880"
    }

    CONVERSATION {
        uuid id PK
        uuid listing_id FK "NOT NULL, LISTING.id"
        uuid buyer_id FK "NOT NULL, USER.id"
        timestamptz buyer_read_at "NULL"
        timestamptz seller_read_at "NULL"
        timestamptz created_at "NOT NULL, default now()"
    }

    MESSAGE {
        uuid id PK
        uuid conversation_id FK "NOT NULL, CONVERSATION.id, ON DELETE CASCADE"
        uuid sender_id FK "NOT NULL, USER.id"
        text body "NOT NULL, 1-1000 car."
        timestamptz created_at "NOT NULL, default now()"
    }

    OFFER {
        uuid id PK
        uuid conversation_id FK "NOT NULL, CONVERSATION.id"
        uuid buyer_id FK "NOT NULL, USER.id"
        integer amount_cents "NOT NULL, > 0 y <= LISTING.price_cents"
        offer_status status "NOT NULL, default pending"
        timestamptz resolved_at "NULL"
        timestamptz created_at "NOT NULL, default now()"
    }

    REVIEW {
        uuid id PK
        uuid listing_id FK "NOT NULL, LISTING.id"
        uuid author_id FK "NOT NULL, USER.id"
        uuid subject_id FK "NOT NULL, USER.id"
        smallint score "NOT NULL, 1-5"
        varchar comment "NULL, <= 500 car."
        timestamptz created_at "NOT NULL, default now()"
    }
```

### **3.2. Descripción de entidades principales:**

#### USER

Persona registrada. Actúa indistintamente como vendedora y como compradora: no
hay roles separados.

| Atributo | Tipo | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | `uuid` | **PK** | Identificador. |
| `email` | `citext` | **UNIQUE**, NOT NULL | Credencial de acceso. Nunca es público. |
| `alias` | `citext` | **UNIQUE**, NOT NULL, 3-24 alfanuméricos | Identidad pública y segmento de URL del perfil. |
| `password_hash` | `varchar(255)` | NOT NULL | Argon2id con sal por usuario. |
| `city` | `varchar(80)` | NOT NULL | Ciudad declarada, base del filtro por distancia. |
| `latitude` / `longitude` | `decimal(9,6)` | NULL | Centroide de la ciudad, no la ubicación exacta. |
| `rating_average` | `numeric(3,2)` | NULL, 1.00-5.00 | Media de las valoraciones recibidas. `NULL` mientras no hay ninguna. |
| `closed_deals` | `integer` | NOT NULL, default 0 | Operaciones cerradas como comprador o vendedor. |
| `created_at` | `timestamptz` | NOT NULL | Antigüedad mostrada en el perfil. |

**Relaciones:** 1:N con `LISTING` (como vendedor y, opcionalmente, como
comprador), `CONVERSATION`, `MESSAGE`, `OFFER` y `REVIEW` (como autor y como
sujeto).

#### CATEGORY

Taxonomía jerárquica en dos niveles. Se carga por semillas; no la edita el
usuario.

| Atributo | Tipo | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | `uuid` | **PK** | Identificador. |
| `slug` | `varchar(60)` | **UNIQUE**, NOT NULL | Segmento de URL y clave del filtro. |
| `name` | `varchar(80)` | NOT NULL | Nombre mostrado. |
| `parent_id` | `uuid` | **FK** → `CATEGORY.id`, NULL | Autorreferencia. `NULL` en las categorías raíz. |
| `position` | `integer` | NOT NULL, default 0 | Orden de presentación. |

**Relaciones:** 1:N consigo misma (padre-hijas) y 1:N con `LISTING`.

#### LISTING

Anuncio de un artículo. Es la entidad central: concentra el ciclo de vida y el
resultado de la operación.

| Atributo | Tipo | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | `uuid` | **PK** | Identificador. |
| `seller_id` | `uuid` | **FK** → `USER.id`, NOT NULL | Autor. Único que puede editar o cambiar el estado. |
| `category_id` | `uuid` | **FK** → `CATEGORY.id`, NOT NULL | Categoría hoja. |
| `title` | `varchar(80)` | NOT NULL, 5-80 car. | Indexado para búsqueda por texto. |
| `description` | `text` | NOT NULL, 20-2000 car. | Indexado para búsqueda por texto. |
| `price_cents` | `integer` | NOT NULL, > 0, < 10.000.000 | Precio en céntimos: sin decimales binarios, sin errores de redondeo. |
| `condition` | `enum` | NOT NULL | `nuevo`, `como_nuevo`, `bueno`, `aceptable`, `para_piezas`. |
| `status` | `enum` | NOT NULL, default `draft` | `draft`, `published`, `reserved`, `sold`, `archived`. |
| `city` | `varchar(80)` | NOT NULL | Ubicación del artículo. |
| `latitude` / `longitude` | `decimal(9,6)` | NOT NULL | Centroide de la ciudad para el filtro por distancia. |
| `published_at` | `timestamptz` | NULL | Se fija al publicar. Criterio del orden por novedad. |
| `sold_at` | `timestamptz` | NULL | Se fija al cerrar. Abre la ventana de 30 días de valoración. |
| `buyer_id` | `uuid` | **FK** → `USER.id`, NULL | Comprador final. `NOT NULL` obligatorio cuando `status = sold`. |
| `sold_price_cents` | `integer` | NULL | Importe realmente acordado, que puede diferir de `price_cents`. |

**Restricciones adicionales:** `CHECK (status <> 'sold' OR (buyer_id IS NOT NULL
AND sold_at IS NOT NULL AND sold_price_cents IS NOT NULL))` y
`CHECK (buyer_id <> seller_id)`.

**Índices:** `(status, published_at DESC)` para el catálogo,
`(category_id, price_cents)` para el filtro combinado más frecuente, y un índice
GIN sobre `to_tsvector('spanish', title || ' ' || description)` para la búsqueda
por texto.

**Relaciones:** N:1 con `USER` y `CATEGORY`; 1:N con `LISTING_IMAGE` (borrado en
cascada) y `CONVERSATION`; 1:0..2 con `REVIEW`.

#### LISTING_IMAGE

Imagen de un anuncio. Entidad propia porque el orden es dato de negocio: la
posición 0 es la portada.

| Atributo | Tipo | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | `uuid` | **PK** | Identificador. |
| `listing_id` | `uuid` | **FK** → `LISTING.id`, NOT NULL, ON DELETE CASCADE | Anuncio al que pertenece. |
| `url` | `varchar(500)` | NOT NULL | Ubicación en el blob storage. |
| `alt` | `varchar(140)` | NOT NULL | Texto alternativo, obligatorio por accesibilidad. |
| `position` | `integer` | NOT NULL, **UNIQUE** `(listing_id, position)`, 0-7 | Orden en la galería. 0 es la portada. |
| `bytes` | `integer` | NOT NULL, ≤ 5.242.880 | Tamaño; refuerza en base de datos el límite de 5 MB. |

#### CONVERSATION

Hilo entre el comprador y el vendedor sobre un anuncio concreto.

| Atributo | Tipo | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | `uuid` | **PK** | Identificador. |
| `listing_id` | `uuid` | **FK** → `LISTING.id`, NOT NULL | Anuncio negociado. |
| `buyer_id` | `uuid` | **FK** → `USER.id`, NOT NULL | Comprador interesado. |
| `buyer_read_at` / `seller_read_at` | `timestamptz` | NULL | Última lectura de cada parte; base del contador de no leídos. |

**Restricciones:** **UNIQUE** `(listing_id, buyer_id)` — un solo hilo por anuncio
y comprador, que es la regla que impide duplicar conversaciones. El vendedor se
deduce de `LISTING.seller_id` y no se duplica aquí.

#### MESSAGE

Mensaje de texto dentro de una conversación.

| Atributo | Tipo | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | `uuid` | **PK** | Identificador. |
| `conversation_id` | `uuid` | **FK** → `CONVERSATION.id`, NOT NULL, ON DELETE CASCADE | Hilo. |
| `sender_id` | `uuid` | **FK** → `USER.id`, NOT NULL | Autor; debe ser uno de los dos participantes. |
| `body` | `text` | NOT NULL, 1-1000 car. | Contenido. |
| `created_at` | `timestamptz` | NOT NULL | Orden cronológico. Indexado junto a `conversation_id`. |

#### OFFER

Propuesta de precio del comprador dentro de una conversación.

| Atributo | Tipo | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | `uuid` | **PK** | Identificador. |
| `conversation_id` | `uuid` | **FK** → `CONVERSATION.id`, NOT NULL | Hilo donde se negocia. |
| `buyer_id` | `uuid` | **FK** → `USER.id`, NOT NULL | Quien propone. |
| `amount_cents` | `integer` | NOT NULL, > 0, ≤ `LISTING.price_cents` | Importe ofrecido. |
| `status` | `enum` | NOT NULL, default `pending` | `pending`, `accepted`, `rejected`, `superseded`. |
| `resolved_at` | `timestamptz` | NULL | Momento de aceptación, rechazo o sustitución. |

**Restricciones:** índice único parcial sobre `(conversation_id)` donde
`status = 'pending'` — sólo una oferta viva por conversación.

#### REVIEW

Valoración emitida tras cerrar una operación.

| Atributo | Tipo | Restricciones | Descripción |
| --- | --- | --- | --- |
| `id` | `uuid` | **PK** | Identificador. |
| `listing_id` | `uuid` | **FK** → `LISTING.id`, NOT NULL | Operación valorada; debe estar en `sold`. |
| `author_id` | `uuid` | **FK** → `USER.id`, NOT NULL | Quien valora. |
| `subject_id` | `uuid` | **FK** → `USER.id`, NOT NULL | Quien recibe la valoración. |
| `score` | `smallint` | NOT NULL, 1-5 | Puntuación. |
| `comment` | `varchar(500)` | NULL | Comentario opcional. |

**Restricciones:** **UNIQUE** `(listing_id, author_id)` — una sola valoración por
operación y autor; `CHECK (author_id <> subject_id)`. La ventana de 30 días desde
`LISTING.sold_at` se aplica en la capa de dominio.

---

## 4. Especificación de la API

Tres endpoints públicos. El resto de mutaciones usa Server Actions, con tipado
de extremo a extremo y sin contrato HTTP que mantener.

```yaml
openapi: 3.1.0
info:
  title: Loop Market API
  version: 1.0.0
servers:
  - url: https://loop-market.vercel.app/api

paths:
  /listings:
    get:
      summary: Buscar anuncios publicados
      description: Devuelve los anuncios en estado published o reserved que cumplen los filtros. No requiere sesión.
      parameters:
        - { name: q, in: query, schema: { type: string, maxLength: 80 }, description: Texto libre en título y descripción, insensible a mayúsculas y acentos }
        - { name: category, in: query, schema: { type: string }, description: Slug de categoría }
        - { name: minPrice, in: query, schema: { type: integer, minimum: 0 }, description: Precio mínimo en céntimos }
        - { name: maxPrice, in: query, schema: { type: integer, minimum: 0 }, description: Precio máximo en céntimos }
        - { name: condition, in: query, schema: { type: string, enum: [nuevo, como_nuevo, bueno, aceptable, para_piezas] } }
        - { name: city, in: query, schema: { type: string } }
        - { name: distanceKm, in: query, schema: { type: integer, minimum: 1, maximum: 500 } }
        - { name: sort, in: query, schema: { type: string, enum: [relevance, price_asc, price_desc, newest], default: relevance } }
        - { name: page, in: query, schema: { type: integer, minimum: 1, default: 1 } }
      responses:
        '200':
          description: Página de resultados
          content:
            application/json:
              schema:
                type: object
                required: [items, total, page, pageSize]
                properties:
                  items:
                    type: array
                    items: { $ref: '#/components/schemas/ListingSummary' }
                  total: { type: integer }
                  page: { type: integer }
                  pageSize: { type: integer, const: 24 }

    post:
      summary: Crear un anuncio
      description: Crea un anuncio en estado draft a nombre del usuario autenticado.
      security: [{ sessionCookie: [] }]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/ListingInput' }
      responses:
        '201':
          description: Anuncio creado
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Listing' }
        '401': { $ref: '#/components/responses/Unauthorized' }
        '422': { $ref: '#/components/responses/ValidationError' }

  /listings/{id}/offers:
    post:
      summary: Ofertar por un anuncio
      description: Registra una oferta del comprador. Marca como superseded cualquier oferta pendiente previa del mismo comprador.
      security: [{ sessionCookie: [] }]
      parameters:
        - { name: id, in: path, required: true, schema: { type: string, format: uuid } }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [amountCents]
              properties:
                amountCents: { type: integer, minimum: 1, description: No puede superar el precio del anuncio }
                message: { type: string, maxLength: 1000 }
      responses:
        '201':
          description: Oferta registrada
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Offer' }
        '401': { $ref: '#/components/responses/Unauthorized' }
        '403': { description: El vendedor no puede ofertar por su propio anuncio }
        '409': { description: El anuncio no admite ofertas en su estado actual }
        '422': { $ref: '#/components/responses/ValidationError' }

components:
  securitySchemes:
    sessionCookie:
      type: apiKey
      in: cookie
      name: lm_session

  responses:
    Unauthorized:
      description: Sesión requerida o expirada
    ValidationError:
      description: Entrada inválida
      content:
        application/json:
          schema:
            type: object
            properties:
              message: { type: string }
              issues:
                type: array
                items:
                  type: object
                  properties:
                    path: { type: string }
                    message: { type: string }

  schemas:
    ListingSummary:
      type: object
      required: [id, title, priceCents, condition, status, city, coverUrl]
      properties:
        id: { type: string, format: uuid }
        title: { type: string }
        priceCents: { type: integer }
        condition: { type: string }
        status: { type: string, enum: [published, reserved] }
        city: { type: string }
        distanceKm: { type: number, nullable: true }
        coverUrl: { type: string, format: uri }
        publishedAt: { type: string, format: date-time }

    ListingInput:
      type: object
      required: [title, description, priceCents, categorySlug, condition, city]
      properties:
        title: { type: string, minLength: 5, maxLength: 80 }
        description: { type: string, minLength: 20, maxLength: 2000 }
        priceCents: { type: integer, minimum: 1, maximum: 9999999 }
        categorySlug: { type: string }
        condition: { type: string, enum: [nuevo, como_nuevo, bueno, aceptable, para_piezas] }
        city: { type: string, maxLength: 80 }
        imageIds:
          type: array
          minItems: 1
          maxItems: 8
          items: { type: string, format: uuid }

    Listing:
      allOf:
        - $ref: '#/components/schemas/ListingSummary'
        - type: object
          properties:
            description: { type: string }
            sellerAlias: { type: string }
            images:
              type: array
              items:
                type: object
                properties:
                  url: { type: string, format: uri }
                  alt: { type: string }

    Offer:
      type: object
      properties:
        id: { type: string, format: uuid }
        conversationId: { type: string, format: uuid }
        amountCents: { type: integer }
        status: { type: string, enum: [pending, accepted, rejected, superseded] }
        createdAt: { type: string, format: date-time }
```

**Ejemplo — buscar bicicletas de hasta 300 € cerca de Madrid**

```http
GET /api/listings?q=bicicleta&category=deporte&maxPrice=30000&city=Madrid&distanceKm=25&sort=price_asc
```

```json
{
  "items": [
    {
      "id": "0f2b6a1e-4c9d-4b7a-9a11-2d3e4f5a6b7c",
      "title": "Bicicleta de montaña 27,5\"",
      "priceCents": 18000,
      "condition": "bueno",
      "status": "published",
      "city": "Alcobendas",
      "distanceKm": 14.2,
      "coverUrl": "https://cdn.loop-market.app/listings/0f2b6a1e/cover.webp",
      "publishedAt": "2026-09-12T09:31:04Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 24
}
```

**Ejemplo — ofertar 150 € por un anuncio de 180 €**

```http
POST /api/listings/0f2b6a1e-4c9d-4b7a-9a11-2d3e4f5a6b7c/offers
Content-Type: application/json
Cookie: lm_session=...

{ "amountCents": 15000, "message": "¿Aceptarías 150 € si la recojo hoy?" }
```

```json
{
  "id": "9c1d2e3f-5a6b-4c7d-8e9f-0a1b2c3d4e5f",
  "conversationId": "3a4b5c6d-7e8f-4a1b-9c2d-3e4f5a6b7c8d",
  "amountCents": 15000,
  "status": "pending",
  "createdAt": "2026-09-16T11:02:47Z"
}
```

---

## 5. Historias de Usuario

Las historias se gestionan con **OpenSpec** en
`openspec/changes/add-marketplace-mvp/specs/`, donde cada criterio de aceptación
es un `#### Scenario:` que se traduce directamente en un test. A continuación,
las tres principales.

**Historia de Usuario 1**

> **Como** persona que quiere deshacerse de un artículo que ya no usa,
> **quiero** publicar un anuncio con fotos, precio y estado en pocos minutos,
> **para** que quien lo necesite pueda encontrarlo y contactarme sin que yo tenga
> que perseguir a nadie.

*Spec: `marketplace/listings`*

**Criterios de aceptación**

- **Dado** que tengo sesión iniciada, **cuando** completo título, descripción,
  precio, categoría, estado y ciudad y subo al menos una foto, **entonces** el
  anuncio se guarda como borrador y veo su vista previa.
- **Dado** un borrador completo, **cuando** pulso "Publicar", **entonces** el
  anuncio pasa a `published`, registra la fecha y aparece en el catálogo de
  inmediato.
- **Dado** un formulario con el título de menos de 5 caracteres o el precio a
  cero, **cuando** intento avanzar, **entonces** no avanzo y veo el error junto
  a cada campo afectado.
- **Dado** que subo una novena foto, **cuando** se procesa, **entonces** se
  rechaza indicando el máximo de 8.
- **Dado** que arrastro una foto a la primera posición, **cuando** guardo,
  **entonces** esa foto pasa a ser la portada.
- **Dado** que no tengo sesión, **cuando** intento publicar, **entonces** se me
  redirige al acceso y, al autenticarme, vuelvo al formulario con lo escrito.

**Notas:** el precio se valida también en servidor; un envío manipulado con
precio negativo se rechaza sin persistir nada.

**Estimación:** 8 puntos · **Prioridad:** imprescindible

---

**Historia de Usuario 2**

> **Como** persona que busca un artículo concreto de segunda mano,
> **quiero** filtrar el catálogo por precio, estado y cercanía,
> **para** ver sólo lo que puedo permitirme y recoger sin desplazarme medio país.

*Spec: `marketplace/search`*

**Criterios de aceptación**

- **Dado** el catálogo publicado, **cuando** busco "bicicleta", **entonces** veo
  los anuncios visibles cuyo título o descripción contienen el término, sin que
  importen acentos ni mayúsculas.
- **Dado** un resultado de búsqueda, **cuando** aplico categoría "deporte",
  precio entre 50 y 200 € y estado "como nuevo", **entonces** sólo veo los
  anuncios que cumplen las tres condiciones a la vez.
- **Dado** que indico Madrid y 25 km, **cuando** se aplica el filtro,
  **entonces** desaparecen los anuncios cuya ciudad está más lejos.
- **Dado** un conjunto de filtros aplicados, **cuando** recargo la página o
  comparto la URL, **entonces** se reproduce exactamente la misma búsqueda.
- **Dado** que hay 60 coincidencias, **cuando** paso a la página 2, **entonces**
  veo los resultados 25 a 48 y el total de 60.
- **Dado** que ningún anuncio coincide, **cuando** se muestra el resultado,
  **entonces** veo un estado vacío que sugiere ampliar la búsqueda.
- **Dado** un anuncio en borrador, vendido o archivado, **cuando** coincide con
  el término, **entonces** no aparece en los resultados.

**Notas:** los filtros viven en un store de zustand precisamente para que
cambiar uno no rerenderice las tarjetas de resultado.

**Estimación:** 5 puntos · **Prioridad:** imprescindible

---

**Historia de Usuario 3**

> **Como** comprador interesado en un artículo,
> **quiero** negociar el precio con el vendedor y cerrar el acuerdo dentro de la
> plataforma,
> **para** tener constancia de lo pactado y no depender de conversaciones
> sueltas en otra aplicación.

*Spec: `marketplace/transactions`*

**Criterios de aceptación**

- **Dado** un anuncio publicado que no es mío, **cuando** envío el primer
  mensaje, **entonces** se crea la conversación y aparece en la bandeja de
  ambos.
- **Dado** que ya escribí sobre ese anuncio, **cuando** vuelvo a escribir,
  **entonces** se reutiliza el hilo existente en lugar de crear otro.
- **Dado** un anuncio de 100 €, **cuando** ofrezco 80 €, **entonces** la oferta
  queda pendiente y visible en el hilo; si ofrezco más de 100 €, se rechaza.
- **Dado** que tengo una oferta pendiente, **cuando** envío otra, **entonces** la
  anterior queda superada y sólo la nueva sigue viva.
- **Dado** que soy el vendedor, **cuando** acepto una oferta, **entonces** el
  anuncio pasa a reservado, el resto de ofertas quedan superadas y el precio se
  bloquea.
- **Dado** un anuncio reservado, **cuando** el vendedor lo marca como vendido,
  **entonces** se registran comprador, importe y fecha, y se habilita la
  valoración para ambos.
- **Dado** que la operación se cerró hace menos de 30 días, **cuando** valoro con
  1 a 5 estrellas, **entonces** se guarda y se recalcula la media del perfil
  valorado; una segunda valoración mía sobre la misma operación se rechaza.
- **Dado** que no participo en una conversación, **cuando** intento abrirla,
  **entonces** recibo un error de autorización.

**Estimación:** 13 puntos · **Prioridad:** imprescindible

---

## 6. Tickets de Trabajo

**Ticket 1 — Backend**

| | |
| --- | --- |
| **ID** | `LM-041` |
| **Título** | Server Action de creación de anuncio con validación en servidor |
| **Tipo** | Backend |
| **Historia** | HU-1 · Spec `marketplace/listings` |
| **Estimación** | 6 h |
| **Prioridad** | Alta |

**Descripción**

Implementar la Server Action que crea un anuncio en estado `draft` a nombre del
usuario autenticado. La acción es la única puerta de escritura: la validación de
cliente no se considera barrera de seguridad.

**Criterios de aceptación**

1. La acción exige sesión; sin ella devuelve error de autorización sin tocar la
   base de datos.
2. La entrada se parsea con el esquema zod de
   `features/create-listing/model/schema.ts`, el mismo que usa el formulario.
3. Se rechazan: título fuera de 5-80 caracteres, descripción fuera de 20-2000,
   `priceCents` ≤ 0 o ≥ 10.000.000, categoría inexistente, estado de conservación
   fuera del enumerado y lista de imágenes vacía o de más de 8.
4. Los errores se devuelven como lista `{ path, message }` que el formulario
   asocia a cada campo.
5. En el caso correcto se crea el `Listing` con `status = draft` y sus
   `ListingImage` con `position` 0..n **en una sola transacción**.
6. `seller_id` se toma de la sesión, **nunca** del cuerpo de la petición.

**Detalle técnico**

- Ubicación: `src/features/create-listing/api/create-listing-action.ts`.
- La lógica de dominio vive en `src/entities/listing/model/` y no importa nada de
  Next: la acción valida y delega.
- Escritura con `prisma.$transaction`.
- Al terminar, `revalidatePath('/sell')` y redirección a la vista previa.
- Sin comentarios en el código; el archivo no supera 300 líneas.

**Tests (TDD, se escriben antes)**

- `rechaza sin sesión`
- `rechaza título corto`
- `rechaza precio negativo enviado sin pasar por el formulario`
- `rechaza más de 8 imágenes`
- `crea anuncio y sus imágenes en una transacción`
- `ignora seller_id enviado en el cuerpo`

**Definición de hecho:** tests en verde, `lint`, `typecheck` y revisión de PR
aprobada.

---

**Ticket 2 — Frontend**

| | |
| --- | --- |
| **ID** | `LM-057` |
| **Título** | Panel de filtros de búsqueda sincronizado con la URL |
| **Tipo** | Frontend |
| **Historia** | HU-2 · Spec `marketplace/search` |
| **Estimación** | 8 h |
| **Prioridad** | Alta |

**Descripción**

Construir el panel lateral de filtros de `/search` (categoría, rango de precio,
estado de conservación, ciudad y distancia) y sincronizarlo en ambos sentidos con
los parámetros de la URL, de forma que la búsqueda sea un enlace compartible.

**Criterios de aceptación**

1. El panel muestra categoría (select jerárquico), precio mínimo y máximo,
   estado de conservación (checkboxes múltiples), ciudad y distancia (slider de
   1 a 500 km).
2. Cambiar un filtro actualiza la URL sin recargar la página (`router.replace`
   con `scroll: false`).
3. Abrir una URL con parámetros deja el panel con esos filtros ya marcados.
4. Un rango con mínimo mayor que máximo no se aplica y muestra un aviso en línea.
5. "Limpiar filtros" restablece el panel y deja la URL sin parámetros.
6. En móvil, el panel se presenta como hoja inferior con botón "Filtrar
   (N activos)".
7. Cambiar un filtro **no** rerenderiza las tarjetas de resultado ya montadas.
8. Accesibilidad: navegable por teclado, cada control con etiqueta asociada y el
   número de resultados anunciado en una región `aria-live`.

**Detalle técnico**

- Ubicación: `src/features/filter-listings/` con segmentos `ui`, `model` y
  `config`.
- Store de zustand con selectores por campo. Se descarta Context API aquí: cada
  pulsación cambia el estado y un Context rerenderizaría todo el árbol suscrito.
- Componentes de `shared/ui` (shadcn/ui): `Select`, `Slider`, `Checkbox`,
  `Sheet`. Iconos de `lucide-react`.
- El panel es Client Component; la lista de resultados sigue siendo Server
  Component.
- Debounce de 300 ms en los campos de texto y de precio antes de tocar la URL.

**Tests (TDD, se escriben antes)**

- `marca los filtros recibidos por la URL`
- `escribe los filtros en la URL al cambiarlos`
- `no aplica el rango con mínimo mayor que máximo`
- `limpiar filtros vacía la URL`
- `cambiar un filtro no rerenderiza las tarjetas`
- E2E: `filtrar, recargar y conservar los filtros`

**Definición de hecho:** tests en verde, auditoría de accesibilidad sin
incidencias críticas, revisión de PR aprobada.

---

**Ticket 3 — Base de datos**

| | |
| --- | --- |
| **ID** | `LM-012` |
| **Título** | Esquema inicial, restricciones e índices de búsqueda |
| **Tipo** | Base de datos |
| **Historia** | Transversal a HU-1, HU-2 y HU-3 |
| **Estimación** | 6 h |
| **Prioridad** | Crítica (bloquea el resto) |

**Descripción**

Definir el esquema Prisma completo con las ocho entidades de §3, generar la
primera migración y sembrar el árbol de categorías. Las invariantes que la base
de datos puede garantizar se declaran en la base de datos, no sólo en el código.

**Criterios de aceptación**

1. Modelos `User`, `Category`, `Listing`, `ListingImage`, `Conversation`,
   `Message`, `Offer` y `Review` conformes a §3.2.
2. Enumerados `ListingStatus`, `ListingCondition` y `OfferStatus`.
3. Restricciones únicas: `User.email`, `User.alias`, `Category.slug`,
   `(ListingImage.listing_id, position)`,
   `(Conversation.listing_id, buyer_id)`, `(Review.listing_id, author_id)` y el
   índice único parcial de una sola `Offer` con `status = pending` por
   conversación.
4. `CHECK`: `price_cents > 0 AND price_cents < 10000000`, `score BETWEEN 1 AND
   5`, `buyer_id <> seller_id`, `author_id <> subject_id` y la coherencia de
   `sold` (`buyer_id`, `sold_at` y `sold_price_cents` no nulos).
5. Índices: `(status, published_at DESC)`, `(category_id, price_cents)`,
   `(conversation_id, created_at)` y GIN sobre
   `to_tsvector('spanish', title || ' ' || description)`.
6. Borrado en cascada de `ListingImage` con su `Listing` y de `Message` con su
   `Conversation`.
7. `prisma migrate deploy` levanta la base desde cero sin errores.
8. `bun run db:seed` carga el árbol de categorías en dos niveles y es
   idempotente.

**Detalle técnico**

- Los importes se guardan como `integer` en céntimos: nada de `float` para
  dinero.
- Extensiones `citext` (email y alias insensibles a mayúsculas) y `unaccent`
  (búsqueda sin acentos) declaradas en la migración.
- El índice único parcial y los `CHECK` se añaden con SQL crudo dentro de la
  migración generada.
- Ubicación: `prisma/schema.prisma`, `prisma/migrations/` y `prisma/seed.ts`.

**Tests (integración contra PostgreSQL en Docker)**

- `rechaza email duplicado`
- `rechaza alias duplicado con distinta capitalización`
- `rechaza segunda conversación del mismo comprador sobre el mismo anuncio`
- `rechaza segunda oferta pendiente en la misma conversación`
- `rechaza valoración duplicada del mismo autor sobre la misma operación`
- `rechaza marcar como vendido sin comprador`
- `borra las imágenes al borrar el anuncio`
- `encuentra "guitarra acústica" buscando "GUITARRA ACUSTICA"`

**Definición de hecho:** migración aplicable desde cero, tests de integración en
verde, diagrama de §3.1 coherente con el esquema final.

---

## 7. Pull Requests

**Pull Request 1**

`feature/entrega-1-AO` → `main` — *Documentación técnica y especificaciones.*

Ficha del proyecto, descripción del producto, arquitectura, modelo de datos,
especificación OpenAPI, historias de usuario y tickets de trabajo. Incluye el
`AGENTS.md` con las convenciones del repositorio y el cambio OpenSpec
`add-marketplace-mvp` con sus cuatro artefactos (propuesta, specs, diseño y
tareas) y las cuatro capacidades del MVP.

**Pull Request 2**

Pendiente — entrega 2. `feature/entrega-2-AO` → `main`: código funcional con
backend, frontend y base de datos conectados, y el flujo principal operativo.

**Pull Request 3**

Pendiente — entrega 3. `final-project-AO` → `main`: tests unitarios, de
integración y E2E, despliegue, documentación de IA en `prompts.md` y evidencia
de funcionamiento.
