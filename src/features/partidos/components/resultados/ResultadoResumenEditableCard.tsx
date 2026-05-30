"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { EstadoPartido } from "@prisma/client";
import { Timer } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ResultadoFormState } from "@/features/partidos/types/resultado-manual.types";
import { ESTADO_PARTIDO_OPTIONS } from "@/features/partidos/utils/partidos-ui.helpers";

type TeamSummary = {
  nombre: string;
  escudoUrl?: string | null;
};

type ResultadoResumenEditableCardProps = {
  competencia: string;
  fechaTexto?: string;
  local: TeamSummary;
  visitante: TeamSummary;
  form: ResultadoFormState;
  onChange: (patch: Partial<ResultadoFormState>) => void;
};

const DARK_FIELD =
  "border-white/10 bg-white/[0.08] text-white shadow-none placeholder:text-white/30 focus-visible:ring-2 focus-visible:ring-[#5993B6]/40";

export function ResultadoResumenEditableCard({
  competencia,
  fechaTexto,
  local,
  visitante,
  form,
  onChange,
}: ResultadoResumenEditableCardProps) {
  const golesLocalCalculados = form.detalleGolesLocal.length;
  const golesVisitanteCalculados = form.detalleGolesVisitante.length;

  return (
    <section className="group relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-[#223553]/90 text-white shadow-[0_20px_55px_rgba(2,8,23,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#7DD3FC]/30 hover:shadow-[0_26px_60px_rgba(2,8,23,0.3)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#5993B6] via-[#AEEBFF] to-[#FAB438]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.08),transparent_30%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="relative space-y-5 p-5 md:p-6">
        <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.05] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_auto] 2xl:grid-cols-[minmax(220px,1fr)_auto_minmax(460px,1fr)]">
            <div className="min-w-0 text-sm lg:col-start-1 lg:row-start-1 2xl:col-start-1 2xl:row-start-1">
              <span className="font-semibold text-white">{competencia}</span>
              {fechaTexto ? (
                <span className="ml-2 text-white/56">· {fechaTexto}</span>
              ) : null}
            </div>

            <div className="flex min-w-0 flex-wrap items-center justify-center gap-3 lg:col-span-2 lg:row-start-2 2xl:col-span-1 2xl:col-start-2 2xl:row-start-1">
              <CompactTeam
                nombre={local.nombre}
                escudoUrl={local.escudoUrl}
                align="right"
              />

              <div className="flex shrink-0 items-center justify-center gap-2">
                <ScoreDisplay value={golesLocalCalculados} />
                <span className="text-3xl font-black leading-none tracking-[-0.04em] text-white">
                  -
                </span>
                <ScoreDisplay value={golesVisitanteCalculados} />
              </div>

              <CompactTeam
                nombre={visitante.nombre}
                escudoUrl={visitante.escudoUrl}
                align="left"
              />
            </div>

            <div className="flex flex-wrap items-center justify-start gap-3 lg:col-start-2 lg:row-start-1 lg:justify-end 2xl:col-start-3 2xl:row-start-1">
              <HorizontalField label="Tiempo de juego">
                <div className="relative">
                  <Timer className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={form.tiempoJuego}
                    placeholder="90"
                    onFocus={(event) => {
                      event.currentTarget.select();
                    }}
                    onMouseUp={(event) => {
                      event.preventDefault();
                    }}
                    onChange={(event) => {
                      const onlyNumbers = event.target.value.replace(/\D/g, "");
                      onChange({
                        tiempoJuego: onlyNumbers,
                      });
                    }}
                    onPaste={(event) => {
                      event.preventDefault();
                      const pastedText = event.clipboardData.getData("text");
                      const onlyNumbers = pastedText.replace(/\D/g, "");
                      onChange({
                        tiempoJuego: onlyNumbers,
                      });
                    }}
                    className={`h-10 w-24 rounded-xl pl-9 text-center font-semibold ${DARK_FIELD}`}
                  />
                </div>
              </HorizontalField>

              <div className="hidden h-8 w-px bg-white/10 sm:block" />

              <HorizontalField label="Estado">
                <Select
                  value={form.estado}
                  onValueChange={(value) =>
                    onChange({
                      estado: value as EstadoPartido,
                    })
                  }
                >
                  <SelectTrigger className={`h-10 w-40 rounded-xl ${DARK_FIELD}`}>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>

                  <SelectContent>
                    {ESTADO_PARTIDO_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </HorizontalField>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricTile
            label={`${local.nombre} goles`}
            value={golesLocalCalculados}
          />
          <MetricTile
            label={`${visitante.nombre} goles`}
            value={golesVisitanteCalculados}
          />
          <MetricTile
            label="Tarjetas amarillas"
            value={
              form.estadisticasLocal.yellowCards +
              form.estadisticasVisitante.yellowCards
            }
          />
          <MetricTile
            label="Tarjetas rojas"
            value={
              form.estadisticasLocal.redCards +
              form.estadisticasVisitante.redCards
            }
          />
        </div>

        <div className="space-y-2 border-t border-white/10 pt-1">
          <label className="text-sm font-medium text-white">Observaciones</label>
          <Textarea
            value={form.observaciones}
            placeholder="Comentarios del partido, incidencias o contexto"
            onChange={(event) =>
              onChange({
                observaciones: event.target.value,
              })
            }
            className={`min-h-[96px] ${DARK_FIELD}`}
          />
        </div>
      </div>
    </section>
  );
}

function MetricTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#AEEBFF]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">
        {value}
      </p>
    </div>
  );
}

function CompactTeam({
  nombre,
  escudoUrl,
  align,
}: {
  nombre: string;
  escudoUrl?: string | null;
  align: "left" | "right";
}) {
  const image = escudoUrl ? (
    <Image
      src={escudoUrl}
      alt={nombre}
      width={40}
      height={24}
      unoptimized
      className="h-6 w-10 shrink-0 object-cover drop-shadow-[0_8px_16px_rgba(2,8,23,0.32)]"
    />
  ) : null;

  const name = (
    <span className="max-w-[150px] truncate whitespace-nowrap text-lg font-black tracking-tight text-white sm:max-w-[190px] 2xl:max-w-[220px]">
      {nombre}
    </span>
  );

  return (
    <div className="flex min-w-0 items-center gap-3">
      {align === "right" ? (
        <>
          {name}
          {image}
        </>
      ) : (
        <>
          {image}
          {name}
        </>
      )}
    </div>
  );
}

function ScoreDisplay({ value }: { value: number }) {
  return (
    <div className="flex h-11 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] px-2 text-center text-2xl font-black tracking-[-0.04em] text-white shadow-none sm:h-12 sm:w-14 sm:text-3xl">
      {value}
    </div>
  );
}

function HorizontalField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="whitespace-nowrap text-xs font-semibold text-white/68">
        {label}
      </label>
      {children}
    </div>
  );
}
