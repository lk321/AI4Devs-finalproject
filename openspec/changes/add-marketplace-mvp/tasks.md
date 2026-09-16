## 1. Tooling y esqueleto

- [x] 1.1 Configurar ESLint y Prettier y verificar que `bun run lint` y `bun run format:check` pasan en limpio
- [x] 1.2 Añadir `lefthook.yml` con `pre-commit` (formato y lint sobre `{staged_files}`), `pre-push` (typecheck y tests) y `commit-msg` (commitlint con máximo 50 caracteres), y verificar que un commit con mensaje inválido se rechaza
- [x] 1.3 Configurar Vitest con Testing Library y `bun run test`, y verificar que la suite arranca
- [x] 1.4 Crear el árbol FSD `src/{_app,_pages,widgets,features,entities,shared}` con el alias `@/*` y verificar que `app/page.tsx` re-exporta desde `@/_pages/home`
- [x] 1.5 Añadir la regla de linter de dependencias entre capas FSD y verificar que un import de `app/` hacia `@/widgets` falla el lint
- [x] 1.6 Inicializar shadcn/ui en `src/shared/ui` con los tokens de tema en `app/globals.css` y verificar que el build compila

## 2. Datos y dominio (Supabase)

- [x] 2.1 Definir el esquema en migraciones de Supabase con `profiles`, `categories`, `listings`, `listing_images`, `conversations`, `messages`, `offers` y `reviews`, y verificar que `supabase db reset` lo aplica desde cero
- [x] 2.2 Añadir restricciones y unicidades (alias, una conversación por anuncio y comprador, una sola oferta `pending`, una valoración por operación y autor) y verificar con `db reset` que se crean
- [x] 2.3 Activar RLS en todas las tablas y escribir las políticas de lectura, escritura y participación, y verificar que el bucket de imágenes sólo admite subidas del propietario
- [x] 2.4 Añadir disparadores de transición de estado, bloqueo de precio en reserva, sustitución de ofertas y recálculo de valoración, y verificar que una transición inválida falla
- [x] 2.5 Escribir `search_listings` con texto sin acentos, filtros combinados, distancia, orden y paginación, y verificar la consulta contra la base local
- [x] 2.6 Escribir la semilla de categorías, usuarios y anuncios de demostración y verificar que `bun run db:reset` la carga
- [x] 2.7 Generar los tipos de la base con `bun run db:types` y crear los clientes de servidor y navegador en `src/shared/api`
- [x] 2.8 Crear `entities/user` y `entities/listing` con sus esquemas zod, consultas y componentes, y verificar con tests que los límites de título, precio e imágenes se rechazan

## 3. Identidad (`identity/user-auth`)

- [ ] 3.1 Escribir los tests de los esquemas de registro y acceso a partir del spec, y verificar que fallan antes de implementar
- [ ] 3.2 Implementar las Server Actions de registro, acceso y cierre de sesión sobre Supabase Auth y verificar que el error de credenciales es genérico
- [ ] 3.3 Configurar la sesión de 30 días y el límite de intentos en `supabase/config.toml`, y verificar que una contraseña de menos de 12 caracteres se rechaza
- [ ] 3.4 Implementar `features/auth-by-credentials` con react-hook-form y zod, y verificar en test de componente que los errores se muestran junto a cada campo
- [ ] 3.5 Proteger las rutas privadas en `proxy.ts` y verificar que un visitante sin sesión es redirigido conservando la ruta de origen
- [ ] 3.6 Implementar el perfil público por alias y verificar que no expone email ni teléfono

## 4. Anuncios (`marketplace/listings`)

- [ ] 4.1 Escribir los tests de los escenarios de creación, publicación y ciclo de vida, y verificar que fallan
- [ ] 4.2 Implementar la Server Action de creación con validación zod en servidor y verificar que un precio negativo enviado a mano se rechaza
- [ ] 4.3 Implementar la subida y reordenación de imágenes contra Supabase Storage con los límites de formato, tamaño y cantidad, y verificar los escenarios de imágenes
- [ ] 4.4 Implementar las acciones de cambio de estado apoyadas en los disparadores y verificar que las transiciones no permitidas se rechazan
- [ ] 4.5 Implementar `features/create-listing` como formulario de tres pasos y verificar que no avanza con campos inválidos
- [ ] 4.6 Implementar la página de detalle con `loading.tsx` y verificar que un anuncio en `draft` no es visible para terceros
- [ ] 4.7 Implementar el panel de anuncios propios y verificar que sólo el autor puede cambiar el estado

## 5. Búsqueda (`marketplace/search`)

- [ ] 5.1 Escribir los tests de los escenarios de búsqueda, filtros, orden y paginación, y verificar que fallan
- [ ] 5.2 Implementar la lectura del catálogo en Server Component contra `search_listings` y verificar los escenarios de texto
- [ ] 5.3 Implementar los filtros combinados de categoría, precio, estado y distancia y verificar el escenario de rango de precio inválido
- [ ] 5.4 Sincronizar filtros, orden y página con los parámetros de URL y verificar que recargar reproduce el mismo resultado
- [ ] 5.5 Implementar `features/filter-listings` con store de zustand y verificar que cambiar un filtro no rerenderiza las tarjetas de resultado
- [ ] 5.6 Implementar `widgets/listing-catalog` con paginación de 24, total de coincidencias y prefetch de los resultados, y verificar el escenario de página fuera de rango

## 6. Operaciones (`marketplace/transactions`)

- [ ] 6.1 Escribir los tests de los escenarios de conversación, mensajes, ofertas, reserva, cierre y valoración, y verificar que fallan
- [ ] 6.2 Implementar el inicio de conversación con `start_conversation` y verificar que el segundo mensaje reutiliza el hilo
- [ ] 6.3 Implementar el envío de mensajes con sus límites y verificar que un tercero no puede leer el hilo
- [ ] 6.4 Implementar las ofertas con la regla de una sola `pending` y verificar el escenario de oferta superada
- [ ] 6.5 Implementar aceptación, rechazo, reserva y liberación con `resolve_offer` y `release_reservation`, y verificar el cambio de estado del anuncio
- [ ] 6.6 Implementar el cierre de venta con `mark_listing_sold` y verificar que no se puede cerrar sin reserva previa
- [ ] 6.7 Implementar la valoración mutua con ventana de 30 días y unicidad, y verificar el recálculo de la media del perfil
- [ ] 6.8 Implementar `widgets/conversation-thread` con contador de no leídos y verificar el escenario del indicador

## 7. Cierre

- [ ] 7.1 Verificar que `bun run lint`, `bun run typecheck`, `bun run test` y `bun run build` pasan en limpio
- [ ] 7.2 Recorrer publicar, buscar y cerrar una operación en el navegador y verificar que el flujo principal funciona de extremo a extremo
- [ ] 7.3 Revisar que ningún archivo supera 300 líneas y que no quedan comentarios explicativos en el código
- [ ] 7.4 Actualizar `readme.md` y `AGENTS.md` con el stack real (Supabase) y la estructura entregada
