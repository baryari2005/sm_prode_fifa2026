# Prode Mundial 2026 — SQL para pruebas mock de partidos

Este archivo contiene queries para simular estados y resultados de partidos directamente en Supabase/Postgres.

> Reemplazá `537327` por el `footballDataId` del partido que quieras probar.

---

## 0. Orden recomendado de prueba

1. Verificar el partido.
2. Resetear resultado si querés empezar limpio.
3. Cambiar la fecha para que el partido parezca iniciado.
4. Ponerlo en juego.
5. Cambiar marcadores/minutos.
6. Finalizarlo.
7. Volver a consultar la pantalla o endpoint.

> Importante: si finalizás directo por SQL, no se ejecuta automáticamente la función TypeScript `recalcularPronosticosDePartido`.
> Para probar recalculo de puntos, usá el endpoint mock desde Postman con `status=FINISHED`.

---

## 1. Verificar tipos de columnas

Ejecutá esto si aparecen errores de tipos como `text = uuid` o `uuid = text`.

```sql
SELECT 
  table_name,
  column_name,
  data_type,
  udt_name
FROM information_schema.columns
WHERE table_name IN ('Partido', 'Seleccion', 'Resultado')
  AND column_name IN (
    'id',
    'seleccionLocalId',
    'seleccionVisitanteId',
    'partidoId',
    'footballDataId'
  )
ORDER BY table_name, column_name;
```

---

## 2. Ver el partido por `footballDataId`

Este query contempla que `Partido.seleccionLocalId` y `Partido.seleccionVisitanteId` puedan ser `text`, mientras que `Seleccion.id` sea `uuid`.

```sql
SELECT
  p.id,
  p."footballDataId",
  p.fecha,
  p.fecha AT TIME ZONE 'America/Argentina/Buenos_Aires' AS fecha_argentina,
  sl.nombre AS seleccion_local,
  sv.nombre AS seleccion_visitante,
  r.estado,
  r."golesLocal",
  r."golesVisitante",
  r."penalesLocal",
  r."penalesVisitante",
  r."tiempoJuego",
  r.observaciones,
  r."createdAt" AS resultado_created_at,
  r."updatedAt" AS resultado_updated_at
FROM "Partido" p
LEFT JOIN "Seleccion" sl 
  ON sl.id::text = p."seleccionLocalId"
LEFT JOIN "Seleccion" sv 
  ON sv.id::text = p."seleccionVisitanteId"
LEFT JOIN "Resultado" r 
  ON r."partidoId" = p.id
WHERE p."footballDataId" = 537327;
```

---

## 3. Resetear resultado del partido

Elimina el resultado cargado para volver a probar desde cero.

```sql
BEGIN;

DELETE FROM "Resultado" r
USING "Partido" p
WHERE r."partidoId" = p.id
  AND p."footballDataId" = 537327;

COMMIT;
```

---

## 4. Cambiar fecha para que el partido parezca iniciado

Esto sirve si tu endpoint/cron filtra partidos con `fecha <= NOW()`.

```sql
BEGIN;

UPDATE "Partido"
SET
  fecha = NOW() - INTERVAL '10 minutes',
  "updatedAt" = NOW()
WHERE "footballDataId" = 537327;

COMMIT;
```

Verificación:

```sql
SELECT
  id,
  "footballDataId",
  fecha AS fecha_utc,
  fecha AT TIME ZONE 'America/Argentina/Buenos_Aires' AS fecha_argentina
FROM "Partido"
WHERE "footballDataId" = 537327;
```

---

## 5. Dejar el partido como futuro otra vez

```sql
BEGIN;

UPDATE "Partido"
SET
  fecha = NOW() + INTERVAL '2 hours',
  "updatedAt" = NOW()
WHERE "footballDataId" = 537327;

COMMIT;
```

---

# Casos de prueba de resultado

Los siguientes scripts usan `INSERT ... ON CONFLICT ("partidoId") DO UPDATE`, para que funcionen tanto si el resultado no existe como si ya existe.

Si te aparece error por `gen_random_uuid()`, ejecutá una sola vez:

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

---

## 6. Partido EN JUEGO — 0 a 0, minuto 10

