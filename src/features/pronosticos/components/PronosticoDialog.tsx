"use client";

import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import Image from "next/image";
import {
  CalendarDays,  
  Clock3,
  Info,
  RefreshCw,
  Save,
  Sparkles,
  TimerReset,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  formatMatchHour,
  getPredictionCloseTimestamp,
  getPredictionCountdownLabel,
  hasMatchStartedForPrediction,
  isPredictionBlocked,
  PREDICTION_CLOSE_MINUTES_BEFORE,
  type PartidoConRelaciones,
} from "@/features/partidos/utils/partidos-ui.helpers";
import { useCountdownNow } from "@/features/pronosticos/hooks/useCountdownNow";
import { upsertPronostico } from "@/features/pronosticos/services/pronosticos.service";
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
  const now = useCountdownNow();

  const [golesLocal, setGolesLocal] = useState("0");
  const [golesVisitante, setGolesVisitante] = useState("0");
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

  const countdownLabel = partido
    ? getPredictionCountdownLabel(
        partido.fecha,
        PREDICTION_CLOSE_MINUTES_BEFORE,
        now
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
      partido.fecha,
      PREDICTION_CLOSE_MINUTES_BEFORE
    );

    return new Intl.DateTimeFormat("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(closeTimestamp));
  }, [partido?.fecha]);

  useEffect(() => {
    if (!open || !partido) return;

    setGolesLocal(String(partido.miPrediccion?.golesLocal ?? 0));
    setGolesVisitante(String(partido.miPrediccion?.golesVisitante ?? 0));
  }, [open, partido]);

  const setNumericValue = (
    value: string,
    setter: Dispatch<SetStateAction<string>>
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
    setter: Dispatch<SetStateAction<string>>
  ) => {
    setter(String(Math.min(Number(value || 0) + 1, 99)));
  };

  const decrement = (
    value: string,
    setter: Dispatch<SetStateAction<string>>
  ) => {
    setter(String(Math.max(Number(value || 0) - 1, 0)));
  };

  const handleSubmit = async () => {
    if (!partido || bloqueado) return;

    try {
      setSaving(true);

      await upsertPronostico({
        partidoId: partido.id,
        golesLocal: Number(golesLocal),
        golesVisitante: Number(golesVisitante),
      });

      toast.success("Pronóstico guardado correctamente");

      await onSaved?.();
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al guardar el pronóstico.";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (!partido) return null;

  const scoreCardClass = bloqueado
    ? "border-red-200 bg-red-50/40 opacity-70"
    : "border-slate-200/90 bg-white/90";

  const statusCardClass = bloqueado
    ? "border-red-200 bg-gradient-to-b from-red-50 via-white to-red-50 text-red-700"
    : "border-[#008C93]/15 bg-gradient-to-b from-[#E8FBFC] via-white to-[#F7FAFC] text-[#008C93]";

  const statusIconClass = bloqueado ? "text-red-600" : "text-[#008C93]";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="
          w-[calc(100vw-1rem)]
          max-w-[1080px]
          overflow-hidden
          rounded-[2rem]
          border border-slate-200/90
          bg-gradient-to-br from-white via-white to-slate-50
          p-0
          text-slate-950
          shadow-[0_30px_90px_rgba(15,23,42,0.18)]
          sm:max-w-[1080px]
        "
      >
        <div className="relative">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#008C93] via-[#00A6B2] to-[#7DD3FC]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.08),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(57,169,53,0.08),transparent_28%)]" />

          <header className="relative px-5 pb-5 pt-6 sm:px-8">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="
                absolute
                right-5
                top-5
                inline-flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-slate-500
                transition
                hover:bg-slate-100
                hover:text-slate-950
              "
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col gap-3 pr-10 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-[#008C93]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Carga de pronóstico
                </p>

                <DialogTitle className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-950 sm:text-3xl">
                  Editar pronóstico
                </DialogTitle>

                <p className="mt-1 flex items-center text-sm font-semibold text-slate-500">
                  <Info className="mr-2 h-3 w-3" />
                  Completá tu resultado y guardalo con el mismo flujo que usa la
                  carga masiva.
                </p>
              </div>

              {miPronostico ? (
                <Badge
                  className={`w-fit rounded-full px-4 py-2 text-xs font-black ${
                    bloqueado
                      ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-50"
                      : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  Pronóstico actual: {miPronostico.golesLocal} -{" "}
                  {miPronostico.golesVisitante}
                </Badge>
              ) : null}
            </div>
          </header>

          <div className="relative px-5 pb-5 sm:px-8">
            <section>
              <div className="mx-auto flex w-full flex-col items-center justify-center rounded-2xl border border-[#008C93]/15 bg-gradient-to-b from-[#E8FBFC] via-white to-[#F7FAFC] px-5 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#008C93]">
                  <CalendarDays className="h-5 w-5" />
                  <span className="capitalize">{fechaPartidoLabel}</span>
                  <Clock3 className="h-5 w-5 text-[#008C93]" />
                  {horaPartidoLabel} hs
                </div>
              </div>
            </section>

            <section
              className={`mt-5 rounded-[1.6rem] border p-4 shadow-[0_16px_35px_rgba(15,23,42,0.06)] transition sm:p-5 ${scoreCardClass}`}
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-4">
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
                    className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] sm:px-3 sm:text-xs sm:tracking-[0.18em] ${
                      bloqueado
                        ? "bg-red-100 text-red-500"
                        : "bg-slate-100 text-slate-400"
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
            </section>

            <Separator className="my-6 bg-slate-200" />

            <section>
              <div
                className={`mx-auto flex w-full flex-col items-center justify-center rounded-xl border px-5 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] ${statusCardClass}`}
              >
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em]">
                  <TimerReset className={`h-5 w-5 shrink-0 ${statusIconClass}`} />

                  {partidoFinalizado ? (
                    <span>El partido ya finalizó. No se puede editar.</span>
                  ) : partidoIniciado ? (
                    <span>El partido ya esta iniciado. No se puede editar.</span>
                  ) : pronosticoCerrado ? (
                    <span>El pronóstico está cerrado. No se puede editar.</span>
                  ) : (
                    <span>
                      {countdownLabel} · Editable hasta las {fechaCierreLabel}{" "}
                      hs.
                    </span>
                  )}
                </div>
              </div>
            </section>
          </div>

          <footer className="relative flex flex-col-reverse gap-3 border-t border-slate-200/80 bg-slate-50/80 px-5 py-5 sm:flex-row sm:justify-end sm:px-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
              className="h-11 rounded-2xl border-slate-200 bg-white px-7 font-black text-slate-700 hover:bg-slate-100 hover:text-slate-950"
            >
              Cancelar
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={bloqueado || saving}
              className="h-11 rounded-2xl bg-[#39A935] px-8 font-black text-white shadow-lg shadow-green-900/20 transition hover:bg-[#2f8d2f] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
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
          </footer>
        </div>
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
  onIncrement,
  onDecrement,
}: TeamScoreControlProps) {
  const isLocal = side === "local";
  const flagSrc = resolveBanderaSrc(flag?.trim(), code);

  return (
    <div
      className={`grid min-w-0 items-center gap-2 sm:gap-3 ${
        isLocal
          ? "grid-cols-[minmax(0,1fr)_auto_auto]"
          : "grid-cols-[auto_auto_minmax(0,1fr)]"
      }`}
    >
      {isLocal ? (
        <>
          <TeamName name={name} align="right" />
          <FlagBox name={name} flag={flag} flagSrc={flagSrc} />
          <MiniScoreInput
            value={value}
            disabled={disabled}
            onChange={onChange}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
        </>
      ) : (
        <>
          <MiniScoreInput
            value={value}
            disabled={disabled}
            onChange={onChange}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
          <FlagBox name={name} flag={flag} flagSrc={flagSrc} />
          <TeamName name={name} align="left" />
        </>
      )}
    </div>
  );
}

type TeamNameProps = {
  name: string;
  align: "left" | "right";
};

function TeamName({ name, align }: TeamNameProps) {
  return (
    <p
      className={`min-w-0 truncate text-xs font-black tracking-[-0.03em] text-slate-950 sm:text-sm md:text-base ${
        align === "right" ? "text-right" : "text-left"
      }`}
      title={name}
    >
      {name}
    </p>
  );
}

type FlagBoxProps = {
  name: string;
  flag?: string | null;
  flagSrc?: string | null;
};

function FlagBox({ name, flag, flagSrc }: FlagBoxProps) {
  return (
    <div className="shrink-0">
      {flagSrc ? (
        <Image
          src={flagSrc}
          alt={`Bandera de ${name}`}
          width={48}
          height={32}
          unoptimized
          className="h-7 w-10 object-contain sm:h-8 sm:w-12"
        />
      ) : (
        <span className="text-xl">{flag || "🏳️"}</span>
      )}
    </div>
  );
}

type MiniScoreInputProps = {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onIncrement: () => void;
  onDecrement: () => void;
};

function MiniScoreInput({
  value,
  disabled = false,
  onChange,
}: MiniScoreInputProps) {
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
        className="h-8 w-10 rounded-xl border border-slate-200 bg-white text-center text-lg font-black text-slate-950 shadow-sm outline-none transition focus:border-[#008C93] focus:ring-4 focus:ring-[#008C93]/10 disabled:cursor-not-allowed disabled:border-red-100 disabled:bg-red-50 disabled:text-red-400 md:h-10 md:w-12 md:text-xl"
      />
    </div>
  );
}
