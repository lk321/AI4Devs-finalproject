# Registro de uso de IA — Loop Market

## Herramientas y modelos

| Herramienta | Modelo | Fase |
| --- | --- | --- |
| Claude Code (CLI) | Claude Opus / Sonnet | Especificación, arquitectura, implementación, tests, documentación |
| OpenSpec (`/opsx:*`) | — | Flujo spec-first: propuesta → specs → diseño → tareas → implementación |
| Claude Code + hooks | — | Calidad automática: lefthook (format, lint, test) y commitlint |

Flujo general: **la especificación manda**. Cada cambio nace como propuesta OpenSpec
(`openspec/changes/`), los `#### Scenario:` de las specs dan nombre a los tests, y la IA
implementa tarea a tarea con revisión humana en cada pull request.

> Se recogen los prompts clave, depurados para mayor claridad, no la conversación completa.

---

## 1. Descripción general del producto

**Prompt 1 — Definición del producto**
```
Actúa como product manager. Quiero un marketplace de segunda mano entre particulares
con publicación, búsqueda, negociación de precio y cierre de la operación. Propón el
objetivo, los tres perfiles de usuario y un MVP acotado que quepa en 4 semanas.
Señala explícitamente qué queda fuera.
```
**Ajuste humano:** recorté el MVP (sin pagos ni envíos) y fijé que la reputación se
construye solo con operaciones cerradas.

**Prompt 2 — Propuesta OpenSpec** · `/opsx:propose add-marketplace-mvp`

**Prompt 3 — Revisión crítica**
```
Revisa la propuesta como si fueras el responsable técnico. Lista ambigüedades,
casos límite sin cubrir y requisitos que no se puedan testear.
```
**Ajuste humano:** añadí a mano los escenarios de oferta duplicada y de anuncio reservado.

## 2. Arquitectura del sistema

### 2.1 Diagrama de arquitectura
**Prompt 1:**
```
Propón una arquitectura para Next.js App Router + Supabase. Compara capas clásicas
con Feature-Sliced Design y recomienda una con sus sacrificios.
```
**Ajuste humano:** elegí FSD y pedí que las reglas de capas se hicieran cumplir con
ESLint (`@boundaries`) en vez de dejarlas como convención.

### 2.2 Componentes principales
**Prompt 1:**
```
Define las capas _app, _pages, widgets, features, entities y shared. Para cada slice
indica su API pública (index.ts) y qué no puede importar.
```

### 2.3 Estructura de ficheros
**Prompt 1:**
```
Genera el árbol de src/ y el AGENTS.md con las convenciones: nombres, límites de capa,
dónde va cada tipo de test y cuándo usar Server Components.
```
**Ajuste humano:** `AGENTS.md` quedó como contrato para cualquier agente futuro.

### 2.4 Infraestructura y despliegue
**Prompt 1:**
```
Diseña el pipeline: lefthook en local, GitHub Actions (lint, typecheck, test, build,
integración y E2E contra Supabase local) y Vercel con preview por PR.
```
**Ajuste humano:** la CI levanta Supabase con la CLI y excluye servicios que no se usan
para bajar el tiempo de arranque.

### 2.5 Seguridad
**Prompt 1:**
```
Audita la app como pentester: RLS, enumeración de cuentas, fuerza bruta, subida de
archivos, redirección abierta en ?next=. Propón la mitigación mínima de cada una.
```
**Ajuste humano:** moví las invariantes críticas (autorización, transiciones) a la base
de datos; el código de aplicación no es la única barrera.

### 2.6 Tests
**Prompt 1:**
```
A partir de los Scenario de las specs, genera los tests de Vitest. Un test por
escenario, consultas por rol accesible y nunca por clase CSS.
```
**Prompt 2:**
```
Escribe tests de integración contra Supabase local: RLS, CHECK, disparadores y RPC.
Deben ser no destructivos para poder repetirse sin resetear la base.
```
**Prompt 3:**
```
Playwright sobre el build de producción: buscar, negociar (oferta y aceptación con dos
contextos de navegador) y publicar con validación.
```
**Ajuste humano:** ejecuté los E2E contra una base recién sembrada y corregí los
selectores que no coincidían con la UI real.

## 3. Modelo de datos
**Prompt 1:**
```
Diseña el esquema PostgreSQL: perfiles, categorías, anuncios, imágenes, conversaciones,
mensajes, ofertas y valoraciones. Restricciones en la base: precio, longitudes, una
conversación por comprador y anuncio, una sola oferta pendiente.
```
**Prompt 2:**
```
Escribe las políticas RLS y los disparadores de la máquina de estados del anuncio
(draft → published → reserved → sold).
```
**Ajuste humano:** sustituí un campo de texto libre por un enum de condición.

## 4. Especificación de la API
**Prompt 1:**
```
Documenta las Server Actions y las funciones RPC (resolve_offer, mark_listing_sold,
release_reservation, search_listings) con entrada, salida y errores.
```
**Ajuste humano:** unifiqué los mensajes de error para no revelar si un email existe.

## 5. Historias de usuario
**Prompt 1:**
```
Redacta las historias en formato Como/Quiero/Para con criterios en Gherkin
(GIVEN/WHEN/THEN) y numeración estable. Una historia por requisito.
```

## 6. Tickets de trabajo
**Prompt 1:**
```
Descompón cada historia en tickets técnicos con estimación, dependencias y criterios
de aceptación verificables por un test.
```

## 7. Pull Requests
**Prompt 1:**
```
Redacta la descripción del PR: qué cambia, escenarios probados y cómo verificarlo.
Mensajes de commit en conventional commits, minúsculas y máximo 50 caracteres.
```
**Ajuste humano:** commitlint lo hace cumplir en el hook `commit-msg`.

---

## Lecciones

- Pedir a la IA que **critique** la especificación antes de implementar evitó más
  retrabajo que cualquier prompt de generación.
- Las reglas que importan (capas, formato de commit, RLS) se **automatizan** con
  herramientas; la IA las cumple porque el hook la rechaza si no.
- La IA acelera lo mecánico; las decisiones de alcance y de seguridad fueron humanas.