```sql
BEGIN;

INSERT INTO "Resultado" (
  id,
  "partidoId",
  "golesLocal",
  "golesVisitante",
  "penalesLocal",
  "penalesVisitante",
  estado,
  "tiempoJuego",
  observaciones,
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid(),
  p.id,
  0,
  0,
  NULL,
  NULL,
  'EN_JUEGO',
  10,
  'Prueba SQL mock: partido en juego minuto 10.',
  NOW(),
  NOW()
FROM "Partido" p
WHERE p."footballDataId" = 537327
ON CONFLICT ("partidoId")
DO UPDATE SET
  "golesLocal" = 0,
  "golesVisitante" = 0,
  "penalesLocal" = NULL,
  "penalesVisitante" = NULL,
  estado = 'EN_JUEGO',
  "tiempoJuego" = 10,
  observaciones = 'Prueba SQL mock: partido en juego minuto 10.',
  "updatedAt" = NOW();

COMMIT;
```

---

## 7. Partido EN JUEGO — local gana 1 a 0, minuto 35

```sql
BEGIN;

INSERT INTO "Resultado" (
  id,
  "partidoId",
  "golesLocal",
  "golesVisitante",
  "penalesLocal",
  "penalesVisitante",
  estado,
  "tiempoJuego",
  observaciones,
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid(),
  p.id,
  1,
  0,
  NULL,
  NULL,
  'EN_JUEGO',
  35,
  'Prueba SQL mock: gol local, partido en juego minuto 35.',
  NOW(),
  NOW()
FROM "Partido" p
WHERE p."footballDataId" = 537327
ON CONFLICT ("partidoId")
DO UPDATE SET
  "golesLocal" = 1,
  "golesVisitante" = 0,
  "penalesLocal" = NULL,
  "penalesVisitante" = NULL,
  estado = 'EN_JUEGO',
  "tiempoJuego" = 35,
  observaciones = 'Prueba SQL mock: gol local, partido en juego minuto 35.',
  "updatedAt" = NOW();

COMMIT;
```

---

## 8. Partido EN JUEGO — empate 1 a 1, minuto 70

```sql
BEGIN;

INSERT INTO "Resultado" (
  id,
  "partidoId",
  "golesLocal",
  "golesVisitante",
  "penalesLocal",
  "penalesVisitante",
  estado,
  "tiempoJuego",
  observaciones,
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid(),
  p.id,
  1,
  1,
  NULL,
  NULL,
  'EN_JUEGO',
  70,
  'Prueba SQL mock: empate parcial minuto 70.',
  NOW(),
  NOW()
FROM "Partido" p
WHERE p."footballDataId" = 537327
ON CONFLICT ("partidoId")
DO UPDATE SET
  "golesLocal" = 1,
  "golesVisitante" = 1,
  "penalesLocal" = NULL,
  "penalesVisitante" = NULL,
  estado = 'EN_JUEGO',
  "tiempoJuego" = 70,
  observaciones = 'Prueba SQL mock: empate parcial minuto 70.',
  "updatedAt" = NOW();

COMMIT;
```

---

## 9. Partido EN JUEGO — visitante gana 1 a 2, minuto 80

```sql
BEGIN;

INSERT INTO "Resultado" (
  id,
  "partidoId",
  "golesLocal",
  "golesVisitante",
  "penalesLocal",
  "penalesVisitante",
  estado,
  "tiempoJuego",
  observaciones,
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid(),
  p.id,
  1,
  2,
  NULL,
  NULL,
  'EN_JUEGO',
  80,
  'Prueba SQL mock: visitante gana 2 a 1 minuto 80.',
  NOW(),
  NOW()
FROM "Partido" p
WHERE p."footballDataId" = 537327
ON CONFLICT ("partidoId")
DO UPDATE SET
  "golesLocal" = 1,
  "golesVisitante" = 2,
  "penalesLocal" = NULL,
  "penalesVisitante" = NULL,
  estado = 'EN_JUEGO',
  "tiempoJuego" = 80,
  observaciones = 'Prueba SQL mock: visitante gana 2 a 1 minuto 80.',
  "updatedAt" = NOW();

COMMIT;
```

---

## 10. Partido FINALIZADO — local gana 2 a 1

```sql
BEGIN;

INSERT INTO "Resultado" (
  id,
  "partidoId",
  "golesLocal",
  "golesVisitante",
  "penalesLocal",
  "penalesVisitante",
  estado,
  "tiempoJuego",
  observaciones,
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid(),
  p.id,
  2,
  1,
  NULL,
  NULL,
  'FINALIZADO',
  90,
  'Prueba SQL mock: partido finalizado 2 a 1.',
  NOW(),
  NOW()
FROM "Partido" p
WHERE p."footballDataId" = 537327
ON CONFLICT ("partidoId")
DO UPDATE SET
  "golesLocal" = 2,
  "golesVisitante" = 1,
  "penalesLocal" = NULL,
  "penalesVisitante" = NULL,
  estado = 'FINALIZADO',
  "tiempoJuego" = 90,
  observaciones = 'Prueba SQL mock: partido finalizado 2 a 1.',
  "updatedAt" = NOW();

COMMIT;
```

