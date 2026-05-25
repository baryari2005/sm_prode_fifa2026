# Prompt para Codex — Rediseño Dashboard Principal Prode Mundial 2026

Usá el mockup adjunto como referencia visual principal.

También voy a adjuntar la imagen PNG transparente de la mascota.  
No uses la imagen tipo póster/cuadrada: integrá la mascota transparente dentro del hero como parte del diseño.

El código que aparece en este prompt es solo una guía visual de estructura.  
No hace falta copiarlo exacto si la estructura actual del proyecto ya tiene componentes parecidos.  
Primero revisá los archivos existentes y adaptá el cambio respetando la arquitectura actual.

---

## Objetivo

Necesito ajustar el dashboard principal del Prode Mundial 2026 para que quede mucho más parecido al mockup de referencia adjunto.

---

## Reglas importantes

- No cambiar lógica de negocio.
- No cambiar endpoints.
- No tocar auth, permisos ni middleware.
- No cambiar datos ni contratos de API.
- No hacer refactors grandes innecesarios.
- No hacer código sábana.
- Mantener o crear componentes chicos por responsabilidad.
- Reutilizar componentes, hooks, helpers, services, types y constantes existentes.
- Usar Next.js, TypeScript, TailwindCSS, shadcn/ui y lucide-react.
- Las imágenes de las mascotas que voy a usar ya tienen fondo transparente.
- Antes de modificar, primero indicame qué archivos encontraste relacionados con el dashboard y cuál es tu plan de cambios. Después aplicá los cambios.

---

## Problema actual

El dashboard quedó bastante bien, pero el hero principal no se parece lo suficiente al mockup.

Actualmente la imagen dentro del hero se ve como un póster/cuadro rectangular. Eso está mal.

Como las imágenes de las mascotas tienen fondo transparente, necesito que la mascota quede integrada directamente dentro del hero, posicionada a la derecha, sin contenedor visible, sin fondo cuadrado y sin parecer una imagen pegada.

---

## Objetivo visual

Quiero que el dashboard quede más parecido al mockup adjunto:

- Hero grande a la izquierda.
- Card de acciones importantes a la derecha.
- Hero con gradient oscuro verde/teal/azul petróleo.
- Mascota grande integrada dentro del hero.
- Sin póster.
- Sin imagen cuadrada.
- Sin card interna para la imagen.
- Stats en 4 columnas debajo.
- Abajo: partidos en juego, ranking rápido y última actividad.
- Accesos rápidos al final.
- Código limpio y separado por componentes.

---

## Layout general esperado

El `main` debe tener un ancho máximo cómodo:

```tsx
<main className="mx-auto w-full max-w-[1320px] space-y-6 px-6 py-6">
  ...
</main>
```

### Primera fila

```tsx
<div className="grid grid-cols-12 gap-6">
  <div className="col-span-8">
    <DashboardHeroCard />
  </div>

  <div className="col-span-4">
    <ImportantActionsCard />
  </div>
</div>
```

### Segunda fila

```tsx
<div className="grid grid-cols-4 gap-6">
  <DashboardStatCard />
  <DashboardStatCard />
  <DashboardStatCard />
  <DashboardStatCard />
</div>
```

### Tercera fila

```tsx
<div className="grid grid-cols-12 gap-6">
  <div className="col-span-5">
    <LiveMatchesCard />
  </div>

  <div className="col-span-3">
    <RankingPreviewCard />
  </div>

  <div className="col-span-4">
    <RecentActivityCard />
  </div>
</div>
```

### Abajo

```tsx
<QuickActionsCard />
```

---

## Corrección principal: Hero

Buscar el componente del hero, probablemente:

- `DashboardHeroCard.tsx`
- `AdminDashboardHero.tsx`
- `DashboardHero.tsx`
- o similar.

El hero debe tener esta estructura visual:

```tsx
<section
  className="
    relative min-h-[300px] overflow-hidden rounded-[32px]
    border border-white/10
    bg-[radial-gradient(circle_at_85%_25%,rgba(34,197,94,0.25),transparent_32%),linear-gradient(135deg,#064e3b_0%,#063949_45%,#020617_100%)]
    shadow-2xl
  "
>
  <div className="relative z-10 max-w-2xl px-8 py-10 lg:px-10 lg:py-12">
    {/* badge */}
    {/* title */}
    {/* subtitle */}
    {/* description */}
    {/* stats badges */}
  </div>

  <div className="pointer-events-none absolute right-6 top-0 hidden h-[330px] w-[330px] lg:block">
    <div className="absolute inset-0 rounded-full bg-emerald-400/10 blur-3xl" />

    <Image
      src={mascotImage}
      alt="Mascota Prode Mundial 2026"
      fill
      priority
      className="relative object-contain drop-shadow-2xl"
    />
  </div>
</section>
```

---

## Muy importante sobre la imagen

Las imágenes tienen fondo transparente.

Por eso:

### No hacer

- No usar una imagen tipo póster.
- No meter la imagen dentro de una card.
- No ponerle fondo al wrapper de la imagen.
- No usar `bg-black`, `bg-slate-*`, `rounded-*` o borde alrededor de la imagen.
- No usar una imagen rectangular.
- No aplicar máscara si no hace falta.

### Sí hacer

