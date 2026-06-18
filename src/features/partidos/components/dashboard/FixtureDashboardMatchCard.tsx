"use client";

import { useMemo } from "react";
import { Clock3, MapPin, Network, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FlagImage } from "@/components/ui/flag-image";
import {
  DASHBOARD_PANEL,
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import { Seleccion } from "@/features/partidos/types/types";
import {
  formatMatchHour,
  getEstadioCiudad,
  getPredictionCountdownLabel,
  getSeleccionResumen,
  PartidoConRelaciones,
} from "@/features/partidos/utils/partidos-ui.helpers";
import { useCountdownNow } from "@/features/pronosticos/hooks/useCountdownNow";

type FixtureDashboardMatchCardProps = {
  partido: PartidoConRelaciones;
  selecciones: Seleccion[];
  onVerDetalle?: () => void;
  onGestionarResultado?: () => void;
  onCargarFormaciones?: () => void;
};

export function FixtureDashboardMatchCard({
  partido,
  selecciones,
  onVerDetalle,
  onGestionarResultado,
  onCargarFormaciones,
}: FixtureDashboardMatchCardProps) {
  const local = getSeleccionResumen(partido, "local", selecciones);
  const visitante = getSeleccionResumen(partido, "visitante", selecciones);
  const referenceNow = useMemo(() => {
    const evaluatedAt = partido.predictionMeta?.evaluatedAt;
    return evaluatedAt ? new Date(evaluatedAt).getTime() : null;
  }, [partido.predictionMeta?.evaluatedAt]);
  const now = useCountdownNow(referenceNow);
  const hora = formatMatchHour(partido.fecha);
  const estadioCiudad = getEstadioCiudad(partido);
  const cierre = getPredictionCountdownLabel(partido, undefined, now);
  const resultadoEnJuego =
    partido.resultado?.estado === "EN_JUEGO" ||
    partido.resultado?.estado === "ENTRETIEMPO";
  const resultadoFinalizado = partido.resultado?.estado === "FINALIZADO";
  const mostrarResultado = resultadoEnJuego || resultadoFinalizado;
  const estadoLabel = resultadoFinalizado
    ? "Partido finalizado"
    : resultadoEnJuego
      ? "Partido en juego"
      : null;
  const scoreClassName = resultadoFinalizado
    ? "border-[#FAB438]/24 bg-[#FAB438]/16 text-[#FFE4A3]"
    : "border-[#5993B6]/24 bg-[#5993B6]/18 text-[#AEEBFF]";

  return (
    <article className={`${DASHBOARD_PANEL} rounded-[28px] p-4`}>
      <div className={DASHBOARD_TOP_LINE}>
        <div className={DASHBOARD_TOP_LINE_INNER} />
        <div className={DASHBOARD_TOP_LINE_SWEEP} />
        <div className={DASHBOARD_TOP_LINE_GLOW} />
        <div className={DASHBOARD_TOP_LINE_HAIR} />
      </div>

      <div className="space-y-4">
        <div className={`${DASHBOARD_SUBCARD} rounded-[20px] px-4 py-3`}>
          <div className="flex flex-wrap items-center gap-3 text-[15px] font-semibold text-white/74">
            <span className="inline-flex items-center gap-1.5 text-base font-black text-[#AEEBFF]">
              <Clock3 className="h-4.5 w-4.5" />
              {hora}
            </span>
            <span className="text-white/34">|</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4 text-[#AEEBFF]" />
              {cierre}
            </span>
            {estadioCiudad ? (
              <>
                <span className="text-white/34">|</span>
                <span className="inline-flex min-w-0 items-center gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0 text-[#AEEBFF]" />
                  <span className="truncate">{estadioCiudad}</span>
                </span>
              </>
            ) : null}
            {estadoLabel ? (
              <>
                <span className="text-white/34">|</span>
                <span
                  className={[
                    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-black uppercase tracking-[0.14em]",
                    resultadoFinalizado
                      ? "border-[#FAB438]/28 bg-[#FAB438]/14 text-[#FFE4A3]"
                      : "border-[#5993B6]/28 bg-[#5993B6]/14 text-[#AEEBFF]",
                  ].join(" ")}
                >
                  {estadoLabel}
                </span>
              </>
            ) : null}
          </div>
        </div>

        <div className={`${DASHBOARD_SUBCARD} rounded-[24px] p-4`}>
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_150px_minmax(0,1fr)] md:items-center">
            <EquipoDashboardSlot align="left" nombre={local.nombre} bandera={local.bandera} codigo={local.codigo} />

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div
                className={[
                  "flex h-12 items-center justify-center rounded-2xl border font-black",
                  mostrarResultado
                    ? scoreClassName
                    : "border-white/10 bg-white/10 text-transparent",
                ].join(" ")}
              >
                {mostrarResultado ? partido.resultado?.golesLocal : "0"}
              </div>
              <span className="font-brand text-[1.8rem] leading-none text-white/68">vs</span>
              <div
                className={[
                  "flex h-12 items-center justify-center rounded-2xl border font-black",
                  mostrarResultado
                    ? scoreClassName
                    : "border-white/10 bg-white/10 text-transparent",
                ].join(" ")}
              >
                {mostrarResultado ? partido.resultado?.golesVisitante : "0"}
              </div>
            </div>

            <EquipoDashboardSlot
              align="right"
              nombre={visitante.nombre}
              bandera={visitante.bandera}
              codigo={visitante.codigo}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {mostrarResultado ? (
            <span
              className={[
                "inline-flex h-10 items-center rounded-full border px-4 text-sm font-semibold",
                resultadoFinalizado
                  ? "border-[#FAB438]/24 bg-[#FAB438]/12 text-[#FFE4A3]"
                  : "border-[#5993B6]/24 bg-[#5993B6]/12 text-[#AEEBFF]",
              ].join(" ")}
            >
              Resultado oficial cargado
            </span>
          ) : null}

          {onVerDetalle ? (
            <Button
              type="button"
              onClick={onVerDetalle}
              className="h-10 rounded-full bg-white/[0.08] px-4 text-sm font-semibold text-white shadow-none hover:bg-white/[0.14]"
            >
              Ver detalle
            </Button>
          ) : null}

          {onGestionarResultado ? (
            <Button
              type="button"
              onClick={onGestionarResultado}
              className="h-10 rounded-full bg-white/[0.08] px-4 text-sm font-semibold text-white shadow-none hover:bg-white/[0.14]"
            > 
              <TrendingUp className="w-4 h-4 ml-2"/>             
              Gestionar estadisticas
            </Button>
          ) : null}

          {onCargarFormaciones ? (
            <Button
              type="button"
              onClick={onCargarFormaciones}
              className="h-10 rounded-full bg-white/[0.08] px-4 text-sm font-semibold text-white shadow-none hover:bg-white/[0.14]"
            >
              <Network className="w-4 h-4 ml-2"/>
              Gestionar formaciones
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function EquipoDashboardSlot({
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
    <div className={isRight ? "min-w-0 text-right" : "min-w-0 text-left"}>
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
