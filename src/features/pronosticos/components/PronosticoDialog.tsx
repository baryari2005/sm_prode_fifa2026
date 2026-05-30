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
      partido.fecha,
      PREDICTION_CLOSE_MINUTES_BEFORE,
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

    try {
      setSaving(true);

      await upsertPronostico({
        partidoId: partido.id,
        golesLocal: Number(golesLocal),
        golesVisitante: Number(golesVisitante),
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
    : "border-white/10 bg-white/[0.06]";

  const statusCardClass = bloqueado
    ? "border-rose-300/18 bg-rose-500/12 text-rose-100"
    : "border-[#5993B6]/20 bg-[#5993B6]/10 text-[#AEEBFF]";

  const statusIconClass = bloqueado ? "text-rose-200" : "text-[#AEEBFF]";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={`${BRAND_DIALOG_CONTENT_CLASSNAME} w-[calc(100vw-1rem)] sm:max-w-[1080px]`}
      >
        <BrandDialogFrame>
          <div className="relative">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="absolute right-5 top-5 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/68 transition hover:bg-white/[0.1] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <header className="relative border-b border-white/10 px-5 pb-5 pt-6 sm:px-8">
              <div className="flex flex-col gap-3 pr-10 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-[#AEEBFF]">
                    <Sparkles className="h-3.5 w-3.5 text-[#FAB438]" />
                    Carga de pronostico
                  </p>

                  <DialogTitle className="mt-2 font-brand text-[2rem] font-black tracking-[0.03em] text-white sm:text-[2.35rem]">
                    Editar pronostico
                  </DialogTitle>

                  <p className="mt-1 flex items-center text-sm font-semibold text-white/68">
                    <Info className="mr-2 h-3 w-3 text-[#AEEBFF]" />
                    Completa tu resultado y guardalo con el mismo flujo que usa la
                    carga masiva.
                  </p>
                </div>

                {miPronostico ? (
                  <Badge
                    className={`w-fit rounded-full px-4 py-2 text-xs font-black ${
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
            </header>

            <div className="relative space-y-5 px-5 pb-5 pt-5 sm:px-8">
              <section>
                <div className="mx-auto flex w-full flex-col items-center justify-center rounded-[24px] border border-white/10 bg-[#0E1D30]/72 px-5 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#AEEBFF]">
                    <CalendarDays className="h-5 w-5 text-[#FAB438]" />
                    <span className="capitalize">{fechaPartidoLabel}</span>
                    <Clock3 className="h-5 w-5 text-[#AEEBFF]" />
                    {horaPartidoLabel} hs
                  </div>
                </div>
              </section>

              <section
                className={`rounded-[28px] border p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition sm:p-5 ${scoreCardClass}`}
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
                      className={`rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] sm:px-3 sm:text-xs sm:tracking-[0.18em] ${
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
                        {countdownLabel} · Editable hasta las {fechaCierreLabel}{" "}
                        hs.
                      </span>
                    )}
                  </div>
                </div>
              </section>
            </div>

            <footer className="relative flex flex-col-reverse gap-3 border-t border-white/10 bg-[#0B1B2F]/88 px-5 py-5 sm:flex-row sm:justify-end sm:px-8">
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
                    Guardar pronostico
                  </span>
                )}
              </Button>
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
          <FlagBox
            name={name}
            fallbackCode={code}
            flag={flag}
            flagSrc={flagSrc}
          />
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
          <FlagBox
            name={name}
            fallbackCode={code}
            flag={flag}
            flagSrc={flagSrc}
          />
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
      className={`min-w-0 truncate text-xs font-black tracking-[-0.03em] text-white sm:text-sm md:text-base ${
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
  fallbackCode?: string | null;
  flag?: string | null;
  flagSrc?: string | null;
};

function FlagBox({ name, fallbackCode, flag, flagSrc }: FlagBoxProps) {
  return (
    <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.08] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
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
        <span className="flex h-7 w-10 items-center justify-center rounded-xl bg-[#0E1D30]/72 text-xs font-black text-[#AEEBFF] sm:h-8 sm:w-12">
          {fallbackCodeFromName(name, fallbackCode, flag)}
        </span>
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
        className={`${BRAND_DIALOG_INPUT_CLASSNAME} h-8 w-10 px-0 text-center text-lg font-black text-white disabled:cursor-not-allowed disabled:border-white/8 disabled:bg-white/[0.05] disabled:text-white/34 md:h-10 md:w-12 md:text-xl`}
      />
    </div>
  );
}

function fallbackCodeFromName(
  name: string,
  fallbackCode?: string | null,
  flag?: string | null,
) {
  const cleanedFlag = flag?.trim();
  if (cleanedFlag && cleanedFlag.length <= 3) {
    return cleanedFlag.toUpperCase();
  }

  if (fallbackCode?.trim()) {
    return fallbackCode.trim().slice(0, 3).toUpperCase();
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
