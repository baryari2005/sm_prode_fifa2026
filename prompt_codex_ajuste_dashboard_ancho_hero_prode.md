# Prompt para Codex — Ajuste visual del Dashboard Principal Prode Mundial 2026

Necesito ajustar el dashboard principal del Prode Mundial 2026 para que se parezca mucho más al mockup de referencia adjunto.

El diseño actual quedó bien encaminado, pero todavía tiene diferencias importantes:

1. El contenido general está demasiado angosto y centrado.
2. El dashboard no está usando el ancho disponible de la página.
3. El hero sigue mostrando la mascota dentro de un bloque/rectángulo visual.
4. El hero debería tener un fondo más parecido a cancha/estadio con degradado.
5. Las cards se ven más chicas porque el wrapper general está limitando demasiado el ancho.

---

## Importante

- No cambiar lógica de negocio.
- No cambiar endpoints.
- No tocar auth, permisos ni middleware.
- No cambiar datos ni contratos de API.
- No hacer refactors grandes innecesarios.
- No hacer código sábana.
- Mantener componentes chicos y separados por responsabilidad.
- Reutilizar componentes, hooks, helpers, services, types y constantes existentes.
- Usar Next.js, TypeScript, TailwindCSS, shadcn/ui y lucide-react.
- Las imágenes de las mascotas ya tienen fondo transparente.
- No usar la imagen tipo póster/cuadrada dentro del hero.
- Usar el mockup adjunto como referencia visual principal.

---

## Objetivo

Quiero que el dashboard quede más parecido al boceto/mockup:

- El dashboard debe usar casi todo el ancho útil entre sidebar y borde derecho.
- El contenido no debe quedar comprimido en una columna central.
- Primera fila: hero grande a la izquierda y acciones importantes a la derecha.
- Hero ancho, horizontal, premium, con fondo tipo cancha/estadio.
- Mascota transparente integrada a la derecha, sin ningún recuadro visible.
- Stats alineadas en 4 columnas.
- Abajo: partidos en juego, ranking rápido y última actividad.
- Accesos rápidos al final.
- Código limpio y componentizado.

---

## 1) Corregir ancho general del dashboard

Buscar el wrapper principal del dashboard.

Actualmente parece que hay una clase que limita demasiado el ancho, probablemente algo como:

- `max-w-5xl`
- `max-w-6xl`
- `max-w-[1000px]`
- `max-w-[1120px]`
- `container`
- `mx-auto` con un ancho muy chico

Necesito que el dashboard use mucho más ancho disponible, como el mockup.

Usar algo parecido a:

```tsx
<main className="w-full px-6 py-6">
  <div className="mx-auto w-full max-w-[1500px] space-y-6">
    ...
  </div>
</main>
```

O directamente, si el layout ya tiene padding:

```tsx
<div className="w-full max-w-none space-y-6 px-6 py-6">
  ...
</div>
```

El objetivo es que el dashboard ocupe casi todo el ancho útil entre sidebar y borde derecho.

No quiero que quede centrado en una columna angosta.

---

## 2) Primera fila: hero + acciones importantes

La primera fila debe ocupar todo el ancho disponible.

Usar una grid tipo:

```tsx
<div className="grid w-full grid-cols-12 gap-6">
  <div className="col-span-8">
    <DashboardHeroCard />
  </div>

  <div className="col-span-4">
    <ImportantActionsCard />
  </div>
</div>
```

Si se necesita más parecido al mockup, usar:

```tsx
<div className="grid w-full grid-cols-[minmax(0,2.1fr)_minmax(360px,0.9fr)] gap-6">
  <DashboardHeroCard />
  <ImportantActionsCard />
</div>
```

El hero debe quedar ancho, horizontal y protagonista.

---

## 3) Hero con fondo tipo cancha / estadio degradado

El hero actual se ve demasiado plano. Quiero que tenga más profundidad, parecido al mockup.

Usar un fondo con gradientes combinados:

```tsx
className="
  relative min-h-[300px] overflow-hidden rounded-[32px]
  border border-white/10
  bg-[radial-gradient(circle_at_78%_35%,rgba(34,197,94,0.28),transparent_30%),radial-gradient(circle_at_35%_0%,rgba(16,185,129,0.18),transparent_35%),linear-gradient(135deg,#064e3b_0%,#053545_45%,#020617_100%)]
  shadow-2xl
"
```

Agregar además efectos sutiles de cancha/luces con divs absolutos:

```tsx
<div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.06)_45%,transparent_60%)] opacity-50" />
<div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-emerald-950/60 to-transparent" />
<div className="absolute right-20 top-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
```

La idea es que parezca un fondo de estadio/cancha, no una card plana.

---

## 4) Mascota transparente sin recuadro

Las imágenes de la mascota ya tienen fondo transparente.

Por lo tanto:

### No hacer

- No meter la mascota dentro de una card.
- No ponerle fondo al contenedor.
- No usar rectángulo detrás.
- No usar borde.
- No usar etiqueta “mascota oficial”.
- No poner `bg-slate-*`, `bg-black`, `rounded-*` ni sombra de card en el wrapper.
- No mostrar una imagen tipo póster.

