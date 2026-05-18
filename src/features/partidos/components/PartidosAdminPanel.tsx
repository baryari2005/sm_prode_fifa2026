"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  CalendarPlus,
  ChevronDown,
  Download,
  RefreshCw,
  RotateCcw,
  Trophy,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import {
  actualizarResultadosDesdeApi,
  actualizarPartidosEnJuegoDesdeApi,
  generarCrucesPorFase,
} from "@/features/partidos/services/partidos.service";
import {
  FIXTURE_PHASE_OPTIONS,
  type FixturePhaseSlug,
} from "@/features/partidos/constants/fixture-phase-filter.constants";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PartidosAdminPanelProps = {
  canCrearPartidos: boolean;
  canActualizarResultados: boolean;
};

type SectionKey = "acciones" | "live" | "resultados" | "cruces";

const KNOCKOUT_PHASES: Array<{
  label: string;
  fase: Exclude<FixturePhaseSlug, "grupos">;
}> = [
  { label: "Dieciseisavos", fase: "dieciseisavos" },
  { label: "Octavos", fase: "octavos" },
  { label: "Cuartos", fase: "cuartos" },
  { label: "Semifinal", fase: "semis" },
  { label: "Tercer puesto", fase: "tercer-puesto" },
  { label: "Final", fase: "final" },
];

const DEFAULT_OPEN_SECTIONS: Record<SectionKey, boolean> = {
  acciones: true,
  live: true,
  resultados: true,
  cruces: true,
};

