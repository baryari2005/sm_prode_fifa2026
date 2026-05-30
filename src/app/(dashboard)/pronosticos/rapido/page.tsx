"use client";

import { Suspense } from "react";
import { RefreshCcw } from "lucide-react";

import { PronosticoRapidoContent } from "@/features/pronosticos/components/rapido/PronosticoRapidoContent";

export default function PronosticoRapidoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-white/[0.06] px-5 py-4 text-white shadow-[0_18px_40px_rgba(0,0,0,0.08)] backdrop-blur-sm">
            <RefreshCcw className="h-5 w-5 animate-spin text-[#AEEBFF]" />
            <div>
              <p className="text-sm font-black text-white">
                Cargando pronósticos rápidos
              </p>
              <p className="text-xs font-semibold text-white/58">
                Preparando partidos y formulario de carga.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <PronosticoRapidoContent />
    </Suspense>
  );
}
