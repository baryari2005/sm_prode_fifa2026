# Live Control Map

## Rutas encontradas
- `/api/partidos`
- `/api/partidos/[id]`
- `/api/partidos/resultados`
- `/api/partidos/actualizar-en-juego-api`
- `/api/partidos/actualizar-resultados-api`
- `/api/partidos/cargar-api`
- `/api/partidos/reimportar-api`
- `/api/partidos/generar-cruces`
- `/api/pronosticos`
- `/api/pronosticos/bulk`
- `/api/pronosticos/general`
- `/api/pronosticos/ranking`
- `/api/pronosticos/recalcular-ranking-diario`
- `/api/goleadores`
- `/api/paises/[id]/plantel`
- `/api/paises/[id]/plantel/import`
- `/api/paises/[id]/plantel/import-api`
- `/api/plantel/[jugadorId]`
- Nuevas:
- `/api/admin/live-control/matches`
- `/api/admin/live-control/matches/[id]/goal`
- `/api/admin/live-control/matches/[id]/status`
- `/api/admin/live-control/matches/[id]/sync-now`
- `/api/admin/live-control/sync-now`
- `/api/admin/live-control/tools`

## Modelos involucrados
- `Partido`
- `Resultado`
- `PrediccionPartido`
- `RankingUsuario`
- `Seleccion`
- `JugadorSeleccion`
- `Fase`
- `ReglaPuntaje`
- Nuevos:
- `PartidoEventoLive`
- `PartidoLiveAudit`

## Services y helpers reutilizados
- `src/features/partidos/services/partido.service.ts`
- `src/features/partidos/services/partidos.service.ts`
- `src/features/partidos/services/pronosticos.service.ts`
- `src/features/partidos/services/resultado.service.ts`
- `src/features/partidos/services/plantel.service.ts`
- `src/features/goleadores/services/goleadores.service.ts`
- `src/hooks/useCan.ts`
- `src/lib/server-auth.ts`

## Frontend que depende de partidos/resultados/pronósticos
- `src/app/(dashboard)/admin/partidos/**`
- `src/features/partidos/components/**`
- `src/features/partidos/hooks/**`
- `src/app/(dashboard)/pronosticos/**`
- `src/features/pronosticos/components/**`
- `src/features/pronosticos/hooks/**`
- `src/app/(dashboard)/ranking/page.tsx`
- `src/app/(dashboard)/admin/goleadores/page.tsx`
- `src/app/(dashboard)/admin/planteles/**`

## Cron jobs y sincronización externa
- Cron documentada en `VERCEL_CRON_PARTIDOS_EN_JUEGO.md`
- Endpoint cron actual: `/api/partidos/actualizar-en-juego-api`
- Sync de resultados finales: `/api/partidos/actualizar-resultados-api`
- Reimport fixture: `/api/partidos/cargar-api` y `/api/partidos/reimportar-api`

## Funciones nuevas creadas
- `reconcileLiveEvents(apiEvents, dbEvents)`
- `findMatchingGoal(apiGoal, dbGoals)`
- `calculateScoreFromEvents(events)`
- `createManualGoal(...)`
- `syncSingleMatchNow(partidoId)`
- `syncLiveMatches()`
- `cleanupDuplicateLiveGoals(partidoId, userId)`
- `validateMatchLiveConsistency(partidoId)`
- `recalculateScoreFromEvents(partidoId, userId)`

## Flujo recomendado
1. El operador live crea eventos manuales protegidos en `PartidoEventoLive`.
2. La próxima sincronización usa `syncLiveMatches()` para traer eventos/API y reconciliar contra los ya guardados.
3. Si el evento API es equivalente a uno manual, no se duplica.
4. Ningún evento `protected=true` o `confirmedManual=true` se elimina automáticamente.
5. Después de reconciliar, el sistema recalcula el score y lo refleja en `Resultado` para no romper ranking, detalle, fixture y pronósticos existentes.
6. Toda acción manual o técnica registra auditoría en `PartidoLiveAudit`.
