"use client";

import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Home, Info, ShieldAlert, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
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

type Props = {
  code: "403" | "404" | "501";
  title: string;
  description?: string;
  imageSrc: string;
  imageWrapperClassName?: string;
  showBrandHeader?: boolean;
  brandTitle?: string;
  brandSubtitle?: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
};

function getStatusMeta(code: Props["code"]) {
  switch (code) {
    case "403":
      return {
        label: "Acceso restringido",
        icon: ShieldAlert,
        badgeClass: "border-red-400/20 bg-red-400/10 text-red-100",
      };
    case "404":
      return {
        label: "Pagina no encontrada",
        icon: AlertTriangle,
        badgeClass: "border-amber-300/20 bg-amber-300/12 text-amber-100",
      };
    case "501":
    default:
      return {
        label: "Seccion en construccion",
        icon: Wrench,
        badgeClass: "border-cyan-300/20 bg-cyan-300/12 text-cyan-100",
      };
  }
}

export function StatusPage({
  code,
  title,
  description,
  imageSrc,
  imageWrapperClassName,
  showBrandHeader = true,
  brandTitle = "Pasión mundial",
  brandSubtitle = "Panel del torneo",
  primaryAction = { label: "Volver al inicio", href: "/" },
  secondaryAction,
}: Props) {
  const meta = getStatusMeta(code);
  const StatusIcon = meta.icon;

  return (
    <div className="min-h-[78vh] w-full px-6 py-10 md:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <section className={`${DASHBOARD_PANEL} rounded-[2.25rem] p-5 md:p-6 lg:p-8`}>
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-[2.25rem] bg-[radial-gradient(circle_at_10%_16%,rgba(89,147,182,0.12),transparent_24%),radial-gradient(circle_at_90%_14%,rgba(250,180,56,0.10),transparent_22%)] opacity-80" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
            <div className="flex justify-center">
              <div
                className={[
                  "relative aspect-[4/3] w-full max-w-[760px]",
                  imageWrapperClassName ?? "",
                ].join(" ")}
              >
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <Image
                    src={brandImages.institucional.masSanMiguelLogo}
                    alt=""
                    width={540}
                    height={540}
                    aria-hidden="true"
                    className="h-auto w-[80%] max-w-[540px] object-contain opacity-[0.12] blur-[0.5px]"
                  />
                </div>
                <Image
                  src={imageSrc}
                  alt={title}
                  fill
                  priority
                  className="relative z-10 object-contain drop-shadow-2xl animate-[float_4s_ease-in-out_infinite]"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <div className={`${DASHBOARD_PANEL} w-full max-w-xl rounded-[2rem] p-6 md:p-8`}>
                <div className={DASHBOARD_TOP_LINE}>
                  <div className={DASHBOARD_TOP_LINE_INNER} />
                  <div className={DASHBOARD_TOP_LINE_SWEEP} />
                  <div className={DASHBOARD_TOP_LINE_GLOW} />
                  <div className={DASHBOARD_TOP_LINE_HAIR} />
                </div>

                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.18),transparent_32%),radial-gradient(circle_at_12%_18%,rgba(250,180,56,0.12),transparent_18%)] opacity-90" />

                <div className={`relative flex flex-col items-center rounded-[1.6rem] p-6 text-center md:p-7 ${DASHBOARD_SUBCARD}`}>
                  {showBrandHeader ? (
                    <div className="inline-flex flex-col items-center">
                      <span className="text-[14px] font-black uppercase tracking-[0.3em] text-[#AEEBFF]">
                        {brandSubtitle}
                      </span>
                      <span className="mt-2 brand-heading text-3xl font-black !tracking-[0.04em] text-white">
                        Orgullo de barrio
                      </span>
                      <span className="mt-2 brand-heading text-4xl font-black !tracking-[0.04em] text-brand-blue">
                        {brandTitle}
                      </span>
                    </div>
                  ) : null}

                  <div className={`mt-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${meta.badgeClass}`}>
                    <StatusIcon className="h-4 w-4" />
                    <span>
                      Error {code} · {meta.label}
                    </span>
                  </div>

                  <h1 className="mt-5 text-3xl font-black tracking-[-0.03em] text-white md:text-[2rem]">
                    {title}
                  </h1>

                  {description ? (
                    <div className="flex justify-center mt-4 text-base leading-relaxed text-white/74 md:text-[15px]">
                      <Info className="w-10 h-10 ml-2" />
                      <p className=" max-w-md ">
                        {description}
                      </p>
                    </div>
                  ) : null}

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button
                      asChild
                      className="h-11 rounded-xl bg-[#008C93] px-5 text-white shadow-[0_12px_24px_rgba(0,140,147,0.28)] hover:bg-[#007381]"
                    >
                      <Link href={primaryAction.href} className="inline-flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        <span>{primaryAction.label}</span>
                      </Link>
                    </Button>

                    {secondaryAction ? (
                      <Button
                        asChild
                        className="h-11 min-w-[180px] rounded-xl bg-[#008C93] px-5 text-white shadow-[0_12px_24px_rgba(0,140,147,0.28)] hover:bg-[#007381]"
                      >
                        <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
