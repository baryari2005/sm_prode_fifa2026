"use client";

import { useMemo } from "react";
import { Clock3, Eye, MapPin } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FlagImage } from "@/components/ui/flag-image";
import { Input } from "@/components/ui/input";
import {
  formatMatchHour,
  getEstadioCiudad,
  getPredictionCountdownLabel,
  isPredictionBlocked,
} from "@/features/partidos/utils/partidos-ui.helpers";
import { useCountdownNow } from "@/features/pronosticos/hooks/useCountdownNow";
import {
  DASHBOARD_PANEL,
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import { useCan } from "@/hooks/useCan";
import type {
  PartidoPronosticoRapido,
  PronosticoRapidoField,
  PronosticoRapidoValue,
} from "@/features/pronosticos/types/pronostico-rapido.types";

type PronosticoRapidoDashboardMatchCardProps = {
  partido: PartidoPronosticoRapido;
  value: PronosticoRapidoValue;
  error?: string;
  onScoreChange: (
    partidoId: string,
    field: PronosticoRapidoField,
    value: string,
  ) => void;
};

export function PronosticoRapidoDashboardMatchCard({
  partido,
  value,
  error,
  onScoreChange,
}: PronosticoRapidoDashboardMatchCardProps) {
  const canViewPartidoDetalle = useCan("partidos", "ver_detalle");
  const partidoFinalizado = partido.resultado?.estado === "FINALIZADO";
  const referenceNow = useMemo(() => {
    const evaluatedAt = partido.predictionMeta?.evaluatedAt;
    return evaluatedAt ? new Date(evaluatedAt).getTime() : null;
  }, [partido.predictionMeta?.evaluatedAt]);
  const now = useCountdownNow(referenceNow);
  const closed = isPredictionBlocked(partido, undefined, now);
  const hora = formatMatchHour(partido.fecha);
  const countdownLabel = getPredictionCountdownLabel(partido, undefined, now);
  const estadioCiudad = getEstadioCiudad(partido);
  const pronosticoAnterior =
    partido.miPrediccion ?? partido.pronostico ?? partido.prediccion ?? null;
  const pronosticoAnteriorLabel =
    pronosticoAnterior?.golesLocal !== null &&
    pronosticoAnterior?.golesLocal !== undefined &&
    pronosticoAnterior?.golesVisitante !== null &&
    pronosticoAnterior?.golesVisitante !== undefined
      ? `${pronosticoAnterior.golesLocal} - ${pronosticoAnterior.golesVisitante}`
      : null;
  const displayedLocalValue = partidoFinalizado
    ? String(partido.resultado?.golesLocal ?? "")
    : value.golesLocal;
  const displayedVisitanteValue = partidoFinalizado
    ? String(partido.resultado?.golesVisitante ?? "")
    : value.golesVisitante;

  return (
    <article className={`${DASHBOARD_PANEL} rounded-[28px] p-4`}>
      <div className={DASHBOARD_TOP_LINE}>
        <div className={DASHBOARD_TOP_LINE_INNER} />
        <div className={DASHBOARD_TOP_LINE_SWEEP} />
        <div className={DASHBOARD_TOP_LINE_GLOW} />
        <div className={DASHBOARD_TOP_LINE_HAIR} />
      </div>

      <div className="space-y-4">
        <div className={`${DASHBOARD_SUBCARD} rounded-[22px] px-4 py-3`}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] font-semibold text-white/74">
            <span className="inline-flex items-center gap-1.5 text-base font-black text-[#AEEBFF]">
              <Clock3 className="h-4.5 w-4.5" />
              {hora}
            </span>
            <span className="text-white/34">|</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4 text-[#AEEBFF]" />
              {countdownLabel}
            </span>
            {estadioCiudad ? (
              <>
                <span className="text-white/34">|</span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#AEEBFF]" />
                  {estadioCiudad}
                </span>
              </>
            ) : null}
            {pronosticoAnteriorLabel ? (
              <>
                <span className="text-white/34">|</span>
                <span className="text-[#AEEBFF]">
                  <span className="font-black uppercase tracking-[0.12em] text-white/54">
                    Pronostico anterior:
                  </span>{" "}
                  <span className="font-black">{pronosticoAnteriorLabel}</span>
                </span>
              </>
            ) : null}
          </div>
        </div>

        <div className={`${DASHBOARD_SUBCARD} rounded-[24px] p-4`}>
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_150px_minmax(0,1fr)] md:items-center">
            <EquipoColumn
              align="left"
              nombre={partido.seleccionLocal?.nombre ?? "Equipo local"}
              bandera={partido.seleccionLocal?.bandera}
              codigo={partido.seleccionLocal?.codigo}
            />

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <Input
                value={displayedLocalValue}
                disabled={closed || partidoFinalizado}
                inputMode="numeric"
                maxLength={2}
                onChange={(event) =>
                  onScoreChange(partido.id, "golesLocal", event.target.value)
                }
                className={[
                  "h-12 rounded-2xl text-center text-lg font-black placeholder:text-white/28 disabled:opacity-60",
                  partidoFinalizado
                    ? "border-emerald-300/20 bg-emerald-300/14 text-emerald-100"
                    : "border-white/10 bg-white/10 text-white",
                ].join(" ")}
              />
              <span className="font-brand text-[1.8rem] leading-none text-white/68">
                vs
              </span>
              <Input
                value={displayedVisitanteValue}
                disabled={closed || partidoFinalizado}
                inputMode="numeric"
                maxLength={2}
                onChange={(event) =>
                  onScoreChange(partido.id, "golesVisitante", event.target.value)
                }
                className={[
                  "h-12 rounded-2xl text-center text-lg font-black placeholder:text-white/28 disabled:opacity-60",
                  partidoFinalizado
                    ? "border-emerald-300/20 bg-emerald-300/14 text-emerald-100"
                    : "border-white/10 bg-white/10 text-white",
                ].join(" ")}
              />
            </div>

            <EquipoColumn
              align="right"
              nombre={partido.seleccionVisitante?.nombre ?? "Equipo visitante"}
              bandera={partido.seleccionVisitante?.bandera}
              codigo={partido.seleccionVisitante?.codigo}
            />
          </div>

          {canViewPartidoDetalle ? (
            <div className="mt-4 flex justify-end border-t border-white/10 pt-4">
              <Button
                asChild
                type="button"
                variant="outline"
                size="sm"
                className="h-9 rounded-full border-white/12 bg-white/[0.08] px-4 text-sm font-semibold text-white shadow-none hover:bg-white/[0.14] hover:text-white"
              >
                <Link href={`/admin/partidos/${partido.id}`}>
                  <Eye className="mr-1.5 h-4 w-4" />
                  Ver detalles
                </Link>
              </Button>
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="rounded-[20px] border border-rose-300/20 bg-rose-300/12 px-4 py-3 text-sm font-semibold text-rose-100">
            {error}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function EquipoColumn({
  nombre,
  bandera,
  codigo,
  align,
}: {
  nombre: string;
  bandera?: string | null;
  codigo?: string | null;
  align: "left" | "right";
}) {
  const isRight = align === "right";

  return (
    <div
      className={[
        "min-w-0",
        isRight ? "text-right" : "text-left",
      ].join(" ")}
    >
      <p className="text-xs font-black uppercase tracking-[0.2em] text-white/46">
        {isRight ? "Visitante" : "Local"}
      </p>
      <div
        className={[
          "mt-2 flex items-center gap-3",
          isRight ? "justify-end" : "justify-start",
        ].join(" ")}
      >
        {!isRight ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/10">
            <FlagImage
              bandera={bandera}
              codigo={codigo}
              nombre={nombre}
              widthClassName="w-8"
              heightClassName="h-6"
              fallbackMode="emoji"
              fallbackTextClassName="text-lg"
            />
          </div>
        ) : null}

        <p className="truncate text-lg font-black text-white xl:text-xl">{nombre}</p>

        {isRight ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/10">
            <FlagImage
              bandera={bandera}
              codigo={codigo}
              nombre={nombre}
              widthClassName="w-8"
              heightClassName="h-6"
              fallbackMode="emoji"
              fallbackTextClassName="text-lg"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
