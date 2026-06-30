"use client";

import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import Image from "next/image";
import {
  CalendarDays,
  Clock3,
  Info,
  RefreshCw,
  Save,
  TimerReset,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  BRAND_DIALOG_CANCEL_BUTTON_CLASSNAME,
  BRAND_DIALOG_CONTENT_CLASSNAME,
  BRAND_DIALOG_INPUT_CLASSNAME,
  BRAND_DIALOG_PRIMARY_BUTTON_CLASSNAME,
  BrandDialogFrame,
} from "@/components/ui/brand-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FlagImage } from "@/components/ui/flag-image";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DASHBOARD_PANEL,
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import {
  formatMatchHour,
  getPredictionCloseTimestamp,
  getPredictionCountdownLabel,
  hasMatchStartedForPrediction,
  isPredictionBlocked,
  isKnockoutPartido,
  PREDICTION_CLOSE_MINUTES_BEFORE,
  type PartidoConRelaciones,
} from "@/features/partidos/utils/partidos-ui.helpers";
import { KnockoutQualifierSelector } from "@/features/pronosticos/components/rapido/KnockoutQualifierSelector";
import { useCountdownNow } from "@/features/pronosticos/hooks/useCountdownNow";
import { upsertPronostico } from "@/features/pronosticos/services/pronosticos.service";
import { resolveTeamAsset } from "@/features/partidos/components/dashboard/team-assets";
import { resolveBanderaSrc } from "@/lib/flags";

type PronosticoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partido: PartidoConRelaciones | null;
  onSaved?: () => void | Promise<void>;
};

