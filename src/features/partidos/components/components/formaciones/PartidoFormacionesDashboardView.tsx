"use client";

import Link from "next/link";
import { ChevronLeft, ClipboardList, RefreshCw, Save, ShieldCheck, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DesktopMatchVersusHero } from "@/features/partidos/components/dashboard/DesktopMatchVersusHero";
import {
  DASHBOARD_PANEL,
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import { LineupEditorCard } from "@/features/partidos/components/LineupEditorCard";
import type { TeamLineup } from "@/features/partidos/types/fixture-details";
import type { JugadorSeleccion, Partido } from "@/features/partidos/types/types";

type Props = {
  partido: Partido;
  partidoId: string;
  localNombre: string;
  visitanteNombre: string;
  localCodigo?: string | null;
  visitanteCodigo?: string | null;
  localPlantel: JugadorSeleccion[];
  visitantePlantel: JugadorSeleccion[];
  alineacionLocal: TeamLineup;
  alineacionVisitante: TeamLineup;
  previousLocalLabel?: string | null;
  previousVisitanteLabel?: string | null;
  previousLocalLineup?: TeamLineup | null;
  previousVisitanteLineup?: TeamLineup | null;
  onApplyPreviousLocal?: () => void;
  onApplyPreviousVisitante?: () => void;
  onChangeLocal: (lineup: TeamLineup) => void;
  onChangeVisitante: (lineup: TeamLineup) => void;
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
  canEdit: boolean;
  isLiveLocked: boolean;
};

export function PartidoFormacionesDashboardView({
  partido,
  partidoId,
  localNombre,
  visitanteNombre,
  localCodigo,
  visitanteCodigo,
  localPlantel,
  visitantePlantel,
  alineacionLocal,
  alineacionVisitante,
  previousLocalLabel,
  previousVisitanteLabel,
  previousLocalLineup,
  previousVisitanteLineup,
  onApplyPreviousLocal,
  onApplyPreviousVisitante,
  onChangeLocal,
  onChangeVisitante,
  onCancel,
  onSave,
  saving,
  canEdit,
  isLiveLocked,
}: Props) {
  const faseLabel = partido.fase?.grupoNombre ?? partido.fase?.nombre ?? "Partido";
  const fechaTexto = new Date(partido.fecha).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const localSuplentes = alineacionLocal.suplentes.length;
  const visitanteSuplentes = alineacionVisitante.suplentes.length;
  const totalTitulares = alineacionLocal.titulares.length + alineacionVisitante.titulares.length;
  const totalSuplentes = localSuplentes + visitanteSuplentes;

  return (
    <main className="px-3 py-4 md:px-5 md:py-5 xl:px-4">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-5 xl:gap-6">
        <section className={`${DASHBOARD_PANEL} rounded-[32px] p-3 md:p-4`}>
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>

          <section className="relative h-full w-full min-w-0 overflow-hidden rounded-[30px] border border-white/10 bg-[#1E2C46] px-4 py-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)] md:px-6 md:py-6 xl:h-[364px] xl:px-7 xl:py-6 2xl:h-[420px] 2xl:px-8 2xl:py-7">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,44,70,0.94)_0%,rgba(30,44,70,0.9)_36%,rgba(37,53,80,0.62)_62%,rgba(30,44,70,0.76)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_35%,rgba(89,147,182,0.22),transparent_30%),radial-gradient(circle_at_34%_0%,rgba(246,180,56,0.14),transparent_35%),linear-gradient(135deg,rgba(30,44,70,0.24)_0%,rgba(37,53,80,0.14)_46%,rgba(30,44,70,0.24)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.06)_48%,transparent_62%)] opacity-45" />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#061B33]/75 via-[#061B33]/24 to-transparent" />
              <div className="absolute right-10 top-8 h-56 w-56 rounded-full bg-sky-300/18 blur-3xl" />
              <div className="absolute -left-8 bottom-5 h-28 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
            </div>

            <div className="relative z-10 flex h-full max-w-[100%] min-w-0 flex-col xl:max-w-[68%] 2xl:max-w-[62%]">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3] backdrop-blur-md">
                Gestionar formaciones
              </div>

              <div className="mt-6 space-y-2.5 xl:mt-8">
                <h1 className="text-[2.1rem] font-bold leading-[0.98] tracking-[-0.065em] text-white md:text-[2.35rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
                  Carga visual de <span className="text-[#5993B6]">alineaciones</span>
                </h1>

                <p className="font-brand max-w-[560px] text-[1.9rem] font-semibold leading-[0.96] tracking-[0.04em] text-white md:text-[2rem] xl:text-[2.25rem] 2xl:text-[2.55rem]">
                  titulares, suplentes y base previa
                </p>

                <p className="max-w-[560px] pt-2 text-[0.95rem] leading-5 text-white/78 xl:text-[1rem]">
                  Definí las formaciones del partido, reutilizá una base anterior y
                  validá la cancha antes de guardar.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 xl:pt-6 2xl:pt-8">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Volver al partido
                </Button>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-3 backdrop-blur-md">
                  <span className="block text-[14px] font-black leading-none tracking-[0.04em] text-white">
                    {faseLabel}
                  </span>
                  <span className="text-[11px] font-semibold leading-4 text-white/72">
                    {fechaTexto}
                  </span>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-[-4px] right-[0px] z-20 hidden h-[356px] w-[560px] xl:block 2xl:bottom-[0px] 2xl:right-[6px] 2xl:h-[420px] 2xl:w-[660px]">
              <div className="absolute inset-0 rounded-[44px] bg-[radial-gradient(circle_at_center,rgba(89,147,182,0.16),transparent_68%)] blur-[20px]" />
              <DesktopMatchVersusHero
                localSlug={localCodigo}
                visitanteSlug={visitanteCodigo}
                variant="inline"
              />
            </div>
          </section>
        </section>

        {isLiveLocked ? (
          <div className="rounded-2xl border border-[#FAB438]/35 bg-[#FAB438]/12 px-4 py-3 text-sm font-medium text-[#FFE3A1]">
            El partido está en juego. La edición manual de formaciones queda bloqueada
            hasta que salga de ese estado.
          </div>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.32fr)_320px] xl:items-start">
          <div className={`space-y-4 ${isLiveLocked ? "pointer-events-none opacity-60" : ""}`}>
            <div className="grid gap-4 xl:grid-cols-2">
              <LineupEditorCard
                title={localNombre}
                teamCode={localCodigo}
                lineup={alineacionLocal}
                squad={localPlantel}
                onChange={onChangeLocal}
                previousLineup={previousLocalLineup}
                previousMatchLabel={previousLocalLabel}
                onApplyPrevious={previousLocalLineup ? onApplyPreviousLocal : undefined}
                compactPlayers
              />

              <LineupEditorCard
                title={visitanteNombre}
                teamCode={visitanteCodigo}
                lineup={alineacionVisitante}
                squad={visitantePlantel}
                onChange={onChangeVisitante}
                previousLineup={previousVisitanteLineup}
                previousMatchLabel={previousVisitanteLabel}
                onApplyPrevious={previousVisitanteLineup ? onApplyPreviousVisitante : undefined}
                compactPlayers
              />
            </div>

            <section className={`${DASHBOARD_PANEL} rounded-[30px] p-4 md:p-5`}>
              <div className={DASHBOARD_TOP_LINE}>
                <div className={DASHBOARD_TOP_LINE_INNER} />
                <div className={DASHBOARD_TOP_LINE_SWEEP} />
                <div className={DASHBOARD_TOP_LINE_GLOW} />
                <div className={DASHBOARD_TOP_LINE_HAIR} />
              </div>

              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
                <div className="space-y-3">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                    Cierre del flujo
                  </p>
                  <div className={`${DASHBOARD_SUBCARD} rounded-[24px] p-4`}>
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#5993B6]/18 text-[#AEEBFF]">
                        <ClipboardList className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-base font-bold text-white">Checklist previo a guardar</p>
                        <ul className="mt-2 space-y-1 text-sm text-white/68">
                          <li>11 titulares por selección.</li>
                          <li>Suplentes listos para incidencias y resultado.</li>
                          <li>Formación y entrenador visibles en la cancha.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 xl:items-end">
                  <Button
                    variant="outline"
                    onClick={onCancel}
                    className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={onSave}
                    disabled={!canEdit || isLiveLocked || saving}
                    className="rounded-2xl bg-[#FAB438] text-[#1E2C46] hover:bg-[#F7C45A]"
                  >
                    {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {saving ? "Guardando..." : "Guardar formaciones"}
                  </Button>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <SummaryCard>
              <div className="space-y-1">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                  Resumen lateral
                </p>
                <p className="text-sm leading-6 text-white/68">
                  Lectura rápida del estado de la carga y de los planteles disponibles.
                </p>
              </div>

              <MetricCard
                icon={<ShieldCheck className="h-4.5 w-4.5" />}
                title="Estado general"
                detail={isLiveLocked ? "Bloqueado por partido en juego" : "Listo para editar"}
                value={isLiveLocked ? "LOCK" : "OK"}
                tone="text-[#84F0C8] bg-[#84F0C8]/12"
              />
              <MetricCard
                icon={<Users className="h-4.5 w-4.5" />}
                title="Titulares"
                detail="Jugadores ya ubicados"
                value={String(totalTitulares)}
                tone="text-[#AEEBFF] bg-[#5993B6]/18"
              />
              <MetricCard
                icon={<Users className="h-4.5 w-4.5" />}
                title="Suplentes"
                detail="Banco cargado"
                value={String(totalSuplentes)}
                tone="text-[#FFE4A3] bg-[#FAB438]/14"
              />
            </SummaryCard>

            <SummaryCard>
              <div className="space-y-1">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                  Bases reutilizables
                </p>
                <p className="text-sm leading-6 text-white/68">
                  Cada equipo puede arrancar desde una formación anterior si existe.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
                  {localNombre}
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {previousLocalLabel ?? "Sin base anterior"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
                  {visitanteNombre}
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {previousVisitanteLabel ?? "Sin base anterior"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-white/68">
                Accesos rápidos:
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.12]"
                  >
                    <Link href={`/admin/partidos/${partidoId}`}>Ver detalle</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.12]"
                  >
                    <Link href={`/admin/partidos/${partidoId}/resultado`}>Cargar resultado</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.12]"
                  >
                    <Link href={`/admin/paises/${partido.seleccionLocalId}/plantel`}>
                      Plantel {localNombre}
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.12]"
                  >
                    <Link href={`/admin/paises/${partido.seleccionVisitanteId}/plantel`}>
                      Plantel {visitanteNombre}
                    </Link>
                  </Button>
                </div>
              </div>
            </SummaryCard>
          </aside>
        </div>
      </div>
    </main>
  );
}

function SummaryCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.05] p-4">
      <div className={DASHBOARD_TOP_LINE}>
        <div className={DASHBOARD_TOP_LINE_INNER} />
        <div className={DASHBOARD_TOP_LINE_SWEEP} />
        <div className={DASHBOARD_TOP_LINE_GLOW} />
        <div className={DASHBOARD_TOP_LINE_HAIR} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.08),transparent_28%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="relative space-y-4">{children}</div>
    </div>
  );
}

function MetricCard({
  icon,
  title,
  detail,
  value,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.05] px-3 py-3 xl:px-3.5">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${tone}`}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-[13px] font-black leading-4 text-white">{title}</span>
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
