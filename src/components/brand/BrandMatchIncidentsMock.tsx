"use client";

import {
  Activity,
  Goal,
  Square,
} from "lucide-react";

import { BrandFixtureActionShell } from "@/components/brand/BrandFixtureActionShell";
import { Tabs } from "@/components/ui/tabs";
import {
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";

import { IncidentFormMock } from "./incidencias-mock/IncidentFormMock";
import { IncidentTimeline } from "./incidencias-mock/IncidentTimeline";
import { IncidentTypeTabs } from "./incidencias-mock/IncidentTypeTabs";
import { MatchIncidentHeader } from "./incidencias-mock/MatchIncidentHeader";
import { MatchIncidentSummary } from "./incidencias-mock/MatchIncidentSummary";

export function BrandMatchIncidentsMock() {
  return (
    <BrandFixtureActionShell
      eyebrow="Incidencias del partido"
      title="Carga visual de"
      accent="incidencias"
      subtitle="goles, tarjetas, cambios y eventos clave"
      description="Mock visual para validar una pantalla rapida de administracion durante el partido, sin tocar todavia backend ni persistencia."
      summaryText="Resumen operativo del partido, del flujo de incidencias y de la ultima accion registrada."
      metrics={[
        {
          title: "Goles",
          detail: "Eventos de gol registrados",
          value: "3",
          icon: Goal,
          toneClassName: "text-[#84F0C8]",
          ringClassName: "bg-[#84F0C8]/12",
        },
        {
          title: "Tarjetas",
          detail: "Amarillas y rojas",
          value: "2",
          icon: Square,
          toneClassName: "text-[#FFE4A3]",
          ringClassName: "bg-[#FAB438]/14",
        },
        {
          title: "Flujo",
          detail: "Carga lista para guardar",
          value: "OK",
          icon: Activity,
          toneClassName: "text-[#AEEBFF]",
          ringClassName: "bg-[#5993B6]/18",
        },
      ]}
    >
      <section className="rounded-[32px] border border-white/10 bg-[#1E2C46] text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)]">
        <div className="space-y-6 p-4 md:p-6">
          <div className="border-b border-white/10 pb-5">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white md:text-2xl">
                Incidencias del partido
              </h2>
              <p className="text-sm text-white/68">
                Cargá goles, tarjetas, cambios, lesiones y eventos importantes del partido.
              </p>
            </div>
          </div>

          <MatchIncidentHeader />

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.32fr)_320px] xl:items-start">
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/[0.05] p-5">
                <div className={DASHBOARD_TOP_LINE}>
                  <div className={DASHBOARD_TOP_LINE_INNER} />
                  <div className={DASHBOARD_TOP_LINE_SWEEP} />
                  <div className={DASHBOARD_TOP_LINE_GLOW} />
                  <div className={DASHBOARD_TOP_LINE_HAIR} />
                </div>

                <div className="mb-4">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                    Formulario de incidencia
                  </p>
                  <p className="mt-2 text-sm text-white/68">
                    Primero elegí el tipo de incidencia y despues completá solo los campos necesarios.
                  </p>
                </div>

                <Tabs defaultValue="gol" className="space-y-0">
                  <IncidentTypeTabs />
                  <IncidentFormMock />
                </Tabs>
              </div>

              <div className="rounded-[1.9rem] border border-white/10 bg-white/[0.05] p-5">
                <div className={DASHBOARD_TOP_LINE}>
                  <div className={DASHBOARD_TOP_LINE_INNER} />
                  <div className={DASHBOARD_TOP_LINE_SWEEP} />
                  <div className={DASHBOARD_TOP_LINE_GLOW} />
                  <div className={DASHBOARD_TOP_LINE_HAIR} />
                </div>
                <IncidentTimeline />
              </div>
            </div>

            <div className="rounded-[1.9rem] border border-white/10 bg-white/[0.05] p-5">
              <div className={DASHBOARD_TOP_LINE}>
                <div className={DASHBOARD_TOP_LINE_INNER} />
                <div className={DASHBOARD_TOP_LINE_SWEEP} />
                <div className={DASHBOARD_TOP_LINE_GLOW} />
                <div className={DASHBOARD_TOP_LINE_HAIR} />
              </div>
              <MatchIncidentSummary />
            </div>
          </div>
        </div>
      </section>
    </BrandFixtureActionShell>
  );
}
