"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { CalendarCheck2, Clock3, Radio } from "lucide-react";

import { HeroVisualImage } from "@/components/brand/HeroVisualImage";
import { BrandWatermark } from "@/components/brand/BrandWatermark";
import { ProdeIcon } from "@/components/icons/Iconos";
import { brandImages } from "@/config/brand-images";
import { useAuth } from "@/stores/auth";

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
    src: brandImages.mascots.capi,
    alt: "Mascota capi del Prode",
    glowClassName: "bg-[#AEEBFF]/22",
  },
  {
    src: brandImages.mascots.condor,
    alt: "Mascota condor del Prode",
    glowClassName: "bg-[#5993B6]/24",
  },
  {
    src: brandImages.mascots.yaguarete,
    alt: "Mascota yaguarete del Prode",
    glowClassName: "bg-[#FAB438]/22",
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
  const token = useAuth((state) => state.token);
  const normalizedRoleName = roleName?.trim().toLowerCase();
  const isAdmin = normalizedRoleName === "admin";
  const fallbackMascot = isAdmin ? HERO_MASCOTS[1] : HERO_MASCOTS[2];
  const [selectedMascot, setSelectedMascot] = useState<MascotOption>(fallbackMascot);

  useEffect(() => {
    if (typeof window === "undefined" || !token) {
      setSelectedMascot(fallbackMascot);
      return;
    }

    const mascotIndexKey = "dashboard-hero-mascot-index";
    const mascotTokenKey = "dashboard-hero-mascot-token";
    const storedToken = window.localStorage.getItem(mascotTokenKey);
    const storedIndex = Number(window.localStorage.getItem(mascotIndexKey) ?? "0");

    const nextIndex =
      storedToken === token
        ? Number.isFinite(storedIndex)
          ? storedIndex % HERO_MASCOTS.length
          : 0
        : ((Number.isFinite(storedIndex) ? storedIndex : -1) + 1 + HERO_MASCOTS.length) %
          HERO_MASCOTS.length;

    window.localStorage.setItem(mascotIndexKey, String(nextIndex));
    window.localStorage.setItem(mascotTokenKey, token);
    setSelectedMascot(HERO_MASCOTS[nextIndex] ?? fallbackMascot);
  }, [fallbackMascot, token]);

  const heroCopy = isAdmin
    ? {
      title: "Tenes el torneo bajo control",
      description:
        "Gestiona usuarios, partidos, resultados y el avance del Prode en tiempo real.",
    }
    : {
      title: "Tu barrio tambien juega el Mundial",
      description:
        "Segui tus pronosticos, suma puntos y mantente cerca de la cima jornada tras jornada.",
    };

  return (
    <section className="relative h-full w-full min-w-0 overflow-hidden rounded-[30px] border border-white/10 bg-[#1E2C46] px-4 py-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)] md:px-6 md:py-6 xl:px-7 xl:py-6 2xl:h-[420px] 2xl:px-8 2xl:py-7">
      <BrandWatermark
        src={brandImages.institucional.orgulloBarrioPanel}
        className="right-[-6%] top-[6%] left-auto h-[88%] w-[42%]"
        opacityClassName="opacity-[0.10]"
      />
      <div className="pointer-events-none absolute inset-0">
        <Image
          src={brandImages.prode.fieldBackground}
          alt=""
          fill
          priority
          aria-hidden="true"
          className="scale-[1.06] object-cover object-center opacity-[0.3] brightness-[0.8] saturate-[0.75] contrast-[1.02] hue-rotate-[170deg]"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.18),transparent_18%),radial-gradient(circle_at_68%_26%,rgba(255,255,255,0.12),transparent_22%),radial-gradient(circle_at_86%_18%,rgba(255,255,255,0.18),transparent_16%)] opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(30,44,70,0.94)_0%,rgba(30,44,70,0.9)_36%,rgba(37,53,80,0.62)_62%,rgba(30,44,70,0.76)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(89,147,182,0.22),transparent_30%),radial-gradient(circle_at_34%_0%,rgba(246,180,56,0.14),transparent_35%),linear-gradient(135deg,rgba(30,44,70,0.24)_0%,rgba(37,53,80,0.14)_46%,rgba(30,44,70,0.24)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.06)_48%,transparent_62%)] opacity-45" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#061B33]/75 via-[#061B33]/24 to-transparent" />
      <div className="pointer-events-none absolute right-10 top-8 h-56 w-56 rounded-full bg-sky-300/18 blur-3xl" />
      <div className="pointer-events-none absolute -left-8 bottom-5 h-28 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 flex h-full max-w-[62%] min-w-0 flex-col">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3] backdrop-blur-md">
          <ProdeIcon
            source={brandImages.prode.trophyImageIcon}
            mode="mask"
            className="h-5 w-5 text-[#FFE4A3]"
          />
          Prode Mundial 2026
        </div>

        <div className="mt-6 space-y-2.5 xl:mt-8">
          <h1 className="text-[2.1rem] font-bold leading-[0.98] tracking-[-0.065em] md:text-[2.35rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
            Hola, <span className="text-[#5993B6]">{displayName}</span>
          </h1>

          <p className="brand-heading max-w-[540px] text-[1.9rem] font-semibold leading-[0.96] !tracking-[0.04em] text-white md:text-[2rem] xl:text-[2.25rem] 2xl:text-[2.55rem]">
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
              label="pronosticos cargados"
              tone="sky"
            />

            <HeroBadge
              icon={Radio}
              value={`${partidosEnJuegoCount}`}
              label="en juego"
              tone="gold"
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
  tone: "sky" | "gold" | "blue";
}) {
  const toneStyles =
    tone === "sky"
      ? {
        shell: "border-[#5993B6]/24 bg-[#5993B6]/10",
        icon: "bg-[#5993B6]/18 text-[#D8F2FF]",
        minWidth: "min-w-[190px] 2xl:min-w-[214px]",
      }
      : tone === "gold"
        ? {
          shell: "border-[#FAB438]/24 bg-[#FAB438]/10",
          icon: "bg-[#FAB438]/18 text-[#FFE4A3]",
          minWidth: "min-w-[136px] 2xl:min-w-[150px]",
        }
        : {
          shell: "border-white/12 bg-white/[0.06]",
          icon: "bg-white/[0.08] text-[#AEEBFF]",
          minWidth: "min-w-[198px] 2xl:min-w-[224px]",
        };

  return (
    <div
      className={`inline-flex w-fit max-w-full items-center gap-2.5 rounded-full border px-4 py-3 backdrop-blur-md xl:px-4 2xl:px-5 ${toneStyles.minWidth} ${toneStyles.shell}`}
    >
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${toneStyles.icon}`}
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
    <div className="pointer-events-none absolute bottom-[-112px] right-[-186px] z-20 hidden h-[645px] w-[450px] xl:block 2xl:bottom-[-152px] 2xl:right-[-110px] 2xl:h-[810px] 2xl:w-[555px]">
      <div
        className={`absolute inset-2 rounded-full blur-[120px] ${mascot.glowClassName}`}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,44,70,0)_48%,rgba(30,44,70,0.16)_78%,rgba(30,44,70,0.32)_100%)]" />

      <HeroVisualImage
        src={mascot.src}
        alt={mascot.alt}
        priority
        sizes="(min-width: 1536px) 555px, 450px"
        baseClassName="relative object-contain object-bottom drop-shadow-[0_34px_74px_rgba(0,0,0,0.42)] [mask-image:radial-gradient(circle_at_center,black_58%,transparent_94%)] [-webkit-mask-image:radial-gradient(circle_at_center,black_58%,transparent_94%)]"
        loadedClassName="scale-100 opacity-80"
        loadingClassName="scale-[0.97] opacity-0"
      />
    </div>
  );
}
