"use client";

import { useState } from "react";
import { Building2, Clock3, Eye, Trophy, UsersRound } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlagImage } from "@/components/ui/flag-image";
import { Fase, Seleccion } from "@/features/partidos/types/types";
import { PronosticoDialog } from "@/features/pronosticos/components/PronosticoDialog";
import { useCountdownNow } from "@/features/pronosticos/hooks/useCountdownNow";
import { useCan } from "@/hooks/useCan";
import {
  formatMatchHour,
  getEstadioCiudad,
  getFaseNombre,
  getGrupoNombre,
  getMatchStatusMeta,
  getPredictionCountdownLabel,
  getPredictionStatusMeta,
  getSeleccionResumen,
  isPredictionBlocked,
  PartidoConRelaciones,
  PREDICTION_CLOSE_MINUTES_BEFORE,
  SeleccionResumen,
} from "@/features/partidos/utils/partidos-ui.helpers";

type PartidoCardProps = {
  partido: PartidoConRelaciones;
  selecciones: Seleccion[];
  fases: Fase[];
  onVerDetalle?: () => void;
  onGestionarResultado?: () => void;
  onCargarFormaciones?: () => void;
  allowPronostico?: boolean;
  onPronosticoSaved?: () => void | Promise<void>;
  onPronosticarClick?: (partido: PartidoConRelaciones) => void;
  highlighted?: boolean;
  compact?: boolean;
};

