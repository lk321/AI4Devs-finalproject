## Purpose

Permite a un vendedor convertir un artículo que ya no usa en un anuncio visible
y gobernar su ciclo de vida, desde el borrador hasta la venta o el archivado.

## ADDED Requirements

### Requirement: Creación de anuncio

El sistema DEBE permitir a un usuario con sesión crear un anuncio con título
(5-80 caracteres), descripción (20-2000 caracteres), precio en euros mayor que
cero y menor que 100.000, categoría existente, estado de conservación
(`nuevo`, `como_nuevo`, `bueno`, `aceptable`, `para_piezas`) y ciudad. Las
mismas reglas de validación DEBEN aplicarse en el cliente y en el servidor.

#### Scenario: Alta correcta

- **WHEN** un vendedor con sesión envía un anuncio con todos los campos válidos
  y al menos una imagen
- **THEN** el sistema guarda el anuncio en estado `draft` y lo muestra en la
  vista previa

#### Scenario: Campos inválidos

- **WHEN** el título tiene menos de 5 caracteres o el precio no es positivo
- **THEN** el sistema rechaza el envío e indica cada campo en error junto a su
  control

#### Scenario: Precio manipulado en el envío

- **WHEN** el cliente envía un precio negativo saltándose la validación del
  formulario
- **THEN** el servidor rechaza la petición y no persiste ningún cambio

#### Scenario: Visitante sin sesión

- **WHEN** un visitante sin sesión intenta crear un anuncio
- **THEN** el sistema rechaza la operación y redirige al inicio de sesión

### Requirement: Imágenes del anuncio

El sistema DEBE aceptar entre 1 y 8 imágenes por anuncio en formato JPEG, PNG o
WebP, de hasta 5 MB cada una, y DEBE mantener el orden elegido por el vendedor,
siendo la primera la imagen de portada.

#### Scenario: Subida válida

- **WHEN** el vendedor sube tres imágenes JPEG de 2 MB
- **THEN** el sistema las asocia al anuncio y usa la primera como portada

#### Scenario: Formato no permitido

- **WHEN** el vendedor sube un archivo que no es JPEG, PNG o WebP
- **THEN** el sistema rechaza ese archivo e indica los formatos admitidos

#### Scenario: Límite superado

- **WHEN** el vendedor intenta añadir una novena imagen
- **THEN** el sistema impide la subida e indica el máximo de 8 imágenes

#### Scenario: Reordenación

- **WHEN** el vendedor arrastra una imagen a la primera posición
- **THEN** esa imagen pasa a ser la portada del anuncio

### Requirement: Publicación del anuncio

El sistema DEBE permitir publicar un anuncio en estado `draft`, haciéndolo
visible en el catálogo y en las búsquedas de forma inmediata.

#### Scenario: Publicación

- **WHEN** el vendedor publica un borrador completo
- **THEN** el anuncio pasa a `published`, registra su fecha de publicación y
  aparece en el catálogo

#### Scenario: Borrador incompleto

- **WHEN** el borrador no tiene imágenes o le falta la categoría
- **THEN** el sistema impide publicar e indica qué falta

### Requirement: Ciclo de vida del anuncio

El sistema DEBE soportar los estados `draft`, `published`, `reserved`, `sold` y
`archived`. Las transiciones permitidas son `draft → published`,
`published → reserved`, `published → archived`, `reserved → sold`,
`reserved → published` y `sold → archived`. Cualquier otra transición DEBE ser
rechazada.

#### Scenario: Transición permitida

- **WHEN** el vendedor archiva un anuncio publicado
- **THEN** el anuncio pasa a `archived` y desaparece de las búsquedas

#### Scenario: Transición no permitida

- **WHEN** se solicita pasar un anuncio de `draft` a `sold`
- **THEN** el sistema rechaza la operación y el estado no cambia

#### Scenario: Anuncio vendido

- **WHEN** un anuncio pasa a `sold`
- **THEN** deja de admitir nuevas conversaciones y ofertas

### Requirement: Edición y autoría

El sistema DEBE permitir editar o cambiar el estado de un anuncio únicamente a
su autor. El precio NO PUEDE modificarse mientras el anuncio esté en `reserved`.

#### Scenario: Edición por el autor

- **WHEN** el vendedor edita la descripción de su anuncio publicado
- **THEN** el sistema guarda el cambio y actualiza la fecha de modificación

#### Scenario: Edición por un tercero

- **WHEN** un usuario distinto del autor intenta editar el anuncio
- **THEN** el sistema responde con un error de autorización y no aplica cambios

#### Scenario: Precio bloqueado durante la reserva

- **WHEN** el autor intenta cambiar el precio de un anuncio en `reserved`
- **THEN** el sistema rechaza el cambio e indica que debe liberar la reserva

### Requirement: Detalle del anuncio

El sistema DEBE mostrar públicamente los anuncios en estado `published` o
`reserved` con título, descripción, precio, galería, estado de conservación,
ciudad, fecha de publicación y perfil público del vendedor.

#### Scenario: Consulta pública

- **WHEN** cualquier visitante abre un anuncio publicado
- **THEN** el sistema muestra su detalle completo y el acceso al perfil del
  vendedor

#### Scenario: Anuncio no visible

- **WHEN** se solicita un anuncio en `draft` o `archived` sin ser su autor
- **THEN** el sistema responde con la página de recurso no encontrado
