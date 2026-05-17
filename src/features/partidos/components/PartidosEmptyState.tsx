"use client";

import { CalendarDays, Plus, RefreshCw, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type PartidosEmptyStateProps = {
  hasPartidos: boolean;
  canCrearPartidos: boolean;
  cargandoApi: boolean;
  onCargarDesdeApi: () => void;
  onNuevoPartido: () => void;
};

export function PartidosEmptyState({
  hasPartidos,
  canCrearPartidos,
  cargandoApi,
  onCargarDesdeApi,
  onNuevoPartido,
}: PartidosEmptyStateProps) {
  return (
    <Card className="rounded-[2rem] border-white/80 bg-white shadow-sm">
      <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-700">
          <CalendarDays className="h-8 w-8" />
        </div>

        <h3 className="mb-2 text-xl font-black text-slate-950">
          {hasPartidos ? "No se encontraron partidos" : "No hay partidos registrados"}
        </h3>

        <p className="mb-6 max-w-md text-sm text-slate-500">
          {hasPartidos
            ? "Probá cambiando el texto de búsqueda o actualizando el listado."
            : "Todavía no hay partidos cargados. Podés cargarlos desde la API o crearlos manualmente."}
        </p>

        {canCrearPartidos && !hasPartidos && (
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              onClick={onCargarDesdeApi}
              disabled={cargandoApi}
              className="rounded-2xl"
            >
              {cargandoApi ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Cargar desde API
            </Button>

            <Button
              variant="outline"
              onClick={onNuevoPartido}
              className="rounded-2xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear manualmente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}