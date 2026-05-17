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
  Check,
  Clock3,
  RefreshCw,
  Minus,
  Plus,
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { useCountdownNow } from "@/features/pronosticos/hooks/useCountdownNow";
import { resolveBanderaSrc } from "@/lib/flags";

import {
  formatMatchHour,
  getPredictionCountdownLabel,
  getPredictionCloseTimestamp,
  isPredictionClosed,
  type PartidoConRelaciones,
  PREDICTION_CLOSE_MINUTES_BEFORE,
} from "@/features/partidos/utils/partidos-ui.helpers";

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
    ? isPredictionClosed(partido.fecha, PREDICTION_CLOSE_MINUTES_BEFORE, now)
    : true;

  const partidoFinalizado = partido?.resultado?.estado === "FINALIZADO";

  const bloqueado = pronosticoCerrado || partidoFinalizado || !partido;

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

      const response = await fetch(`/api/partidos/${partido.id}/prediccion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          golesLocal: Number(golesLocal),
          golesVisitante: Number(golesVisitante),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "No se pudo guardar el pronóstico.");
      }

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="
          w-[calc(100vw-1.5rem)]
          max-w-[920px]
          overflow-hidden
          rounded-[2rem]
          border
          border-white/10
          bg-[#06131d]
          p-0
          text-white
          shadow-[0_35px_120px_rgba(0,0,0,0.55)]
        "
      >
        <div className="relative">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#39A935]/12 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-[#008C93]/14 blur-3xl" />

          <header className="relative px-6 pb-5 pt-6 sm:px-8">
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
                text-slate-400
                transition
                hover:bg-white/10
                hover:text-white
              "
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col gap-3 pr-10 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <DialogTitle className="text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
                  Pronosticar partido
                </DialogTitle>

                <p className="mt-1 text-sm font-semibold text-slate-400">
                  Completá tu predicción para el partido.
                </p>
              </div>

              {miPronostico && (
                <div className="w-fit rounded-full border border-green-500/25 bg-green-500/10 px-4 py-2 text-xs font-black text-green-300">
                  Tu pronóstico actual: {miPronostico.golesLocal} -{" "}
                  {miPronostico.golesVisitante}
                </div>
              )}
            </div>
          </header>

          <div className="relative px-6 pb-5 sm:px-8">
            <section
              className="
                grid
                items-center
                gap-5
                rounded-[1.5rem]
                border
                border-white/10
                bg-[linear-gradient(135deg,rgba(8,26,39,0.95),rgba(11,34,50,0.92))]
                px-5
                py-5
                sm:grid-cols-[1fr_220px_1fr]
              "
            >
              <TeamPreview
                name={local?.nombre ?? "Local"}
                flag={local?.bandera}
                code={local?.codigo}
                align="left"
              />

              <div
                className="
                  mx-auto
                  flex
                  w-full
                  max-w-[220px]
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  px-4
                  py-4
                  backdrop-blur
                "
              >
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#6DD3D8]">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span className="capitalize">{fechaPartidoLabel}</span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-3xl font-black tracking-[-0.04em] text-white">
                  <Clock3 className="h-5 w-5 text-[#6DD3D8]" />
                  {horaPartidoLabel}
                </div>

                <span className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  hs
                </span>
              </div>

              <TeamPreview
                name={visitante?.nombre ?? "Visitante"}
                flag={visitante?.bandera}
                code={visitante?.codigo}
                align="right"
              />
            </section>

            <section className="mt-7 grid items-end gap-5 sm:grid-cols-[1fr_64px_1fr]">
              <ScoreControl
                label={`Goles de ${local?.nombre ?? "local"}`}
                value={golesLocal}
                disabled={bloqueado || saving}
                onChange={(value) => setNumericValue(value, setGolesLocal)}
                onIncrement={() => increment(golesLocal, setGolesLocal)}
                onDecrement={() => decrement(golesLocal, setGolesLocal)}
              />

              <div className="mb-1 flex justify-center">
                <span
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/5
                    text-sm
                    font-black
                    text-slate-200
                    shadow-inner
                  "
                >
                  VS
                </span>
              </div>

              <ScoreControl
                label={`Goles de ${visitante?.nombre ?? "visitante"}`}
                value={golesVisitante}
                disabled={bloqueado || saving}
                onChange={(value) => setNumericValue(value, setGolesVisitante)}
                onIncrement={() =>
                  increment(golesVisitante, setGolesVisitante)
                }
                onDecrement={() =>
                  decrement(golesVisitante, setGolesVisitante)
                }
              />
            </section>

            <Separator className="my-6 bg-white/10" />

            <section
              className={`
                flex
                items-center
                justify-center
                gap-2
                rounded-full
                border
                px-4
                py-2.5
                text-center
                text-sm
                font-bold
                ${
                  bloqueado
                    ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                    : "border-green-500/20 bg-green-500/10 text-green-300"
                }
              `}
            >
              <ShieldCheck className="h-4 w-4 shrink-0" />

              {partidoFinalizado ? (
                <span>El partido ya finalizó. No se puede editar.</span>
              ) : pronosticoCerrado ? (
                <span>El pronóstico está cerrado.</span>
              ) : (
                <span>
                  {countdownLabel} · Editable hasta las {fechaCierreLabel} hs.
                </span>
              )}
            </section>
          </div>

          <footer
            className="
              relative
              flex
              flex-col-reverse
              gap-3
              border-t
              border-white/10
              bg-white/[0.03]
              px-6
              py-5
              sm:flex-row
              sm:justify-end
              sm:px-8
            "
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
              className="
                h-11
                rounded-2xl
                border-white/15
                bg-transparent
                px-7
                font-black
                text-slate-200
                hover:bg-white/10
                hover:text-white
              "
            >
              Cancelar
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={bloqueado || saving}
              className="
                h-11
                rounded-2xl
                bg-[#39A935]
                px-8
                font-black
                text-white
                shadow-lg
                shadow-green-900/30
                transition
                hover:bg-[#2f8d2f]
                disabled:cursor-not-allowed
                disabled:bg-slate-700
                disabled:text-slate-400
                disabled:shadow-none
              "
            >
              {saving ? (
                <span className="inline-flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Guardando...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4" />
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

type ScoreControlProps = {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onIncrement: () => void;
  onDecrement: () => void;
};

function ScoreControl({
  label,
  value,
  disabled = false,
  onChange,
  onIncrement,
  onDecrement,
}: ScoreControlProps) {
  return (
    <div className="space-y-2">
      <label className="block text-center text-sm font-black text-slate-200">
        {label}
      </label>

      <div
        className={`
          grid
          h-16
          grid-cols-[60px_1fr_60px]
          overflow-hidden
          rounded-2xl
          border
          bg-white/5
          backdrop-blur
          transition
          focus-within:border-[#39A935]
          focus-within:ring-4
          focus-within:ring-[#39A935]/12
          ${disabled ? "opacity-60" : "border-white/12"}
        `}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={onDecrement}
          className="
            flex
            items-center
            justify-center
            text-slate-200
            transition
            hover:bg-white/8
            disabled:cursor-not-allowed
          "
        >
          <Minus className="h-5 w-5" />
        </button>

        <Input
          inputMode="numeric"
          value={value}
          disabled={disabled}
          onFocus={(event) => event.target.select()}
          onChange={(event) => onChange(event.target.value)}
          className="
            h-full
            rounded-none
            border-0
            bg-transparent
            px-0
            text-center
            text-4xl
            font-black
            tracking-[-0.05em]
            text-white
            shadow-none
            outline-none
            focus-visible:ring-0
            placeholder:text-slate-500
          "
        />

        <button
          type="button"
          disabled={disabled}
          onClick={onIncrement}
          className="
            flex
            items-center
            justify-center
            text-slate-200
            transition
            hover:bg-white/8
            disabled:cursor-not-allowed
          "
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

type TeamPreviewProps = {
  name: string;
  flag?: string | null;
  code?: string | null;
  align: "left" | "right";
};

function TeamPreview({ name, flag, code, align }: TeamPreviewProps) {
  const flagSrc = resolveBanderaSrc(flag?.trim(), code);
  const isLeft = align === "left";

  return (
    <div
      className={`
        flex
        min-w-0
        items-center
        justify-center
        gap-3
        ${isLeft ? "sm:justify-start" : "sm:flex-row-reverse sm:justify-start"}
      `}
    >
      <div
        className="
          flex
          h-12
          w-15
          shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-xl
          bg-white/8
          px-1
        "
      >
        {flagSrc ? (
          <Image
            src={flagSrc}
            alt={`Bandera de ${name}`}
            width={48}
            height={32}
            unoptimized
            className="h-9 w-12 object-contain"
          />
        ) : (
          <span className="text-xl">{flag || "🏳️"}</span>
        )}
      </div>

      <p
        className={`
          min-w-0
          truncate
          text-lg
          font-black
          tracking-[-0.04em]
          text-white
          ${isLeft ? "text-left" : "text-left sm:text-right"}
        `}
      >
        {name}
      </p>
    </div>
  );
}