"use client";

import Link from "next/link";
import {
  Clock3,
  Filter,
  Info,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import { BrandPageShell } from "@/components/brand/BrandPageShell";
import { HeroVisualImage } from "@/components/brand/HeroVisualImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { brandImages } from "@/config/brand-images";
import {
  DASHBOARD_PANEL,
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";

const filtrosDeGrupo = [
  { value: "grupo-a", label: "Grupo A", total: 2 },
  { value: "grupo-b", label: "Grupo B", total: 2 },
  { value: "grupo-c", label: "Grupo C", total: 2 },
  { value: "grupo-d", label: "Grupo D", total: 2 },
] as const;

const partidosPorGrupo = [
  {
    value: "grupo-a",
    label: "Grupo A",
    descripcion:
      "Carga rapida de la fecha con una vista compacta para completar tus marcadores en pocos pasos.",
    partidos: [
      {
        hora: "13 Jun - 16:00",
        estadio: "Ciudad de Mexico",
        local: "Mexico",
        visitante: "Suiza",
        localActual: "2",
        visitanteActual: "1",
        estado: "Cierra en 01:24:18",
        tono: "warning",
      },
      {
        hora: "13 Jun - 21:00",
        estadio: "Monterrey",
        local: "Argentina",
        visitante: "Corea del Sur",
        localActual: "3",
        visitanteActual: "0",
        estado: "Abierto para guardar",
        tono: "success",
      },
    ],
  },
  {
    value: "grupo-b",
    label: "Grupo B",
    descripcion:
      "Ideal para revisar una zona puntual y ver rapido si hay partidos bloqueados o todavia abiertos.",
    partidos: [
      {
        hora: "14 Jun - 14:00",
        estadio: "Dallas",
        local: "Estados Unidos",
        visitante: "Croacia",
        localActual: "1",
        visitanteActual: "1",
        estado: "En juego",
        tono: "live",
      },
      {
        hora: "14 Jun - 19:00",
        estadio: "Houston",
        local: "Uruguay",
        visitante: "Ghana",
        localActual: "",
        visitanteActual: "",
        estado: "Pendiente de carga",
        tono: "neutral",
      },
    ],
  },
  {
    value: "grupo-c",
    label: "Grupo C",
    descripcion:
      "Pensado para mostrar tambien mensajes de revision, cambios pendientes y notas rapidas por partido.",
    partidos: [
      {
        hora: "15 Jun - 17:00",
        estadio: "Toronto",
        local: "Canada",
        visitante: "Japon",
        localActual: "0",
        visitanteActual: "1",
        estado: "2 cambios sin guardar",
        tono: "warning",
      },
      {
        hora: "15 Jun - 22:00",
        estadio: "Vancouver",
        local: "Brasil",
        visitante: "Marruecos",
        localActual: "2",
        visitanteActual: "2",
        estado: "Abierto para editar",
        tono: "success",
      },
    ],
  },
  {
    value: "grupo-d",
    label: "Grupo D",
    descripcion:
      "Otro ejemplo de fecha completa, con el mismo lenguaje del dashboard y foco en velocidad de carga.",
    partidos: [
      {
        hora: "16 Jun - 15:00",
        estadio: "Los Angeles",
        local: "Francia",
        visitante: "Serbia",
        localActual: "1",
        visitanteActual: "0",
        estado: "Abierto para guardar",
        tono: "success",
      },
      {
        hora: "16 Jun - 20:00",
        estadio: "Seattle",
        local: "Colombia",
        visitante: "Australia",
        localActual: "",
        visitanteActual: "",
        estado: "Esperando pronostico",
        tono: "neutral",
      },
    ],
  },
] as const;

const notasRapidas = [
  "Auto guardado sugerido cuando falten menos de 5 minutos para el cierre.",
  "Resumen lateral con partidos abiertos, cambios pendientes y progreso de la fecha.",
  "Cards compactas por grupo para evitar una lista larga de encuentros.",
];

export function BrandPronosticosFaseGruposMock() {
  return (
    <BrandPageShell
      backgroundVariant="dashboard"
      contentClassName="space-y-8 pb-16"
    >
      <section className="rounded-[32px] border border-[#5993B6]/16 bg-white/75 px-5 py-4 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5993B6]">
              Mock visual temporal
            </p>
            <p className="mt-1 text-sm text-[#1E2C46]/72">
              Preview aislada para validar la futura experiencia de mis pronosticos.
            </p>
          </div>

          <Link
            href="/brand-preview"
            className="text-sm font-semibold text-[#1E2C46] transition hover:text-[#5993B6]"
          >
            Volver a previews
          </Link>
          <Link
            href="/brand-preview/pronosticos/fase-grupos-compacto"
            className="text-sm font-semibold text-[#1E2C46] transition hover:text-[#5993B6]"
          >
            Ver variante compacta
          </Link>
        </div>
      </section>

      <section className={`${DASHBOARD_PANEL} rounded-[32px] p-3 md:p-4`}>
        <div className={DASHBOARD_TOP_LINE}>
          <div className={DASHBOARD_TOP_LINE_INNER} />
          <div className={DASHBOARD_TOP_LINE_SWEEP} />
          <div className={DASHBOARD_TOP_LINE_GLOW} />
          <div className={DASHBOARD_TOP_LINE_HAIR} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_15%_15%,rgba(250,180,56,0.18),transparent_18%)] opacity-85" />

        <div className="grid w-full min-w-0 gap-4 2xl:grid-cols-[minmax(0,2.05fr)_minmax(300px,0.95fr)] 2xl:items-stretch">
          <section className="relative h-full w-full min-w-0 overflow-hidden rounded-[30px] border border-white/10 bg-[#1E2C46] px-4 py-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)] md:px-6 md:py-6 xl:h-[364px] xl:px-7 xl:py-6 2xl:h-[420px] 2xl:px-8 2xl:py-7">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,44,70,0.94)_0%,rgba(30,44,70,0.9)_36%,rgba(37,53,80,0.62)_62%,rgba(30,44,70,0.76)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(89,147,182,0.22),transparent_30%),radial-gradient(circle_at_34%_0%,rgba(246,180,56,0.14),transparent_35%),linear-gradient(135deg,rgba(30,44,70,0.24)_0%,rgba(37,53,80,0.14)_46%,rgba(30,44,70,0.24)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.06)_48%,transparent_62%)] opacity-45" />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#061B33]/75 via-[#061B33]/24 to-transparent" />
              <div className="absolute right-10 top-8 h-56 w-56 rounded-full bg-sky-300/18 blur-3xl" />
              <div className="absolute -left-8 bottom-5 h-28 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
            </div>

            <div className="relative z-10 flex h-full max-w-[62%] min-w-0 flex-col">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3] backdrop-blur-md">
                Mis pronosticos
              </div>

              <div className="mt-6 space-y-2.5 xl:mt-8">
                <h1 className="text-[2.1rem] font-bold leading-[0.98] tracking-[-0.065em] md:text-[2.35rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
                  Carga rapida de <span className="text-[#5993B6]">fase de grupos</span>
                </h1>

                <p className="font-brand max-w-[560px] text-[1.9rem] font-semibold leading-[0.96] tracking-[0.04em] text-white md:text-[2rem] xl:text-[2.25rem] 2xl:text-[2.55rem]">
                  Pronostica por zona, fecha y cierre
                </p>

                <p className="max-w-[560px] pt-2 text-[0.95rem] leading-5 text-white/78 xl:text-[1rem]">
                  Un mock para llevar la pantalla de pronosticos rapidos a un
                  lenguaje visual de dashboard, con foco en velocidad, estados y
                  cambios pendientes antes de guardar.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 xl:pt-6 2xl:pt-8">
                <Button
                  variant="outline"
                  className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Ver ranking
                </Button>
                <Button
                  variant="outline"
                  className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                >
                  <Clock3 className="mr-2 h-4 w-4" />
                  Actualiza en 28s
                </Button>
                <Button className="rounded-2xl bg-[#FAB438] font-semibold text-[#1E2C46] hover:bg-[#F7C45A]">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Guardar todos
                </Button>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-[-14px] right-[8px] z-20 hidden h-[370px] w-[360px] xl:block 2xl:bottom-[-18px] 2xl:right-[12px] 2xl:h-[430px] 2xl:w-[420px]">
              <div className="absolute inset-3 rounded-full bg-[#5993B6]/18 blur-[110px]" />
              <div className="absolute inset-x-[-8%] top-[12%] h-[74%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(174,235,255,0.18)_0%,rgba(89,147,182,0.12)_34%,rgba(30,44,70,0.02)_72%,transparent_100%)] blur-[18px]" />
              <HeroVisualImage
                src={brandImages.mascots.condor}
                alt="Hero visual de pronosticos"
                sizes="(min-width: 1536px) 420px, 360px"
                priority
                baseClassName="object-contain object-[center_bottom] opacity-[0.88] brightness-110 drop-shadow-[0_30px_68px_rgba(0,0,0,0.32)] [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)]"
              />
            </div>
          </section>

          <aside className={DASHBOARD_PANEL}>
            <div className={DASHBOARD_TOP_LINE}>
              <div className={DASHBOARD_TOP_LINE_INNER} />
              <div className={DASHBOARD_TOP_LINE_SWEEP} />
              <div className={DASHBOARD_TOP_LINE_GLOW} />
              <div className={DASHBOARD_TOP_LINE_HAIR} />
            </div>

            <div className="mb-3">
              <p className="mt-4 flex justify-center text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                Resumen lateral
              </p>
              <p className="mt-1.5 flex items-start justify-center gap-2 text-center text-sm font-semibold leading-5 text-white/68">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="max-w-[260px]">
                  Estado rapido de tus cargas, progreso de la fecha y partidos con cierre cercano.
                </span>
              </p>
            </div>

            <div className="space-y-2.5">
              <MockSummaryMetric
                icon={<Target className="h-4.5 w-4.5" />}
                tone="sky"
                title="Pronosticos cargados"
                detail="6 de 8 partidos completos"
                value="75%"
              />
              <MockSummaryMetric
                icon={<Zap className="h-4.5 w-4.5" />}
                tone="gold"
                title="Cambios pendientes"
                detail="2 partidos aun sin guardar"
                value="2"
              />
              <MockSummaryMetric
                icon={<ShieldCheck className="h-4.5 w-4.5" />}
                tone="emerald"
                title="Estado general"
                detail="Todo listo para enviar"
                value="OK"
              />
            </div>
          </aside>
        </div>
      </section>

      <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
        <div className={DASHBOARD_TOP_LINE}>
          <div className={DASHBOARD_TOP_LINE_INNER} />
          <div className={DASHBOARD_TOP_LINE_SWEEP} />
          <div className={DASHBOARD_TOP_LINE_GLOW} />
          <div className={DASHBOARD_TOP_LINE_HAIR} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_14%_18%,rgba(250,180,56,0.14),transparent_20%)] opacity-90" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                Fase de grupos
              </p>
              <h2 className="font-brand mt-2 text-[2rem] leading-[0.92] tracking-[0.04em] text-white">
                Carga masiva de marcadores
              </h2>
              <p className="mt-2 max-w-[760px] text-sm leading-6 text-white/72">
                Busca un partido puntual o recorre cada grupo para cargar rapido
                tus resultados antes del cierre.
              </p>
            </div>

            <div className="flex flex-col gap-3 xl:min-w-[360px] xl:items-end">
              <div className="flex w-full flex-col gap-3 sm:flex-row xl:justify-end">
                <div className="relative min-w-[220px] flex-1 xl:max-w-[280px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AEEBFF]" />
                  <Input
                    placeholder="Buscar por partido o rival"
                    className="h-11 rounded-2xl border-white/10 bg-white/8 pl-10 text-white placeholder:text-white/38"
                  />
                </div>

                <Button
                  variant="outline"
                  className="rounded-2xl border-white/12 bg-white/8 text-white hover:bg-white/12"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
              </div>

              <div className="flex items-center justify-end gap-3 text-sm font-semibold text-white/72">
                <span>Solo abiertos</span>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <Tabs defaultValue={filtrosDeGrupo[0].value} className="space-y-5">
            <div className="overflow-x-auto pb-1">
              <TabsList className="min-w-max justify-start">
                {filtrosDeGrupo.map((grupo) => (
                  <TabsTrigger
                    key={grupo.value}
                    value={grupo.value}
                    className="min-w-[140px]"
                  >
                    {grupo.label} ({grupo.total})
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {partidosPorGrupo.map((grupo) => (
              <TabsContent key={grupo.value} value={grupo.value} className="mt-0">
                <div className="space-y-4">
                  <section className={`${DASHBOARD_PANEL} rounded-[28px] p-4`}>
                    <div className={DASHBOARD_TOP_LINE}>
                      <div className={DASHBOARD_TOP_LINE_INNER} />
                      <div className={DASHBOARD_TOP_LINE_SWEEP} />
                      <div className={DASHBOARD_TOP_LINE_GLOW} />
                      <div className={DASHBOARD_TOP_LINE_HAIR} />
                    </div>
                    <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sky-400/14 blur-3xl" />

                    <div className="relative flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                          {grupo.label}
                        </p>
                        <h3 className="font-brand mt-2 text-[1.85rem] leading-[0.94] tracking-[0.04em] text-white">
                          Partidos de la fecha
                        </h3>
                        <p className="mt-2 max-w-[820px] text-sm leading-6 text-white/72">
                          {grupo.descripcion}
                        </p>
                      </div>

                      <Badge className="w-fit rounded-full border-white/10 bg-white/10 text-[#AEEBFF] hover:bg-white/10">
                        2 partidos visibles
                      </Badge>
                    </div>
                  </section>

                  <div className="grid gap-4 xl:grid-cols-2">
                    {grupo.partidos.map((partido) => (
                      <article
                        key={`${grupo.value}-${partido.local}-${partido.visitante}`}
                        className={`${DASHBOARD_PANEL} rounded-[28px] p-4`}
                      >
                        <div className={DASHBOARD_TOP_LINE}>
                          <div className={DASHBOARD_TOP_LINE_INNER} />
                          <div className={DASHBOARD_TOP_LINE_SWEEP} />
                          <div className={DASHBOARD_TOP_LINE_GLOW} />
                          <div className={DASHBOARD_TOP_LINE_HAIR} />
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                                {partido.hora}
                              </p>
                              <p className="mt-1 text-sm font-semibold text-white/66">
                                {partido.estadio}
                              </p>
                            </div>
                            <EstadoBadge tono={partido.tono} texto={partido.estado} />
                          </div>

                          <div className={`${DASHBOARD_SUBCARD} rounded-[24px] p-4`}>
                            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_148px_minmax(0,1fr)] md:items-center">
                              <div className="min-w-0">
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/46">
                                  Local
                                </p>
                                <p className="mt-2 text-xl font-black text-white">
                                  {partido.local}
                                </p>
                              </div>

                              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                                <Input
                                  defaultValue={partido.localActual}
                                  className="h-14 rounded-2xl border-white/10 bg-white/10 text-center text-xl font-black text-white placeholder:text-white/28"
                                />
                                <span className="font-brand text-[1.8rem] leading-none text-white/68">
                                  -
                                </span>
                                <Input
                                  defaultValue={partido.visitanteActual}
                                  className="h-14 rounded-2xl border-white/10 bg-white/10 text-center text-xl font-black text-white placeholder:text-white/28"
                                />
                              </div>

                              <div className="min-w-0 text-right">
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/46">
                                  Visitante
                                </p>
                                <p className="mt-2 text-xl font-black text-white">
                                  {partido.visitante}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
                            <Textarea
                              defaultValue="Nota opcional: revisar este cruce antes del cierre final."
                              className="min-h-[98px] rounded-[22px] border-white/10 bg-white/8 text-white placeholder:text-white/34"
                            />

                            <div className="grid gap-3">
                              <div className={`${DASHBOARD_SUBCARD} rounded-[22px] p-4`}>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                                  Confianza
                                </p>
                                <p className="mt-2 text-sm font-semibold text-white/72">
                                  Partido clave de la fecha
                                </p>
                              </div>

                              <div className={`${DASHBOARD_SUBCARD} rounded-[22px] p-4`}>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                                  Recordatorio
                                </p>
                                <p className="mt-2 text-sm font-semibold text-white/72">
                                  El backend sigue validando cierre real.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <Button className="rounded-2xl bg-[#5993B6] text-white hover:bg-[#4B84A6]">
                              Guardar partido
                            </Button>
                            <Button
                              variant="outline"
                              className="rounded-2xl border-white/12 bg-white/8 text-white hover:bg-white/12"
                            >
                              Duplicar resultado
                            </Button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_18%_18%,rgba(250,180,56,0.12),transparent_22%)] opacity-90" />

          <div className="relative z-10 space-y-4">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
              Acciones rapidas
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              <QuickActionCard
                title="Copiar fecha completa"
                detail="Replica un patron base y ajusta solo cambios puntuales."
                icon={<Sparkles className="h-4.5 w-4.5" />}
              />
              <QuickActionCard
                title="Limpiar cambios"
                detail="Vuelve al ultimo guardado si la carga se desordeno."
                icon={<Zap className="h-4.5 w-4.5" />}
              />
              <QuickActionCard
                title="Ver cierres"
                detail="Prioriza partidos que estan cerca de bloquearse."
                icon={<Clock3 className="h-4.5 w-4.5" />}
              />
            </div>
          </div>
        </section>

        <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_18%_18%,rgba(250,180,56,0.12),transparent_22%)] opacity-90" />

          <div className="relative z-10 space-y-4">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
              Ideas del mock
            </p>
            <div className="space-y-3">
              {notasRapidas.map((idea) => (
                <div key={idea} className={`${DASHBOARD_SUBCARD} rounded-2xl p-4`}>
                  <p className="text-sm leading-6 text-white/76">{idea}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </BrandPageShell>
  );
}

function MockSummaryMetric({
  icon,
  tone,
  title,
  detail,
  value,
}: {
  icon: React.ReactNode;
  tone: "sky" | "gold" | "emerald";
  title: string;
  detail: string;
  value: string;
}) {
  const toneClassName =
    tone === "gold"
      ? "bg-[#FAB438]/14 text-[#FFE4A3]"
      : tone === "emerald"
        ? "bg-emerald-400/14 text-emerald-200"
        : "bg-[#5993B6]/18 text-[#AEEBFF]";

  return (
    <div
      className={`flex w-full min-w-0 items-center gap-3 rounded-[22px] px-3 py-3 xl:px-3.5 ${DASHBOARD_SUBCARD}`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${toneClassName}`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-[13px] font-black leading-4 text-white">
          {title}
        </span>
        <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-white/64">
          {detail}
        </span>
      </span>
      <span className="font-brand text-[1.7rem] leading-none tracking-[0.03em] text-white">
        {value}
      </span>
    </div>
  );
}

function EstadoBadge({
  texto,
  tono,
}: {
  texto: string;
  tono: "warning" | "success" | "live" | "neutral";
}) {
  const className =
    tono === "warning"
      ? "border-[#FAB438]/22 bg-[#FAB438]/14 text-[#FFE4A3]"
      : tono === "success"
        ? "border-emerald-400/18 bg-emerald-400/14 text-emerald-200"
        : tono === "live"
          ? "border-rose-300/18 bg-rose-300/14 text-rose-100"
          : "border-white/10 bg-white/10 text-white/76";

  return (
    <Badge className={`rounded-full ${className} hover:${className}`}>
      {texto}
    </Badge>
  );
}

function QuickActionCard({
  title,
  detail,
  icon,
}: {
  title: string;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <article className={`${DASHBOARD_SUBCARD} rounded-[24px] p-4`}>
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#5993B6]/18 text-[#AEEBFF]">
          {icon}
        </span>
        <div>
          <p className="text-base font-black text-white">{title}</p>
          <p className="mt-2 text-sm leading-6 text-white/68">{detail}</p>
        </div>
      </div>
    </article>
  );
}
