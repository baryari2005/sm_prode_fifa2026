# Prode Live Control Admin

## Objetivo
Consolidar el modulo privado `/admin/live-control` para operar partidos del Prode Mundial 2026 en tiempo real, sin romper la sincronizacion automatica ni la consistencia de resultados, ranking, pronosticos y auditoria.

El panel debe servir para:
- operacion live rapida durante partidos en juego
- contingencias manuales cuando la API externa no alcanza
- mantenimiento tecnico seguro desde una consola interna
- cierre correcto de partidos viejos que quedaron abiertos

## Reglas rectoras
Estas reglas tienen prioridad sobre cualquier decision de implementacion:

1. Los eventos manuales quedan protegidos.
2. El cron no duplica ni borra eventos manuales equivalentes.
3. El marcador se calcula desde eventos.
4. Las estadisticas derivadas se recalculan desde eventos cuando corresponda.
5. Toda accion manual o tecnica registra auditoria obligatoria.

## Estado actual relevado

### Ya implementado
- Ruta protegida `/admin/live-control`.
- Endpoints base:
  - `GET /api/admin/live-control/matches`
  - `POST /api/admin/live-control/matches/[id]/goal`
  - `PATCH /api/admin/live-control/matches/[id]/status`
  - `POST /api/admin/live-control/matches/[id]/sync-now`
  - `POST /api/admin/live-control/sync-now`
  - `POST /api/admin/live-control/tools`
- Modelos Prisma:
  - `PartidoEventoLive`
  - `PartidoLiveAudit`
- Services actuales:
  - `calculateScoreFromEvents`
  - `findMatchingGoal`
  - `reconcileLiveEvents`
  - `createManualGoal`
  - `updateLiveMatchStatus`
  - `syncSingleMatchNow`
  - `syncLiveMatches`
  - `cleanupDuplicateLiveGoals`
  - `validateMatchLiveConsistency`
  - `recalculateScoreFromEvents`
  - `recalculatePointsForMatch`
  - `recalculateRankingFromPredictions`
- Permisos dedicados:
  - modulo `live-control`
- Consola tecnica inicial:
  - acciones de sync
  - recalculos
  - carga simple de formaciones

### Documentacion tecnica existente
- `docs/live-control-map.md`

## Alcance funcional base

### Pantallas
- `/admin/live-control`
- `/admin/live-control/tools` o pestana `Herramientas tecnicas`

### Operacion live visual
Debe permitir:
- listar partidos live y proximos
- mostrar estado:
  - programado
  - en vivo
  - entretiempo
  - finalizado
  - suspendido
- mostrar marcador calculado desde eventos validos
- ejecutar acciones rapidas:
  - gol local
  - gol visitante
  - editar minuto
  - cambiar estado
  - finalizar partido
  - sincronizar ahora
- mostrar historial compacto de eventos y auditoria

### Consola tecnica
Debe funcionar como “Swagger interno” visual y seguro.

Debe incluir:
- selector de accion
- formulario dinamico por accion
- preview del payload
- resultado tipo JSON formateado
- historial de acciones recientes

Acciones tecnicas previstas:
- sincronizar partido especifico
- sincronizar todos los partidos live
- recalcular marcador desde eventos
- recalcular puntos del Prode
- recalcular ranking
- limpiar eventos duplicados
- validar consistencia de partido
- marcar partido como en vivo
- marcar partido como entretiempo
- marcar partido como finalizado
- actualizar minuto actual
- actualizar resultado parcial
- cargar gol manual
- cargar estadisticas
- cargar formacion
- cargar plantel
- cargar goleador
- cargar tarjetas
- cargar penales

## Modelos y contratos base

### Modelo `PartidoEventoLive`
Campos actuales y/o requeridos:
- `id`
- `partidoId`
- `tipo`
- `equipoId`
- `jugadorId`
- `minuto`
- `descripcion`
- `source`
- `externalEventId`
- `confirmedManual`
- `protected`
- `createdById`
- `createdAt`
- `updatedAt`

### Modelo `PartidoLiveAudit`
- `id`
- `partidoId`
- `userId`
- `accion`
- `valorAnterior`
- `valorNuevo`
- `createdAt`

### Resultado como fuente persistente derivada
`Resultado` sigue siendo el modelo persistente que refleja:
- goles local y visitante
- estado del partido
- tiempo de juego
- estadisticas local y visitante
- alineacion local y visitante
- detalle de goles
- penales si aplican

