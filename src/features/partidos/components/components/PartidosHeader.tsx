"use client";

import {
  CalendarDays,
  Info,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PartidosHeaderProps = {
  cantidadPartidos: number;
  busqueda: string;
  onBusquedaChange: (value: string) => void;
  onActualizar: () => void;
  canCrearPartidos: boolean;
  canActualizarResultados: boolean;
  cargandoApi: boolean;
  actualizandoResultadosApi: boolean;
  actualizandoResultadosMock: boolean;
  onCargarDesdeApi: () => void;
  onActualizarResultadosDesdeApi: () => void;
  onActualizarResultadosMock: () => void;
  onNuevoPartido: () => void;
};

export function PartidosHeader({
  cantidadPartidos,
  busqueda,
  onBusquedaChange,
  onActualizar,
  canCrearPartidos,
  canActualizarResultados,
  cargandoApi,
  actualizandoResultadosApi,
  actualizandoResultadosMock,
  onCargarDesdeApi,
  onActualizarResultadosDesdeApi,
  onActualizarResultadosMock,
  onNuevoPartido,
}: PartidosHeaderProps) {  
  return (
    <>
      <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle className="flex items-center gap-2 text-2xl">
                  <CalendarDays className="h-6 w-6" />                
                Partidos
              </CardTitle>

              <Badge className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-50">
                {cantidadPartidos} cargados
              </Badge>
            </div>

            <CardDescription className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span>Administración de partidos de la primera fase</span>
              <Info className="h-4 w-4 text-slate-400" />
            </CardDescription>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:items-center">
            <Button
              type="button"
              variant="outline"
              onClick={onActualizar}
              className="h-11 rounded-xl border-slate-200 bg-white px-4 cursor-pointer"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualizar
            </Button>

            {(canCrearPartidos || canActualizarResultados) && (
              <>
                {canCrearPartidos && (
                  <Button
                    type="button"
                    onClick={onCargarDesdeApi}
                    disabled={cargandoApi}
                    variant="outline"
                    className="h-11 rounded-xl border-slate-200 bg-white px-4 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {cargandoApi ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    Cargar desde API
                  </Button>
                )}

                {canActualizarResultados && (
                  <>
                    <Button
                      type="button"
                      onClick={onActualizarResultadosDesdeApi}
                      disabled={actualizandoResultadosApi}
                      variant="outline"
                      className="h-11 rounded-xl border-slate-200 bg-white px-4 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {actualizandoResultadosApi ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      Actualizar resultados API
                    </Button>

                    <Button
                      type="button"
                      onClick={onActualizarResultadosMock}
                      disabled={actualizandoResultadosMock}
                      variant="outline"
                      className="h-11 rounded-xl border-dashed border-slate-300 bg-slate-50 px-4 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {actualizandoResultadosMock ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      Probar resultados mock
                    </Button>
                  </>
                )}

                {canCrearPartidos && (
                  <Button
                    type="button"
                    onClick={onNuevoPartido}
                     className="h-11 rounded-2xl bg-[#39A935] font-bold text-white shadow-lg shadow-green-700/20 transition hover:bg-[#247A28]"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo partido
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-4 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <Input
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              placeholder="Buscar por selección, estadio, ciudad o fase..."
              className="h-11 rounded-xl border-slate-200 bg-white pl-12 text-sm shadow-none focus-visible:ring-[#008C93]/30"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl border-slate-200 bg-white px-6 cursor-pointer md:w-auto"
          >
            <SlidersHorizontal className="mr-2 h-5 w-5" />
            Filtros
          </Button>
        </div>
      </CardContent>
    </>
  );
}
