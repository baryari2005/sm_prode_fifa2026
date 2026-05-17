"use client";

import {
  CalendarDays,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Props = {
  total: number;
  busqueda: string;
  onBusquedaChange: (value: string) => void;
  onActualizar: () => void;
};

export function PronosticosHeader({
  total,
  busqueda,
  onBusquedaChange,
  onActualizar,
}: Props) {
  return (
    <>
      <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CalendarDays className="h-6 w-6" />
                Mis pronosticos
              </CardTitle>

              <Badge className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 hover:bg-green-50">
                {total} partidos
              </Badge>
            </div>

            <CardDescription className="text-sm text-slate-500">
              Carga o edita tus resultados hasta 1 hora antes del inicio de cada
              partido.
            </CardDescription>
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
              placeholder="Buscar por seleccion, fase o estadio..."
              className="h-11 rounded-xl border-slate-200 bg-white pl-12 text-sm shadow-none focus-visible:ring-[#008C93]/30"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onActualizar}
            className="h-11 cursor-pointer rounded-xl border-slate-200 bg-white px-4"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-11 cursor-pointer rounded-xl border-slate-200 bg-white px-6 md:w-auto"
          >
            <SlidersHorizontal className="mr-2 h-5 w-5" />
            Filtros
          </Button>
        </div>
      </CardContent>
    </>
  );
}
