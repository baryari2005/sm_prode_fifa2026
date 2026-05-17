"use client";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, ListOrdered } from "lucide-react";

export function TablaPosicionesHeader() {  
  return (
    <>
      <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle className="flex items-center gap-2 text-2xl">
                  <ListOrdered className="h-6 w-6" />                
                Tabla de Posiciones
              </CardTitle>

            </div>

            <CardDescription className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span>Posiciones actuales de las selecciones en el Mundial 2026</span>
              <Info className="h-4 w-4 text-slate-400" />
            </CardDescription>
          </div>
        </div>
     </CardHeader>
    </>
  );
}