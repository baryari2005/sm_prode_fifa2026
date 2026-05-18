"use client";

import { AlertTriangle, Loader2, Save, Target, Trophy, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResultMetricCard } from "@/components/ui/result-metric-card";
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

type ScoreMetricKey = "puntosExacto" | "puntosParcial" | "puntosSinAcierto";

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
  icon,
  title,
  description,
  value,
  disabled,
  onChange,
}: ScoreCardProps) {
  return (
    <ResultMetricCard
      icono={icon}
      titulo={title}
      descripcion={description}
      className="min-h-full"
      resultado={
        <div className="mt-1 space-y-2">
          <Label className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Puntaje
          </Label>

          {disabled ? (
            <div className="flex h-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-center text-2xl font-extrabold text-slate-950">
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
              className="h-14 rounded-2xl border-slate-200 bg-white text-center text-2xl font-extrabold text-slate-950"
            />
          )}
        </div>
      }
    />
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
      <section className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm md:p-5">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
            <Trophy className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold tracking-tight text-slate-950">
              Seleccion de fase
            </h2>
            <p className="text-sm text-slate-500">
              Elegi la fase que queres configurar antes de definir los puntajes.
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)]">
          <div className="space-y-2">
            <Label>Fase</Label>

            <Select
              value={values.faseId ? String(values.faseId) : ""}
              onValueChange={(value) => onChange("faseId", Number(value))}
              disabled={saving}
            >
              <SelectTrigger className="h-12 rounded-2xl bg-white">
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

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Reglas activas
            </p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
              {reglaActual ? "Cargadas" : "Nuevas"}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {reglaActual
                ? "Esta fase ya tiene una configuracion guardada y podes actualizarla mientras siga habilitada."
                : "Todavia no hay una configuracion registrada para esta fase."}
            </p>
          </div>
        </div>
      </section>

      {loadingRegla && (
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Cargando configuracion de puntaje...
        </div>
      )}

      {reglaActual?.bloqueada && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">Edicion no disponible</p>
            <p className="mt-1">
              Esta fase ya comenzo. Las reglas de puntaje no pueden modificarse.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_320px]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
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

        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <Target className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-lg font-bold tracking-tight text-slate-950">
                Resumen
              </h3>
              <p className="text-sm text-slate-500">
                Revision rapida antes de guardar.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {scoreMetrics.map((item) => (
              <div key={`summary-${item.key}`} className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {item.summaryTitle}
                </p>
                <p className="mt-1 text-2xl font-extrabold text-slate-950">
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
                Guardar configuracion
              </>
            )}
          </Button>
        </aside>
      </div>
    </div>
  );
}
