# AGENTS.md

## Proyecto

Este proyecto es una app Next.js / TypeScript para un Prode Mundial 2026.
Además, respetá la regla de no generar código sábana: separá responsabilidades en componentes, hooks, helpers, services o types cuando el archivo empiece a crecer, pero sin hacer refactors grandes innecesarios.

La aplicación usa principalmente:

- Next.js App Router
- TypeScript
- Prisma
- Supabase / PostgreSQL
- shadcn/ui
- TailwindCSS
- lucide-react
- Zustand para auth cuando corresponda
- axiosInstance para llamadas HTTP cuando ya exista en el proyecto

El objetivo general es mantener una app ordenada, segura, escalable y fácil de mantener.

---

## Forma de trabajo obligatoria

Antes de modificar código:

- Revisar la estructura existente del proyecto.
- Buscar archivos relacionados antes de crear archivos nuevos.
- Reutilizar helpers, hooks, schemas, services, types y componentes existentes.
- No hacer refactors grandes innecesarios.
- No cambiar nombres de rutas existentes salvo que la tarea lo pida claramente.
- No cambiar contratos de API salvo que sea estrictamente necesario.
- No tocar autenticación, permisos ni middleware salvo que la tarea lo pida explícitamente.
- No eliminar validaciones del backend.
- No modificar código que no esté relacionado con la tarea pedida.
- Priorizar cambios chicos, claros y fáciles de revisar.

---

## Estructura de archivos y componentización

Muy importante:
- Evitar código sábana.
- No meter toda la lógica, UI y estilos en un solo archivo gigante.
- Siempre que un componente empiece a crecer demasiado, separar responsabilidades en archivos chicos.
- Reutilizar componentes existentes antes de crear nuevos.
- Crear archivos nuevos solo si ayudan a mantener el código ordenado.
- Mantener una estructura clara por responsabilidad.

Cuando aplique, separar en:
- components: componentes visuales.
- dialogs: modales/dialogs.
- hooks: lógica de estado o efectos.
- helpers: funciones puras o utilidades.
- services: llamadas HTTP/API.
- types: tipos TypeScript.
- schemas: validaciones si corresponde.

Ejemplo deseado:
- `components/dialogs/EditUserDialog.tsx`
- `components/dialogs/DeleteSelectionDialog.tsx`
- `components/dialogs/ProfileActionDialog.tsx`
- `components/dialogs/ThemedActionDialog.tsx`
- `hooks/useEditUserDialog.ts`
- `helpers/user-dialog.helpers.ts`
- `types/user-dialog.types.ts`

Regla:
Si una modificación requiere más de un bloque grande de código, preferir separar en componentes, helpers o hooks antes que dejar un archivo enorme.

Pero:
- No hacer refactors grandes innecesarios.
- No mover archivos por mover.
- No crear abstracciones exageradas.
- La separación debe ayudar realmente a que el código sea más mantenible.

---

## Estilo de respuesta esperado

Cuando termines una tarea, responder con:

- Archivos modificados.
- Qué se cambió en cada archivo.
- Cómo probarlo paso a paso.
- Qué comando correr, si aplica.
- Riesgos o puntos a revisar, si los hay.

Como Codex trabaja directo en el proyecto, no devolver todo el código completo salvo que se pida explícitamente.

---

## Reglas generales de código

- Mantener TypeScript tipado.
- Evitar `any` salvo que sea inevitable.
- Usar tipos existentes si ya están definidos.
- Crear tipos nuevos solo si realmente hacen falta.
- Preferir componentes chicos y reutilizables.
- Separar lógica en hooks, helpers o services cuando un componente se vuelve grande.
- Usar nombres claros en español cuando el dominio sea del Prode.
- Usar nombres consistentes con el código existente.
- No duplicar lógica si ya existe un helper.
- No agregar dependencias nuevas sin avisar antes.
- No cambiar estilos globales salvo que la tarea lo pida.
- No romper compatibilidad con mobile/PWA.

---

## Next.js / API Routes

En endpoints dinámicos o sensibles a datos recientes, usar cuando corresponda:

```ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
```

Para respuestas que no deben cachearse, usar headers:

```ts
return NextResponse.json(data, {
  headers: {
    "Cache-Control": "no-store, max-age=0",
  },
});
```

