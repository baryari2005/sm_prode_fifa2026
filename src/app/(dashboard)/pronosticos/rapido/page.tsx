"use client";

import { Suspense } from "react";
import { RefreshCcw } from "lucide-react";

import { PronosticoRapidoContent } from "@/features/pronosticos/components/rapido/PronosticoRapidoContent";

export default function PronosticoRapidoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[58vh] items-center justify-center px-4">
          <div className="flex items-center gap-3 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(30,44,70,0.96),rgba(37,53,80,0.92))] px-5 py-4 text-white shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
            <RefreshCcw className="h-5 w-5 animate-spin text-[#AEEBFF]" />
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-white">
                Cargando pronosticos rapidos
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
