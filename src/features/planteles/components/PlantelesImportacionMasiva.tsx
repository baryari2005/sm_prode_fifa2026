"use client";

import { useEffect, useMemo, useState } from "react";
import { CirclePlus, RefreshCw, Sigma, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";
import { DASHBOARD_PANEL, DASHBOARD_SUBCARD, DASHBOARD_TOP_LINE, DASHBOARD_TOP_LINE_GLOW, DASHBOARD_TOP_LINE_HAIR, DASHBOARD_TOP_LINE_INNER, DASHBOARD_TOP_LINE_SWEEP } from "@/features/dashboard/components/home/dashboard-home.styles";
import { ImportacionMetricCard } from "@/features/importaciones/components/ImportacionMetricCard";

type ImportSummary = {
  seleccionId: string;
  seleccionNombre?: string | null;
  coach?: string | null;
  success: boolean;
  imported: number;
  cleared: number;
  message?: string | null;
};

type IgnoredImportRow = {
  reason: "missing_player_name" | "missing_selection_match";
  rowCount: number;
  selectionName?: string | null;
  selectionCode?: string | null;
};

export type ImportResponse = {
  message?: string;
  meta?: {
    importedSelections?: number;
    importedPlayers?: number;
    failedSelections?: number;
    ignoredRowsCount?: number;
    ignoredRows?: IgnoredImportRow[];
    summaries?: ImportSummary[];
  };
};

type PlantelesImportacionMasivaProps = {
  result: ImportResponse | null;
  retryingFailed?: boolean;
  onRetryFailed?: () => void;
};

type SeleccionLookup = {
  id: string;
  nombre?: string | null;
};

type SeleccionesResponse = {
  data?: SeleccionLookup[];
};

export function PlantelesImportacionMasiva({
  result,
  retryingFailed = false,
  onRetryFailed,
}: PlantelesImportacionMasivaProps) {
  const [selectionNamesById, setSelectionNamesById] = useState<Record<string, string>>({});
  const summaries = useMemo(
    () => result?.meta?.summaries ?? [],
    [result?.meta?.summaries],
  );
  const successCount = result?.meta?.importedSelections ?? 0;
  const importedPlayers = result?.meta?.importedPlayers ?? 0;
  const failedCount = result?.meta?.failedSelections ?? 0;
  const ignoredRows = result?.meta?.ignoredRows ?? [];
  const ignoredRowsCount = result?.meta?.ignoredRowsCount ?? 0;
  const statusLabel =
    result?.message ?? "Todavía no se ejecutó la importación masiva.";
  const failedSummaries = useMemo(
    () => summaries.filter((item) => !item.success),
    [summaries],
  );
  const canRetryFailed = failedSummaries.some(
    (item) => !item.seleccionId.startsWith("missing-"),
  );

  useEffect(() => {
    const missingNameIds = Array.from(
      new Set(
        failedSummaries
          .filter((item) => !item.seleccionNombre)
          .map((item) => item.seleccionId),
      ),
    );

    if (missingNameIds.length === 0) {
      return;
    }

    let cancelled = false;

    async function loadSelectionNames() {
      try {
        const response = await axiosInstance.get<SeleccionesResponse>(
          "/paises?page=1&pageSize=200&sortBy=nombre&sortDir=asc",
          {
            headers: {
              "Cache-Control": "no-cache",
            },
          },
        );

        if (cancelled) {
          return;
        }

        const nextEntries = (response.data.data ?? []).reduce<Record<string, string>>(
          (accumulator, item) => {
            if (item.id && item.nombre) {
              accumulator[item.id] = item.nombre;
            }

            return accumulator;
          },
          {},
        );

        setSelectionNamesById((current) => ({
          ...current,
          ...nextEntries,
        }));
      } catch (error) {
        console.error(error);
      }
    }

    void loadSelectionNames();

    return () => {
      cancelled = true;
    };
  }, [failedSummaries]);

  function getSelectionDisplayName(item: ImportSummary) {
    return (
      item.seleccionNombre ??
      selectionNamesById[item.seleccionId] ??
      `Seleccion ${item.seleccionId.slice(0, 8)}`
    );
  }

  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ImportacionMetricCard
          icon={<Sigma className="h-4.5 w-4.5" />}
          toneClassName="bg-[#5993B6]/18 text-[#AEEBFF]"
          title="Selecciones importadas"
          detail="Lotes procesados correctamente"
          value={successCount}
        />
        <ImportacionMetricCard
          icon={<CirclePlus className="h-4.5 w-4.5" />}
          toneClassName="bg-emerald-400/14 text-emerald-200"
          title="Jugadores cargados"
          detail="Convocados agregados al sistema"
          value={importedPlayers}
        />
        <ImportacionMetricCard
          icon={<TriangleAlert className="h-4.5 w-4.5" />}
          toneClassName="bg-[#FAB438]/14 text-[#FFE4A3]"
          title="Selecciones con error"
          detail="Casos que requieren revision"
          value={failedCount}
        />
        <ImportacionMetricCard
          icon={<TriangleAlert className="h-4.5 w-4.5" />}
          toneClassName="bg-white/12 text-white"
          title="Filas omitidas"
          detail="Registros descartados del archivo"
          value={ignoredRowsCount}
        />
      </section>

      <section className={`${DASHBOARD_PANEL} rounded-[28px] p-4`}>
        <div className={DASHBOARD_TOP_LINE}>
          <div className={DASHBOARD_TOP_LINE_INNER} />
          <div className={DASHBOARD_TOP_LINE_SWEEP} />
          <div className={DASHBOARD_TOP_LINE_GLOW} />
          <div className={DASHBOARD_TOP_LINE_HAIR} />
        </div>
        <div className="relative z-10 space-y-2">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
            Estado
          </p>
          <p className="text-sm leading-6 text-white/72">{statusLabel}</p>
          <p className="text-xs leading-5 text-white/46">
            Esta pantalla ejecuta la importacion en serie y maneja pausas con reintentos cuando la API responde rate limit.
          </p>
        </div>
      </section>

      {failedSummaries.length > 0 ? (
        <section className={`${DASHBOARD_PANEL} rounded-[28px] p-4`}>
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>

          <div className="relative z-10 space-y-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                Selecciones con error
              </p>
              <p className="mt-2 text-sm leading-6 text-white/68">
                Estas selecciones no pudieron importar su plantel en esta corrida.
              </p>
            </div>

            {canRetryFailed && onRetryFailed ? (
              <div className="flex justify-start">
                <Button
                  type="button"
                  onClick={onRetryFailed}
                  disabled={retryingFailed}
                  className="rounded-2xl bg-[#FAB438] font-semibold text-[#1E2C46] hover:bg-[#F7C45A]"
                >
                  <RefreshCw
                    className={`mr-2 h-4 w-4 ${retryingFailed ? "animate-spin" : ""}`}
                  />
                  {retryingFailed ? "Reintentando errores..." : "Reintentar selecciones con error"}
                </Button>
              </div>
            ) : null}

            <div className="grid gap-3 xl:grid-cols-2">
              {failedSummaries.map((item) => (
                <article
                  key={`failed-${item.seleccionId}`}
                  className={`rounded-[24px] p-4 ${DASHBOARD_SUBCARD}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-black text-white">
                        {getSelectionDisplayName(item)}
                      </p>
                      {item.coach ? (
                        <p className="mt-1 text-xs font-semibold text-[#AEEBFF]">
                          DT: {item.coach}
                        </p>
                      ) : null}
                      <p className="mt-1 break-words text-sm text-white/64">
                        {item.message ?? "La API devolvio un error sin detalle adicional."}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="rounded-full border-rose-400/20 bg-rose-400/14 text-rose-100"
                    >
                      Error
                    </Badge>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {ignoredRows.length > 0 ? (
        <section className={`${DASHBOARD_PANEL} rounded-[28px] p-4`}>
          <div className={DASHBOARD_TOP_LINE}>
            <div className={DASHBOARD_TOP_LINE_INNER} />
            <div className={DASHBOARD_TOP_LINE_SWEEP} />
            <div className={DASHBOARD_TOP_LINE_GLOW} />
            <div className={DASHBOARD_TOP_LINE_HAIR} />
          </div>

          <div className="relative z-10 space-y-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                Filas omitidas
              </p>
              <p className="mt-2 text-sm leading-6 text-white/68">
                Estas filas no se importaron porque les faltaban datos clave o no se pudo asociar la seleccion.
              </p>
            </div>

            <div className="grid gap-3 xl:grid-cols-2">
              {ignoredRows.map((item, index) => (
                <article
                  key={`ignored-${item.reason}-${item.selectionCode ?? item.selectionName ?? index}`}
                  className={`rounded-[24px] p-4 ${DASHBOARD_SUBCARD}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-black text-white">
                        {item.reason === "missing_player_name"
                          ? "Fila sin nombre de jugador"
                          : "Seleccion no encontrada"}
                      </p>
                      <p className="mt-1 break-words text-sm text-white/64">
                        {item.reason === "missing_player_name"
                          ? `Se omitieron ${item.rowCount} filas porque el Excel no traia nombreJugador o nombre.`
                          : `Se omitieron ${item.rowCount} filas para ${
                              item.selectionName ?? item.selectionCode ?? "una seleccion sin identificar"
                            }${
                              item.selectionCode ? ` (${item.selectionCode})` : ""
                            } porque no hubo match con una seleccion activa del sistema.`}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="rounded-full border-white/15 bg-white/10 text-white"
                    >
                      Omitida
                    </Badge>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className={`${DASHBOARD_PANEL} rounded-[28px] p-4`}>
        <div className={DASHBOARD_TOP_LINE}>
          <div className={DASHBOARD_TOP_LINE_INNER} />
          <div className={DASHBOARD_TOP_LINE_SWEEP} />
          <div className={DASHBOARD_TOP_LINE_GLOW} />
          <div className={DASHBOARD_TOP_LINE_HAIR} />
        </div>

        <div className="relative z-10 space-y-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
              Resumen por plantel
            </p>
            <p className="mt-2 text-sm leading-6 text-white/68">
              Abajo queda el detalle por seleccion con estado, jugadores importados y observaciones.
            </p>
          </div>

          {summaries.length > 0 ? (
            <div className="grid gap-3 xl:grid-cols-2">
              {summaries.map((item) => (
                <article
                  key={item.seleccionId}
                  className={`rounded-[24px] p-4 ${DASHBOARD_SUBCARD}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-black text-white">
                        {getSelectionDisplayName(item)}
                      </p>
                      {item.coach ? (
                        <p className="mt-1 text-xs font-semibold text-[#AEEBFF]">
                          DT: {item.coach}
                        </p>
                      ) : null}
                      <p className="mt-1 text-sm text-white/64">
                        {item.message ?? (item.success ? "Sin novedades" : "No disponible")}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        item.success
                          ? "rounded-full border-emerald-400/20 bg-emerald-400/14 text-emerald-100"
                          : "rounded-full border-rose-400/20 bg-rose-400/14 text-rose-100"
                      }
                    >
                      {item.success ? "Importado" : "Error"}
                    </Badge>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className={`rounded-2xl p-3 ${DASHBOARD_SUBCARD}`}>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                        Plantel anterior
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {item.cleared}
                      </p>
                    </div>
                    <div className={`rounded-2xl p-3 ${DASHBOARD_SUBCARD}`}>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                        Jugadores importados
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {item.imported}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={`rounded-[24px] p-6 text-center ${DASHBOARD_SUBCARD}`}>
              <p className="text-sm leading-6 text-white/64">
                Cuando ejecutes la importacion masiva, aca vas a ver el detalle por seleccion.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