export function PartidoCard({
  partido,
  selecciones,
  fases,
  onVerDetalle,
  onGestionarResultado,
  onCargarFormaciones,
  allowPronostico = false,
  onPronosticoSaved,
  onPronosticarClick,
  highlighted = false,
  compact = false,
}: PartidoCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const now = useCountdownNow();
  const canViewPartidoDetalle = useCan("partidos", "ver_detalle");

  const local = getSeleccionResumen(partido, "local", selecciones);
  const visitante = getSeleccionResumen(partido, "visitante", selecciones);
  const fase = getFaseNombre(partido, fases);
  const grupo = getGrupoNombre(partido);
  const estadioCiudad = getEstadioCiudad(partido);
  const hora = formatMatchHour(partido.fecha);
  const resultado = partido.resultado;
  const partidoActivo = partido.activo !== false;
  const tieneResultadoEnJuego =
    resultado?.estado === "EN_JUEGO" || resultado?.estado === "ENTRETIEMPO";
  const tieneResultadoFinal = resultado?.estado === "FINALIZADO";
  const matchStatus = getMatchStatusMeta(partido);
  const miPronostico = partido.miPrediccion;

  const score =
    resultado && (tieneResultadoEnJuego || tieneResultadoFinal)
      ? `${resultado.golesLocal} - ${resultado.golesVisitante}`
      : null;

  const pronosticoCerrado = isPredictionBlocked(
    partido,
    PREDICTION_CLOSE_MINUTES_BEFORE,
    now,
  );
  const pronosticoBloqueado =
    pronosticoCerrado || tieneResultadoFinal || !partidoActivo;
  const predictionStatus = getPredictionStatusMeta(
    partido,
    now,
    PREDICTION_CLOSE_MINUTES_BEFORE,
  );

  const countdownLabel =
    allowPronostico && !tieneResultadoFinal
      ? getPredictionCountdownLabel(
          partido.fecha,
          PREDICTION_CLOSE_MINUTES_BEFORE,
          now,
        )
      : null;

  const secondaryActionButtonClassName =
    "h-8 rounded-xl border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900";

  return (
    <article
      data-highlighted={highlighted ? "true" : undefined}
      data-partido-id={partido.id}
      className={
        compact
          ? "group relative overflow-hidden rounded-[1.35rem] bg-transparent transition-all duration-200"
          : "group relative overflow-hidden rounded-[1.65rem] border border-slate-200/90 bg-gradient-to-br from-white via-white to-slate-50 shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#008C93]/35 hover:shadow-[0_22px_50px_rgba(15,23,42,0.14)]"
      }
    >
      <div
        className={
          compact
            ? `rounded-[1.35rem] px-1 py-4 transition-all duration-200 ${
                highlighted
                  ? "bg-[#008C93]/8 ring-2 ring-[#008C93]/35"
                  : "bg-transparent"
              }`
            : highlighted
              ? "rounded-[1.65rem] ring-2 ring-[#008C93]/35 ring-offset-2 ring-offset-white"
              : ""
        }
      >
        {!compact ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#008C93] via-[#00A6B2] to-[#7DD3FC]" />
        ) : null}

        <div className={compact ? "px-3 md:px-4" : "p-4 md:p-5"}>
          <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
            <TeamSlot team={local} side="local" />

            <div className="flex items-center justify-center">
              <div
                className={
                  compact
                    ? "flex min-w-[104px] flex-col items-center justify-center rounded-2xl border border-[#008C93]/12 bg-gradient-to-b from-[#F1FCFD] via-white to-[#F8FBFD] px-4 py-3"
                    : "flex min-w-[104px] flex-col items-center justify-center rounded-2xl border border-[#008C93]/15 bg-gradient-to-b from-[#E8FBFC] via-white to-[#F7FAFC] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
                }
              >
                <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#008C93]/70">
                  {score ? "Resultado" : "Hora"}
                </span>

                <p className="text-3xl font-black leading-none tracking-[-0.04em] text-slate-950 md:text-[2.15rem]">
                  {score ?? hora}
                </p>

                {(tieneResultadoEnJuego || tieneResultadoFinal) && (
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                    {matchStatus.label}{" "}
                    {tieneResultadoEnJuego && resultado?.tiempoJuego
                      ? `${resultado.tiempoJuego}'`
                      : ""}
                  </span>
                )}
              </div>
            </div>

            <TeamSlot team={visitante} side="visitante" />
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-slate-200/80 pt-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm font-medium text-slate-600 lg:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/80 px-2.5 py-1 text-slate-700">
                <Trophy className="h-3.5 w-3.5 text-[#008C93]" />
                {fase}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/80 px-2.5 py-1 text-slate-700">
                <UsersRound className="h-3.5 w-3.5 text-[#008C93]" />
                {grupo}
              </span>

              {estadioCiudad ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/80 px-2.5 py-1 text-slate-700">
                  <Building2 className="h-3.5 w-3.5 text-[#008C93]" />
                  {estadioCiudad}
                </span>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
              {!partidoActivo ? (
                <Badge
                  variant="secondary"
                  className="h-8 rounded-full px-3 text-xs font-medium"
                >
                  Inactivo
                </Badge>
              ) : null}

              {miPronostico ? (
                <Badge
                  variant="secondary"
                  className="h-8 rounded-full bg-green-50 px-3 text-xs font-medium text-green-700"
                >
                  Mi pronostico: {miPronostico.golesLocal} -{" "}
                  {miPronostico.golesVisitante}
                </Badge>
              ) : null}

              {countdownLabel ? (
                <Badge
                  variant="secondary"
                  className={`h-8 rounded-full px-3 text-xs font-medium ${
                    pronosticoCerrado
                      ? "bg-amber-50 text-amber-700"
                      : "bg-sky-50 text-sky-700"
                  }`}
                >
                  <Clock3 className="mr-1 h-3.5 w-3.5" />
                  {countdownLabel}
                </Badge>
              ) : null}

              {allowPronostico && canViewPartidoDetalle ? (
                onVerDetalle ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onVerDetalle}
                    className={secondaryActionButtonClassName}
                  >
                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                    Ver detalles
                  </Button>
                ) : (
                  <Button
                    asChild
                    type="button"
                    variant="outline"
                    size="sm"
                    className={secondaryActionButtonClassName}
                  >
                    <Link href={`/admin/partidos/${partido.id}`}>
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      Ver detalles
                    </Link>
                  </Button>
                )
              ) : null}

              {allowPronostico && !tieneResultadoFinal ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (pronosticoBloqueado) return;

                    if (onPronosticarClick) {
                      onPronosticarClick(partido);
                      return;
                    }

                    setDialogOpen(true);
                  }}
                  disabled={pronosticoBloqueado}
                  className="h-8 rounded-xl bg-[#39A935] px-3 text-xs text-white hover:bg-[#247A28] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                >
                  {predictionStatus.label === "Pronostico cerrado" ||
                  predictionStatus.label === "Partido iniciado"
                    ? predictionStatus.label
                    : miPronostico
                      ? "Editar pronostico"
                      : "Pronosticar"}
                </Button>
              ) : null}

              {!allowPronostico && onVerDetalle ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onVerDetalle}
                  className={secondaryActionButtonClassName}
                >
                  Ver detalle
                </Button>
              ) : null}

              {!allowPronostico && onCargarFormaciones ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCargarFormaciones}
                  className={secondaryActionButtonClassName}
                >
                  Cargar Formaciones
                </Button>
              ) : null}

              {!allowPronostico && onGestionarResultado ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onGestionarResultado}
                  className={secondaryActionButtonClassName}
                >
                  Cargar Resultado
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {allowPronostico && !onPronosticarClick ? (
        <PronosticoDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          partido={partido}
          onSaved={async () => {
            await onPronosticoSaved?.();
          }}
        />
      ) : null}
    </article>
  );
}

function TeamSlot({
  team,
  side,
}: {
  team: SeleccionResumen;
  side: "local" | "visitante";
}) {
  const isLocal = side === "local";

  return (
    <div
      className={`flex min-w-0 items-center justify-center gap-2 ${
        isLocal ? "md:justify-end" : "md:justify-start"
      }`}
    >
      {isLocal ? (
        <p className="max-w-[150px] truncate text-base font-extrabold tracking-[-0.02em] text-slate-950 md:max-w-[220px] md:text-[1.08rem]">
          {team.nombre}
        </p>
      ) : null}

      <TeamFlag
        bandera={team.bandera}
        codigo={team.codigo}
        nombre={team.nombre}
      />

      {!isLocal ? (
        <p className="max-w-[150px] truncate text-base font-extrabold tracking-[-0.02em] text-slate-950 md:max-w-[220px] md:text-[1.08rem]">
          {team.nombre}
        </p>
      ) : null}
    </div>
  );
}

function TeamFlag({
  bandera,
  codigo,
  nombre,
}: {
  bandera?: string | null;
  codigo?: string | null;
  nombre: string;
}) {
  return (
    <FlagImage
      bandera={bandera}
      codigo={codigo}
      nombre={nombre}
      widthClassName="w-12"
      heightClassName="h-9"
      fallbackMode="dash"
      fallbackTextClassName="text-lg"
    />
  );
}
