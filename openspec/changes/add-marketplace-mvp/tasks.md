## 1. Tooling y esqueleto

- [ ] 1.1 Configurar ESLint y Prettier con la regla de límite de 300 líneas y verificar que `bun run lint` y `bun run format:check` pasan en limpio
- [ ] 1.2 Añadir `lefthook.yml` con `pre-commit` (lint y format sobre `{staged_files}`), `pre-push` (typecheck y tests) y `commit-msg` (commitlint), y verificar que un commit con mensaje inválido se rechaza
- [ ] 1.3 Configurar Vitest con Testing Library y `bun run test`, y verificar con un test trivial que la suite arranca
- [ ] 1.4 Configurar Playwright con `bun run test:e2e` y verificar que el navegador arranca contra el servidor de desarrollo
- [ ] 1.5 Crear el árbol FSD `src/{_app,_pages,widgets,features,entities,shared}` con el alias `@/*` y verificar que un import desde `app/page.tsx` a `@/_pages/home` resuelve
- [ ] 1.6 Añadir la regla de linter de dependencias entre capas FSD y verificar que un import de `entities` hacia `features` falla el lint
- [ ] 1.7 Inicializar shadcn/ui en `src/shared/ui` y verificar que el componente `Button` renderiza en un test

## 2. Datos y dominio

- [ ] 2.1 Definir el esquema Prisma con `User`, `Category`, `Listing`, `ListingImage`, `Conversation`, `Message`, `Offer` y `Review`, y verificar que `prisma validate` pasa
- [ ] 2.2 Añadir índices de búsqueda y las restricciones únicas (`User.email`, `User.alias`, conversación única por anuncio y comprador, valoración única por operación y autor) y verificar con un test de integración que la inserción duplicada falla
- [ ] 2.3 Generar la primera migración y verificar que `prisma migrate deploy` levanta la base desde cero
- [ ] 2.4 Escribir la semilla de categorías y verificar que `bun run db:seed` deja las categorías consultables
- [ ] 2.5 Crear `entities/user/model` y `entities/listing/model` con sus tipos y esquemas zod, y verificar con tests que los límites de título, precio y estado se rechazan

## 3. Identidad (`identity/user-auth`)

- [ ] 3.1 Escribir los tests de los escenarios de registro e inicio de sesión a partir del spec, y verificar que fallan antes de implementar
- [ ] 3.2 Implementar el hash de contraseña y el alta de usuario, y verificar que los tests de registro pasan y que la contraseña nunca viaja en la respuesta
- [ ] 3.3 Implementar la sesión en cookie `httpOnly`/`secure`/`sameSite=lax` con caducidad de 30 días y verificar el escenario de retorno con sesión vigente
- [ ] 3.4 Implementar el cierre de sesión y la limitación de intentos fallidos, y verificar los escenarios correspondientes
- [ ] 3.5 Implementar `features/auth-by-credentials` con react-hook-form y zod, y verificar en test de componente que los errores se muestran junto a cada campo
- [ ] 3.6 Proteger las rutas privadas y verificar que un visitante sin sesión es redirigido conservando la ruta de origen
- [ ] 3.7 Implementar el perfil público por alias y verificar que no expone email ni teléfono

## 4. Anuncios (`marketplace/listings`)

- [ ] 4.1 Escribir los tests de los escenarios de creación, publicación y ciclo de vida, y verificar que fallan
- [ ] 4.2 Implementar la Server Action de creación con validación zod en servidor y verificar que un precio negativo enviado a mano se rechaza
- [ ] 4.3 Implementar la subida y reordenación de imágenes con los límites de formato, tamaño y cantidad, y verificar los escenarios de imágenes
- [ ] 4.4 Implementar la máquina de estados del anuncio y verificar que las transiciones no permitidas se rechazan
- [ ] 4.5 Implementar la comprobación de autoría en edición y cambio de estado, y verificar que un tercero recibe error de autorización
- [ ] 4.6 Implementar `features/create-listing` como formulario de tres pasos y verificar en test de componente que no avanza con campos inválidos
- [ ] 4.7 Implementar la página de detalle y verificar que un anuncio en `draft` no es visible para terceros

## 5. Búsqueda (`marketplace/search`)

- [ ] 5.1 Escribir los tests de los escenarios de búsqueda, filtros, orden y paginación, y verificar que fallan
- [ ] 5.2 Implementar la consulta de catálogo insensible a mayúsculas y acentos en `entities/listing/api` y verificar los escenarios de texto
- [ ] 5.3 Implementar los filtros combinados de categoría, precio, estado y distancia y verificar el escenario de rango de precio inválido
- [ ] 5.4 Sincronizar filtros, orden y página con los parámetros de URL y verificar que recargar reproduce el mismo resultado
- [ ] 5.5 Implementar `features/filter-listings` con store de zustand y verificar que cambiar un filtro no rerenderiza las tarjetas de resultado
- [ ] 5.6 Implementar `widgets/listing-catalog` con paginación de 24 y total de coincidencias, y verificar el escenario de página fuera de rango

## 6. Operaciones (`marketplace/transactions`)

- [ ] 6.1 Escribir los tests de los escenarios de conversación, mensajes, ofertas, reserva, cierre y valoración, y verificar que fallan
- [ ] 6.2 Implementar la conversación única por anuncio y comprador y verificar que el segundo mensaje reutiliza el hilo
- [ ] 6.3 Implementar el envío de mensajes con sus límites y el control de acceso, y verificar que un tercero recibe error de autorización
- [ ] 6.4 Implementar las ofertas con la regla de una sola `pending` por comprador y verificar el escenario de oferta superada
- [ ] 6.5 Implementar aceptación, reserva y liberación y verificar que aceptar marca el resto de ofertas como `superseded`
- [ ] 6.6 Implementar el cierre de venta con comprador, importe y fecha, y verificar que no se puede cerrar sin reserva previa
- [ ] 6.7 Implementar la valoración mutua con ventana de 30 días y unicidad, y verificar el recálculo de la media del perfil
- [ ] 6.8 Implementar `widgets/conversation-thread` con contador de no leídos y verificar el escenario del indicador

## 7. Cierre

- [ ] 7.1 Escribir los E2E de publicar, buscar y cerrar una operación, y verificar que los tres recorridos pasan en Playwright
- [ ] 7.2 Revisar que ningún archivo supera 300 líneas y que no quedan comentarios explicativos en el código, y verificar con el script de comprobación
- [ ] 7.3 Ejecutar lint, typecheck, tests y E2E en CI y verificar que el pipeline queda en verde
- [ ] 7.4 Desplegar en Vercel con `prisma migrate deploy` y semillas, y verificar los tres recorridos contra el entorno desplegado
