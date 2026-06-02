"use client";

import Image from "next/image";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  Clock3,
  Flag,
  Home,
  ListOrdered,
  Search,
  ShieldCheck,
  Trophy,
  UserCog,
  Users,
} from "lucide-react";

import { BrandPatternBackground } from "@/components/brand/BrandPatternBackground";
import { BrandWatermark } from "@/components/brand/BrandWatermark";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { brandImages } from "@/config/brand-images";
import { cn } from "@/lib/utils";

import type { DashboardPreviewVariant } from "@/components/brand/dashboard-preview/dashboard-preview.data";

type DashboardChromePreviewProps = {
  variant: DashboardPreviewVariant;
};

type NavSection = {
  label: string;
  items: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    active?: boolean;
    badge?: string;
  }[];
};

const chromeCopy: Record<
  DashboardPreviewVariant,
  {
    topbarBadge: string;
    topbarHint: string;
    userName: string;
    userRole: string;
    sections: NavSection[];
  }
> = {
  admin: {
    topbarBadge: "Control operativo",
    topbarHint: "Accesos, resultados y seguimiento del torneo.",
    userName: "Admin Prode",
    userRole: "Administrador",
    sections: [
      {
        label: "General",
        items: [{ label: "Inicio", icon: Home, active: true }],
      },
      {
        label: "Gestión Usuarios",
        items: [
          { label: "Administrar", icon: UserCog, badge: "7" },
          { label: "Roles y permisos", icon: ShieldCheck },
        ],
      },
      {
        label: "Gestión Mundial",
        items: [
          { label: "Selecciones", icon: Flag },
          { label: "Gestionar fixture", icon: CalendarDays },
          { label: "Live Control", icon: Trophy },
        ],
      },
      {
        label: "Ayuda y reglas",
        items: [{ label: "Ayuda admin", icon: CircleHelp }],
      },
    ],
  },
  user: {
    topbarBadge: "Modo jugador",
    topbarHint: "Pronosticos, ranking y fixture a mano.",
    userName: "Sergio Ariel",
    userRole: "Participante",
    sections: [
      {
        label: "General",
        items: [{ label: "Inicio", icon: Home, active: true }],
      },
      {
        label: "Mundial",
        items: [
          { label: "Mis pronosticos", icon: CalendarDays, badge: "2" },
          { label: "Mi ranking", icon: ListOrdered },
          { label: "Fixture", icon: Flag },
        ],
      },
      {
        label: "Comunidad",
        items: [{ label: "Participantes", icon: Users }],
      },
      {
        label: "Ayuda y reglas",
        items: [{ label: "Ayuda usuario", icon: CircleHelp }],
      },
    ],
  },
};