export function PartidosAdminPanel({
  canCrearPartidos,
  canActualizarResultados,
}: PartidosAdminPanelProps) {
  const [updatingResults, setUpdatingResults] = useState(false);
  const [updatingResultsPhase, setUpdatingResultsPhase] = useState<
    string | null
  >(null);
  const [syncingLive, setSyncingLive] = useState(false);
  const [generatingPhase, setGeneratingPhase] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] =
    useState<Record<SectionKey, boolean>>(DEFAULT_OPEN_SECTIONS);

  function togglePanelCollapse() {
    setCollapsed((prev) => !prev);
  }

  function toggleSection(section: SectionKey) {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }

  async function handleUpdateResults() {
    try {
      setUpdatingResults(true);
      const message = await actualizarResultadosDesdeApi(false);
      toast.success(message);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudieron actualizar los resultados"
      );
    } finally {
      setUpdatingResults(false);
    }
  }

  async function handleUpdateResultsByPhase(fase: FixturePhaseSlug) {
    try {
      setUpdatingResultsPhase(fase);
      const message = await actualizarResultadosDesdeApi(false, fase);
      toast.success(message);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudieron actualizar los resultados por fase"
      );
    } finally {
      setUpdatingResultsPhase(null);
    }
  }

  async function handleGenerateCruces(
    fase: Exclude<FixturePhaseSlug, "grupos">
  ) {
    try {
      setGeneratingPhase(fase);
      const message = await generarCrucesPorFase(fase);
      toast.success(message);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "No se pudieron generar cruces"
      );
    } finally {
      setGeneratingPhase(null);
    }
  }

  async function handleSyncLiveMatches() {
    try {
      setSyncingLive(true);
      const result = await actualizarPartidosEnJuegoDesdeApi();
      toast.success(result.message);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudieron sincronizar los partidos en juego"
      );
    } finally {
      setSyncingLive(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Card className="border-white/70 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl text-slate-950">
                Gestionar fixture
              </CardTitle>
              <CardDescription>
                Acciones operativas para importar, reconstruir y mantener el
                fixture del torneo.
              </CardDescription>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={togglePanelCollapse}
              className="rounded-2xl"
            >
              <ChevronDown
                className={[
                  "mr-2 h-4 w-4 transition-transform",
                  collapsed ? "-rotate-90" : "rotate-0",
                ].join(" ")}
              />
              {collapsed ? "Expandir panel" : "Colapsar panel"}
            </Button>
          </div>
        </CardHeader>

        {!collapsed && (
          <CardContent className="space-y-6 p-4 md:p-6">
            <CollapsibleSection
              title="Acciones principales"
              description="Importa, reinicia o crea partidos manualmente dentro del fixture."
              open={openSections.acciones}
              onToggle={() => toggleSection("acciones")}
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <ActionCard
                  title="Importar fixture API"
                  description="Carga o sincroniza partidos desde la API con detalle por partido."
                  href="/admin/partidos/importar"
                  icon={<Download className="h-5 w-5" />}
                />
                <ActionCard
                  title="Reset total mundial"
                  description="Borra selecciones, planteles, partidos, resultados y predicciones antes de reconstruir."
                  href="/admin/partidos/reimportar"
                  icon={<RotateCcw className="h-5 w-5" />}
                  danger
                />
                <ActionCard
                  title="Nuevo partido"
                  description="Crea un partido manualmente dentro del fixture."
                  href="/admin/partidos/nuevo"
                  icon={<CalendarPlus className="h-5 w-5" />}
                />
                <ActionButtonCard
                  title="Actualizar resultados"
                  description="Sincroniza marcadores finales desde la API sin tocar el fixture."
                  icon={<Trophy className="h-5 w-5" />}
                  disabled={!canActualizarResultados || updatingResults}
                  busy={updatingResults}
                  onClick={() => void handleUpdateResults()}
                />
              </div>
            </CollapsibleSection>

            <CollapsibleSection
              title="Auto-actualizacion de partidos en juego"
              description="Sincroniza partidos activos y deja listo el endpoint para un cron."
              open={openSections.live}
              onToggle={() => toggleSection("live")}
            >
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={() => void handleSyncLiveMatches()}
                  disabled={!canActualizarResultados || syncingLive}
                  className="rounded-2xl bg-[#39A935] text-white hover:bg-[#247A28]"
                >
                  {syncingLive ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sincronizando en vivo...
                    </>
                  ) : (
                    <>
                      <Trophy className="mr-2 h-4 w-4" />
                      Sincronizar partidos en juego
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                <p>
                  Endpoint recomendado para cron:{" "}
                  <code>/api/partidos/actualizar-en-juego-api</code>
                </p>
                <p className="mt-2">
                  Frecuencia sugerida: cada 5 minutos. Si definis{" "}
                  <code>CRON_SECRET</code>, el cron debe enviar el header{" "}
                  <code>x-cron-secret</code>.
                </p>
              </div>
            </CollapsibleSection>

            <CollapsibleSection
              title="Actualizar resultados por fase"
              description="Sincroniza resultados finales solo para la fase elegida."
              open={openSections.resultados}
              onToggle={() => toggleSection("resultados")}
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {FIXTURE_PHASE_OPTIONS.map((item) => (
                  <Button
                    key={`resultados-${item.slug}`}
                    type="button"
                    variant="outline"
                    onClick={() => void handleUpdateResultsByPhase(item.slug)}
                    disabled={
                      !canActualizarResultados || updatingResultsPhase !== null
                    }
                    className="h-11 justify-start rounded-2xl border-slate-200 bg-white px-4"
                  >
                    {updatingResultsPhase === item.slug ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trophy className="mr-2 h-4 w-4" />
                    )}
                    {item.label}
                  </Button>
                ))}
              </div>
            </CollapsibleSection>

            <CollapsibleSection
              title="Generar cruces"
              description="Ejecuta la generacion automatica de cruces a partir de la fase que necesites."
              open={openSections.cruces}
              onToggle={() => toggleSection("cruces")}
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {KNOCKOUT_PHASES.map((item) => (
                  <Button
                    key={item.fase}
                    type="button"
                    variant="outline"
                    onClick={() => void handleGenerateCruces(item.fase)}
                    disabled={!canCrearPartidos || generatingPhase !== null}
                    className="h-11 justify-start rounded-2xl border-slate-200 bg-white px-4"
                  >
                    {generatingPhase === item.fase ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Zap className="mr-2 h-4 w-4" />
                    )}
                    {item.label}
                  </Button>
                ))}
              </div>
            </CollapsibleSection>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

function CollapsibleSection({
  title,
  description,
  open,
  onToggle,
  children,
}: {
  title: string;
  description: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-600">{description}</p>
        </div>

        <ChevronDown
          className={[
            "mt-1 h-5 w-5 shrink-0 text-slate-500 transition-transform",
            open ? "rotate-0" : "-rotate-90",
          ].join(" ")}
        />
      </button>

      {open && <div className="mt-4">{children}</div>}
    </section>
  );
}

function ActionCard({
  title,
  description,
  href,
  icon,
  danger = false,
}: {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  danger?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-3xl border p-4 shadow-sm transition hover:shadow-md ${
        danger
          ? "border-rose-200 bg-rose-50/60 hover:bg-rose-50"
          : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
          danger ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700"
        }`}
      >
        {icon}
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
    </Link>
  );
}

function ActionButtonCard({
  title,
  description,
  icon,
  disabled,
  busy,
  onClick,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  disabled: boolean;
  busy: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:bg-slate-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
        {busy ? <RefreshCw className="h-5 w-5 animate-spin" /> : icon}
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
    </button>
  );
}