Reglas:

- No romper rutas existentes.
- No cambiar métodos HTTP existentes salvo que se pida.
- Mantener validaciones del backend.
- Usar `requireAuth` cuando la ruta requiera usuario autenticado.
- Usar `requirePermission` cuando la ruta requiera permisos.
- Mantener `runtime = "nodejs"` cuando se use Prisma.
- Evitar cache en endpoints donde los datos pueden cambiar seguido.

---

## Prisma / Base de datos

Reglas importantes:

- No modificar `schema.prisma` salvo que la tarea lo pida claramente.
- No ejecutar migraciones destructivas sin advertir.
- No borrar datos.
- Mantener relaciones existentes.
- Revisar tipos UUID, fechas y relaciones antes de escribir queries.
- Verificar nombres reales de modelos y campos antes de usarlos.
- No asumir que los IDs son `number`; muchos IDs pueden ser `uuid`.
- Para cambios de prueba, proponer SQL separado.
- Cuando propongas SQL de prueba, explicar también cómo revertirlo.
- No usar cambios destructivos como `DROP`, `TRUNCATE` o deletes masivos sin advertencia previa.

Cuando trabajes con fechas:

- Tener en cuenta que el proyecto usa horarios relacionados con Argentina.
- Revisar si las fechas vienen como UTC o como hora local.
- Evitar comparaciones ambiguas.
- Centralizar lógica de fechas en helpers si ya existen.

---

## Permisos y roles

La app usa permisos por módulo/acción.

Antes de mostrar, ocultar o bloquear una funcionalidad:

- Revisar si existe un hook tipo `useCan`.
- Revisar si existe lógica de permisos en frontend.
- Revisar si el backend usa `requireAuth`.
- Revisar si el backend usa `requirePermission`.
- Validar permisos tanto en frontend como en backend cuando corresponda.
- No confiar solo en el frontend.
- No mostrar botones de acciones si el usuario no tiene permiso.
- No permitir acciones sensibles desde API si el usuario no tiene permiso.

Ejemplo conceptual:

```ts
requirePermission(loggedInUser, "partidos", "editar");
```

No cambiar módulos o acciones de permisos existentes sin revisar el impacto en el dashboard.

---

## UI / UX

Mantener el estilo visual actual del proyecto:

- Cards con bordes redondeados.
- Gradientes suaves.
- shadcn/ui.
- TailwindCSS.
- Badges consistentes.
- Íconos de lucide-react.
- Diseño responsive.
- Sombras suaves.
- Separadores sutiles.
- Buen espaciado entre secciones.

Cuando modifiques componentes visuales:

- No cambiar el diseño general salvo que se pida.
- Mantener consistencia con cards, badges, botones e inputs existentes.
- Priorizar claridad visual.
- Evitar pantallas sobrecargadas.
- Mantener buen comportamiento en mobile.
- Evitar que los textos largos rompan el layout.
- Usar `truncate`, `line-clamp`, `flex-wrap` o layouts responsive cuando haga falta.

---

## Mobile / PWA

Cuando trabajes pantallas mobile o PWA:

- Priorizar layout claro.
- Evitar que los cards se rompan en pantallas chicas.
- Ocultar elementos secundarios si molestan en mobile.
- Mantener botones fáciles de tocar.
- Evitar tablas anchas sin scroll horizontal.
- Priorizar grids simples.
- Usar tamaños cómodos para inputs y botones.
- Probar mentalmente el layout en pantallas chicas.

En mobile, si hay demasiada información:

- Mostrar lo principal primero.
- Ocultar badges secundarios.
- Usar dialogs o accordions si mejora la experiencia.
- Evitar que bandera, nombre de país, inputs y botones queden apretados.

---

## Pronósticos

Reglas importantes del dominio:

- El backend siempre es la autoridad.
- No eliminar validaciones de cierre de pronóstico.
- Si un partido ya empezó o cerró, no debe permitir crear o editar pronósticos.
- El frontend puede mostrar estados, pero la validación final siempre debe estar en backend.
- Si el frontend tiene datos viejos y el backend rechaza con `400`, refrescar los datos y mostrar un toast claro.
- Para pantallas de pronóstico, considerar polling cada 30 segundos cuando la tarea involucre estados o fechas de partidos.

