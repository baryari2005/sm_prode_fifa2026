"use client";

import Image from "next/image";
import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import { CalendarCheck2, Clock3, Radio } from "lucide-react";

import { ProdeIcon } from "@/components/icons/Iconos";

type DashboardHeroProps = {
  displayName: string;
  roleName?: string | null;
  pronosticosCargados: number;
  totalPartidos: number;
  partidosEnJuegoCount: number;
  isAutoRefreshing?: boolean;
  nextAutoRefreshIn?: number;
  lastAutoRefreshAt?: Date | null;
};

type MascotOption = {
  src: string;
  alt: string;
  glowClassName: string;
};

const HERO_MASCOTS: MascotOption[] = [
  {
    src: "/mascotas/canada.png",
    alt: "Mascota del Prode Mundial 2026 con camiseta de Canadá",
    glowClassName: "bg-[#F7B731]/25",
  },
  {
    src: "/mascotas/mexico.png",
    alt: "Mascota del Prode Mundial 2026 con camiseta de México",
    glowClassName: "bg-emerald-300/24",
  },
  {
    src: "/mascotas/usa.png",
    alt: "Mascota del Prode Mundial 2026 con camiseta de Estados Unidos",
    glowClassName: "bg-sky-300/22",
  },
];

export function DashboardHero({
  displayName,
  roleName,
  pronosticosCargados,
  totalPartidos,
  partidosEnJuegoCount,
  isAutoRefreshing = false,
  nextAutoRefreshIn = 30,
}: DashboardHeroProps) {
  const selectedMascot = useMemo(
    () => HERO_MASCOTS[Math.floor(Math.random() * HERO_MASCOTS.length)],
    [],
  );

  const normalizedRoleName = roleName?.trim().toLowerCase();
  const isAdmin = normalizedRoleName === "admin";

  const heroCopy = isAdmin
    ? {
        title: "Tenés el torneo bajo control",
        description:
          "Gestioná usuarios, partidos, resultados y el avance del Prode en tiempo real.",
      }
    : {
        title: "Cada partido puede cambiar todo",
        description:
          "Seguí tus pronósticos, sumá puntos y mantenete cerca de la cima jornada tras jornada.",
      };

  return (
    <section className="relative h-full w-full min-w-0 overflow-hidden rounded-[30px] border border-white/10 bg-slate-950 px-4 py-6 text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)] md:px-6 md:py-7 xl:px-7 xl:py-7 2xl:h-[420px] 2xl:px-8 2xl:py-8">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/cancha.png"
          alt=""
          fill
          priority
          aria-hidden="true"
          className="scale-[1.06] object-cover object-center opacity-95 brightness-[1.42] saturate-[1.38] contrast-[1.04]"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.34),transparent_18%),radial-gradient(circle_at_68%_26%,rgba(255,255,255,0.26),transparent_22%),radial-gradient(circle_at_86%_18%,rgba(255,255,255,0.35),transparent_16%)] opacity-85" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.72)_0%,rgba(6,78,59,0.52)_36%,rgba(5,53,69,0.22)_62%,rgba(2,6,23,0.36)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(34,197,94,0.30),transparent_30%),radial-gradient(circle_at_34%_0%,rgba(16,185,129,0.24),transparent_35%),linear-gradient(135deg,rgba(6,78,59,0.28)_0%,rgba(5,53,69,0.16)_46%,rgba(2,6,23,0.30)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.08)_48%,transparent_62%)] opacity-45" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-emerald-950/75 via-emerald-950/24 to-transparent" />
      <div className="pointer-events-none absolute right-10 top-8 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-8 bottom-5 h-28 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute left-[5%] right-[42%] bottom-7 h-px bg-gradient-to-r from-transparent via-emerald-100/25 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-[7%] h-20 w-[40%] rounded-[100%] border-t border-white/10 opacity-30" />
      <div className="pointer-events-none absolute bottom-0 left-[19%] h-16 w-[28%] rounded-[100%] border-t border-white/8 opacity-25" />

      <div className="relative z-10 flex h-full max-w-[580px] min-w-0 flex-col">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#F7B731]/45 bg-[#F7B731]/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#F7B731] backdrop-blur-md">
          <ProdeIcon
            source="/trofeo.ico"
            mode="mask"
            className="h-5 w-5 text-[#F7B731]"
          />
          Prode Mundial 2026
        </div>

        <div className="mt-6 space-y-2.5 xl:mt-8">
          <h1 className="text-[2.1rem] font-bold leading-[0.98] tracking-[-0.065em] md:text-[2.35rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
            Hola, {displayName}
          </h1>

          <p className="max-w-[540px] text-[1.75rem] font-semibold leading-[1.02] tracking-[-0.06em] text-[#72DD84] md:text-[1.8rem] xl:text-[2rem] 2xl:text-[2.3rem]">
            {heroCopy.title}
          </p>

          <p className="max-w-[470px] pt-2 text-[0.95rem] leading-5 text-white/78 xl:text-[1rem]">
            {heroCopy.description}
          </p>
        </div>

        <div className="pt-8 xl:pt-10 2xl:pt-14">
          <div className="flex max-w-[960px] flex-wrap gap-2 2xl:flex-nowrap">
            <HeroBadge
              icon={CalendarCheck2}
              value={`${pronosticosCargados}/${totalPartidos}`}
              label="pronósticos cargados"
              tone="green"
            />

            <HeroBadge
              icon={Radio}
              value={`${partidosEnJuegoCount}`}
              label="en juego"
              tone="violet"
            />

            <HeroBadge
              icon={Clock3}
              value={
                isAutoRefreshing
                  ? "Actualizando..."
                  : `Actualiza en ${nextAutoRefreshIn}s`
              }
              label="en tiempo real"
              tone="blue"
            />
          </div>
        </div>
      </div>

      <HeroMascot mascot={selectedMascot} />
    </section>
  );
}