---

## 11. Partido FINALIZADO — empate 1 a 1

```sql
BEGIN;

INSERT INTO "Resultado" (
  id,
  "partidoId",
  "golesLocal",
  "golesVisitante",
  "penalesLocal",
  "penalesVisitante",
  estado,
  "tiempoJuego",
  observaciones,
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid(),
  p.id,
  1,
  1,
  NULL,
  NULL,
  'FINALIZADO',
  90,
  'Prueba SQL mock: partido finalizado empatado 1 a 1.',
  NOW(),
  NOW()
FROM "Partido" p
WHERE p."footballDataId" = 537327
ON CONFLICT ("partidoId")
DO UPDATE SET
  "golesLocal" = 1,
  "golesVisitante" = 1,
  "penalesLocal" = NULL,
  "penalesVisitante" = NULL,
  estado = 'FINALIZADO',
  "tiempoJuego" = 90,
  observaciones = 'Prueba SQL mock: partido finalizado empatado 1 a 1.',
  "updatedAt" = NOW();

COMMIT;
```

---

## 12. Partido FINALIZADO — visitante gana 0 a 2

```sql
BEGIN;

INSERT INTO "Resultado" (
  id,
  "partidoId",
  "golesLocal",
  "golesVisitante",
  "penalesLocal",
  "penalesVisitante",
  estado,
  "tiempoJuego",
  observaciones,
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid(),
  p.id,
  0,
  2,
  NULL,
  NULL,
  'FINALIZADO',
  90,
  'Prueba SQL mock: visitante gana 2 a 0.',
  NOW(),
  NOW()
FROM "Partido" p
WHERE p."footballDataId" = 537327
ON CONFLICT ("partidoId")
DO UPDATE SET
  "golesLocal" = 0,
  "golesVisitante" = 2,
  "penalesLocal" = NULL,
  "penalesVisitante" = NULL,
  estado = 'FINALIZADO',
  "tiempoJuego" = 90,
  observaciones = 'Prueba SQL mock: visitante gana 2 a 0.',
  "updatedAt" = NOW();

COMMIT;
```

---

## 13. Partido FINALIZADO por penales — 1 a 1, penales 4 a 3

```sql
BEGIN;

INSERT INTO "Resultado" (
  id,
  "partidoId",
  "golesLocal",
  "golesVisitante",
  "penalesLocal",
  "penalesVisitante",
  estado,
  "tiempoJuego",
  observaciones,
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid(),
  p.id,
  1,
  1,
  4,
  3,
  'FINALIZADO',
  90,
  'Prueba SQL mock: partido finalizado por penales, gana local.',
  NOW(),
  NOW()
FROM "Partido" p
WHERE p."footballDataId" = 537327
ON CONFLICT ("partidoId")
DO UPDATE SET
  "golesLocal" = 1,
  "golesVisitante" = 1,
  "penalesLocal" = 4,
  "penalesVisitante" = 3,
  estado = 'FINALIZADO',
  "tiempoJuego" = 90,
  observaciones = 'Prueba SQL mock: partido finalizado por penales, gana local.',
  "updatedAt" = NOW();

COMMIT;
```

---

## 14. Partido FINALIZADO por penales — 2 a 2, penales 3 a 5

```sql
BEGIN;

INSERT INTO "Resultado" (
  id,
  "partidoId",
  "golesLocal",
  "golesVisitante",
  "penalesLocal",
  "penalesVisitante",
  estado,
  "tiempoJuego",
  observaciones,
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid(),
  p.id,
  2,
  2,
  3,
  5,
  'FINALIZADO',
  90,
  'Prueba SQL mock: partido finalizado por penales, gana visitante.',
  NOW(),
  NOW()
FROM "Partido" p
WHERE p."footballDataId" = 537327
ON CONFLICT ("partidoId")
DO UPDATE SET
  "golesLocal" = 2,
  "golesVisitante" = 2,
  "penalesLocal" = 3,
  "penalesVisitante" = 5,
  estado = 'FINALIZADO',
  "tiempoJuego" = 90,
  observaciones = 'Prueba SQL mock: partido finalizado por penales, gana visitante.',
  "updatedAt" = NOW();

COMMIT;
```

---

## 15. Partido SUSPENDIDO — 0 a 0, minuto 55

