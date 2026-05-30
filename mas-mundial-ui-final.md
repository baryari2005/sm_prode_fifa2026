# Más Mundial / Más San Miguel — Guía final UI para Codex

> **Objetivo:** este documento es la referencia final de UI/UX para aplicar la identidad visual de **Más Mundial / Más San Miguel** al proyecto **Prode Mundial 2026**.  
> Codex debe leer este archivo antes de hacer cambios visuales importantes.

---

## 1. Objetivo general

Necesitamos que toda la app del Prode Mundial 2026 tenga una identidad visual unificada, moderna, deportiva y claramente asociada a **Más San Miguel**.

La idea no es rehacer la app desde cero, sino realizar una **migración visual progresiva, segura y controlada**, manteniendo intacta la lógica actual.

La UI final debe sentirse:

- institucional
- mundialista
- deportiva
- moderna
- clara
- mobile first
- consistente entre pantallas
- fácil de mantener
- fácil de revertir si algo no convence

---

## 2. Regla principal

Antes de modificar una pantalla importante, Codex debe mostrar una propuesta visual o mock.

No se debe reestructurar una pantalla completa directamente sin validación previa.

### Flujo obligatorio

Para cada pantalla grande:

1. Analizar la pantalla actual.
2. Identificar componentes, lógica, hooks, stores y llamadas API que **no deben tocarse**.
3. Armar un mock o preview visual.
4. Mostrar qué archivos se crearían o modificarían.
5. Esperar aprobación.
6. Recién después aplicar cambios sobre la pantalla real.

Pantallas que requieren mock previo:

- Login
- Home / Dashboard
- Fixture
- Cargar pronósticos
- Mis pronósticos
- Ranking
- Perfil
- Layout general
- Sidebar / navegación mobile
- Estados vacíos importantes
- Pantallas de error

---

## 3. Identidad visual

### Colores principales

```css
--brand-navy: #1e2c46;
--brand-blue: #5993b6;
--brand-gold: #fab438;
--brand-white: #ffffff;
```

### Uso recomendado

#### Navy `#1e2c46`

Usar como color principal de marca.

Aplicar en:

- fondos hero
- login
- headers destacados
- cards oscuras
- sidebar o navegación institucional
- títulos importantes
- textos principales sobre fondos claros

#### Celeste `#5993b6`

Usar como color secundario.

Aplicar en:

- bordes activos
- detalles visuales
- separadores
- badges secundarios
- links
- highlights sutiles
- pattern de fondo

#### Amarillo / dorado `#fab438`

Usar como acento fuerte.

Aplicar en:

- botones principales
- estrellas
- sol
- badges importantes
- estados destacados
- números clave
- CTAs

No abusar del amarillo. Debe llamar la atención, no saturar toda la pantalla.

#### Blanco `#ffffff`

Usar para:

- cards claras
- textos sobre navy
- fondos limpios
- formularios
- tablas
- contenido denso

---

## 4. Tipografías

### Fuente principal

**Poppins**

Debe usarse como fuente global de la app.

Aplicar en:

- textos generales
- botones
- inputs
- labels
- tablas
- formularios
- navegación
- cards
- badges
- mensajes de estado

### Fuente de marca

**Cheddar Gothic Sans**

Debe usarse solo como fuente de impacto.

Aplicar en:

- títulos grandes
- hero titles
- frases como “Orgullo de barrio”
- frases como “Pasión mundial”
- números destacados
- titulares de ranking
- textos de identidad

No aplicar Cheddar Gothic Sans a toda la app.

### Clases sugeridas

```css
.font-brand {}
.brand-heading {}
.brand-hero-title {}
.brand-number {}
```

---

## 5. Assets necesarios

Codex debe validar si estos archivos existen. Si no existen, debe pedirlos explícitamente.

### Estructura sugerida

```txt
/public/brand/
  mas-logo.svg
  mas-logo-white.svg
  mas-logo-color.svg
  mas-sun.svg
  mas-stars.svg
  mas-pattern.png
  mas-pattern.svg
  argentina-flag.svg

/public/fonts/
  cheddar-gothic-sans.woff2
  poppins-regular.woff2
  poppins-medium.woff2
  poppins-semibold.woff2
  poppins-bold.woff2
```

### Regla importante

Si un asset no existe:

- no inventarlo
- no reemplazarlo por otro sin avisar
- no descargar de internet
- no romper el build
- dejar fallback claro
- informar qué archivo falta

### Respuesta esperada de Codex

Antes de implementar, Codex debe decir:

```txt
Archivos de marca encontrados:
- ...

Archivos faltantes:
- ...

Necesito que me pases:
1. ...
2. ...
3. ...
```

---

## 6. Pattern de fondo

El pattern orgánico de líneas celestes es un elemento central de la identidad.

### Uso principal

Debe usarse especialmente en:

- login
- hero del home
- headers de secciones
- cards oscuras destacadas
- estados vacíos importantes
- pantallas de bienvenida
- fondos institucionales

### Login

En el login, el pattern debe ocupar **todo el fondo**.

No debe quedar solo en una esquina.

Debe verse como una textura institucional de fondo, sobre navy, con opacidad controlada.

Ejemplo conceptual:

```tsx
<div className="relative min-h-screen overflow-hidden bg-[#1e2c46]">
  <div className="absolute inset-0 bg-[url('/brand/mas-pattern.png')] bg-cover bg-center opacity-20 pointer-events-none" />
  <div className="absolute inset-0 bg-gradient-to-b from-[#1e2c46]/75 to-[#1e2c46]/95 pointer-events-none" />
  <main className="relative z-10">
    {/* contenido */}
  </main>
</div>
```

### Reglas del pattern

- debe estar en una capa absoluta
- debe tener `pointer-events-none`
- no debe tapar contenido
- no debe dificultar lectura
- no debe verse como bloque cuadrado mal recortado
- en mobile debe tener menor opacidad
- puede combinarse con gradientes
- puede repetirse si el asset lo permite, pero sin cortes bruscos

---

## 7. Componentes visuales base

Antes de migrar pantallas, crear o adaptar componentes visuales reutilizables.

### Componentes sugeridos

```txt
BrandPageShell
BrandHero
BrandSectionCard
BrandPatternBackground
BrandTitle
BrandBadge
BrandActionButton
BrandEmptyState
BrandLoadingState
BrandStatsCard
BrandFixtureCard
BrandRankingCard
```

Estos componentes deben servir para que las pantallas compartan el mismo lenguaje visual.

---

## 8. Clases globales sugeridas

Crear tokens y clases reutilizables en `globals.css`, `tailwind.config` o donde corresponda según el proyecto.

```css
.brand-pattern-bg {}
.brand-pattern-overlay {}
.brand-card {}
.brand-card-dark {}
.brand-heading {}
.brand-subtitle {}
.brand-button-primary {}
.brand-button-secondary {}
.brand-badge {}
.brand-hero {}
.brand-glass-card {}
.brand-page-shell {}
```

La idea es evitar estilos sueltos repetidos por toda la app.

---

## 9. Sistema de botones

Todos los botones deben verse parte del mismo sistema.

### Botón principal

Uso:

- iniciar sesión
- jugar ahora
- cargar pronóstico
- guardar
- confirmar
- acciones principales

Estilo:

- fondo `#fab438`
- texto `#1e2c46`
- fuente Poppins semibold
- border radius grande
- altura cómoda
- hover suave
- buen tamaño táctil en mobile

Ejemplo:

```tsx
<Button className="rounded-2xl bg-[#fab438] px-5 py-3 font-semibold text-[#1e2c46] hover:bg-[#f7c45a]">
  Jugar ahora
</Button>
```

### Botón secundario

Uso:

- volver
- refrescar
- ver detalle
- acciones complementarias

Estilo:

- fondo blanco o navy según contexto
- borde celeste
- texto navy o blanco
- hover sutil

### Botón peligro

Uso:

- eliminar
- cancelar acción sensible
- rechazar

Regla:

- mantener claridad semántica
- no camuflar errores o acciones destructivas con colores de marca
- puede adaptarse visualmente, pero debe seguir siendo reconocible como acción peligrosa

---

## 10. Sistema de cards

### Card clara

Uso:

- formularios
- tablas
- listados
- fixture
- ranking
- contenido denso

Estilo:

- fondo blanco
- borde suave
- sombra sutil
- radio grande
- texto navy
- detalles celestes
- acentos amarillos mínimos

### Card oscura

Uso:

- hero
- resumen destacado
- próximo partido
- ranking propio
- llamados a la acción

