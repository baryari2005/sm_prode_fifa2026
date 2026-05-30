"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type ReimportarPartidosHeaderProps = {
  canRun: boolean;
  running: boolean;
  onRun: () => void;
};

export function ReimportarPartidosHeader({
  canRun,
  running,
  onRun,
}: ReimportarPartidosHeaderProps) {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-2xl font-semibold text-white">
              <AlertTriangle className="h-6 w-6 text-[#FFE4A3]" />
              Reimportacion total del fixture
            </div>
          </div>
          <p className="text-sm leading-6 text-white/68">
            Borra partidos, resultados, predicciones, selecciones y planteles
            para reconstruir el fixture desde cero usando la API.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:items-center">
          <Button
            type="button"
            onClick={onRun}
            disabled={!canRun || running}
            className="h-11 rounded-2xl bg-[#FAB438] font-bold text-[#1E2C46] transition hover:bg-[#F7C45A]"
          >
            {running ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Reimportando...
              </>
            ) : (
              "Borrar y reimportar desde API"
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
