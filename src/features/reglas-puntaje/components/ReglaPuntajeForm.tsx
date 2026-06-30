"use client";

import {
  AlertTriangle,
  Loader2,
  Save,
  ShieldCheck,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  FaseResumen,
  ReglaPuntaje,
  ReglaPuntajeFormValues,
} from "../types/regla-puntaje.types";

type ScoreMetricKey =
  | "puntosExacto"
  | "puntosParcial"
  | "puntosClasificadoPenales"
  | "puntosSinAcierto";

type ReglaPuntajeFormProps = {
  fases: FaseResumen[];
  values: ReglaPuntajeFormValues;
  reglaActual: ReglaPuntaje | null;
  loadingRegla: boolean;
  saving: boolean;
  isFormDisabled: boolean;
  onChange: <K extends keyof ReglaPuntajeFormValues>(
    field: K,
    value: ReglaPuntajeFormValues[K]
  ) => void;
  onSubmit: () => void;
};

type ScoreCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  value: number;
  disabled: boolean;
  onChange?: (value: number) => void;
};

function ScoreCard({
  icon: Icon,
  title,
  description,
  value,
  disabled,
  onChange,
}: ScoreCardProps) {
  return (
    <article className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.1]">
      <div className="grid h-11 w-11 place-items-center rounded-[18px] bg-[#5993B6]/18 text-[#AEEBFF]">
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-4 text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-white/68">{description}</p>

      <div className="mt-4 space-y-2">
        <Label className="text-xs uppercase tracking-[0.18em] text-white/58">
          Puntaje
        </Label>

        {disabled ? (
          <div className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-[#425675]/55 text-center text-2xl font-extrabold text-white">
            {value}
          </div>
        ) : (
          <Input
            type="text"
            inputMode="numeric"
            value={value}
            disabled={disabled}
            onFocus={(event) => event.target.select()}
            onChange={(event) => onChange?.(Number(event.target.value || 0))}
            className="h-14 text-center text-2xl font-extrabold text-white"
          />
        )}
      </div>
    </article>
  );
}

const SCORE_CARD_CONFIG: Array<{
  key: ScoreMetricKey;
  icon: LucideIcon;
  title: string;
  summaryTitle: string;
  description: string;
  editable: boolean;
}> = [
  {
    key: "puntosExacto",
    icon: Trophy,
    title: "Resultado exacto",
    summaryTitle: "Exacto",
    description: "Acierta marcador y resultado final del partido.",
    editable: true,
  },
  {
    key: "puntosParcial",
    icon: Target,
    title: "Resultado parcial",
    summaryTitle: "Parcial",
    description: "Acierta ganador o empate sin clavar el marcador.",
    editable: true,
  },
  {
    key: "puntosClasificadoPenales",
    icon: ShieldCheck,
    title: "Clasificado por penales",
    summaryTitle: "Penales",
    description: "Bonus para quien acierta el equipo que pasa de ronda.",
    editable: true,
  },
  {
    key: "puntosSinAcierto",
    icon: AlertTriangle,
    title: "Sin acierto",
    summaryTitle: "Sin acierto",
    description: "No suma puntos cuando el pronostico no coincide.",
    editable: false,
  },
];

export function ReglaPuntajeForm({
  fases,
  values,
  reglaActual,
  loadingRegla,
  saving,
  isFormDisabled,
  onChange,
  onSubmit,
}: ReglaPuntajeFormProps) {
  const isSelectionIncomplete = !values.faseId;
  const scoreMetrics = SCORE_CARD_CONFIG.map((item) => ({
    ...item,
    value: values[item.key],
  }));

  return (
    <div className="space-y-6">
      <section className="rounded-[24px] border border-white/10 bg-white/[0.05] p-4 shadow-sm md:p-5">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5993B6]/18 text-[#AEEBFF]">
            <Trophy className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold tracking-tight text-white">
              Seleccion de fase
            </h2>
            <p className="text-sm text-white/68">
              Elige la fase que quieres configurar antes de definir los puntajes.
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)]">
          <div className="space-y-2">
            <Label className="text-white">Fase</Label>

            <Select
              value={values.faseId ? String(values.faseId) : ""}
              onValueChange={(value) => onChange("faseId", Number(value))}
              disabled={saving}
            >
              <SelectTrigger className="h-12 w-full rounded-2xl">
                <SelectValue placeholder="Seleccionar fase" />
              </SelectTrigger>

              <SelectContent>
                {fases.map((fase) => (
                  <SelectItem key={fase.id} value={String(fase.id)}>
                    {fase.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-[#425675]/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#AEEBFF]">
              Reglas activas
            </p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-white">
              {reglaActual ? "Cargadas" : "Nuevas"}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/68">
              {reglaActual
                ? "Esta fase ya tiene una configuración guardada y puedes actualizarla mientras siga habilitada."
                : "Todavía no hay una configuración registrada para esta fase."}
            </p>
          </div>
        </div>
      </section>

      {loadingRegla ? (
        <div className="flex items-center gap-2 rounded-[22px] border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white/72">
          <Loader2 className="h-4 w-4 animate-spin" />
          Cargando configuración de puntaje...
        </div>
      ) : null}

      {reglaActual?.bloqueada ? (
        <div className="flex items-start gap-3 rounded-[22px] border border-[#FAB438]/18 bg-[#FAB438]/10 px-4 py-3 text-sm text-[#FFE4A3]">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">Edición no disponible</p>
            <p className="mt-1 text-white/72">
              Esta fase ya comenzo. Las reglas de puntaje no pueden modificarse.
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_320px]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {scoreMetrics.map((item) => (
              <ScoreCard
                key={item.key}
                icon={item.icon}
                title={item.title}
                description={item.description}
                value={item.value}
                disabled={
                  !item.editable || isFormDisabled || isSelectionIncomplete
                }
                onChange={
                  item.editable
                    ? (value) => onChange(item.key, value)
                    : undefined
                }
              />
            ))}
          </div>
        </div>

        <aside className="rounded-[24px] border border-white/10 bg-white/[0.05] p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#5993B6]/18 text-[#AEEBFF]">
              <Target className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-lg font-bold tracking-tight text-white">
                Resumen
              </h3>
              <p className="text-sm text-white/68">
                Revision rapida antes de guardar.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {scoreMetrics.map((item) => (
              <div
                key={`summary-${item.key}`}
                className="rounded-[20px] border border-white/10 bg-[#425675]/40 px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#AEEBFF]">
                  {item.summaryTitle}
                </p>
                <p className="mt-1 text-2xl font-extrabold text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <Button
            onClick={onSubmit}
            disabled={isFormDisabled || isSelectionIncomplete}
            className="mt-5 h-11 w-full rounded-2xl bg-[#39A935] font-bold text-white shadow-lg shadow-green-700/20 transition hover:bg-[#247A28]"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar configuración
              </>
            )}
          </Button>
        </aside>
      </div>
    </div>
  );
}
