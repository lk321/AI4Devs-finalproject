## Purpose

Permite a un comprador localizar entre todo el catálogo publicado los artículos
que encajan con lo que busca, acotando por texto, categoría, precio, estado y
cercanía, y compartir esa búsqueda con otra persona.

## ADDED Requirements

### Requirement: Búsqueda por texto

El sistema DEBE buscar el término introducido en el título y la descripción de
los anuncios `published` y `reserved`, ignorando mayúsculas y acentos.

#### Scenario: Coincidencias encontradas

- **WHEN** el comprador busca "bicicleta"
- **THEN** el sistema lista los anuncios visibles cuyo título o descripción
  contienen ese término

#### Scenario: Insensibilidad a acentos y mayúsculas

- **WHEN** el comprador busca "GUITARRA ACUSTICA"
- **THEN** el sistema devuelve también los anuncios que dicen "guitarra
  acústica"

#### Scenario: Sin resultados

- **WHEN** ningún anuncio coincide con el término
- **THEN** el sistema muestra un estado vacío con sugerencias para ampliar la
  búsqueda

#### Scenario: Anuncios no publicados

- **WHEN** un anuncio en `draft`, `sold` o `archived` coincide con el término
- **THEN** el sistema lo excluye de los resultados

### Requirement: Filtros del catálogo

El sistema DEBE permitir filtrar por categoría, precio mínimo y máximo, estado
de conservación y distancia máxima en kilómetros respecto a la ciudad indicada.
Los filtros DEBEN combinarse con el operador Y.

#### Scenario: Filtros combinados

- **WHEN** el comprador filtra categoría "deporte", precio entre 50 y 200 € y
  estado "como_nuevo"
- **THEN** el sistema devuelve sólo los anuncios que cumplen las tres
  condiciones

#### Scenario: Rango de precio inválido

- **WHEN** el precio mínimo es mayor que el máximo
- **THEN** el sistema ignora el filtro de precio e informa del rango inválido

#### Scenario: Filtro por distancia

- **WHEN** el comprador fija Madrid y 25 km de distancia máxima
- **THEN** el sistema excluye los anuncios cuya ciudad supera esa distancia

#### Scenario: Limpieza de filtros

- **WHEN** el comprador pulsa "limpiar filtros"
- **THEN** el sistema restablece el catálogo completo y la URL sin parámetros

### Requirement: Búsqueda compartible

El sistema DEBE reflejar término, filtros, orden y página en los parámetros de
la URL, de forma que abrir esa URL reproduzca exactamente el mismo resultado.

#### Scenario: Recarga de la página

- **WHEN** el comprador aplica filtros y recarga la página
- **THEN** el sistema mantiene los filtros aplicados y la misma página de
  resultados

#### Scenario: URL compartida

- **WHEN** otra persona abre la URL de resultados recibida
- **THEN** ve la misma búsqueda con los mismos filtros activos

### Requirement: Orden de resultados

El sistema DEBE ordenar por relevancia de forma predeterminada y DEBE ofrecer
además orden por precio ascendente, precio descendente y fecha de publicación
descendente.

#### Scenario: Orden por precio

- **WHEN** el comprador elige "precio: de menor a mayor"
- **THEN** el sistema devuelve los resultados ordenados de forma ascendente por
  precio

#### Scenario: Orden desconocido

- **WHEN** la URL contiene un criterio de orden no soportado
- **THEN** el sistema aplica el orden por relevancia sin error

### Requirement: Paginación

El sistema DEBE paginar los resultados en bloques de 24 anuncios e informar del
total de coincidencias.

#### Scenario: Navegación entre páginas

- **WHEN** hay 60 coincidencias y el comprador pasa a la página 2
- **THEN** el sistema muestra los anuncios 25 a 48 y el total de 60

#### Scenario: Página fuera de rango

- **WHEN** se solicita una página superior a la última disponible
- **THEN** el sistema muestra la última página existente