Estilo:

- fondo navy
- pattern sutil
- texto blanco
- acentos amarillos
- bordes o brillos celestes con baja opacidad

---

## 11. Login final esperado

El login debe ser una pantalla protagonista de la identidad.

Debe incluir:

- fondo navy
- pattern en todo el fondo
- logo Más San Miguel
- frase fuerte:
  - “Orgullo de barrio”
  - “Pasión mundial”
- CTA claro
- card de login legible
- textos con personalidad
- responsive mobile y desktop

### No tocar

- lógica de login
- endpoint de login
- validaciones
- stores
- manejo de token
- redirecciones
- errores de auth

Solo modificar estructura visual y estilos.

---

## 12. Home / Dashboard final esperado

El home debe funcionar como portada de la experiencia.

Debe incluir:

- saludo del usuario
- bloque destacado con identidad Más Mundial
- resumen de ranking
- próximo partido o próxima acción
- accesos rápidos
- cards consistentes
- presencia sutil del pattern
- CTAs claros

Debe sentirse como “entrada al torneo”.

---

## 13. Fixture final esperado

El fixture debe ser claro, visual y fácil de recorrer.

Recomendaciones:

- dividir partidos por bloques de fechas, idealmente cada 3 días
- mostrar banderas o escudos
- destacar estado del partido
- mostrar si está abierto para pronosticar
- mostrar si el pronóstico está cerrado
- destacar partidos próximos
- usar cards compactas en mobile
- usar layout más amplio en desktop

Estados visuales sugeridos:

```txt
Abierto a pronosticar
Cierra pronto
Predicción cerrada
En vivo
Finalizado
```

---

## 14. Cargar pronósticos final esperado

Debe ser una pantalla simple y rápida.

Prioridades:

- que el usuario entienda qué partidos puede pronosticar
- que se vea claramente el deadline
- que se puedan cargar resultados sin confusión
- que los botones principales sean consistentes
- que se mantenga el agrupamiento por fechas
- que el estado abierto/cerrado sea muy claro

No tocar:

- reglas de cierre
- validaciones
- endpoints
- lógica de guardado

---

## 15. Mis pronósticos final esperado

Debe permitir revisar rápido lo cargado.

Prioridades:

- distinguir pronósticos abiertos, cerrados y finalizados
- mostrar resultado real si existe
- mostrar puntos obtenidos si corresponde
- mantener cards consistentes con fixture
- facilitar edición cuando esté permitido

No tocar:

- lógica de puntos
- lógica de edición
- reglas de cierre
- llamadas API

---

## 16. Ranking final esperado

El ranking debe sentirse competitivo y visualmente atractivo.

Recomendaciones:

- destacar posición del usuario
- usar card oscura para “Mi ranking”
- usar amarillo para puntos destacados
- usar celeste para separadores o progreso
- usar tabla o lista clara
- mejorar top 3 visualmente
- mantener buena lectura en mobile

Componentes shadcn sugeridos:

- Card
- Badge
- Tabs si hay rankings por fase o grupo
- Table para desktop
- Accordion o cards para mobile
- Skeleton para carga

---

## 17. Estados vacíos

Los estados vacíos deben tener personalidad.

Ejemplos de copy:

```txt
Todavía no hay partidos para pronosticar.
El Mundial se está preparando. Volvé pronto.

Aún no cargaste pronósticos.
Tu barrio también juega: empezá con el próximo partido.

Todavía no hay ranking disponible.
Cuando empiece la acción, vas a ver quién manda en la tabla.
```

Visual:

- card clara o navy
- sol o estrellas
- pattern sutil
- botón de acción si corresponde

---

## 18. Loaders

Los loaders deben ser consistentes.

Recomendaciones:

- Skeletons de shadcn para cards/listados
- spinner solo si es necesario
- mensajes cortos y personalizados

Ejemplos:

```txt
Preparando el fixture...
Cargando tu ranking...
Buscando tus pronósticos...
```

---

## 19. Errores

Las pantallas 403, 404 y 500 deben seguir la identidad.

### 403

Mensaje sugerido:

```txt
No tenés acceso a esta jugada.
```

### 404

Mensaje sugerido:

```txt
Esta página se fue al lateral.
```

### 500

Mensaje sugerido:

