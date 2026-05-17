"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    <CardHeader className="border-b border-rose-100 px-5 py-5 md:px-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="flex items-center gap-2 text-2xl text-rose-700">
              <AlertTriangle className="h-6 w-6" />
              Reimportacion total del fixture
            </CardTitle>
          </div>
          <CardDescription className="text-sm text-slate-500">
            Borra partidos, resultados, predicciones, selecciones y planteles
            para reconstruir el fixture desde cero usando la API.
          </CardDescription>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:items-center">
          <Button
            type="button"
            onClick={onRun}
            disabled={!canRun || running}
            className="h-11 rounded-2xl bg-rose-600 font-bold text-white transition hover:bg-rose-700"
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
    </CardHeader>
  );
}
