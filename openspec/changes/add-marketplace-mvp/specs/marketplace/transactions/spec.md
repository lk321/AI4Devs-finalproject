## Purpose

Permite que comprador y vendedor negocien un artículo dentro de la plataforma,
dejen constancia de la oferta aceptada y cierren la operación con una valoración
mutua que alimenta la reputación de ambos perfiles.

## ADDED Requirements

### Requirement: Conversación por anuncio

El sistema DEBE permitir a un usuario con sesión iniciar una única conversación
por anuncio con su vendedor. El vendedor NO PUEDE iniciar conversación sobre su
propio anuncio.

#### Scenario: Primer mensaje

- **WHEN** un comprador con sesión envía el primer mensaje sobre un anuncio
  publicado
- **THEN** el sistema crea la conversación y la muestra en la bandeja de ambos

#### Scenario: Conversación existente

- **WHEN** el mismo comprador vuelve a escribir sobre el mismo anuncio
- **THEN** el sistema reutiliza la conversación existente en lugar de crear otra

#### Scenario: Vendedor sobre su propio anuncio

- **WHEN** el autor del anuncio intenta abrir una conversación sobre él
- **THEN** el sistema rechaza la operación

#### Scenario: Anuncio no disponible

- **WHEN** se intenta escribir sobre un anuncio en `sold` o `archived`
- **THEN** el sistema rechaza el envío e indica que el anuncio ya no admite
  mensajes

### Requirement: Mensajes

El sistema DEBE aceptar mensajes de texto de 1 a 1000 caracteres, ordenarlos
cronológicamente y marcarlos como leídos al abrir la conversación. El acceso a
una conversación DEBE limitarse a sus dos participantes.

#### Scenario: Envío y recepción

- **WHEN** un participante envía un mensaje válido
- **THEN** el sistema lo añade al final del hilo con su fecha y su autor

#### Scenario: Mensaje vacío

- **WHEN** se envía un mensaje sin contenido o de más de 1000 caracteres
- **THEN** el sistema rechaza el envío e indica el límite

#### Scenario: Acceso de un tercero

- **WHEN** un usuario que no participa en la conversación intenta abrirla
- **THEN** el sistema responde con un error de autorización

#### Scenario: Indicador de no leídos

- **WHEN** un participante recibe un mensaje y no ha abierto la conversación
- **THEN** la bandeja muestra el contador de mensajes sin leer

### Requirement: Oferta de precio

El sistema DEBE permitir al comprador adjuntar a la conversación una oferta con
importe mayor que cero y no superior al precio del anuncio. Sólo la última
oferta del comprador DEBE estar en estado `pending`.

#### Scenario: Oferta válida

- **WHEN** el comprador ofrece 80 € por un anuncio de 100 €
- **THEN** el sistema registra la oferta como `pending` y la muestra en el hilo

#### Scenario: Oferta superior al precio

- **WHEN** el comprador ofrece un importe mayor que el precio publicado
- **THEN** el sistema rechaza la oferta e indica el límite

#### Scenario: Nueva oferta sobre otra pendiente

- **WHEN** el comprador envía una segunda oferta con una anterior `pending`
- **THEN** el sistema marca la anterior como `superseded` y deja `pending` la
  nueva

#### Scenario: Rechazo del vendedor

- **WHEN** el vendedor rechaza la oferta pendiente
- **THEN** la oferta pasa a `rejected` y el anuncio permanece `published`

### Requirement: Reserva por oferta aceptada

El sistema DEBE reservar el anuncio para el comprador cuando el vendedor acepta
su oferta, y DEBE permitir liberar la reserva devolviendo el anuncio a
`published`.

#### Scenario: Aceptación

- **WHEN** el vendedor acepta una oferta `pending`
- **THEN** la oferta pasa a `accepted`, el anuncio pasa a `reserved` y el resto
  de ofertas del anuncio pasan a `superseded`

#### Scenario: Liberación de la reserva

- **WHEN** el vendedor libera la reserva
- **THEN** el anuncio vuelve a `published` y admite nuevas ofertas

#### Scenario: Aceptación por quien no es el vendedor

- **WHEN** un usuario distinto del autor del anuncio intenta aceptar la oferta
- **THEN** el sistema responde con un error de autorización

### Requirement: Cierre de la operación

El sistema DEBE permitir al vendedor marcar como vendido un anuncio `reserved`,
registrando comprador, importe acordado y fecha de cierre.

#### Scenario: Venta confirmada

- **WHEN** el vendedor marca como vendido el anuncio reservado
- **THEN** el anuncio pasa a `sold` y el sistema habilita la valoración a ambas
  partes

#### Scenario: Anuncio sin reserva

- **WHEN** el vendedor intenta marcar como vendido un anuncio `published`
- **THEN** el sistema rechaza la operación e indica que primero debe aceptar una
  oferta

### Requirement: Valoración mutua

El sistema DEBE permitir a comprador y vendedor valorarse una sola vez por
operación cerrada, con una puntuación de 1 a 5 y un comentario opcional de hasta
500 caracteres, dentro de los 30 días siguientes al cierre.

#### Scenario: Valoración dentro de plazo

- **WHEN** un participante valora la operación con 5 estrellas al día siguiente
  del cierre
- **THEN** el sistema guarda la valoración y recalcula la media del perfil
  valorado

#### Scenario: Valoración duplicada

- **WHEN** el mismo participante intenta valorar por segunda vez la misma
  operación
- **THEN** el sistema rechaza la operación

#### Scenario: Plazo vencido

- **WHEN** han pasado más de 30 días desde el cierre
- **THEN** el sistema no admite nuevas valoraciones de esa operación

#### Scenario: Operación no cerrada

- **WHEN** se intenta valorar una operación cuyo anuncio no está en `sold`
- **THEN** el sistema rechaza la operación
