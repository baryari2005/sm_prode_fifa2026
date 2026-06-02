"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Flag,
  Search,
  ShieldCheck,
  Trophy,
  Zap,
} from "lucide-react";

import { HeroVisualImage } from "@/components/brand/HeroVisualImage";
import { BrandPageShell } from "@/components/brand/BrandPageShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const grupos = ["Grupo A", "Grupo B", "Grupo C", "Grupo D"] as const;
type GrupoKey = (typeof grupos)[number];
type GrupoRow = readonly [
  string,
  string,
  string,
  number,
  number,
  number,
  number,
  number,
  number,
  string,
  number,
];

const tablaPorGrupo: Record<GrupoKey, readonly GrupoRow[]> = {
  "Grupo A": [
    ["1", "Argentina", "ARG", 3, 2, 1, 0, 6, 2, "+4", 7],
    ["2", "Senegal", "SEN", 3, 2, 0, 1, 5, 4, "+1", 6],
    ["3", "Paises Bajos", "NED", 3, 1, 1, 1, 4, 4, "0", 4],
    ["4", "Canada", "CAN", 3, 0, 0, 3, 2, 7, "-5", 0],
  ],
  "Grupo B": [
    ["1", "Brasil", "BRA", 3, 2, 1, 0, 7, 3, "+4", 7],
    ["2", "Suiza", "SUI", 3, 1, 2, 0, 4, 2, "+2", 5],
    ["3", "Serbia", "SRB", 3, 1, 0, 2, 3, 5, "-2", 3],
    ["4", "Camerun", "CMR", 3, 0, 1, 2, 2, 6, "-4", 1],
  ],
  "Grupo C": [
    ["1", "Mexico", "MEX", 3, 2, 0, 1, 5, 2, "+3", 6],
    ["2", "Polonia", "POL", 3, 1, 2, 0, 3, 2, "+1", 5],
    ["3", "Japon", "JPN", 3, 1, 1, 1, 4, 4, "0", 4],
    ["4", "Marruecos", "MAR", 3, 0, 1, 2, 1, 5, "-4", 1],
  ],
  "Grupo D": [
    ["1", "Francia", "FRA", 3, 3, 0, 0, 8, 1, "+7", 9],
    ["2", "Dinamarca", "DEN", 3, 1, 1, 1, 4, 4, "0", 4],
    ["3", "Australia", "AUS", 3, 1, 0, 2, 3, 5, "-2", 3],
    ["4", "Tunez", "TUN", 3, 0, 1, 2, 1, 6, "-5", 1],
  ],
} as const;

const metricas = [
  {
    icon: Trophy,
    title: "Grupos cargados",
    detail: "Vista completa de la fase",
    value: "12",
    accent: "text-[#AEEBFF]",
    ring: "bg-[#AEEBFF]/12",
  },
  {
    icon: Flag,
    title: "Selecciones activas",
    detail: "Pais + puntos + diferencia",
    value: "48",
    accent: "text-[#FFE4A3]",
    ring: "bg-[#FAB438]/12",
  },
  {
    icon: ShieldCheck,
    title: "Clasificables",
    detail: "Top 2 por grupo visibles",
    value: "2",
    accent: "text-[#84F0C8]",
    ring: "bg-emerald-400/12",
  },
];