### Sí hacer

- Usar la mascota PNG transparente.
- Posicionarla con `absolute`.
- Ponerla a la derecha del hero.
- Hacerla grande.
- Levantarla un poco.
- Usar `object-contain`.
- Usar `drop-shadow-2xl`.
- Agregar un glow suave detrás para integrarla.

Ejemplo:

```tsx
<div className="pointer-events-none absolute right-8 -top-4 hidden h-[360px] w-[360px] lg:block">
  <div className="absolute inset-8 rounded-full bg-emerald-300/10 blur-3xl" />

  <Image
    src={mascotImage}
    alt="Mascota Prode Mundial 2026"
    fill
    priority
    className="relative object-contain drop-shadow-2xl"
  />
</div>
```

Si tapa mucho texto, reservar espacio en el texto:

```tsx
<div className="relative z-10 max-w-[620px] px-8 py-10 lg:px-10 lg:py-12">
  ...
</div>
```

La mascota debe verse integrada al hero, como parte del diseño.

---

## 5) Sacar cualquier bloque interno alrededor de la mascota

En el hero actual parece haber un bloque visual detrás de la mascota.

Eliminar cualquier wrapper de imagen con clases como:

- `bg-*`
- `rounded-*`
- `border`
- `shadow`
- `p-*`
- `card`
- `overflow-hidden` aplicado solo al contenedor de imagen
- título interno como “Mascota oficial”

La imagen debe quedar directamente sobre el gradient del hero.

---

## 6) Stats más anchas por usar mejor el layout

Las cards de stats están bien, pero al estar el wrapper general angosto quedan chicas.

Una vez corregido el ancho del dashboard, usar:

```tsx
<div className="grid w-full grid-cols-4 gap-6">
  ...
</div>
```

No limitar esta sección con `max-w-*` chico.

---

## 7) Sección inferior

Debe ocupar todo el ancho disponible, como en el mockup.

Usar:

```tsx
<div className="grid w-full grid-cols-12 gap-6">
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

No envolver esta sección en un contenedor angosto.

---

## 8) Accesos rápidos

Los accesos rápidos deben quedar debajo en una card blanca ancha.

Accesos:

- Fixture
- Tabla de posiciones
- Goleadores
- Simular cruces

No deben quedar cortados ni pegados al borde inferior.

---

## 9) Revisar el `page.tsx` o layout

Revisar especialmente si en el dashboard hay algo como:

```tsx
<div className="mx-auto max-w-5xl">
```

O:

```tsx
<main className="container">
```

O:

```tsx
<section className="max-w-6xl">
```

Eso está haciendo que todo quede chico.

Cambiarlo por un contenedor más amplio:

```tsx
<div className="mx-auto w-full max-w-[1500px] space-y-6">
```

O:

```tsx
<div className="w-full max-w-none space-y-6">
```

según cómo esté armado el layout general.

---

## 10) Componentización obligatoria

No dejar todo en `page.tsx`.

Mantener o crear componentes chicos como:

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

Ejemplo de composición esperada:

```tsx
<DashboardHeroCard />
<ImportantActionsCard />
<DashboardStatsGrid />
<LiveMatchesCard />
<RankingPreviewCard />
<RecentActivityCard />
<QuickActionsCard />
```

---

## Resultado esperado

Quiero que quede más parecido al mockup:

- El dashboard usa casi todo el ancho disponible.
- El contenido no queda comprimido en una columna central.
- El hero queda ancho y horizontal.
- El hero tiene fondo tipo cancha/estadio con gradientes.
- La mascota transparente aparece integrada, sin ningún recuadro.
- No se ve imagen tipo póster.
- Acciones importantes queda a la derecha del hero.
- Stats quedan en 4 columnas anchas.
- Partidos/ranking/actividad quedan alineados abajo.
- Accesos rápidos quedan abajo en una card ancha.
- El código sigue componentizado y sin código sábana.

---

## Validación visual

Comparar contra el mockup:

- Si se ve mucho espacio vacío a la derecha, el wrapper sigue mal.
- Si la mascota aparece dentro de un rectángulo, el hero sigue mal.
- Si el hero no ocupa más o menos 2/3 de la primera fila, la grid sigue mal.
- Si las cards se ven muy chicas, revisar `max-w-*` del contenedor padre.
- Si la imagen parece póster, no está usando correctamente el PNG transparente.

---

## Pruebas mínimas

Verificar:

1. El dashboard usa más ancho de pantalla.
2. El hero no queda comprimido.
3. La mascota no tiene recuadro, fondo ni card interna.
4. La mascota transparente está integrada al hero.
5. El fondo del hero tiene profundidad tipo cancha/estadio.
6. Las cards de estadísticas quedan en 4 columnas.
7. Partidos, ranking y actividad quedan alineados abajo.
8. Los accesos rápidos quedan visibles y bien ubicados.
9. No se rompieron links ni datos.
10. No se tocaron endpoints, auth, permisos ni lógica de negocio.
11. No hay errores TypeScript.
12. No hay código sábana.