function HeroBadge({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  tone: "green" | "violet" | "blue";
}) {
  const toneStyles =
    tone === "green"
      ? {
          shell: "border-emerald-200/25 bg-slate-950/18",
          icon: "bg-emerald-500/18 text-emerald-200 shadow-[0_0_22px_rgba(34,197,94,0.18)]",
          minWidth: "min-w-[190px] 2xl:min-w-[214px]",
        }
      : tone === "violet"
        ? {
            shell: "border-violet-200/25 bg-slate-950/18",
            icon: "bg-violet-500/18 text-violet-200 shadow-[0_0_22px_rgba(168,85,247,0.18)]",
            minWidth: "min-w-[136px] 2xl:min-w-[150px]",
          }
        : {
            shell: "border-sky-200/25 bg-slate-950/18",
            icon: "bg-sky-500/18 text-sky-200 shadow-[0_0_22px_rgba(14,165,233,0.18)]",
            minWidth: "min-w-[198px] 2xl:min-w-[224px]",
          };

  return (
    <div
      className={`inline-flex w-fit max-w-full items-center gap-2.5 rounded-4xl border px-4 py-3 backdrop-blur-md xl:px-4 2xl:px-5 ${toneStyles.minWidth} ${toneStyles.shell}`}
    >
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-4xl ${toneStyles.icon}`}
      >
        <Icon className="h-4.5 w-4.5" />
      </span>

      <span className="min-w-0">
        <span className="block text-[14px] font-black leading-none tracking-[0.04em] text-white">
          {value}
        </span>
        <span className="mt-1 block text-[11px] font-semibold leading-4 text-white/82">
          {label}
        </span>
      </span>
    </div>
  );
}

function HeroMascot({ mascot }: { mascot: MascotOption }) {
  return (
    <div className="pointer-events-none absolute bottom-[-72px] right-0 z-20 hidden h-[390px] w-[270px] xl:block 2xl:bottom-[-96px] 2xl:right-6 2xl:h-[500px] 2xl:w-[340px]">
      <div
        className={`absolute inset-6 rounded-full blur-[100px] ${mascot.glowClassName}`}
      />

      <Image
        src={mascot.src}
        alt={mascot.alt}
        fill
        priority
        className="relative object-contain object-bottom drop-shadow-[0_34px_74px_rgba(0,0,0,0.5)]"
      />
    </div>
  );
}