- Usar la mascota PNG transparente.
- Posicionarla con `absolute`.
- Ubicarla a la derecha.
- Levantarla un poco con `top-0`, `-top-2` o similar.
- Usar `object-contain`.
- Usar `drop-shadow-2xl`.
- Agregar un radial gradient o glow atrás para integrarla.

Ejemplo:

```tsx
<div className="pointer-events-none absolute right-8 -top-2 hidden h-[350px] w-[350px] lg:block">
  <div className="absolute inset-0 rounded-full bg-emerald-400/10 blur-3xl" />
  <Image
    src={mascotImage}
    alt="Mascota Prode Mundial 2026"
    fill
    priority
    className="relative object-contain drop-shadow-2xl"
  />
</div>
```

---

## Texto del hero

Usar este texto:

### Título

```txt
Hola, Admin Root
```

### Subtítulo

```txt
Tenés el torneo bajo control
```

### Descripción

```txt
Gestioná usuarios, partidos, resultados y el avance del Prode en tiempo real.
```

### Badges

```txt
7/72 pronósticos cargados
2 en juego
Actualiza en 22s
```

El subtítulo puede ir en verde claro para parecerse al mockup.

---

## Acciones importantes

La card de acciones importantes debe quedar a la derecha del hero.

Debe tener:

- Título en mayúsculas con tracking: `ACCIONES IMPORTANTES`.
- Descripción corta.
- Lista de acciones tipo mini-card.

Acciones:

- Aprobar usuarios pendientes.
- Cargar resultado de partido.
- Gestionar fixture.
- Ver ranking general.

Cada acción debe tener:

- Ícono circular.
- Título.
- Descripción.
- Flecha a la derecha.
- Hover suave.
- Borde sutil.

No cambiar rutas existentes. Usar links actuales.

---

## Stats

Las estadísticas deben quedar en 4 columnas en desktop.

Cards:

- Pronósticos cargados.
- Participantes activos.
- Usuarios pendientes.
- Partidos en juego.

Cada card debe tener:

- Fondo blanco.
- Borde sutil.
- Sombra suave.
- Rounded grande.
- Ícono circular.
- Número grande.
- Descripción corta.
- Barra solo si aplica.

---

## Sección inferior

Debe tener 3 cards:

- Partidos en juego.
- Ranking rápido.
- Última actividad.

Proporción:

- Partidos en juego más ancho.
- Ranking rápido mediano.
- Última actividad mediano.

Usar esta idea:

```tsx
<div className="grid grid-cols-12 gap-6">
  <div className="col-span-5">
    <LiveMatchesCard />
  </div>

  <div className="col-span-3">
    <RankingPreviewCard />
  </div>

  <div className="col-span-4">
    <RecentActivityCard />
  </div>
</div>
```

---

## Accesos rápidos

Los accesos rápidos deben quedar debajo en una card blanca ancha.

Accesos:

- Fixture.
- Tabla de posiciones.
- Goleadores.
- Simular cruces.

---

## Componentización obligatoria

No dejar todo en `page.tsx`.

Separar, mantener o crear componentes como:

```txt
components/
  DashboardHeroCard.tsx
  DashboardHeroBadges.tsx
  ImportantActionsCard.tsx
  DashboardStatsGrid.tsx
  DashboardStatCard.tsx
  LiveMatchesCard.tsx
  RankingPreviewCard.tsx
  RecentActivityCard.tsx
  QuickActionsCard.tsx
```

Crear helpers/types/constants solo si realmente hace falta:

```txt
helpers/
  dashboard.helpers.ts

types/
  dashboard.types.ts

constants/
  dashboard.constants.ts
```

El `page.tsx` debe quedar como composición clara, no como código sábana.

Ejemplo conceptual:

```tsx
<DashboardHeroCard />
<ImportantActionsCard />
<DashboardStatsGrid />
<LiveMatchesCard />
<RankingPreviewCard />
<RecentActivityCard />
<QuickActionsCard />
```

No crear abstracciones exageradas. Separar solo lo necesario para evitar código sábana y mantener responsabilidades claras.

---

## Responsive

Aunque el foco principal es desktop, no romper mobile.

En pantallas chicas:

- Hero y acciones deben apilarse.
- Cards deben pasar a una columna.
- Evitar overflow horizontal.
- La mascota puede ocultarse o reducirse si molesta.

---

## Resultado esperado

El dashboard debe quedar más parecido al mockup:

- Hero más horizontal.
- Mascota transparente integrada a la derecha.
- Sin imagen cuadrada.
- Sin póster dentro del hero.
- Sin card interna para la mascota.
- Gradient oscuro premium.
- Acciones importantes a la derecha.
- Stats alineadas en 4 columnas.
- Partidos/ranking/actividad en fila inferior.
- Accesos rápidos abajo.
- Código limpio y separado por componentes.

---

## Pruebas mínimas

Verificar:

1. El hero ya no muestra una imagen cuadrada.
2. La mascota aparece integrada al fondo.
3. La imagen transparente no tiene wrapper visible.
4. El dashboard se parece al mockup adjunto.
5. Las cards están alineadas.
6. No se rompieron links ni datos.
7. No hay errores TypeScript.
8. No hay código sábana.
9. No se rompieron auth, permisos ni navegación.

---

## Entrega esperada

Devolveme:

- Qué archivos encontraste relacionados con el dashboard.
- Qué archivos modificaste.
- Qué se cambió en cada archivo.
- Cómo probarlo paso a paso.
- Riesgos o puntos a revisar, si los hay.