export function DashboardChromePreview({
  variant,
}: DashboardChromePreviewProps) {
  const content = chromeCopy[variant];

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5993B6]">
            Mock sidebar + topbar
          </p>
          <p className="mt-1 text-sm text-[#1E2C46]/70">
            Rebranding del chrome actual, manteniendo estructura, navegación y densidad visual.
          </p>
        </div>
        <Badge className="border-[#FAB438]/18 bg-[#FAB438]/12 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#8A5A00]">
          Solo preview visual
        </Badge>
      </div>

      <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#1E2C46] p-3 shadow-[0_22px_54px_rgba(30,44,70,0.18)]">
        <BrandPatternBackground
          variant="cover"
          className="opacity-[0.12]"
          overlayClassName="bg-[radial-gradient(circle_at_top_left,rgba(89,147,182,0.16),transparent_22%),radial-gradient(circle_at_84%_18%,rgba(250,180,56,0.12),transparent_14%)]"
        />
        <BrandWatermark
          src={brandImages.institucional.masSanMiguelLogo}
          className="left-[2%] bottom-[6%] top-auto h-36 w-36"
          opacityClassName="opacity-[0.06]"
        />
        <BrandWatermark
          src={brandImages.institucional.solArgentino}
          className="right-[-4%] top-[-8%] left-auto h-44 w-44"
          opacityClassName="opacity-[0.06]"
        />

        <div className="relative z-10 overflow-hidden rounded-[28px] border border-white/10 bg-[#10233B]/70 backdrop-blur-md">
          <div className="grid min-h-[680px] grid-cols-[252px_minmax(0,1fr)]">
            <aside className="border-r border-white/10 bg-[linear-gradient(180deg,#061B33_0%,#071A2F_100%)]">
              <div className="border-b border-white/10 px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Image
                      src={brandImages.prode.masSanMiguelLogo}
                      alt="Mas San Miguel"
                      width={120}
                      height={44}
                      className="h-auto w-[112px] object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.25)]"
                    />
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/48">
                      Mundial 2026
                    </p>
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-white/72">
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 px-3 py-4">
                {content.sections.map((section) => (
                  <div key={section.label}>
                    <p className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/38">
                      {section.label}
                    </p>
                    <div className="mt-2 space-y-1">
                      {section.items.map((item) => (
                        <div
                          key={item.label}
                          className={cn(
                            "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                            item.active
                              ? "bg-[#5993B6]/18 text-white shadow-[0_10px_22px_rgba(89,147,182,0.12)]"
                              : "text-white/78 hover:bg-white/[0.06]",
                          )}
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <item.icon
                              className={cn(
                                "h-4 w-4 shrink-0",
                                item.active ? "text-[#AEEBFF]" : "text-white/62",
                              )}
                            />
                            <span className="truncate">{item.label}</span>
                          </span>
                          {item.badge ? (
                            <span className="rounded-full bg-[#FAB438]/14 px-2 py-0.5 text-[10px] font-black text-[#FFE4A3]">
                              {item.badge}
                            </span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(89,147,182,0.16)_0%,rgba(250,180,56,0.08)_100%)] px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={brandImages.institucional.solArgentino}
                      alt=""
                      width={46}
                      height={46}
                      className="h-11 w-11 object-contain opacity-90"
                    />
                    <div>
                      <p className="text-sm font-black text-white">Orgullo de barrio</p>
                      <p className="text-xs font-semibold text-white/62">
                        Sidebar actual con identidad mas institucional.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex min-w-0 flex-col">
              <header className="border-b border-white/10 bg-[rgba(6,27,51,0.78)] px-5 py-3 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/[0.05]">
                      <Image
                        src={brandImages.prode.solMark}
                        alt=""
                        width={42}
                        height={42}
                        className="h-10 w-10 object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <Image
                        src={brandImages.prode.pasionMundialWordmark}
                        alt="Pasion Mundial"
                        width={170}
                        height={32}
                        className="h-auto w-[152px] object-contain"
                      />
                      <p className="mt-1 text-xs font-semibold text-white/54">
                        {content.topbarHint}
                      </p>
                    </div>
                  </div>

                  <div className="hidden min-w-0 max-w-[360px] flex-1 items-center rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 xl:flex">
                    <Search className="mr-2 h-4 w-4 text-white/40" />
                    <span className="truncate text-sm font-medium text-white/42">
                      Buscar partidos, ranking o usuarios...
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className="hidden border-[#5993B6]/18 bg-[#5993B6]/12 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#AEEBFF] 2xl:inline-flex">
                      {content.topbarBadge}
                    </Badge>
                    <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white/82 2xl:flex">
                      <CalendarDays className="h-4 w-4 text-[#AEEBFF]" />
                      Mundial 2026
                    </div>
                    <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/74">
                      <Bell className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-2.5 py-2">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#5993B6]/18 text-sm font-black text-white">
                        {content.userName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="hidden text-left xl:block">
                        <p className="text-sm font-black text-white">{content.userName}</p>
                        <p className="text-xs font-semibold text-white/56">{content.userRole}</p>
                      </div>
                      <ChevronDown className="hidden h-4 w-4 text-white/56 xl:block" />
                    </div>
                  </div>
                </div>
              </header>

              <div className="grid flex-1 gap-4 p-5 xl:grid-cols-[1.4fr_0.9fr]">
                <Card className="rounded-[26px] border-white/10 bg-white/[0.04] py-0 shadow-[0_12px_30px_rgba(0,0,0,0.14)]">
                  <CardContent className="p-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
                      Sidebar
                    </p>
                    <h3 className="brand-heading mt-1 text-xl font-black text-white">
                      Misma estructura, lectura mas clara
                    </h3>
                    <ul className="mt-4 space-y-3 text-sm font-semibold text-white/70">
                      <li>Se respetan secciones, permisos y jerarquía actuales.</li>
                      <li>El activo gana más presencia con acento celeste institucional.</li>
                      <li>Logo, card inferior y labels se ordenan con mejor contraste.</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="rounded-[26px] border-white/10 bg-white/[0.04] py-0 shadow-[0_12px_30px_rgba(0,0,0,0.14)]">
                  <CardContent className="p-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
                      Topbar
                    </p>
                    <h3 className="brand-heading mt-1 text-xl font-black text-white">
                      Barra superior más de marca
                    </h3>
                    <div className="mt-4 space-y-3 text-sm font-semibold text-white/70">
                      <p>Wordmark, badge contextual, búsqueda y usuario siguen en el mismo lugar.</p>
                      <p>El cambio es de piel visual, no de comportamiento ni navegación.</p>
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-white/70">
                        <Clock3 className="h-3.5 w-3.5 text-[#FAB438]" />
                        mock de chrome alineado al dashboard aprobado
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
