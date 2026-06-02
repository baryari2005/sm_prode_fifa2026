"use client";

import Link from "next/link";
import {
  Clock3,
  Info,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import { BrandPageShell } from "@/components/brand/BrandPageShell";
import { HeroVisualImage } from "@/components/brand/HeroVisualImage";
import { Button } from "@/components/ui/button";
import { FlagImage } from "@/components/ui/flag-image";
import { Input } from "@/components/ui/input";
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

const partidosCompactos = [
  {
    horaPartido: "16:00",
    cierre: "Cierra en 1 h 18 min",
    estadio: "Ciudad de Mexico",
    local: "Mexico",
    localCodigo: "MEX",
    visitante: "Suiza",
    visitanteCodigo: "SUI",
    pronosticoAnterior: "Pronostico anterior: 2 - 1",
    inputLocal: "2",
    inputVisitante: "1",
    finalizado: false,
  },
  {
    horaPartido: "21:00",
    cierre: "Pronostico cerrado",
    estadio: "Monterrey",
    local: "Argentina",
    localCodigo: "ARG",
    visitante: "Corea del Sur",
    visitanteCodigo: "KOR",
    pronosticoAnterior: "Tu pronostico: 1 - 0",
    inputLocal: "2",
    inputVisitante: "1",
    resultadoFinal: "Resultado final: 2 - 1",
    finalizado: true,
  },
  {
    horaPartido: "18:00",
    cierre: "Cierra en 4 h 42 min",
    estadio: "Dallas",
    local: "Estados Unidos",
    localCodigo: "USA",
    visitante: "Croacia",
    visitanteCodigo: "CRO",
    pronosticoAnterior: "Sin carga previa",
    inputLocal: "",
    inputVisitante: "",
    finalizado: false,
  },
] as const;

export function BrandPronosticosFaseGruposCompactMock() {
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
              Variante compacta para validar la nueva distribucion de las cards de pronosticos.
            </p>
          </div>

          <Link
            href="/brand-preview/pronosticos/fase-grupos"
            className="text-sm font-semibold text-[#1E2C46] transition hover:text-[#5993B6]"
          >
            Volver al mock anterior
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
            </div>

            <div className="relative z-10 flex h-full max-w-[62%] min-w-0 flex-col">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3] backdrop-blur-md">
                Mis pronosticos
              </div>

              <div className="mt-6 space-y-2.5 xl:mt-8">
                <h1 className="text-[2.1rem] font-bold leading-[0.98] tracking-[-0.065em] md:text-[2.35rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
                  Cards mas <span className="text-[#5993B6]">compactas</span>
                </h1>

                <p className="font-brand max-w-[560px] text-[1.9rem] font-semibold leading-[0.96] tracking-[0.04em] text-white md:text-[2rem] xl:text-[2.25rem] 2xl:text-[2.55rem]">
                  Enfoque en cierre, resultado y carga
                </p>

                <p className="max-w-[560px] pt-2 text-[0.95rem] leading-5 text-white/78 xl:text-[1rem]">
                  Esta variante muestra una estructura mas corta: datos arriba,
                  contexto entre equipos y abajo la fila fuerte de banderas e inputs.
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
                <Button className="rounded-2xl bg-[#FAB438] font-semibold text-[#1E2C46] hover:bg-[#F7C45A]">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Guardar todos
                </Button>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-[-14px] right-[8px] z-20 hidden h-[370px] w-[360px] xl:block 2xl:bottom-[-18px] 2xl:right-[12px] 2xl:h-[430px] 2xl:w-[420px]">
              <div className="absolute inset-3 rounded-full bg-[#5993B6]/18 blur-[110px]" />
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
                Vista rápida
              </p>
              <p className="mt-1.5 flex items-start justify-center gap-2 text-center text-sm font-semibold leading-5 text-white/68">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="max-w-[260px]">
                  Una propuesta para reducir altura sin perder jerarquia visual ni contexto del partido.
                </span>
              </p>
            </div>

            <div className="space-y-2.5">
              <CompactMetric
                icon={<Target className="h-4.5 w-4.5" />}
                tone="sky"
                title="Lectura rapida"
                detail="Header mas estable y cuerpo mas corto"
                value="OK"
              />
              <CompactMetric
                icon={<Zap className="h-4.5 w-4.5" />}
                tone="gold"
                title="Foco visual"
                detail="Inputs y banderas pasan a ser el centro"
                value="2x"
              />
              <CompactMetric
                icon={<ShieldCheck className="h-4.5 w-4.5" />}
                tone="emerald"
                title="Caso finalizado"
                detail="Muestra pronostico arriba y resultado real en inputs"
                value="LIVE"
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
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
              Fase de grupos
            </p>
            <h2 className="font-brand mt-2 text-[2rem] leading-[0.92] tracking-[0.04em] text-white">
              Preview de cards compactas
            </h2>
            <p className="mt-2 max-w-[860px] text-sm leading-6 text-white/72">
              Linea 1 con horario del partido, cierra en y estadio. Linea 2 con local, pronostico anterior opcional y visitante. Abajo, la fila principal con bandera, pais e inputs.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {partidosCompactos.map((partido) => (
              <CompactMatchCard key={`${partido.local}-${partido.visitante}`} partido={partido} />
            ))}
          </div>
        </div>
      </section>
    </BrandPageShell>
  );
}

