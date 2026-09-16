## Purpose

Permite a una persona crear una cuenta en Loop Market, autenticarse con
credenciales propias y mantener una identidad pública estable que el resto de
usuarios pueda reconocer antes de cerrar una compraventa.

## ADDED Requirements

### Requirement: Registro con email y contraseña

El sistema DEBE permitir crear una cuenta con email, alias y contraseña. El
email DEBE ser único, el alias DEBE tener entre 3 y 24 caracteres alfanuméricos
y la contraseña DEBE tener al menos 12 caracteres. La contraseña NUNCA se
almacena en claro ni se devuelve en ninguna respuesta.

#### Scenario: Registro correcto

- **WHEN** una persona envía email, alias y contraseña válidos y no registrados
- **THEN** el sistema crea la cuenta, inicia sesión y redirige al catálogo

#### Scenario: Email ya registrado

- **WHEN** el email enviado ya pertenece a una cuenta
- **THEN** el sistema rechaza el registro y muestra un error genérico de
  credenciales sin confirmar la existencia de la cuenta

#### Scenario: Contraseña débil

- **WHEN** la contraseña tiene menos de 12 caracteres
- **THEN** el sistema rechaza el registro e indica el requisito de longitud
  antes de enviar la petición al servidor

#### Scenario: Alias ya en uso

- **WHEN** el alias enviado ya pertenece a otra cuenta
- **THEN** el sistema rechaza el registro e indica que el alias no está
  disponible

### Requirement: Inicio de sesión

El sistema DEBE autenticar a un usuario existente mediante email y contraseña y
DEBE responder con el mismo mensaje de error tanto si el email no existe como si
la contraseña es incorrecta.

#### Scenario: Credenciales correctas

- **WHEN** un usuario registrado envía su email y contraseña correctos
- **THEN** el sistema abre una sesión y lo devuelve a la página desde la que
  inició el acceso

#### Scenario: Credenciales incorrectas

- **WHEN** la contraseña no coincide o el email no existe
- **THEN** el sistema responde "email o contraseña incorrectos" sin revelar
  cuál de los dos ha fallado

#### Scenario: Intentos repetidos

- **WHEN** se acumulan más de 10 peticiones de acceso o registro desde la misma
  IP en 5 minutos
- **THEN** el sistema rechaza las siguientes hasta que se cierra la ventana

### Requirement: Sesión persistente

El sistema DEBE mantener la sesión en cookies `httpOnly`, `secure` y
`sameSite=lax`, con una caducidad máxima de 30 días desde el inicio de sesión, y
DEBE invalidarla al cerrar sesión.

#### Scenario: Retorno con sesión vigente

- **WHEN** un usuario con sesión vigente vuelve a abrir la aplicación
- **THEN** el sistema lo reconoce sin pedir credenciales

#### Scenario: Cierre de sesión

- **WHEN** el usuario pulsa "cerrar sesión"
- **THEN** el sistema invalida la cookie y las rutas privadas dejan de ser
  accesibles

#### Scenario: Sesión caducada

- **WHEN** la cookie de sesión ha caducado y se solicita una ruta privada
- **THEN** el sistema redirige al inicio de sesión conservando la ruta de origen

### Requirement: Acceso a rutas privadas

El sistema DEBE exigir sesión activa para publicar anuncios, gestionar anuncios
propios, acceder a mensajes y valorar una operación.

#### Scenario: Visitante sin sesión

- **WHEN** un visitante sin sesión solicita `/sell` o `/messages`
- **THEN** el sistema redirige al inicio de sesión y, tras autenticarse, lo
  devuelve a la ruta solicitada

### Requirement: Perfil público

El sistema DEBE exponer un perfil público por alias con la ciudad, la fecha de
alta, la valoración media, el número de operaciones cerradas y los anuncios
publicados. El perfil público NUNCA incluye email ni teléfono.

#### Scenario: Consulta de perfil

- **WHEN** cualquier visitante abre el perfil de un alias existente
- **THEN** el sistema muestra alias, ciudad, antigüedad, valoración media,
  operaciones cerradas y anuncios publicados

#### Scenario: Perfil inexistente

- **WHEN** el alias solicitado no existe
- **THEN** el sistema responde con la página de recurso no encontrado