```sql
BEGIN;

INSERT INTO "Resultado" (
  id,
  "partidoId",
  "golesLocal",
  "golesVisitante",
  "penalesLocal",
  "penalesVisitante",
  estado,
  "tiempoJuego",
  observaciones,
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid(),
  p.id,
  0,
  0,
  NULL,
  NULL,
  'SUSPENDIDO',
  55,
  'Prueba SQL mock: partido suspendido minuto 55.',
  NOW(),
  NOW()
FROM "Partido" p
WHERE p."footballDataId" = 537327
ON CONFLICT ("partidoId")
DO UPDATE SET
  "golesLocal" = 0,
  "golesVisitante" = 0,
  "penalesLocal" = NULL,
  "penalesVisitante" = NULL,
  estado = 'SUSPENDIDO',
  "tiempoJuego" = 55,
  observaciones = 'Prueba SQL mock: partido suspendido minuto 55.',
  "updatedAt" = NOW();

COMMIT;
```

---

## 16. Partido CANCELADO

```sql
BEGIN;

INSERT INTO "Resultado" (
  id,
  "partidoId",
  "golesLocal",
  "golesVisitante",
  "penalesLocal",
  "penalesVisitante",
  estado,
  "tiempoJuego",
  observaciones,
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid(),
  p.id,
  0,
  0,
  NULL,
  NULL,
  'CANCELADO',
  NULL,
  'Prueba SQL mock: partido cancelado.',
  NOW(),
  NOW()
FROM "Partido" p
WHERE p."footballDataId" = 537327
ON CONFLICT ("partidoId")
DO UPDATE SET
  "golesLocal" = 0,
  "golesVisitante" = 0,
  "penalesLocal" = NULL,
  "penalesVisitante" = NULL,
  estado = 'CANCELADO',
  "tiempoJuego" = NULL,
  observaciones = 'Prueba SQL mock: partido cancelado.',
  "updatedAt" = NOW();

COMMIT;
```

---

## 17. Volver resultado a PENDIENTE

Sirve para probar cómo se ve un partido que todavía no inició, pero manteniendo un registro en `Resultado`.

```sql
BEGIN;

INSERT INTO "Resultado" (
  id,
  "partidoId",
  "golesLocal",
  "golesVisitante",
  "penalesLocal",
  "penalesVisitante",
  estado,
  "tiempoJuego",
  observaciones,
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid(),
  p.id,
  0,
  0,
  NULL,
  NULL,
  'PENDIENTE',
  NULL,
  'Prueba SQL mock: resultado vuelto a pendiente.',
  NOW(),
  NOW()
FROM "Partido" p
WHERE p."footballDataId" = 537327
ON CONFLICT ("partidoId")
DO UPDATE SET
  "golesLocal" = 0,
  "golesVisitante" = 0,
  "penalesLocal" = NULL,
  "penalesVisitante" = NULL,
  estado = 'PENDIENTE',
  "tiempoJuego" = NULL,
  observaciones = 'Prueba SQL mock: resultado vuelto a pendiente.',
  "updatedAt" = NOW();

COMMIT;
```

---

# Pruebas por endpoint mock

Además de SQL, podés probar el route mock usando Postman o navegador.

## En juego

```txt
GET /api/partidos/actualizar-en-juego-api?mock=1&footballDataId=537327&status=IN_PLAY&home=2&away=1&minute=64&includeFuture=1
```

## Finalizado

```txt
GET /api/partidos/actualizar-en-juego-api?mock=1&footballDataId=537327&status=FINISHED&home=3&away=2&minute=90&includeFuture=1
```

## Finalizado por penales

```txt
GET /api/partidos/actualizar-en-juego-api?mock=1&footballDataId=537327&status=FINISHED&home=1&away=1&penHome=4&penAway=3&minute=90&includeFuture=1
```

## Suspendido

```txt
GET /api/partidos/actualizar-en-juego-api?mock=1&footballDataId=537327&status=SUSPENDED&home=0&away=0&minute=55&includeFuture=1
```

## Cancelado

```txt
GET /api/partidos/actualizar-en-juego-api?mock=1&footballDataId=537327&status=CANCELLED&home=0&away=0&includeFuture=1
```

---

# Nota importante sobre ranking y pronósticos

Los SQL modifican la base directamente.

Eso sirve para probar la pantalla visualmente, pero no ejecuta lógica de backend como:

```ts
recalcularPronosticosDePartido(tx, partido.id)
```

Para probar cálculo de puntos, conviene usar el endpoint mock con:

```txt
status=FINISHED
```

porque ahí sí pasa por la lógica del route.