Regla:
- `Resultado` no es la fuente primaria de goles live.
- Los goles y eventos live son la fuente primaria.
- `Resultado` debe recalcularse o actualizarse a partir de esa fuente.

## Reglas de reconciliacion y consistencia

### Reconciliacion con API externa
- Si un gol manual protegido ya existe, el cron no lo duplica.
- Un gol se considera equivalente si coincide:
  - mismo partido
  - mismo equipo
  - mismo jugador si esta disponible
  - minuto igual o cercano con tolerancia de +/- 2
- Si la API trae un gol nuevo que no existe, se crea con `source = API`.
- Si la API no trae todavia un gol manual, no se elimina.
- Nunca borrar eventos `protected = true` desde cron o sync.
- Nunca pisar `confirmedManual = true` automaticamente.
- El cron y el boton “Sincronizar ahora” usan el mismo service.

### Consistencia de negocio
- goles actualizan marcador calculado
- tarjetas actualizan estadisticas derivadas
- penal convertido durante partido puede crear gol si corresponde
- tanda de penales no altera goles del tiempo regular
- ranking y puntos se recalculan solo cuando corresponda
- todo cambio manual debe auditarse

## Seguridad
- Todos los endpoints usan `requireAuth`.
- El acceso live usa `requireLiveControlAccess`.
- Debe mantenerse proteccion extra por usuario/rol/email/id autorizado.
- Inputs validados con Zod.
- Auditoria obligatoria en cada accion manual y tecnica.

## Arquitectura esperada

### Prisma
Revisar si hacen falta extensiones para soportar Fase 2:
- nuevos tipos de evento para tarjetas avanzadas y penales
- datos estructurados para tanda de penales
- campos auxiliares para eventos anulados, penal, en contra, VAR o metadata
- estadisticas derivadas mas completas

### Endpoints API
Mantener y extender los existentes sin romper contratos actuales.

### Services y helpers
Reutilizar primero lo que ya existe en:
- `src/features/live-control/services/live-control.service.ts`
- `src/features/partidos/services/partido.service.ts`
- `src/features/partidos/services/pronosticos.service.ts`
- `src/features/partidos/services/resultado.service.ts`

Crear helpers nuevos solo si separan bien responsabilidades.

### Cron y sync
- `syncLiveMatches()` debe seguir siendo la pieza comun entre cron y accion manual.
- Cualquier sync nuevo por tarjetas o penales debe reconciliar igual que goles.

## Fase 2 - Mejoras Live Control

### 1. Nueva pestana `Partidos no cerrados`
Agregar en la pantalla principal las pestanas:
- Live / actuales
- Proximos
- Partidos no cerrados
- Herramientas tecnicas

Definicion de “no cerrados”:
- partidos de fechas anteriores que sigan:
  - `PENDIENTE`
  - `EN_JUEGO`
  - `ENTRETIEMPO`
  - `SUSPENDIDO`
  - sin cierre final consistente

Objetivo:
- detectar partidos viejos mal cerrados
- permitir saneamiento rapido

Acciones disponibles:
- ver marcador actual
- editar estado
- finalizar partido
- sincronizar ahora
- recalcular marcador
- recalcular puntos del Prode
- validar consistencia

Cambios esperados:
- API:
  - extender `GET /api/admin/live-control/matches` con agrupacion por categoria
  - o agregar endpoint dedicado `GET /api/admin/live-control/matches/open`
- service:
  - helper para clasificar en `live`, `proximos`, `noCerrados`
- UI:
  - nueva pestana y cards reutilizando `LiveMatchCard`

### 2. Goles con seleccion de jugador desde listado
Al cargar un gol manual, el operador debe poder:
- elegir equipo `LOCAL` o `VISITANTE`
- cargar minuto
- seleccionar jugador desde plantel del equipo
- observacion opcional
- marcar metadata:
  - penal
  - en contra
  - VAR si aplica

Reglas:
- el listado sale del plantel de la seleccion del partido
- evento manual queda:
  - `source = MANUAL`
  - `confirmedManual = true`
  - `protected = true`
- si es gol anulado por VAR, no debe sumar al marcador

Cambios esperados:
- modelos Prisma:
  - posible metadata JSON o campos como `esPenal`, `enContra`, `anuladoVAR`