Reglas de UX para pronósticos:

- Mostrar claramente si un partido está abierto o cerrado.
- Mostrar cuenta regresiva cuando corresponda.
- Deshabilitar inputs cuando el pronóstico esté cerrado.
- Evitar que el usuario piense que puede guardar algo que ya no está permitido.
- Si una acción falla porque el partido cerró, refrescar automáticamente.

Mensaje sugerido cuando el backend rechaza por partido cerrado:

```ts
"El partido ya cerró para pronosticar. Actualizamos la información."
```

---

## Polling / refresco automático

Cuando una pantalla necesite enterarse de cambios recientes, por ejemplo partidos que cambian de estado:

- Usar polling controlado.
- Limpiar intervalos al desmontar.
- Evitar memory leaks.
- No hacer polling innecesario en todas las pantallas.
- Usar una frecuencia razonable, por ejemplo 30 segundos.
- Mostrar un badge de actualización si mejora la UX.

Ejemplo de comportamiento esperado:

- `Actualiza en 30s`
- `Actualiza en 29s`
- `Actualiza en 28s`

El badge debe:

- Reiniciarse después de cada refetch.
- Bajar segundo a segundo.
- Ejecutar recarga al llegar a 0.
- Usar Badge de shadcn/ui si existe.
- Usar íconos de lucide-react si corresponde.

---

## Resultados de partidos

Diferenciar claramente:

- Pronósticos del usuario.
- Resultados reales cargados por admin.

Reglas:

- No usar `/api/pronosticos/bulk` para cargar resultados reales de partidos.
- Los resultados reales deben ir por endpoints propios de resultados o partidos.
- Solo usuarios con permisos/admin deberían cargar resultados reales.
- Mantener validaciones de permisos en backend.
- No mezclar lógica de predicciones con lógica de resultados oficiales.

---

## Autenticación

Reglas:

- No modificar login/logout salvo que la tarea lo pida.
- No cambiar estructura del token salvo que sea necesario.
- No romper `requireAuth`.
- No romper Zustand/auth store si existe.
- No eliminar validaciones de sesión.
- Si una API requiere usuario, usar `requireAuth`.
- Si una API requiere permiso específico, usar `requirePermission`.

---

## axios / fetch

Cuando se consulten datos que no deben venir cacheados:

Con axios:

```ts
await axiosInstance.get("/api/ruta", {
  headers: {
    "Cache-Control": "no-cache",
  },
});
```

Con fetch:

```ts
await fetch("/api/ruta", {
  cache: "no-store",
});
```

Reglas:

- Reutilizar `axiosInstance` si ya se usa en esa zona del proyecto.
- No crear otro cliente HTTP innecesariamente.
- Mantener manejo de errores consistente.
- Mostrar toasts claros cuando corresponda.

---

## Manejo de errores

Reglas:

- Mostrar mensajes claros al usuario.
- No mostrar errores técnicos crudos en pantalla.
- Loguear en consola solo cuando ayude al desarrollo.
- Mantener respuestas JSON consistentes en API.
- No ocultar errores silenciosamente.

Para errores de permisos:

- Mostrar acceso denegado o redirigir según patrón existente.

Para errores de validación:

- Mostrar mensaje claro.
- No continuar el flujo como si hubiera salido bien.

---

## Toasts / feedback visual

Usar feedback visual cuando:

- Se guarda correctamente.
- Se actualizan datos.
- Una acción falla.
- El backend rechaza una operación por validación.
- El partido ya cerró y se refresca la información.

Preferir mensajes cortos y claros.

Ejemplos:

```ts
toast.success("Pronóstico guardado correctamente");
toast.warning("El partido ya cerró para pronosticar. Actualizamos la información.");
toast.error("No se pudo guardar el pronóstico");
```

---

## Componentización

Cuando un archivo crezca demasiado:

- Separar componentes visuales.
- Separar hooks.
- Separar helpers.
- Separar types.
- Separar schemas.
- Separar services.

Pero no hacer refactors grandes si la tarea es chica.

Prioridad:

1. Resolver la tarea.
2. Mantener el código limpio.
3. Evitar cambios innecesarios.
4. No romper funcionalidades existentes.

---

## shadcn/ui