export function BrandTablaPosicionesMock() {
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
              Preview aislada para validar la pantalla de tabla de posiciones.
            </p>
          </div>

          <Link
            href="/brand-preview"
            className="text-sm font-semibold text-[#1E2C46] transition hover:text-[#5993B6]"
          >
            Volver al indice
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

        <div className="grid gap-4 2xl:grid-cols-[minmax(0,2.05fr)_minmax(300px,0.95fr)] 2xl:items-stretch">
          <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#1E2C46] px-4 py-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)] md:px-6 md:py-6 xl:px-7 xl:py-6 2xl:h-[420px] 2xl:px-8 2xl:py-7">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,44,70,0.94)_0%,rgba(30,44,70,0.9)_36%,rgba(37,53,80,0.62)_62%,rgba(30,44,70,0.76)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(89,147,182,0.22),transparent_30%),radial-gradient(circle_at_34%_0%,rgba(246,180,56,0.14),transparent_35%),linear-gradient(135deg,rgba(30,44,70,0.24)_0%,rgba(37,53,80,0.14)_46%,rgba(30,44,70,0.24)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.06)_48%,transparent_62%)] opacity-45" />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#061B33]/75 via-[#061B33]/24 to-transparent" />
            </div>

            <div className="relative z-10 flex h-full max-w-[62%] flex-col">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3] backdrop-blur-md">
                <Trophy className="h-3.5 w-3.5" />
                Tabla de posiciones
              </div>

              <div className="mt-7 space-y-4">
                <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-white md:text-6xl">
                  Asi se ordena
                  <span className="text-[#5993B6]"> cada grupo</span>
                </h1>
                <p className="brand-heading max-w-[680px] text-[2.25rem] uppercase tracking-[0.02em] text-white md:text-[3.2rem] md:leading-[0.9]">
                  puntos, diferencia y clasificación
                </p>
                <p className="max-w-[640px] text-base leading-relaxed text-white/82 md:text-[1.02rem]">
                  Visualiza rapidamente quienes lideran cada zona, revisá goles,
                  diferencia y puntos acumulados sin perder el lenguaje del dashboard.
                </p>
              </div>

              <div className="mt-auto flex flex-wrap gap-3 pt-6 xl:pt-8 2xl:pt-10">
                <Button className="h-12 rounded-full bg-white/[0.08] px-5 text-sm font-semibold text-white shadow-none backdrop-blur hover:bg-white/[0.14]">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al dashboard
                </Button>
                <Button className="h-12 rounded-full bg-white/[0.08] px-5 text-sm font-semibold text-white shadow-none backdrop-blur hover:bg-white/[0.14]">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Ver resumen general
                </Button>
                <Button className="h-12 rounded-full bg-[#FAB438] px-5 text-sm font-semibold text-[#1E2C46] shadow-[0_16px_36px_rgba(250,180,56,0.28)] hover:bg-[#ffd06e]">
                  <Zap className="mr-2 h-4 w-4" />
                  Simular cierre
                </Button>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-[-12px] right-[4px] z-20 hidden h-[402px] w-[340px] xl:block 2xl:bottom-[-18px] 2xl:right-[8px] 2xl:h-[470px] 2xl:w-[390px]">
              <div className="absolute inset-3 rounded-full bg-[#5993B6]/18 blur-[110px]" />
              <div className="absolute inset-x-[-8%] top-[12%] h-[74%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(174,235,255,0.18)_0%,rgba(89,147,182,0.12)_34%,rgba(30,44,70,0.02)_72%,transparent_100%)] blur-[18px]" />
              <HeroVisualImage
                src={brandImages.mascots.selecciones}
                alt="Hero visual de tabla de posiciones"
                sizes="(min-width: 1536px) 390px, 340px"
                priority
                baseClassName="object-contain object-[center_bottom] opacity-[0.88] brightness-110 drop-shadow-[0_30px_68px_rgba(0,0,0,0.32)] [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)]"
              />
            </div>
          </section>

          <aside className={`${DASHBOARD_PANEL} rounded-[30px] p-5 md:p-6`}>
            <div className={DASHBOARD_TOP_LINE}>
              <div className={DASHBOARD_TOP_LINE_INNER} />
              <div className={DASHBOARD_TOP_LINE_SWEEP} />
              <div className={DASHBOARD_TOP_LINE_GLOW} />
              <div className={DASHBOARD_TOP_LINE_HAIR} />
            </div>
            <div className="space-y-6">
              <div className="space-y-2 text-center text-white">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                  Vista rápida
                </p>
                <p className="mx-auto max-w-[22rem] text-[0.95rem] leading-relaxed text-white/76">
                  Estado general de los grupos y lectura rapida del corte de clasificación.
                </p>
              </div>

              <div className="space-y-4">
                {metricas.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className={`${DASHBOARD_SUBCARD} flex items-center justify-between gap-4 rounded-[24px] px-5 py-4 text-white`}
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${item.ring}`}>
                          <Icon className={`h-5 w-5 ${item.accent}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[1.03rem] font-bold text-white">
                            {item.title}
                          </p>
                          <p className="text-sm text-white/68">{item.detail}</p>
                        </div>
                      </div>
                      <div className="brand-heading shrink-0 text-[2.1rem] text-white">
                        {item.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className={`${DASHBOARD_PANEL} rounded-[32px] p-5 md:p-6`}>
        <div className={DASHBOARD_TOP_LINE}>
          <div className={DASHBOARD_TOP_LINE_INNER} />
          <div className={DASHBOARD_TOP_LINE_SWEEP} />
          <div className={DASHBOARD_TOP_LINE_GLOW} />
          <div className={DASHBOARD_TOP_LINE_HAIR} />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-2 text-white">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                Tabla por grupo
              </p>
              <h2 className="brand-heading text-[2.65rem] uppercase text-white md:text-[3.25rem]">
                Explorador de posiciones
              </h2>
              <p className="max-w-[760px] text-base leading-relaxed text-white/76">
                Busca una seleccion puntual o recorre cada grupo para ver puntos,
                diferencia, goles y el corte de clasificación.
              </p>
            </div>

            <div className="relative w-full xl:max-w-[320px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AEEBFF]/70" />
              <Input
                placeholder="Buscar por seleccion o codigo"
                className="h-12 rounded-full border-white/14 bg-white/[0.08] pl-11 text-white placeholder:text-white/48"
              />
            </div>
          </div>

          <Tabs defaultValue="Grupo A" className="w-full space-y-5">
            <TabsList className="h-auto w-fit flex-wrap rounded-full border border-white/10 bg-white/[0.05] p-1">
              {grupos.map((grupo) => (
                <TabsTrigger
                  key={grupo}
                  value={grupo}
                  className="rounded-full px-5 py-2 text-sm font-semibold text-white/72 data-[state=active]:bg-[#5993B6] data-[state=active]:text-white"
                >
                  {grupo}
                </TabsTrigger>
              ))}
            </TabsList>

            {grupos.map((grupo) => (
              <TabsContent key={grupo} value={grupo} className="mt-0">
                <div className="grid gap-5 xl:grid-cols-2">
                  <GrupoCard grupo={grupo} equipos={tablaPorGrupo[grupo]} />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </BrandPageShell>
  );
}

function GrupoCard({
  grupo,
  equipos,
}: {
  grupo: GrupoKey;
  equipos: readonly GrupoRow[];
}) {
  return (
    <section className={`${DASHBOARD_SUBCARD} overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] text-white`}>
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#AEEBFF]/10 text-[#AEEBFF]">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold tracking-[-0.02em] text-white">
              {grupo}
            </h3>
            <p className="text-sm text-white/62">4 selecciones en carrera</p>
          </div>
        </div>
        <Badge className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
          Corte top 2
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.04]">
              {["Pos", "Equipo", "PJ", "G", "E", "P", "GF", "GC", "DIF", "PTS"].map((label, index) => (
                <th
                  key={label}
                  className={`px-4 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-[#AEEBFF]/88 ${
                    index >= 2 ? "text-center" : ""
                  }`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {equipos.map((equipo, index) => {
              const [pos, nombre, codigo, pj, g, e, p, gf, gc, dif, pts] = equipo;
              const esClasificado = index < 2;
              return (
                <tr
                  key={`${grupo}-${codigo}`}
                  className="border-b border-white/8 transition-colors hover:bg-white/[0.05]"
                >
                  <td className="px-4 py-3 font-extrabold text-white">
                    <span className={esClasificado ? "text-[#FFE4A3]" : "text-white"}>
                      {pos}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-xs font-black uppercase text-[#AEEBFF]">
                        {codigo.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{nombre}</div>
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/48">
                          {codigo}
                        </div>
                      </div>
                    </div>
                  </td>
                  {[pj, g, e, p, gf, gc].map((value) => (
                    <td
                      key={`${grupo}-${codigo}-${value}`}
                      className="px-3 py-3 text-center font-medium text-white/78"
                    >
                      {value}
                    </td>
                  ))}
                  <td className="px-3 py-3 text-center font-bold text-white">
                    <span className={String(dif).startsWith("-") ? "text-rose-300" : "text-emerald-300"}>
                      {dif}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="brand-heading text-[1.65rem] text-white">
                      {pts}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