- endpoint:
  - ampliar body de `POST /api/admin/live-control/matches/[id]/goal`
- service:
  - extender `createManualGoal`
  - actualizar `calculateScoreFromEvents` para excluir anulados y contemplar en contra
- UI:
  - mejorar `LiveControlGoalDialog`

### 3. Carga dinamica de formaciones por esquema
Necesidad:
- seleccionar formacion
- renderizar slots automaticamente

Ejemplo:
- `4-3-3` => `1 + 4 + 3 + 3`

Formaciones minimas:
- `4-4-2`
- `4-3-3`
- `4-2-3-1`
- `3-5-2`
- `5-3-2`
- `4-3-1-2`
- `3-4-3`

Reglas:
- titulares se cargan segun formacion
- maximo 11 titulares
- exactamente 1 arquero titular
- no permitir jugadores duplicados
- suplentes por defecto = todos los jugadores del plantel no elegidos como titulares
- permitir override manual de suplentes
- guardar por equipo y por partido

Implementacion recomendada:
1. Version simple:
   - selects dinamicos por posicion
   - helper `buildFormationSlots`
   - helper `validateLineup`
   - helper `getDefaultSubstitutes`
2. Version futura:
   - drag & drop entre banco y cancha

Cambios esperados:
- UI:
  - nueva seccion dedicada en `LiveControlToolsPanel`
  - o componente separado reutilizable desde resultados/formaciones
- services/helpers:
  - `buildFormationSlots`
  - `validateLineup`
  - `getDefaultSubstitutes`
- reutilizacion:
  - usar `getPreviousLineupForSelection`
  - reutilizar `teamLineupSchema`

### 4. Reutilizacion de formacion previa del equipo
Si existe una alineacion previa de esa seleccion:
- ofrecer “usar ultima formacion”
- permitir usarla como base editable

Prioridad:
- reutilizar service existente `getPreviousLineupForSelection`
- no duplicar logica de la pantalla `/admin/partidos/[id]/formaciones`

### 5. Suplentes calculados automaticamente
Comportamiento esperado:
- una vez elegidos titulares, el sistema arma suplentes por diferencia contra el plantel
- permitir sacar o agregar suplentes manualmente despues

Reglas:
- un jugador no puede quedar a la vez en titulares y suplentes
- si cambia un titular, recalcular sugerencia

### 6. Carga de tarjetas por jugador, tipo y minuto
Agregar accion para registrar tarjetas:
- equipo
- jugador
- tipo:
  - amarilla
  - segunda amarilla
  - roja directa
- minuto
- observacion

Eventos requeridos:
- `TARJETA_AMARILLA`
- `SEGUNDA_AMARILLA`
- `TARJETA_ROJA`

Reglas:
- deben afectar estadisticas derivadas del partido
- deben reconciliarse con eventos API sin duplicarse
- un evento manual protegido no puede ser borrado por cron

Cambios esperados:
- Prisma:
  - ampliar enum `PartidoEventoLiveTipo`
- endpoint:
  - nuevo endpoint dedicado o accion tecnica robusta
- services/helpers:
  - `calculateCardsFromEvents`
  - `findMatchingCard`

### 7. Carga de penales durante partido y tanda
Contemplar dos escenarios:

Penal durante partido:
- equipo
- jugador pateador
- minuto
- resultado:
  - convertido
  - errado
  - atajado
  - palo
- observacion

Tanda de penales:
- orden
- equipo
- jugador pateador
- resultado
- observacion

Reglas:
- orden unico por equipo en tanda
- jugador debe existir en plantel
- no duplicar penal equivalente
- penal convertido en tanda no altera marcador regular
- penal convertido durante partido puede alterar marcador

Cambios esperados:
- Prisma:
  - ampliar enum de eventos o usar metadata estructurada
  - evaluar persistencia de tanda en `Resultado` o eventos live
- services/helpers:
  - `calculatePenaltyShootoutResult`
  - `findMatchingPenalty`
- API:
  - endpoint o accion tecnica especifica

### 8. Carga completa de estadisticas
Debe permitir carga manual por local y visitante de:
- remates
- remates al arco
- posesion
- pases
- precision de pases
- corners
- offsides
- faltas
- atajadas
- tarjetas amarillas
- tarjetas rojas
- goles esperados si se decide incorporar
- cualquier otra estadistica ya soportada por el modelo

