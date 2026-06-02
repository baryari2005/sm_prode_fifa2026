# Vercel Cron para partidos en juego

## Objetivo

Ejecutar cada 5 minutos la sincronizacion de partidos en juego usando:

- `POST /api/partidos/actualizar-en-juego-api`

Ese endpoint:

- consulta la API de football-data
- filtra partidos en juego
- actualiza marcador y estado
- recalcula pronosticos solo si el partido pasa a `FINALIZADO`

## Importante

- En Vercel `Hobby`, las cron jobs no sirven para correr cada 5 minutos.
- Para `*/5 * * * *` necesitas `Pro` o superior.
- La zona horaria de Vercel Cron es `UTC`.

Referencia oficial:

- `https://vercel.com/docs/cron-jobs`
- `https://vercel.com/docs/cron-jobs/manage-cron-jobs`

## Variables de entorno requeridas

Configurar en `Vercel > Project > Settings > Environment Variables`:

- `FOOTBALL_DATA_API_TOKEN`
- `MUNDIAL_2026_API_URL`
- `CRON_SECRET`

### Valores esperados

- `FOOTBALL_DATA_API_TOKEN`
  Token de football-data.org

- `MUNDIAL_2026_API_URL`
  URL base de partidos del Mundial 2026, por ejemplo:

```txt
https://api.football-data.org/v4/competitions/WC/matches
```

- `CRON_SECRET`
  String largo y aleatorio. Recomendado: 16+ caracteres.

## Archivo `vercel.json`

Crear este archivo en la raiz del proyecto si no existe:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    {
      "path": "/api/partidos/actualizar-en-juego-api",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

## Como autentica Vercel la cron

Si `CRON_SECRET` existe, Vercel envia:

```txt
Authorization: Bearer <CRON_SECRET>
```

El endpoint ya esta preparado para aceptar:

- `Authorization: Bearer <CRON_SECRET>`
- `x-cron-secret: <CRON_SECRET>`

## Pasos de implementacion

1. Confirmar que el proyecto esta en Vercel `Pro` o superior.
2. Agregar las variables de entorno.
3. Crear o actualizar `vercel.json`.
4. Hacer deploy a `Production`.
5. Verificar que la cron aparezca en:
   `Project > Settings > Cron Jobs`
6. Revisar logs de ejecucion.

## Checklist rapido

- `[ ]` Existe `FOOTBALL_DATA_API_TOKEN`
- `[ ]` Existe `MUNDIAL_2026_API_URL`
- `[ ]` Existe `CRON_SECRET`
- `[ ]` El archivo `vercel.json` esta en la raiz
- `[ ]` La ruta cron es `/api/partidos/actualizar-en-juego-api`
- `[ ]` El schedule es `*/5 * * * *`
- `[ ]` El deploy se hizo a produccion
- `[ ]` La cron aparece en Settings > Cron Jobs

## Como probar antes del cron

### Opcion 1: desde la app

Ir a:

- `Gestión Mundial > Gestionar fixture`

Y ejecutar:

- `Sincronizar partidos en juego`

### Opcion 2: request manual

Ejemplo con `curl`:

```bash
curl -X POST "https://TU-DOMINIO/api/partidos/actualizar-en-juego-api" \
  -H "Authorization: Bearer TU_CRON_SECRET"
```

## Que deberias esperar

Si hay partidos en juego:

- actualiza marcador
- actualiza estado
- si alguno termino, recalcula pronosticos

Si no hay partidos en juego:

```json
{
  "message": "No hay partidos en juego para sincronizar."
}
```

## Donde ver errores

En Vercel:

1. `Project > Settings > Cron Jobs`
2. elegir la cron
3. `View Logs`

Tambien podes revisar:

- `Project > Logs`

Filtrando por:

```txt
requestPath:/api/partidos/actualizar-en-juego-api
```

## Riesgos a tener en cuenta

- Si la API externa no devuelve partidos en juego, no va a actualizar nada.
- Si la cron tarda mas que el intervalo, podria solaparse con otra corrida.
- Vercel recomienda pensar en lock/idempotencia si hubiera riesgo de concurrencia.

## Recomendacion futura

Si despues queres endurecerlo mas:

- agregar lock en base o redis
- guardar ultimo run exitoso
- guardar resumen historico de cada corrida
- alertar cuando falle la cron

## Estado actual del codigo

El endpoint implementado es:

- `src/app/api/partidos/actualizar-en-juego-api/route.ts`

La accion manual esta en:

- `src/features/partidos/components/PartidosAdminPanel.tsx`
