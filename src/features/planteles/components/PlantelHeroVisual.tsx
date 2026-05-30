"use client";

import { useMemo, useState } from "react";

import { HeroVisualImage } from "@/components/brand/HeroVisualImage";
import { getMascotForSeleccion } from "@/features/paises/lib/pais-mascot.helpers";
import { getSeleccionShieldSrcCandidates } from "@/features/paises/lib/seleccion-shield.helpers";

type PlantelHeroVisualProps = {
  codigo?: string | null;
  confederacion?: string | null;
  nombre?: string | null;
};

export function PlantelHeroVisual({
  codigo,
  confederacion,
  nombre,
}: PlantelHeroVisualProps) {
  const shieldCandidates = useMemo(
    () => getSeleccionShieldSrcCandidates(codigo),
    [codigo],
  );
  const mascotSrc = getMascotForSeleccion(confederacion);
  const [candidateIndex, setCandidateIndex] = useState(0);

  const shieldSrc = shieldCandidates[candidateIndex] ?? null;
  const isShield = Boolean(shieldSrc);
  const imageSrc = shieldSrc ?? mascotSrc;

  function handleImageError() {
    if (shieldSrc && candidateIndex < shieldCandidates.length - 1) {
      setCandidateIndex((current) => current + 1);
      return;
    }

    if (shieldSrc) {
      setCandidateIndex(shieldCandidates.length);
    }
  }

  return (
    <div
      className={`pointer-events-none absolute z-20 hidden xl:block ${
        isShield
          ? "bottom-[68px] right-[54px] h-[220px] w-[184px] 2xl:bottom-[62px] 2xl:right-[46px] 2xl:h-[268px] 2xl:w-[220px]"
          : "bottom-[-10px] right-[-4px] h-[390px] w-[325px] 2xl:bottom-[-18px] 2xl:right-0 2xl:h-[470px] 2xl:w-[380px]"
      }`}
    >
      <div
        className={`absolute inset-2 rounded-full blur-[120px] ${
          isShield ? "bg-white/12" : "bg-[#5993B6]/22"
        }`}
      />
      {isShield ? (
        <div className="absolute inset-[-16%] rounded-full bg-[radial-gradient(circle_at_center,rgba(89,147,182,0.22)_0%,rgba(89,147,182,0.12)_34%,rgba(30,44,70,0.02)_64%,transparent_88%)] blur-[36px]" />
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,44,70,0)_48%,rgba(30,44,70,0.16)_78%,rgba(30,44,70,0.32)_100%)]" />
      
      <HeroVisualImage
        src={imageSrc}
        alt={isShield ? `Escudo de ${nombre ?? "la seleccion"}` : ""}
        sizes="(min-width: 1536px) 380px, 325px"
        onError={handleImageError}
        baseClassName={
          isShield
            ? "relative object-contain object-center brightness-[1.08] contrast-[1.04] saturate-[1.06] drop-shadow-[0_18px_34px_rgba(0,0,0,0.18)] [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.99)_14%,rgba(0,0,0,0.95)_30%,rgba(0,0,0,0.78)_48%,rgba(0,0,0,0.5)_66%,rgba(0,0,0,0.18)_84%,rgba(0,0,0,0.06)_92%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.99)_14%,rgba(0,0,0,0.95)_30%,rgba(0,0,0,0.78)_48%,rgba(0,0,0,0.5)_66%,rgba(0,0,0,0.18)_84%,rgba(0,0,0,0.06)_92%,transparent_100%)]"
            : "relative object-contain object-[center_bottom] brightness-110 drop-shadow-[0_30px_68px_rgba(0,0,0,0.32)] [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0.98)_44%,rgba(0,0,0,0.82)_62%,rgba(0,0,0,0.42)_82%,transparent_100%)]"
        }
        loadedClassName={isShield ? "scale-100 opacity-[0.9]" : "scale-100 opacity-[0.82]"}
        loadingClassName="scale-[0.97] opacity-0"
      />
    </div>
  );
}
