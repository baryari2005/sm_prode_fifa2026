# Prompt para Codex — Overlay de celebración de gol

Usá este archivo `.md` como especificación principal para implementar la celebración visual de gol en el dashboard del **Prode Mundial 2026**.

Primero leé todo este archivo y antes de modificar código respondeme con:

1. Qué entendiste del objetivo visual.
2. Qué archivos/componentes relacionados encontraste.
3. Qué archivos vas a crear o modificar.
4. Cómo vas a separar responsabilidades para evitar código sábana.
5. Confirmación de que no vas a cambiar lógica de negocio, endpoints, auth, permisos ni datos.

Después de ese plan, aplicá los cambios siguiendo este `.md`.

---

## Objetivo general

Necesito implementar una animación visual cuando se detecta un gol en el dashboard del Prode Mundial 2026.

La idea NO es mostrar un modal tradicional ni una card flotante.

Quiero una celebración inmersiva:

- Fondo de toda la pantalla oscurecido.
- Dashboard de atrás desenfocado.
- Mascota PNG transparente en el centro o levemente hacia la derecha.
- Texto grande `GOOOL`.
- Texto secundario `Gol de X equipo`.
- Confeti, destellos o partículas alrededor.
- Animación sobre la mascota.
- Mascota sola, sin recuadro, sin borde, sin card y sin fondo propio.

---

## Reglas importantes

- No cambiar lógica de negocio existente.
- No cambiar endpoints.
- No tocar auth.
- No tocar permisos.
- No tocar middleware.
- No romper el dashboard actual.
- No hacer código sábana.
- Separar en componentes chicos si hace falta.
- Usar Next.js, TypeScript, TailwindCSS, shadcn/ui si aplica, lucide-react y framer-motion solo si ya está instalado.
- Si framer-motion no está instalado, usar animaciones con Tailwind/CSS.
- No agregar dependencias nuevas sin avisarme antes.

---

## Qué NO quiero

No hacer:

- No usar `Dialog`.
- No usar modal clásico.
- No usar card rectangular grande.
- No poner borde blanco alrededor de todo.
- No poner fondo sólido detrás de la mascota.
- No poner la mascota dentro de una card.
- No usar imagen tipo póster.
- No dejar el overlay como una caja flotante.

---

## Qué SÍ quiero

Sí hacer:

- Overlay full screen.
- Backdrop oscuro con blur.
- Mascota PNG transparente como protagonista.
- Texto integrado.
- Glow detrás de la mascota.
- Confeti o partículas alrededor.
- Entrada con animación: fade + scale + bounce leve.
- Salida automática después de unos segundos.
- Que se pueda reutilizar para cualquier equipo.

---

## Estructura sugerida

Crear componentes separados para evitar código sábana.

Sugerencia:

```txt
features/live-goals/components/GoalCelebrationOverlay.tsx
features/live-goals/components/GoalCelebrationMascot.tsx
features/live-goals/components/GoalCelebrationText.tsx
features/live-goals/components/GoalCelebrationConfetti.tsx
features/live-goals/types/live-goal.types.ts
```

Si el proyecto ya tiene otra estructura para dashboard, partidos en vivo o live matches, adaptarlo a la estructura existente.

---

## Props sugeridas

El componente principal puede recibir algo así:

```ts
type GoalCelebrationOverlayProps = {
  open: boolean;
  teamName: string;
  teamFlagSrc?: string | null;
  scorerName?: string | null;
  minute?: number | null;
  mascotSrc: string;
  onClose?: () => void;
};
```

El texto principal debe ser dinámico:

```txt
GOOOL
Gol de {teamName}
```

Si hay goleador:

```txt
GOOOL
Gol de {teamName}
Lo hizo {scorerName}
```

Si hay minuto:

```txt
GOOOL
Gol de {teamName} · {minute}'
```

---

## Layout esperado

La estructura visual debería ser similar a esto:

```tsx
<div className="fixed inset-0 z-[999]">
  {/* Fondo oscuro */}
  <div className="absolute inset-0 bg-slate-950/78 backdrop-blur-md" />

  {/* Glow general */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(34,197,94,0.22),transparent_36%)]" />

  {/* Contenido centrado sin card */}
  <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
    <div className="relative flex flex-col items-center justify-center text-center">
      {/* Confeti */}
      {/* Mascota */}
      {/* Texto */}
    </div>
  </div>
</div>
```

---

## Mascota

La mascota debe ser PNG transparente.

Debe mostrarse sin recuadro:

```tsx
<Image
  src={mascotSrc}
  alt="Mascota celebrando un gol"
  width={320}
  height={320}
  priority
  className="relative z-20 object-contain drop-shadow-[0_28px_80px_rgba(0,0,0,0.65)]"
/>
```

Agregar glow detrás:

```tsx
<div className="absolute left-1/2 top-1/2 z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/20 blur-3xl" />
```