Reglas:
- estadisticas manuales editables
- tarjetas derivadas desde eventos
- goles derivados desde eventos
- marcador derivado desde eventos
- evitar doble carga de tarjetas si ya existen eventos

Cambios esperados:
- revisar `TeamStats`
- revisar `Resultado.estadisticasLocal` y `estadisticasVisitante`
- helper de merge entre carga manual y derivaciones

### 9. Revision de consistencia general
Crear una validacion integral que revise:
- marcador vs eventos
- tarjetas vs estadisticas
- penales vs resultado
- estados del partido
- partidos viejos no cerrados
- duplicados logicos
- auditoria minima

Consolidar o extender:
- `validateMatchLiveConsistency`

### 10. Set de tests unitarios
Definir cobertura minima de logica critica.

Si el proyecto aun no tiene framework:
- sugerir Vitest
- configurarlo sin romper Next.js

Ver detalle en seccion `Tests requeridos`.

### 11. Checklist manual de validacion
Generar y mantener:
- seccion en este documento
- archivo operativo `docs/live-control-test-checklist.md`

## Tests requeridos

### Framework
- usar el framework que ya exista
- si no existe, preparar Vitest
- evitar acoplar tests a componentes gigantes

### Reconciliacion de goles
- no duplica gol manual protegido cuando corre cron
- agrega gol API nuevo
- no elimina gol manual ausente en API
- considera equivalente mismo equipo/jugador con tolerancia de minuto +/- 2
- trata como nuevo un gol de otro jugador o equipo

### Marcador
- calcula marcador desde eventos `GOL` validos
- no cuenta goles anulados
- no cuenta penales de tanda como goles del partido
- cuenta penal convertido durante partido si corresponde
- contempla goles en contra si se modelan

### Tarjetas
- calcula amarillas por equipo desde eventos
- calcula rojas por equipo desde eventos
- segunda amarilla impacta correctamente
- no duplica tarjeta manual con tarjeta API equivalente

### Penales
- guarda penal durante partido
- guarda tanda con orden
- valida orden unico por equipo
- penal convertido en tanda no altera marcador regular
- penal convertido durante partido puede alterar marcador

### Formaciones
- `4-3-3` genera `1 + 4 + 3 + 3` slots
- `4-4-2` genera `1 + 4 + 4 + 2` slots
- no permite mas de 11 titulares
- no permite jugador duplicado
- exige 1 arquero
- calcula suplentes por diferencia
- permite reutilizar formacion previa

### clasificación de partidos
- partido finalizado no aparece en `no cerrados`
- partido viejo no finalizado aparece en `Partidos no cerrados`
- partido actual aparece en `Live`
- partido futuro aparece en `Proximos`

### Consistencia
- partido finalizado debe tener resultado calculado
- recalcular ranking se ejecuta despues de cerrar partido si corresponde
- auditoria se registra en cada accion manual
- sync manual y cron usan la misma logica base

## Checklist manual de pruebas

Referencia operativa:
- `docs/live-control-test-checklist.md`

Resumen minimo:

### Panel principal
- acceso permitido solo a usuario admin autorizado
- usuario sin permiso no puede entrar
- se muestran partidos live
- se muestran proximos
- se muestran no cerrados
- el marcador se calcula desde eventos

### Goles
- se puede cargar gol local
- se puede cargar gol visitante
- se puede elegir jugador desde listado
- el marcador se actualiza
- el evento queda `MANUAL`
- el evento queda `protected = true`
- cron no duplica ese gol
- sync agrega goles API nuevos sin pisar manuales

### Formaciones
- se puede elegir formacion
- se generan slots automaticamente
- se pueden elegir jugadores por posicion
- no permite duplicados
- calcula suplentes automaticamente
- permite reutilizar formacion previa
- guarda formacion por partido

### Tarjetas
- se puede cargar amarilla
- se puede cargar segunda amarilla
- se puede cargar roja directa
- se puede elegir jugador
- se puede cargar minuto
- estadisticas de tarjetas se actualizan

### Penales
- se puede cargar penal durante partido
- se puede cargar tanda
- se puede definir orden
- no permite orden duplicado
- tanda no altera marcador regular
- penal convertido durante partido puede alterar marcador

### Estadisticas
- se pueden cargar estadisticas manuales
- tarjetas se derivan desde eventos
- goles se derivan desde eventos