function CompactMatchCard({
  partido,
}: {
  partido: (typeof partidosCompactos)[number];
}) {
  return (
    <article className={`${DASHBOARD_PANEL} rounded-[28px] p-4`}>
      <div className={DASHBOARD_TOP_LINE}>
        <div className={DASHBOARD_TOP_LINE_INNER} />
        <div className={DASHBOARD_TOP_LINE_SWEEP} />
        <div className={DASHBOARD_TOP_LINE_GLOW} />
        <div className={DASHBOARD_TOP_LINE_HAIR} />
      </div>

      <div className="space-y-4">
        <div className={`${DASHBOARD_SUBCARD} rounded-[22px] px-4 py-3`}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] font-semibold text-white/74">
            <span className="inline-flex items-center gap-1.5 text-base font-black text-[#AEEBFF]">
              <Clock3 className="h-4.5 w-4.5" />
              {partido.horaPartido}
            </span>
            <span className="text-white/34">|</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4 text-[#AEEBFF]" />
              {partido.cierre}
            </span>
            <span className="text-white/34">|</span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#AEEBFF]" />
              {partido.estadio}
            </span>
            <span className="text-white/34">|</span>
            <span className="text-[#AEEBFF]">
              <span className="font-black uppercase tracking-[0.12em] text-white/54">
                Pronostico anterior:
              </span>{" "}
              <span className="font-black">{partido.pronosticoAnterior.replace("Pronostico anterior: ", "")}</span>
            </span>
          </div>
        </div>

        <div className={`${DASHBOARD_SUBCARD} rounded-[24px] p-4`}>
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_164px_minmax(0,1fr)] md:items-center">
            <EquipoCompacto
              nombre={partido.local}
              codigo={partido.localCodigo}
              align="left"
            />

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <Input
                defaultValue={partido.inputLocal}
                className={[
                  "h-12 rounded-2xl text-center text-lg font-black placeholder:text-white/28",
                  partido.finalizado
                    ? "border-emerald-300/20 bg-emerald-300/14 text-emerald-100"
                    : "border-white/10 bg-white/10 text-white",
                ].join(" ")}
              />
              <span className="font-brand text-[1.8rem] leading-none text-white/68">
                vs
              </span>
              <Input
                defaultValue={partido.inputVisitante}
                className={[
                  "h-12 rounded-2xl text-center text-lg font-black placeholder:text-white/28",
                  partido.finalizado
                    ? "border-emerald-300/20 bg-emerald-300/14 text-emerald-100"
                    : "border-white/10 bg-white/10 text-white",
                ].join(" ")}
              />
            </div>

            <EquipoCompacto
              nombre={partido.visitante}
              codigo={partido.visitanteCodigo}
              align="right"
            />
          </div>
        </div>

      </div>
    </article>
  );
}

function EquipoCompacto({
  nombre,
  codigo,
  align,
}: {
  nombre: string;
  codigo: string;
  align: "left" | "right";
}) {
  const isRight = align === "right";

  return (
    <div className={isRight ? "text-right" : "text-left"}>
      <div
        className={[
          "flex items-center gap-3",
          isRight ? "justify-end" : "justify-start",
        ].join(" ")}
      >
        {!isRight ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/10">
            <FlagImage
              nombre={nombre}
              codigo={codigo}
              widthClassName="w-8"
              heightClassName="h-6"
              fallbackMode="code"
            />
          </div>
        ) : null}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/46">
            {isRight ? "Visitante" : "Local"}
          </p>
          <p className="mt-1 truncate text-lg font-black text-white">{nombre}</p>
        </div>
        {isRight ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/10">
            <FlagImage
              nombre={nombre}
              codigo={codigo}
              widthClassName="w-8"
              heightClassName="h-6"
              fallbackMode="code"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CompactMetric({
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
      <span className="font-brand text-[1.55rem] leading-none tracking-[0.03em] text-white">
        {value}
      </span>
    </div>
  );
}