export function PronosticoDialog({
  open,
  onOpenChange,
  partido,
  onSaved,
}: PronosticoDialogProps) {
  const referenceNow = partido?.predictionMeta?.evaluatedAt
    ? new Date(partido.predictionMeta.evaluatedAt).getTime()
    : null;
  const now = useCountdownNow(referenceNow);

  const [golesLocal, setGolesLocal] = useState("0");
  const [golesVisitante, setGolesVisitante] = useState("0");
  const [equipoClasificadoId, setEquipoClasificadoId] = useState<string | null>(
    null,
  );
  const [saving, setSaving] = useState(false);

  const local = partido?.seleccionLocal;
  const visitante = partido?.seleccionVisitante;
  const miPronostico = partido?.miPrediccion;

  const pronosticoCerrado = partido
    ? isPredictionBlocked(partido, PREDICTION_CLOSE_MINUTES_BEFORE, now)
    : true;
  const partidoIniciado = partido
    ? hasMatchStartedForPrediction(partido)
    : false;
  const partidoFinalizado = partido?.resultado?.estado === "FINALIZADO";
  const bloqueado = pronosticoCerrado || partidoFinalizado || !partido;
  const cargaDeshabilitada = bloqueado || saving;
  const mostrarClasificado =
    partido &&
    isKnockoutPartido(partido) &&
    golesLocal !== "" &&
    golesLocal === golesVisitante;

  const countdownLabel = partido
    ? getPredictionCountdownLabel(
        partido,
        PREDICTION_CLOSE_MINUTES_BEFORE,
        now,
      )
    : "";

  const fechaPartidoLabel = useMemo(() => {
    if (!partido?.fecha) return "";

    return new Intl.DateTimeFormat("es-AR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(partido.fecha));
  }, [partido?.fecha]);

  const horaPartidoLabel = partido ? formatMatchHour(partido.fecha) : "";

  const fechaCierreLabel = useMemo(() => {
    if (!partido?.fecha) return "";

    const closeTimestamp = getPredictionCloseTimestamp(
      partido,
      PREDICTION_CLOSE_MINUTES_BEFORE,
    );

    return new Intl.DateTimeFormat("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(closeTimestamp));
  }, [partido]);

  useEffect(() => {
    if (!open || !partido) return;

    setGolesLocal(String(partido.miPrediccion?.golesLocal ?? 0));
    setGolesVisitante(String(partido.miPrediccion?.golesVisitante ?? 0));
    setEquipoClasificadoId(partido.miPrediccion?.equipoClasificadoId ?? null);
  }, [open, partido]);

  const setNumericValue = (
    value: string,
    setter: Dispatch<SetStateAction<string>>,
  ) => {
    const onlyNumbers = value.replace(/\D/g, "");

    if (onlyNumbers === "") {
      setter("0");
      return;
    }

    setter(String(Math.min(Number(onlyNumbers), 99)));
  };

  const increment = (
    value: string,
    setter: Dispatch<SetStateAction<string>>,
  ) => {
    setter(String(Math.min(Number(value || 0) + 1, 99)));
  };

  const decrement = (
    value: string,
    setter: Dispatch<SetStateAction<string>>,
  ) => {
    setter(String(Math.max(Number(value || 0) - 1, 0)));
  };

  const handleSubmit = async () => {
    if (!partido || bloqueado) return;

    if (mostrarClasificado && !equipoClasificadoId) {
      toast.error("Selecciona quien pasa por penales");
      return;
    }

    try {
      setSaving(true);

      await upsertPronostico({
        partidoId: partido.id,
        golesLocal: Number(golesLocal),
        golesVisitante: Number(golesVisitante),
        equipoClasificadoId: mostrarClasificado ? equipoClasificadoId : null,
      });

      toast.success("Pronostico guardado correctamente");

      await onSaved?.();
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrio un error al guardar el pronostico.";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (!partido) return null;

  const scoreCardClass = bloqueado
    ? "border-rose-300/18 bg-rose-500/10 opacity-85"
    : "border-white/10 bg-white/[0.08]";

  const statusCardClass = bloqueado
    ? "border-rose-300/18 bg-rose-500/12 text-rose-100"
    : "border-[#5993B6]/20 bg-[#5993B6]/10 text-[#AEEBFF]";

  const statusIconClass = bloqueado ? "text-rose-200" : "text-[#AEEBFF]";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={`${BRAND_DIALOG_CONTENT_CLASSNAME} w-[calc(100vw-1rem)] sm:max-w-[1100px]`}
      >
        <BrandDialogFrame className="rounded-[34px]">
          <div className="relative">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="absolute right-5 top-5 z-20 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-white/68 transition hover:bg-white/[0.14] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-4 p-3 sm:p-4">
              <section className={`${DASHBOARD_PANEL} rounded-[30px] p-3 md:p-4`}>
                <div className={DASHBOARD_TOP_LINE}>
                  <div className={DASHBOARD_TOP_LINE_INNER} />
                  <div className={DASHBOARD_TOP_LINE_SWEEP} />
                  <div className={DASHBOARD_TOP_LINE_GLOW} />
                  <div className={DASHBOARD_TOP_LINE_HAIR} />
                </div>

                <div className={`${DASHBOARD_SUBCARD} relative z-10 overflow-hidden rounded-[28px] p-5 md:p-6`}>
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.95fr)] xl:items-center">
                    <div className="space-y-4 pr-10">
                      {/* <div className="flex flex-wrap items-center gap-2">
                        <Badge className="rounded-full border-[#FAB438]/28 bg-[#FAB438]/12 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3] hover:bg-[#FAB438]/12">
                          Ver detalle
                        </Badge>
                        <Badge className="rounded-full border-white/10 bg-white/[0.06] text-white/74 hover:bg-white/[0.06]">
                          {faseLabel}
                        </Badge>
                      </div> */}

                      <div className="space-y-2">
                        <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.28em] text-[#AEEBFF]">                          
                          CARGA DE PRONÓSTICO
                        </p>

                        <DialogTitle className="text-[2rem] font-bold leading-[0.94] tracking-[-0.05em] text-white md:text-[2.5rem]">
                          Datos del <span className="text-[#5993B6]">encuentro</span>
                          {/* <br />
                          <span className="font-brand text-[2rem] tracking-[0.04em] md:text-[2.35rem]">
                            Estadísticas y seguimiento
                          </span> */}
                        </DialogTitle>

                        <p className="max-w-[520px] text-sm leading-6 text-white/78 md:text-[0.95rem]">
                          Revisá el cruce completo, validá estadísticas oficiales y
                          confirmá tu pronóstico desde el mismo panel.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-sm text-white/68">
                        <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2">
                          <Info className="h-4 w-4 text-[#AEEBFF]" />
                          Edición rápida del resultado del partido.
                        </span>
                        {miPronostico ? (
                          <Badge
                            className={`rounded-full px-4 py-2 text-xs font-black ${
                              bloqueado
                                ? "border border-rose-300/18 bg-rose-500/12 text-rose-100 hover:bg-rose-500/12"
                                : "border border-emerald-300/18 bg-emerald-400/14 text-emerald-100 hover:bg-emerald-400/14"
                            }`}
                          >
                            Pronostico actual: {miPronostico.golesLocal} -{" "}
                            {miPronostico.golesVisitante}
                          </Badge>
                        ) : null}
                      </div>
                    </div>

                    <div className="relative">
                      <div className="pointer-events-none absolute left-[29%] right-[14%] top-[34%] h-[3px] rotate-[-66deg] bg-[linear-gradient(90deg,transparent_0%,rgba(125,211,252,0.26)_16%,rgba(255,255,255,0.98)_50%,rgba(125,211,252,0.28)_84%,transparent_100%)] opacity-95 blur-[0.4px]" />
                      <div className="pointer-events-none absolute left-[30%] right-[15%] top-[34%] h-[44px] rotate-[-66deg] bg-[linear-gradient(90deg,transparent_0%,rgba(125,211,252,0.12)_16%,rgba(255,255,255,0.5)_50%,rgba(125,211,252,0.14)_84%,transparent_100%)] opacity-95 blur-[11px]" />
                      <div className="pointer-events-none absolute bottom-[11px] left-[5%] right-[5%] h-[34px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(18,115,56,0.58)_0%,rgba(41,166,87,0.5)_28%,rgba(74,222,128,0.34)_48%,rgba(145,220,184,0.18)_62%,transparent_100%)] blur-[4px]" />
                      <div className="pointer-events-none absolute bottom-[18px] left-[12%] right-[12%] h-[84px] rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(174,235,255,0.24)_0%,rgba(89,147,182,0.12)_40%,transparent_72%)] blur-[16px]" />
                      <div className="pointer-events-none absolute bottom-[10px] left-[8%] right-[8%] h-[12px] rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.02),rgba(255,255,255,0.18),rgba(255,255,255,0.02))] blur-[2px]" />
                      <div className="pointer-events-none absolute bottom-[18px] left-[10%] right-[10%] h-[16px] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_12px,transparent_12px,transparent_24px)] opacity-20 blur-[1.2px]" />

                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-3">
                        <HeroEscudoSlot
                          nombre={local?.nombre ?? "Local"}
                          bandera={local?.bandera}
                          codigo={local?.codigo}
                          tilt="left"
                        />

                        <div className="flex items-center justify-center">
                          <Image
                            src="/ui/vs.png"
                            alt="Versus"
                            width={180}
                            height={180}
                            unoptimized
                            className="h-[11rem] w-[11rem] max-w-none object-contain drop-shadow-[0_24px_36px_rgba(4,12,25,0.35)] md:h-[6rem] md:w-[6rem]"
                          />
                        </div>

                        <HeroEscudoSlot
                          nombre={visitante?.nombre ?? "Visitante"}
                          bandera={visitante?.bandera}
                          codigo={visitante?.codigo}
                          tilt="right"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className={`${DASHBOARD_PANEL} rounded-[30px] p-3 md:p-4`}>
                <div className={DASHBOARD_TOP_LINE}>
                  <div className={DASHBOARD_TOP_LINE_INNER} />
                  <div className={DASHBOARD_TOP_LINE_SWEEP} />
                  <div className={DASHBOARD_TOP_LINE_GLOW} />
                  <div className={DASHBOARD_TOP_LINE_HAIR} />
                </div>

                <div className="relative z-10 space-y-4">
                  <div className={`${DASHBOARD_SUBCARD} rounded-[24px] px-4 py-3`}>
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-black uppercase tracking-[0.12em] text-[#AEEBFF]">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4.5 w-4.5 text-[#FAB438]" />
                        <span className="capitalize">{fechaPartidoLabel}</span>
                      </span>
                      <span className="text-white/34">|</span>
                      <span className="inline-flex items-center gap-2">
                        <Clock3 className="h-4.5 w-4.5 text-[#AEEBFF]" />
                        {horaPartidoLabel} hs
                      </span>
                    </div>
                  </div>

                  <section
                    className={`${DASHBOARD_SUBCARD} rounded-[26px] border p-4 transition sm:p-5 ${scoreCardClass}`}
                  >
                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_150px_minmax(0,1fr)] md:items-center">
                      <TeamScoreControl
                        side="local"
                        name={local?.nombre ?? "Local"}
                        flag={local?.bandera}
                        code={local?.codigo}
                        value={golesLocal}
                        disabled={cargaDeshabilitada}
                        onChange={(value) => setNumericValue(value, setGolesLocal)}
                        onIncrement={() => increment(golesLocal, setGolesLocal)}
                        onDecrement={() => decrement(golesLocal, setGolesLocal)}
                      />

                      <div className="flex items-center justify-center">
                        <span
                          className={`rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] ${
                            bloqueado
                              ? "border-rose-300/18 bg-rose-500/12 text-rose-100"
                              : "border-white/10 bg-white/[0.08] text-white/56"
                          }`}
                        >
                          vs
                        </span>
                      </div>

                      <TeamScoreControl
                        side="visitante"
                        name={visitante?.nombre ?? "Visitante"}
                        flag={visitante?.bandera}
                        code={visitante?.codigo}
                        value={golesVisitante}
                        disabled={cargaDeshabilitada}
                        onChange={(value) =>
                          setNumericValue(value, setGolesVisitante)
                        }
                        onIncrement={() =>
                          increment(golesVisitante, setGolesVisitante)
                        }
                        onDecrement={() =>
                          decrement(golesVisitante, setGolesVisitante)
                        }
                      />
                    </div>

                    {mostrarClasificado ? (
                      <div className="mt-4">
                        <KnockoutQualifierSelector
                          local={{
                            id: partido.seleccionLocalId,
                            nombre: local?.nombre ?? "Local",
                            bandera: local?.bandera,
                            codigo: local?.codigo,
                          }}
                          visitante={{
                            id: partido.seleccionVisitanteId,
                            nombre: visitante?.nombre ?? "Visitante",
                            bandera: visitante?.bandera,
                            codigo: visitante?.codigo,
                          }}
                          value={equipoClasificadoId}
                          disabled={cargaDeshabilitada}
                          variant="dark"
                          onChange={setEquipoClasificadoId}
                        />
                      </div>
                    ) : null}
                  </section>

                  <Separator className="bg-white/10" />

                  <section>
                    <div
                      className={`mx-auto flex w-full flex-col items-center justify-center rounded-[24px] border px-5 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${statusCardClass}`}
                    >
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em]">
                        <TimerReset
                          className={`h-5 w-5 shrink-0 ${statusIconClass}`}
                        />

                        {partidoFinalizado ? (
                          <span>El partido ya finalizo. No se puede editar.</span>
                        ) : partidoIniciado ? (
                          <span>El partido ya esta iniciado. No se puede editar.</span>
                        ) : pronosticoCerrado ? (
                          <span>El pronostico para este partido ya cerro.</span>
                        ) : (
                          <span>
                            {countdownLabel} - Editable hasta las {fechaCierreLabel} hs.
                          </span>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </section>
            </div>

            <footer className="relative px-3 pb-3 pt-0 sm:px-4 sm:pb-4">
              <div className={`${DASHBOARD_PANEL} rounded-[26px] p-3`}>
                <div className={DASHBOARD_TOP_LINE}>
                  <div className={DASHBOARD_TOP_LINE_INNER} />
                  <div className={DASHBOARD_TOP_LINE_SWEEP} />
                  <div className={DASHBOARD_TOP_LINE_GLOW} />
                  <div className={DASHBOARD_TOP_LINE_HAIR} />
                </div>

                <div
                  className={`${DASHBOARD_SUBCARD} relative z-10 flex flex-col gap-3 rounded-[24px] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5`}
                >
                <p className="text-sm font-medium text-white/58">
                  Revisá el marcador y confirmá el guardado desde este mismo panel.
                </p>
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={saving}
                    className={BRAND_DIALOG_CANCEL_BUTTON_CLASSNAME}
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={bloqueado || saving}
                    className={BRAND_DIALOG_PRIMARY_BUTTON_CLASSNAME}
                  >
                    {saving ? (
                      <span className="inline-flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Guardando...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <Save className="h-4 w-4" />
                       Guardar pronóstico
                      </span>
                    )}
                  </Button>
                </div>
                </div>
              </div>
            </footer>
          </div>
        </BrandDialogFrame>
      </DialogContent>
    </Dialog>
  );
}

type TeamScoreControlProps = {
  side: "local" | "visitante";
  name: string;
  flag?: string | null;
  code?: string | null;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onIncrement: () => void;
  onDecrement: () => void;
};

function TeamScoreControl({
  side,
  name,
  flag,
  code,
  value,
  disabled = false,
  onChange,
}: TeamScoreControlProps) {
  const isLocal = side === "local";

  return (
    <div className="min-w-0">
      <p
        className={`text-xs font-black uppercase tracking-[0.2em] text-white/46 ${
          isLocal ? "text-left" : "text-right"
        }`}
      >
        {isLocal ? "Local" : "Visitante"}
      </p>
      <div
        className={`mt-2 grid min-w-0 items-center gap-2 sm:gap-3 ${
          isLocal
            ? "grid-cols-[minmax(0,1fr)_auto_auto]"
            : "grid-cols-[auto_auto_minmax(0,1fr)]"
        }`}
      >
        {isLocal ? (
          <>
            <TeamName name={name} align="right" />
            <FlagBox name={name} codigo={code} flag={flag} />
            <MiniScoreInput
              value={value}
              disabled={disabled}
              onChange={onChange}
            />
          </>
        ) : (
          <>
            <MiniScoreInput
              value={value}
              disabled={disabled}
              onChange={onChange}
            />
            <FlagBox name={name} codigo={code} flag={flag} />
            <TeamName name={name} align="left" />
          </>
        )}
      </div>
    </div>
  );
}

function TeamName({
  name,
  align,
}: {
  name: string;
  align: "left" | "right";
}) {
  return (
    <p
      className={`min-w-0 truncate text-xs font-black tracking-[-0.03em] text-white sm:text-sm md:text-base ${
        align === "right" ? "text-right" : "text-left"
      }`}
      title={name}
    >
      {name}
    </p>
  );
}

function FlagBox({
  name,
  codigo,
  flag,
}: {
  name: string;
  codigo?: string | null;
  flag?: string | null;
}) {
  return (
    <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.08] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <FlagImage
        bandera={flag}
        codigo={codigo}
        nombre={name}
        widthClassName="w-10 sm:w-12"
        heightClassName="h-7 sm:h-8"
        fallbackMode="emoji"
        fallbackTextClassName="text-lg"
      />
    </div>
  );
}

function HeroEscudoSlot({
  nombre,
  bandera,
  codigo,
  tilt,
}: {
  nombre: string;
  bandera?: string | null;
  codigo?: string | null;
  tilt: "left" | "right";
}) {
  return (
    <div
      className={
        tilt === "left"
          ? "translate-x-2 translate-y-1 md:translate-x-3"
          : "-translate-x-2 translate-y-1 md:-translate-x-3"
      }
    >
      <div className="mx-auto w-fit">
        <HeroShield
          nombre={nombre}
          bandera={bandera}
          codigo={codigo}
          tilt={tilt}
          sizeClassName="h-[132px] w-[132px] md:h-[182px] md:w-[182px]"
          imageClassName="h-[100px] w-[100px] md:h-[138px] md:w-[138px]"
        />
      </div>
      <p className="mt-3 truncate text-center font-brand text-[1.05rem] tracking-[0.04em] text-white md:text-[1.25rem]">
        {nombre}
      </p>
    </div>
  );
}

function HeroShield({
  nombre,
  bandera,
  codigo,
  tilt,
  sizeClassName = "h-20 w-20",
  imageClassName = "h-12 w-12",
}: {
  nombre: string;
  bandera?: string | null;
  codigo?: string | null;
  tilt: "left" | "right";
  sizeClassName?: string;
  imageClassName?: string;
}) {
  const teamAsset = resolveTeamAsset(codigo);
  const src = teamAsset?.escudo ?? resolveBanderaSrc(bandera?.trim(), codigo);
  const glow = teamAsset?.glow ?? "rgba(174,235,255,0.22)";

  if (src) {
    return (
      <div
        className={`relative flex items-center justify-center ${tilt === "left" ? "-rotate-[3deg]" : "rotate-[3deg]"} ${sizeClassName}`}
      >
        <div
          className={`absolute top-[18%] h-[56%] w-[38%] rounded-full blur-[18px] ${
            tilt === "left" ? "-left-[8%]" : "-right-[8%]"
          }`}
          style={{
            background: `radial-gradient(ellipse at center, ${glow} 0%, ${glow} 36%, transparent 82%)`,
          }}
        />
        <div
          className="absolute inset-[18%] blur-[24px]"
          style={{
            background: `radial-gradient(circle at center, ${glow} 0%, ${glow} 26%, rgba(89,147,182,0.12) 54%, transparent 82%)`,
          }}
        />
        <div className="absolute inset-[26%] bg-[radial-gradient(circle_at_center,rgba(250,180,56,0.28),rgba(250,180,56,0.1)_38%,transparent_76%)] blur-[18px]" />
        <div className="absolute inset-[30%] bg-[radial-gradient(circle_at_center,rgba(255,244,190,0.16),transparent_72%)] blur-[12px]" />
        <Image
          src={src}
          alt={`Escudo de ${nombre}`}
          width={128}
          height={128}
          unoptimized
          className={`relative object-contain drop-shadow-[0_26px_38px_rgba(8,18,34,0.46)] ${imageClassName}`}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center ${tilt === "left" ? "-rotate-[3deg]" : "rotate-[3deg]"} ${sizeClassName}`}
    >
      <div
        className={`absolute top-[18%] h-[56%] w-[38%] rounded-full blur-[18px] ${
          tilt === "left" ? "-left-[8%]" : "-right-[8%]"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(174,235,255,0.22) 0%, rgba(174,235,255,0.22) 36%, transparent 82%)",
        }}
      />
      <div className="absolute inset-[18%] blur-[24px] bg-[radial-gradient(circle_at_center,rgba(174,235,255,0.26)_0%,rgba(174,235,255,0.26)_26%,rgba(89,147,182,0.12)_54%,transparent_82%)]" />
      <div className="absolute inset-[26%] bg-[radial-gradient(circle_at_center,rgba(250,180,56,0.28),rgba(250,180,56,0.1)_38%,transparent_76%)] blur-[18px]" />
      <div className="absolute inset-[30%] bg-[radial-gradient(circle_at_center,rgba(255,244,190,0.16),transparent_72%)] blur-[12px]" />
      <FlagImage
        bandera={bandera}
        codigo={codigo}
        nombre={nombre}
        widthClassName="w-20 md:w-28"
        heightClassName="h-20 md:h-28"
        fallbackMode="emoji"
        fallbackTextClassName="text-4xl"
      />
    </div>
  );
}

function MiniScoreInput({
  value,
  disabled = false,
  onChange,
}: {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        disabled={disabled}
        onFocus={(event) => event.target.select()}
        onChange={(event) => onChange(event.target.value)}
        className={`${BRAND_DIALOG_INPUT_CLASSNAME} h-12 w-12 px-0 text-center text-lg font-black text-white disabled:cursor-not-allowed disabled:border-white/8 disabled:bg-white/[0.05] disabled:text-white/34 md:w-14 md:text-xl`}
      />
    </div>
  );
}