### Cron y sync
- sincronizar partido funciona
- sincronizar todos funciona
- cron reutiliza la misma logica que sync-now
- cron no pisa eventos manuales protegidos
- cron agrega eventos nuevos de API
- se registra auditoria

### Cierre de partido
- se puede finalizar partido
- se recalcula marcador
- se recalculan puntos
- se recalcula ranking
- desaparece de no cerrados

## Cambios a revisar por capa

### Modelos Prisma
Revisar necesidad de tocar:
- `prisma/schema.prisma`
- enums de `PartidoEventoLiveTipo`
- metadata para:
  - VAR
  - penal
  - gol en contra
  - tanda de penales
  - estado de anulacion

### Endpoints API
Revisar o agregar:
- `GET /api/admin/live-control/matches`
- `GET /api/admin/live-control/matches/open`
- `POST /api/admin/live-control/matches/[id]/goal`
- `POST /api/admin/live-control/matches/[id]/card`
- `POST /api/admin/live-control/matches/[id]/penalty`
- `POST /api/admin/live-control/matches/[id]/lineup`
- `POST /api/admin/live-control/matches/[id]/stats`
- `POST /api/admin/live-control/tools`

### Services y helpers
Revisar o crear:
- `src/features/live-control/services/live-control.service.ts`
- `src/features/live-control/helpers/*`
- `buildFormationSlots`
- `validateLineup`
- `getDefaultSubstitutes`
- `calculateCardsFromEvents`
- `calculatePenaltyShootoutResult`
- `findMatchingCard`
- `findMatchingPenalty`

### Componentes del panel
Revisar o extender:
- `LiveControlPageClient`
- `LiveMatchCard`
- `LiveControlGoalDialog`
- `LiveControlToolsPanel`
- nuevos componentes de:
  - tarjetas
  - penales
  - formaciones por esquema
  - estadisticas
  - pestaña no cerrados

### Cron y sync
Revisar:
- `src/app/api/partidos/actualizar-en-juego-api/route.ts`
- `syncLiveMatches()`
- reconciliacion de nuevos tipos de evento

### Permisos
Revisar:
- `src/features/live-control/helpers/live-control-permissions.ts`
- `src/config/sidebar.config.ts`
- `prisma/seed.rols.ts`

### Auditoria
Mantener obligatoria en:
- goles
- estados
- tarjetas
- penales
- formaciones
- estadisticas
- herramientas tecnicas

### Tests
Pendiente definir:
- framework actual o incorporacion de Vitest
- carpeta de tests
- cobertura de helpers puros y services clave

## Pendientes detectados
- Hoy no existe pestaña `Partidos no cerrados`.
- `upsert_lineup` ya guarda, pero todavia no resuelve la UI completa por esquema.
- No existe flujo completo de tarjetas live.
- No existe flujo completo de penales live y tanda.
- `calculateScoreFromEvents` todavia esta centrado en `GOL` simple.
- Faltan derivaciones completas de estadisticas desde eventos.
- No hay set de tests unitarios implementado para Live Control.
- Falta materializar el checklist manual en uso cotidiano del equipo.

## Archivos candidatos a tocar en implementacion
- `prisma/schema.prisma`
- `prisma/migrations/*`
- `src/app/api/admin/live-control/matches/route.ts`
- `src/app/api/admin/live-control/matches/[id]/goal/route.ts`
- `src/app/api/admin/live-control/matches/[id]/status/route.ts`
- `src/app/api/admin/live-control/matches/[id]/sync-now/route.ts`
- `src/app/api/admin/live-control/tools/route.ts`
- `src/app/api/partidos/actualizar-en-juego-api/route.ts`
- `src/features/live-control/services/live-control.service.ts`
- `src/features/live-control/schemas/live-control.schemas.ts`
- `src/features/live-control/types/live-control.types.ts`
- `src/features/live-control/helpers/live-control-permissions.ts`
- `src/features/live-control/components/LiveControlPageClient.tsx`
- `src/features/live-control/components/LiveMatchCard.tsx`
- `src/features/live-control/components/LiveControlGoalDialog.tsx`
- `src/features/live-control/components/LiveControlToolsPanel.tsx`
- `src/features/partidos/services/partido.service.ts`
- `src/features/partidos/schemas/resultado.schema.ts`
- `src/features/partidos/services/resultado.service.ts`
- `src/features/partidos/services/plantel.service.ts`
- `docs/live-control-map.md`
- `docs/live-control-test-checklist.md`
