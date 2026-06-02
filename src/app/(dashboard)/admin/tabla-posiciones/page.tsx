"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, ShieldCheck, Trophy, Zap } from "lucide-react";

import { useCan } from "@/hooks/useCan";
import DashboardLoading from "@/features/dashboard/components/loading/DashboardLoading";
import { HeroVisualImage } from "@/components/brand/HeroVisualImage";
import { Button } from "@/components/ui/button";
import AccessDenied403Page from "../../403/page";
import { TablaPosiciones } from "@/features/partidos/components/TablaPosiciones";
import { useTablaPosiciones } from "@/features/partidos/hooks/useTablaPosiciones";
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
import { LateralSummaryHeader } from "@/components/ui/lateralSummaryHeader";

export default function TablaPosicionesPage() {
  const canVerPartidos = useCan("partidos", "ver");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    partidos,
    selecciones,
    loading,
    gruposDisponibles,
    grupoSeleccionado,
    setGrupoSeleccionado,
    grupoActual,
    loadData,
  } = useTablaPosiciones();

  useEffect(() => {
    if (canVerPartidos) {
      loadData();
    }
  }, [canVerPartidos, loadData]);

  useEffect(() => {
    setSearchQuery("");
  }, [grupoSeleccionado]);

  const gruposValidos = gruposDisponibles.filter(
    (grupo): grupo is string => Boolean(grupo),
  );

  const metricas = useMemo(() => {
    const totalSelecciones = grupoActual.length;
    const grupos = gruposValidos.length;
    const clasificados = Math.min(2, totalSelecciones);

    return [
      {
        title: "Grupos cargados",
        detail: "Vista completa de la fase",
        value: String(grupos),
        icon: Trophy,
        accent: "text-[#AEEBFF]",
        ring: "bg-[#AEEBFF]/12",
      },
      {
        title: "Selecciones activas",
        detail: "Pais + puntos + diferencia",
        value: String(totalSelecciones),
        icon: BarChart3,
        accent: "text-[#FFE4A3]",
        ring: "bg-[#FAB438]/12",
      },
      {
        title: "Clasificables",
        detail: "Top 2 por grupo visibles",
        value: String(clasificados),
        icon: ShieldCheck,
        accent: "text-[#84F0C8]",
        ring: "bg-emerald-400/12",
      },
    ];
  }, [grupoActual.length, gruposValidos.length]);

  if (!canVerPartidos) {
    return <AccessDenied403Page />;
  }

  if (loading) {
    return <DashboardLoading badgeLabel="Cargando tabla de posiciones" />;
  }

  return (
    <main className="min-h-full bg-transparent px-3 py-4 md:px-5 md:py-5 xl:px-4">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 xl:gap-6">
        <section className={`${DASHBOARD_PANEL} rounded-[32px] p-3 md:p-4`}>
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>

          <div className="grid gap-4 2xl:grid-cols-[minmax(0,2.05fr)_minmax(300px,0.95fr)] 2xl:items-stretch">
            <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#1E2C46] px-4 py-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)] md:px-6 md:py-6 xl:h-[364px] xl:px-7 xl:py-6 2xl:h-[420px] 2xl:px-8 2xl:py-7">
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
                    Clasificación 
                    <span className="text-[#5993B6]"> cada grupo</span>
                  </h1>
                  <p className="brand-heading max-w-[680px] text-[2.25rem] uppercase !tracking-[0.04em] text-white md:text-[3.2rem] md:leading-[1.1]">
                    puntos y diferencia
                  </p>
                  <p className="max-w-[640px] text-base leading-relaxed text-white/82 md:text-[1.02rem]">
                    Seguí el minuto a minuto de cada zona, controlá los goles, la diferencia y los puntos acumulados bajo la interfaz unificada del panel de control.
                  </p>
                </div>

                <div className="mt-auto flex flex-wrap gap-3 pt-6 xl:pt-8 2xl:pt-10">
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

              <div className="pointer-events-none absolute bottom-[-12px] right-[8px] z-20 hidden h-[371px] w-[315px] xl:block 2xl:bottom-[-18px] 2xl:right-[10px] 2xl:h-[435px] 2xl:w-[361px]">
                <div className="absolute inset-3 rounded-full bg-[#5993B6]/18 blur-[110px]" />
                <div className="absolute inset-x-[-8%] top-[12%] h-[74%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(174,235,255,0.18)_0%,rgba(89,147,182,0.12)_34%,rgba(30,44,70,0.02)_72%,transparent_100%)] blur-[18px]" />
                <HeroVisualImage
                  src={brandImages.mascots.tabla}
                  alt="Hero visual de tabla de posiciones"
                  sizes="(min-width: 1536px) 361px, 315px"
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

                <LateralSummaryHeader
                  title="Vista rápida"
                  description="Estado general de los grupos y monitoreo directo de la zona de clasificación."
                />

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
                        <div className="brand-heading shrink-0 !tracking-[0.04em] text-[2.1rem] text-white">
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

          <TablaPosiciones
            grupos={gruposValidos}
            grupoSeleccionado={grupoSeleccionado}
            onGrupoChange={setGrupoSeleccionado}
            tabla={grupoActual}
            partidos={partidos}
            selecciones={selecciones}
            searchQuery={searchQuery}
          />
        </section>
      </div>
    </main>
  );
}