```txt
Hubo un error en la cancha.
```

Usar:

- pattern sutil
- navy
- amarillo para CTA
- texto claro
- botón para volver al inicio

---

## 20. Responsive

La app debe estar optimizada para:

- mobile
- desktop
- notebook chica de 14 pulgadas

Reglas:

- no usar alturas fijas que rompan pantallas chicas
- evitar cards demasiado altas
- evitar sidebar cortado
- usar grids adaptativos
- en mobile, priorizar una columna
- en desktop, usar 2 o 3 columnas cuando aporte claridad
- botones con tamaño táctil cómodo
- textos grandes solo donde correspondan

---

## 21. Qué no debe tocar Codex

No modificar:

- endpoints
- servicios
- hooks de datos
- Zustand stores
- auth
- permisos
- schemas
- validaciones
- lógica de ranking
- cálculo de puntos
- lógica de pronósticos
- cron
- integración con APIs
- reglas de cierre de pronósticos
- rutas existentes
- nombres de módulos de permisos

Si para mejorar UI hace falta mover algo, primero debe avisar.

---

## 22. Mocks y previews

Crear una pantalla temporal de validación visual.

Ruta sugerida:

```txt
/src/app/brand-preview/page.tsx
```

Esta pantalla debe mostrar:

- paleta de colores
- tipografías
- botones
- inputs
- badges
- cards claras
- cards oscuras
- hero con pattern
- ejemplo de fixture
- ejemplo de ranking
- estado vacío
- loader
- ejemplo de login visual

Esta pantalla no debe afectar navegación productiva.

---

## 23. Entrega esperada por etapa

Al terminar cada etapa, Codex debe responder:

```txt
Archivos modificados:
- ...

Archivos creados:
- ...

Qué cambió:
- ...

Qué no se tocó:
- ...

Assets faltantes:
- ...

Cómo probar:
- ...

Mock o preview:
- ...
```

---

## 24. Etapas recomendadas

### Etapa 1 — Base visual

- assets
- fuentes
- tokens
- clases globales
- componentes base
- pantalla `brand-preview`

No tocar pantallas reales todavía.

### Etapa 2 — Login

- mock primero
- aprobación
- implementación real
- pattern en todo el fondo

### Etapa 3 — Home / Dashboard

- mock primero
- aprobación
- implementación real

### Etapa 4 — Fixture

- mock primero
- aprobación
- implementación real

### Etapa 5 — Cargar pronósticos y Mis pronósticos

- mock primero
- aprobación
- implementación real

### Etapa 6 — Ranking

- mock primero
- aprobación
- implementación real

### Etapa 7 — Estados finales

- perfil
- loaders
- errores
- empty states
- detalles visuales
- unificación final

---

## 25. Prompt inicial para Codex

Usar este pedido al comenzar:

```md
Leé el archivo de guía final UI de Más Mundial / Más San Miguel antes de modificar el proyecto.

Primero inspeccioná la estructura actual y respondé con:
1. Archivos de diseño global encontrados.
2. Assets de marca encontrados.
3. Assets faltantes.
4. Archivos que conviene modificar en la Etapa 1.
5. Riesgos visuales o técnicos.
6. Plan de implementación por etapas.

No hagas cambios grandes todavía.
No modifiques lógica.
No modifiques endpoints.
No modifiques stores.
No modifiques permisos.
No modifiques rutas.
Primero quiero validar la base visual y los mocks.
```

---

## 26. Criterio de aceptación final

La migración visual se considera correcta si:

- toda la app usa Poppins como fuente base
- Cheddar Gothic Sans se usa solo para títulos de marca
- los colores están centralizados
- los botones se ven consistentes
- las cards tienen un mismo sistema visual
- el login usa pattern en todo el fondo
- el pattern no tapa contenido
- cada pantalla importante fue validada con mock previo
- mobile se ve bien
- notebook chica se ve bien
- no se rompió lógica existente
- no se modificaron endpoints ni stores
- no se tocaron permisos
- la app se siente visualmente como “Más Mundial / Más San Miguel”

---

## 27. Nota final

La prioridad es una UI final con identidad fuerte, pero sin perder estabilidad.

Codex debe avanzar de forma incremental:

```txt
base visual → preview → mock → aprobación → implementación real
```

No hacer cambios grandes sin aprobación previa.
