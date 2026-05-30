"use client";

import { CalendarDays, Plus, RefreshCw, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DASHBOARD_PANEL,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";

type PartidosEmptyStateProps = {
  hasPartidos: boolean;
  canCrearPartidos: boolean;
  cargandoApi: boolean;
  onCargarDesdeApi: () => void;
  onNuevoPartido: () => void;
  variant?: "default" | "dashboard";
};

export function PartidosEmptyState({
  hasPartidos,
  canCrearPartidos,
  cargandoApi,
  onCargarDesdeApi,
  onNuevoPartido,
  variant = "default",
}: PartidosEmptyStateProps) {
  if (variant === "dashboard") {
    return (
      <section className={`${DASHBOARD_PANEL} rounded-[32px] p-5 md:p-6`}>
        <div className={DASHBOARD_TOP_LINE}>
          <div className={DASHBOARD_TOP_LINE_INNER} />
          <div className={DASHBOARD_TOP_LINE_SWEEP} />
          <div className={DASHBOARD_TOP_LINE_GLOW} />
          <div className={DASHBOARD_TOP_LINE_HAIR} />
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-16 text-center text-white">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#5993B6]/18 text-[#AEEBFF]">
            <CalendarDays className="h-8 w-8" />
          </div>

          <h3 className="mb-2 text-xl font-black text-white">
            {hasPartidos ? "No se encontraron partidos" : "No hay partidos registrados"}
          </h3>

          <p className="mb-6 max-w-md text-sm text-white/64">
            {hasPartidos
              ? "Proba cambiando el texto de busqueda o actualizando el listado."
              : "Todavia no hay partidos cargados. Podes cargarlos desde la API o crearlos manualmente."}
          </p>

          {canCrearPartidos && !hasPartidos ? (
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                onClick={onCargarDesdeApi}
                disabled={cargandoApi}
                className="rounded-2xl bg-[#FAB438] text-[#1E2C46] hover:bg-[#F7C45A]"
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
                className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15"
              >
                <Plus className="mr-2 h-4 w-4" />
                Crear manualmente
              </Button>
            </div>
          ) : null}
        </div>
      </section>
    );
  }

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
