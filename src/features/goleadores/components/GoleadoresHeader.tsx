"use client";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Goal, Search, Upload, Wand2 } from "lucide-react";

type Props = {
  total: number;
  source: "api" | "mock" | "db" | null;
  busqueda: string;
  onBusquedaChange: (value: string) => void;
  cargandoApi: boolean;
  cargandoMock: boolean;
  onCargarDesdeApi: () => void;
  onCargarDesdeMock: () => void;
};

export function GoleadoresHeader({
  total,
  source,
  busqueda,
  onBusquedaChange,
  cargandoApi,
  cargandoMock,
  onCargarDesdeApi,
  onCargarDesdeMock,
}: Props) {
  return (
    <>
      <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle className="flex items-center gap-2 text-2xl text-slate-950">
                <Goal className="h-6 w-6" />
                Goleadores
              </CardTitle>

              <Badge className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 hover:bg-amber-50">
                {total} cargados
              </Badge>

              {source && (
                <Badge
                  variant="outline"
                  className="rounded-full border-slate-200 px-3 py-1 text-sm font-medium text-slate-700"
                >
                  Fuente: {source === "api" ? "API" : source === "db" ? "Base" : "Mock"}
                </Badge>
              )}
            </div>

            <CardDescription className="text-sm text-slate-500">
              Ranking de goleadores del Mundial 2026 para consulta rápida.
            </CardDescription>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:items-center">
            <Button
              type="button"
              onClick={onCargarDesdeApi}
              disabled={cargandoApi}
              variant="outline"
              className="h-11 rounded-xl border-slate-200 bg-white px-4"
            >
              <Upload className={`mr-2 h-4 w-4 ${cargandoApi ? "animate-spin" : ""}`} />
              Cargar desde API
            </Button>

            <Button
              type="button"
              onClick={onCargarDesdeMock}
              disabled={cargandoMock}
              variant="outline"
              className="h-11 rounded-xl border-dashed border-slate-300 bg-slate-50 px-4"
            >
              <Wand2 className={`mr-2 h-4 w-4 ${cargandoMock ? "animate-spin" : ""}`} />
              Cargar desde mock
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-4 md:px-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            placeholder="Buscar por jugador, selección, nacionalidad o posición..."
            className="h-11 rounded-xl border-slate-200 bg-white pl-12 text-sm shadow-none focus-visible:ring-[#FDBB30]/30"
          />
        </div>
      </CardContent>
    </>
  );
}
