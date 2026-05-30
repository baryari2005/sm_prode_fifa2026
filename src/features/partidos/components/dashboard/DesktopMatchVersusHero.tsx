"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarClock, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { resolveTeamAsset } from "@/features/partidos/components/dashboard/team-assets";

type Props = {
  localSlug?: string | null;
  visitanteSlug?: string | null;
  localGoals?: number | null;
  visitanteGoals?: number | null;
  fechaLabel?: string;
  horaLabel?: string;
  sedeLabel?: string;
  variant?: "section" | "inline";
};

function DesktopHeroShield({
  slug,
  fallbackLabel,
  showMeta = true,
  tilt = "left",
}: {
  slug?: string | null;
  fallbackLabel: string;
  showMeta?: boolean;
  tilt?: "left" | "right";
}) {
  const asset = resolveTeamAsset(slug);

  const initials = fallbackLabel
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className={`flex min-w-[198px] flex-col items-center gap-3 2xl:min-w-[242px] 2xl:gap-4 ${tilt === "left"
          ? "translate-x-5 translate-y-1 2xl:translate-x-6"
          : "-translate-x-5 translate-y-1 2xl:-translate-x-6"
        }`}
    >
      <div
        className={`relative flex h-[242px] w-[242px] items-center justify-center 2xl:h-[296px] 2xl:w-[296px] ${tilt === "left"
            ? "-rotate-[3deg] 2xl:-rotate-[4deg]"
            : "rotate-[3deg] 2xl:rotate-[4deg]"
          }`}
      >
        <div
          className={`absolute top-[18%] h-[56%] w-[38%] rounded-full blur-[18px] 2xl:top-[16%] 2xl:h-[60%] 2xl:w-[40%] ${tilt === "left"
              ? "-left-[8%] 2xl:-left-[10%]"
              : "-right-[8%] 2xl:-right-[10%]"
            }`}
          style={{
            background: `radial-gradient(ellipse at center, ${asset?.glow ?? "rgba(174,235,255,0.3)"
              } 0%, ${asset?.glow ?? "rgba(174,235,255,0.3)"
              } 36%, transparent 82%)`,
          }}
        />

        <div
          className="absolute inset-[18%] blur-[24px]"
          style={{
            background: `radial-gradient(circle at center, ${asset?.glow ?? "rgba(174,235,255,0.26)"
              } 0%, ${asset?.glow ?? "rgba(174,235,255,0.26)"
              } 26%, rgba(89,147,182,0.12) 54%, transparent 82%)`,
          }}
        />

        <div className="absolute inset-[26%] bg-[radial-gradient(circle_at_center,rgba(250,180,56,0.28),rgba(250,180,56,0.1)_38%,transparent_76%)] blur-[18px]" />
        <div className="absolute inset-[30%] bg-[radial-gradient(circle_at_center,rgba(255,244,190,0.16),transparent_72%)] blur-[12px]" />

        {asset ? (
          <div className="relative h-[190px] w-[190px] drop-shadow-[0_26px_38px_rgba(8,18,34,0.46)] 2xl:h-[236px] 2xl:w-[236px]">
            <Image
              src={asset.escudo}
              alt={`Escudo de ${asset.nombre}`}
              fill
              sizes="296px"
              className="object-contain"
            />
          </div>
        ) : (
          <span className="font-brand text-[2.8rem] uppercase tracking-[0.08em] text-white 2xl:text-[3.25rem]">
            {initials}
          </span>
        )}
      </div>

      {showMeta && asset ? (
        <div className="space-y-2 text-center">
          <p className="font-brand text-[1.25rem] leading-none tracking-[0.05em] text-white 2xl:text-[1.65rem]">
            {asset?.nombre ?? fallbackLabel}
          </p>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 backdrop-blur-sm 2xl:px-3 2xl:py-1.5">
            <div className="relative h-4 w-4 overflow-hidden rounded-full 2xl:h-5 2xl:w-5">
              <Image
                src={asset.confederacionAsset}
                alt={`Confederacion de ${asset.nombre}`}
                fill
                sizes="20px"
                className="object-contain"
              />
            </div>

            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#AEEBFF] 2xl:text-[11px]">
              {asset.confederacion}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MatchScoreBoard({
  localGoals,
  visitanteGoals,
  isInline,
}: {
  localGoals?: number | null;
  visitanteGoals?: number | null;
  isInline: boolean;
}) {
  const shouldShowScore =
    localGoals !== null &&
    localGoals !== undefined &&
    visitanteGoals !== null &&
    visitanteGoals !== undefined;

  if (!shouldShowScore) return null;

  return (
    <div
      className={
        isInline
          ? "relative z-30 -mt-6 flex justify-center 2xl:-mt-8"
          : "relative z-30 -mt-4 flex justify-center 2xl:-mt-6"
      }
    >
      <div className="relative flex items-center justify-center gap-4 2xl:gap-5">
        {/* Glow general detrás del resultado */}
        <div className="pointer-events-none absolute -inset-x-10 -inset-y-4 rounded-full bg-[radial-gradient(circle_at_center,rgba(174,235,255,0.34),rgba(14,165,233,0.16)_42%,transparent_72%)] blur-xl motion-safe:animate-pulse" />

        {/* Brillo inferior suave */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[-8px] h-4 rounded-full bg-[#AEEBFF]/25 blur-md" />

        <ScoreNumber value={localGoals} />

        <span className="font-brand relative -mt-1 text-[2.25rem] font-black leading-none text-[#AEEBFF]/90 drop-shadow-[0_0_16px_rgba(174,235,255,0.65)] 2xl:text-[2.8rem]">
          -
        </span>

        <ScoreNumber value={visitanteGoals} />
      </div>
    </div>
  );
}

function ScoreNumber({ value }: { value: number }) {
  return (
    <span className="relative inline-flex min-w-[42px] justify-center 2xl:min-w-[54px]">
      {/* Glow del número */}
      <span className="font-brand absolute text-[4.35rem] font-black leading-none tracking-[0.03em] text-[#AEEBFF]/45 blur-[7px] 2xl:text-[5.45rem]">
        {value}
      </span>

      {/* Número principal */}
      <span className="font-brand relative bg-gradient-to-b from-white via-[#EAFBFF] to-[#AEEBFF] bg-clip-text text-[4.35rem] font-black leading-none tracking-[0.03em] text-transparent drop-shadow-[0_14px_28px_rgba(0,0,0,0.7)] 2xl:text-[5.45rem]">
        {value}
      </span>
    </span>
  );
}

export function DesktopMatchVersusHero({
  localSlug,
  visitanteSlug,
  localGoals,
  visitanteGoals,
  fechaLabel,
  horaLabel,
  sedeLabel,
  variant = "section",
}: Props) {
  const [showVsImage, setShowVsImage] = useState(true);

  const hasMeta = Boolean(fechaLabel || horaLabel || sedeLabel);
  const isInline = variant === "inline";

  return (
    <section
      className={
        isInline
          ? "relative hidden h-full w-full xl:block"
          : "relative hidden overflow-hidden rounded-[34px] border border-white/10 bg-[#1E2C46] px-8 py-8 text-white shadow-[0_30px_80px_rgba(2,6,23,0.28)] xl:block 2xl:px-10 2xl:py-9"
      }
    >
      <div className="pointer-events-none absolute inset-0">
        {isInline ? null : (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(19,34,58,0.98)_0%,rgba(30,44,70,0.94)_34%,rgba(36,57,88,0.92)_68%,rgba(15,29,50,0.96)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_34%,rgba(89,147,182,0.18),transparent_25%),radial-gradient(circle_at_78%_22%,rgba(174,235,255,0.14),transparent_24%),radial-gradient(circle_at_50%_88%,rgba(250,180,56,0.12),transparent_24%)]" />
            <div className="absolute left-[12%] top-[-18%] h-[280px] w-[280px] rounded-full bg-[#5993B6]/14 blur-[120px]" />
            <div className="absolute bottom-[-24%] right-[10%] h-[320px] w-[320px] rounded-full bg-[#0EA5E9]/12 blur-[130px]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#AEEBFF]/60 to-[#FAB438]/60" />
          </>
        )}
      </div>

      <div
        className={
          isInline
            ? "relative z-10 flex h-full items-center justify-center"
            : "relative z-10 space-y-8"
        }
      >
        {!isInline && hasMeta ? (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {fechaLabel ? (
              <Badge className="rounded-full border border-white/12 bg-white/[0.08] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF] hover:bg-white/[0.08]">
                <CalendarClock className="mr-2 h-4 w-4" />
                {fechaLabel}
              </Badge>
            ) : null}

            {horaLabel ? (
              <Badge className="rounded-full border border-white/12 bg-white/[0.08] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white hover:bg-white/[0.08]">
                {horaLabel}
              </Badge>
            ) : null}

            {sedeLabel ? (
              <Badge className="rounded-full border border-white/12 bg-white/[0.08] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white hover:bg-white/[0.08]">
                <MapPin className="mr-2 h-4 w-4 text-[#AEEBFF]" />
                {sedeLabel}
              </Badge>
            ) : null}
          </div>
        ) : null}

        <div
          className={
            isInline
              ? "relative grid w-full grid-cols-[minmax(0,1fr)_104px_minmax(0,1fr)] items-center gap-0 2xl:grid-cols-[minmax(0,1fr)_132px_minmax(0,1fr)]"
              : "relative grid grid-cols-[minmax(0,1fr)_180px_minmax(0,1fr)] items-center gap-8 2xl:grid-cols-[minmax(0,1fr)_220px_minmax(0,1fr)]"
          }
        >
          {isInline ? (
            <>
              <div className="pointer-events-none absolute left-[29%] right-[14%] top-[34%] h-[3px] rotate-[-66deg] bg-[linear-gradient(90deg,transparent_0%,rgba(125,211,252,0.26)_16%,rgba(255,255,255,0.98)_50%,rgba(125,211,252,0.28)_84%,transparent_100%)] opacity-95 blur-[0.4px] 2xl:top-[35%]" />
              <div className="pointer-events-none absolute left-[30%] right-[15%] top-[34%] h-[44px] rotate-[-66deg] bg-[linear-gradient(90deg,transparent_0%,rgba(125,211,252,0.12)_16%,rgba(255,255,255,0.5)_50%,rgba(125,211,252,0.14)_84%,transparent_100%)] opacity-95 blur-[11px] 2xl:top-[35%]" />
              <div className="pointer-events-none absolute bottom-[11px] left-[5%] right-[5%] h-[34px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(18,115,56,0.58)_0%,rgba(41,166,87,0.5)_28%,rgba(74,222,128,0.34)_48%,rgba(145,220,184,0.18)_62%,transparent_100%)] blur-[4px] 2xl:bottom-[16px] 2xl:h-[42px]" />
              <div className="pointer-events-none absolute bottom-[18px] left-[12%] right-[12%] h-[84px] rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(174,235,255,0.24)_0%,rgba(89,147,182,0.12)_40%,transparent_72%)] blur-[16px] 2xl:bottom-[24px] 2xl:h-[94px]" />
              <div className="pointer-events-none absolute bottom-[10px] left-[8%] right-[8%] h-[12px] rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.02),rgba(255,255,255,0.18),rgba(255,255,255,0.02))] blur-[2px]" />
              <div className="pointer-events-none absolute bottom-[18px] left-[10%] right-[10%] h-[16px] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_12px,transparent_12px,transparent_24px)] opacity-20 blur-[1.2px]" />
            </>
          ) : null}

          <DesktopHeroShield
            slug={localSlug}
            fallbackLabel={localSlug ?? "Local"}
            showMeta={!isInline}
            tilt="left"
          />

          <div className="relative z-20 flex flex-col items-center justify-center">
            {showVsImage ? (
              <div
                className={
                  isInline
                    ? "relative h-[150px] w-[150px] drop-shadow-[0_28px_38px_rgba(4,12,25,0.42)] 2xl:h-[182px] 2xl:w-[182px]"
                    : "relative h-[148px] w-[148px] drop-shadow-[0_24px_36px_rgba(4,12,25,0.35)] 2xl:h-[170px] 2xl:w-[170px]"
                }
              >
                <Image
                  src="/ui/vs.png"
                  alt="Versus"
                  fill
                  sizes="170px"
                  className="object-contain"
                  onError={() => setShowVsImage(false)}
                />
              </div>
            ) : (
              <div
                className={
                  isInline
                    ? "flex h-[138px] w-[138px] items-center justify-center rounded-full  bg-[radial-gradient(circle_at_top,rgba(250,180,56,0.24),rgba(89,147,182,0.14)_58%,rgba(16,42,71,0.9)_100%)] shadow-[0_24px_42px_rgba(1,10,24,0.34)] 2xl:h-[166px] 2xl:w-[166px]"
                    : "flex h-[134px] w-[134px] items-center justify-center rounded-full  bg-[radial-gradient(circle_at_top,rgba(250,180,56,0.22),rgba(89,147,182,0.1)_58%,rgba(16,42,71,0.88)_100%)] shadow-[0_22px_38px_rgba(1,10,24,0.3)] 2xl:h-[154px] 2xl:w-[154px]"
                }
              >
                <span
                  className={
                    isInline
                      ? "font-brand text-[3.45rem] leading-none tracking-[0.05em] text-white 2xl:text-[4rem]"
                      : "font-brand text-[3.2rem] leading-none tracking-[0.05em] text-white 2xl:text-[3.5rem]"
                  }
                >
                  VS
                </span>
              </div>
            )}


            <MatchScoreBoard
              localGoals={localGoals}
              visitanteGoals={visitanteGoals}
              isInline={isInline}
            />
          </div>

          <DesktopHeroShield
            slug={visitanteSlug}
            fallbackLabel={visitanteSlug ?? "Visitante"}
            showMeta={!isInline}
            tilt="right"
          />
        </div>
      </div>
    </section>
  );
}