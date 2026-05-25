"use client";

import { Download, Flag, RefreshCw, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FlagImage } from "@/components/ui/flag-image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { SeleccionResumen } from "../types/plantel-manager.types";
import { SummaryCard } from "./SummaryCard";

type PlantelSelectorSummaryProps = {
  selecciones: SeleccionResumen[];
  selectedSeleccionId: string;
  selectedSeleccion: SeleccionResumen | null;
  totalJugadores: number;
  canCreate: boolean;
  importingApi: boolean;
  onSeleccionChange: (seleccionId: string) => void;
  onImportFromApi: () => void;
};

function SeleccionFlag({
  seleccion,
  size = "md",
}: {
  seleccion: SeleccionResumen | null;
  size?: "sm" | "md" | "lg";
}) {
  if (!seleccion?.bandera && !seleccion?.codigo) {
    return (
      <div
        className={`${size === "sm" ? "h-6 w-8" : size === "md" ? "h-8 w-10" : "h-10 w-12"} flex shrink-0 items-center justify-center text-slate-400`}
      >
        <Flag className="h-4 w-4" />
      </div>
    );
  }

  return (
    <FlagImage
      bandera={seleccion?.bandera}
      codigo={seleccion?.codigo}
      nombre={seleccion?.nombre ?? "selección"}
      widthClassName={size === "sm" ? "w-8" : size === "md" ? "w-10" : "w-12"}
      heightClassName={size === "sm" ? "h-6" : size === "md" ? "h-8" : "h-10"}
    />
  );
}

export function PlantelSelectorSummary({
  selecciones,
  selectedSeleccionId,
  selectedSeleccion,
  totalJugadores,
  canCreate,
  importingApi,
  onSeleccionChange,
  onImportFromApi,
}: PlantelSelectorSummaryProps) {
  const actionsDisabled = !canCreate;

  return (
    <section className="min-w-0 rounded-3xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm md:p-5">
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(320px,1fr)_auto] xl:items-end">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Selección
          </label>

          <Select value={selectedSeleccionId} onValueChange={onSeleccionChange}>
            <SelectTrigger className="h-14 w-full rounded-2xl border-slate-200 bg-white px-4 shadow-sm transition hover:border-slate-300 focus:ring-2 focus:ring-[#39A935]/20">
              {selectedSeleccion ? (
                <div className="flex min-w-0 items-center gap-3">
                  <SeleccionFlag seleccion={selectedSeleccion} />

                  <div className="min-w-0 text-left">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {selectedSeleccion.nombre}
                    </p>

                    {selectedSeleccion.codigo ? (
                      <p className="text-xs font-medium uppercase text-slate-500">
                        {selectedSeleccion.codigo}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400">
                        Selección activa
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <span className="text-sm text-slate-400">
                  Seleccioná una selección
                </span>
              )}
            </SelectTrigger>

            <SelectContent className="rounded-2xl">
              {selecciones.map((seleccion) => (
                <SelectItem key={seleccion.id} value={seleccion.id}>
                  <div className="flex items-center gap-3">
                    <SeleccionFlag seleccion={seleccion} size="sm" />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {seleccion.nombre}
                      </p>

                      {seleccion.codigo ? (
                        <p className="text-xs uppercase text-slate-500">
                          {seleccion.codigo}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onImportFromApi}
          disabled={actionsDisabled || importingApi || !selectedSeleccionId}
          className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-sm font-semibold shadow-sm transition hover:bg-slate-50 xl:min-w-[210px]"
        >
          <Download className="mr-2 h-4 w-4" />
          {importingApi ? (
            <span className="inline-flex items-center gap-2">
              <RefreshCw className="animate-spin" size={18} />
              { "Importando..."}
            </span>
          ) : (
            "Importar"
          )}
        </Button>
      </div>

      <div className="mt-4 grid min-w-0 gap-4 2xl:grid-cols-2">
        <SummaryCard
          title="Selección activa"
          value={selectedSeleccion?.nombre ?? "Sin seleccionar"}
          icon={
            <SeleccionFlag seleccion={selectedSeleccion} size="lg" />
          }
        />

        <SummaryCard
          title="Plantel cargado"
          value={`${totalJugadores} ${totalJugadores === 1 ? "Futbolista convocado." : "Futbolistas convocados."
            }`}
          icon={
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#39A935]/10 text-[#247A28]">
              <Users className="h-5 w-5" />
            </div>
          }
        />
      </div>
    </section>
  );
}