Usar componentes existentes de shadcn/ui cuando ya estén disponibles:

- `Button`
- `Card`
- `Badge`
- `Input`
- `Label`
- `Select`
- `Dialog`
- `Tabs`
- `Table`
- `DropdownMenu`
- `Alert`
- `Skeleton`

No crear componentes duplicados si ya existe uno equivalente.

---

## TailwindCSS

Mantener clases consistentes con el proyecto.

Preferir:

- `rounded-2xl`
- `rounded-full`
- `shadow-sm`
- `border`
- `bg-white`
- `bg-sky-50`
- `text-sky-700`
- `text-muted-foreground`
- `grid`
- `flex`
- `gap-*`
- `p-*`
- `space-y-*`

Evitar:

- Estilos inline salvo que sean necesarios.
- Colores inconsistentes.
- Layouts rígidos que rompan mobile.
- Anchos fijos innecesarios.

---

## Testing / validación

Después de modificar código:

- Revisar errores TypeScript.
- Ejecutar lint si está disponible.
- Ejecutar build si la tarea lo justifica.
- Si no se puede correr un comando, explicarlo.

Comandos sugeridos:

```bash
npm run lint
npm run build
```

Si aparece un error:

- Identificar archivo.
- Explicar causa.
- Corregir si está relacionado con la tarea.
- No hacer cambios masivos no relacionados.

---

## SQL de prueba

Cuando se necesite simular un escenario con SQL:

- Proponer queries separadas.
- Explicar qué hace cada query.
- Explicar cómo revertir.
- Cuidar tipos UUID.
- Cuidar fechas con zona horaria.
- No borrar datos reales.

Ejemplo conceptual:

```sql
-- Simular que un partido ya empezó
UPDATE "Partido"
SET "fecha" = NOW() - INTERVAL '10 minutes'
WHERE "id" = 'UUID_DEL_PARTIDO';
```

También proponer reversión:

```sql
-- Revertir fecha de prueba
UPDATE "Partido"
SET "fecha" = '2026-06-11 13:00:00-03'
WHERE "id" = 'UUID_DEL_PARTIDO';
```

---

## Reglas específicas del Prode Mundial 2026

El sistema debe contemplar:

- Partidos del Mundial 2026.
- Pronósticos por usuario.
- Ranking de usuarios.
- Permisos por rol.
- Panel admin.
- Carga de resultados.
- Visualización mobile/PWA.
- Posiciones y puntos obtenidos.
- Estados de partidos.
- Cierre de pronósticos antes del inicio del partido.

Reglas importantes:

- No permitir pronósticos después del cierre.
- No confiar en el horario mostrado en frontend.
- Validar siempre en backend.
- Mantener clara la diferencia entre datos reales y predicciones del usuario.
- Mantener experiencia simple para usuarios comunes.
- Mantener controles administrativos protegidos por permisos.

---

## Restricciones fuertes

No hacer:

- Cambios masivos sin necesidad.
- Renombrado general de carpetas.
- Cambios de diseño grandes sin pedirlo.
- Eliminación de validaciones.
- Cambios en auth/permisos sin revisar impacto.
- Instalación de paquetes nuevos sin avisar.
- Migraciones destructivas sin advertir.
- Borrado de datos.
- Cambios de contratos de API sin justificar.
- Modificaciones en archivos no relacionados con la tarea.

---

## Antes de finalizar una tarea

Verificar:

- Que compile TypeScript.
- Que no haya imports rotos.
- Que no haya variables sin usar.
- Que no se haya roto mobile.
- Que los permisos sigan funcionando.
- Que las APIs sigan validando en backend.
- Que el cambio cumpla exactamente lo pedido.

Responder con un resumen claro:

```txt
Archivos modificados:
- archivo 1
- archivo 2

Cambios realizados:
- cambio 1
- cambio 2

Cómo probar:
1. Paso uno
2. Paso dos
3. Paso tres

Notas:
- Riesgos o puntos a revisar
```

---

## Instrucción final

Trabajar siempre de forma conservadora, prolija y enfocada en la tarea.

Cuando haya dudas entre hacer un cambio grande o uno chico, elegir el cambio chico.

Cuando algo pueda afectar seguridad, permisos, autenticación, base de datos o datos reales, advertirlo antes de avanzar.