La mascota debe quedar protagonista, como si estuviera celebrando arriba del dashboard.

---

## Texto

Texto integrado, sin card:

```tsx
<div className="relative z-30 mt-4 text-center">
  <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/40 bg-yellow-300/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
    Gol detectado
  </div>

  <h2 className="mt-4 text-6xl font-black tracking-[-0.08em] text-white md:text-7xl">
    GOOOL
  </h2>

  <p className="mt-2 text-xl font-bold text-white/90 md:text-2xl">
    Gol de {teamName}
  </p>
</div>
```

Si hay bandera:

```tsx
{teamFlagSrc && (
  <Image
    src={teamFlagSrc}
    alt={teamName}
    width={32}
    height={22}
    className="rounded-sm object-cover"
  />
)}
```

---

## Confeti / partículas

Crear un componente simple de partículas con elementos absolutos.

No hace falta una librería si no existe.

Requisitos:

- 18 a 28 partículas.
- Colores sugeridos:
  - verde
  - amarillo
  - celeste
  - blanco
- Animación con `animate-ping`, `animate-bounce`, `animate-pulse` o keyframes CSS.
- Distribuidas alrededor de la mascota.
- No sobrecargar visualmente.

Ejemplo conceptual:

```tsx
const particles = Array.from({ length: 24 });

return (
  <div className="pointer-events-none absolute inset-0 z-10">
    {particles.map((_, index) => (
      <span
        key={index}
        className="absolute h-2 w-2 rounded-full bg-emerald-300 animate-bounce"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
      />
    ))}
  </div>
);
```

Importante: si se usa `Math.random()`, evitar problemas de hydration. Preferir posiciones fijas definidas en un array constante.

---

## Animación

La aparición debe sentirse como celebración:

- Overlay fade in.
- Mascota entra con scale de `0.75` a `1`.
- Pequeño bounce o pulso.
- Texto entra desde abajo.
- Confeti aparece alrededor.
- Después de `2.8s` a `4s` se cierra automáticamente si `onClose` existe.

Si se usa framer-motion y ya está instalado:

```tsx
initial={{ opacity: 0, scale: 0.8, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.92, y: -10 }}
```

Si no se usa framer-motion, hacerlo con Tailwind/CSS.

---

## Comportamiento

El overlay debe:

- Renderizarse solo si `open === true`.
- Bloquear visualmente la pantalla.
- Cerrarse automáticamente después de unos segundos.
- Permitir cerrar con `Escape` si es simple de implementar.
- No dejar timers colgados.
- Limpiar `setTimeout` en `useEffect`.

Ejemplo:

```ts
useEffect(() => {
  if (!open || !onClose) return;

  const timeout = window.setTimeout(() => {
    onClose();
  }, 3500);

  return () => window.clearTimeout(timeout);
}, [open, onClose]);
```

---

## Integración

No inventar una integración grande.

Primero crear el componente visual reutilizable.

Después, en el dashboard o donde se detectan goles, mostrarlo con estado temporal.

Ejemplo conceptual:

```tsx
<GoalCelebrationOverlay
  open={goalCelebrationOpen}
  teamName={goalTeamName}
  teamFlagSrc={goalTeamFlagSrc}
  scorerName={goalScorerName}
  minute={goalMinute}
  mascotSrc="/mascotas/mexico-goal.png"
  onClose={() => setGoalCelebrationOpen(false)}
/>
```

Si todavía no existe la lógica real de detección de gol, dejar el componente listo y agregar un ejemplo controlado o una función mock solo si ya existe una pantalla de pruebas.

No modificar la lógica de live match sync salvo que la tarea lo pida.

---

## Estilo visual esperado

Debe sentirse así:

- Pantalla oscura.
- Dashboard de fondo blur.
- Mascota grande y sola.
- `GOOOL` gigante.
- `Gol de X equipo`.
- Confeti/destellos.
- Sin card.
- Sin modal tradicional.
- Sin recuadro alrededor de la mascota.

---

## Resultado esperado

Quiero un overlay visual reutilizable para goles.

Debe quedar como una celebración encima del dashboard, no como un dialog.

---

## Pruebas

Verificar:

1. Al abrir `GoalCelebrationOverlay`, se oscurece todo el dashboard.
2. La mascota aparece sola y centrada.
3. No hay card rectangular.
4. El texto dice `GOOOL`.
5. El subtítulo dice `Gol de X equipo`.
6. Se ve confeti o partículas.
7. Se cierra automáticamente.
8. No quedan timers activos.
9. No se rompe el dashboard.
10. No se cambió lógica de endpoints ni auth.
11. No se generó código sábana.

---

## Entrega esperada

Al terminar, responder con:

```txt
Archivos creados:
- ...

Archivos modificados:
- ...

Cambios realizados:
- ...

Cómo probar:
1. ...
2. ...
3. ...

Notas:
- ...
```
