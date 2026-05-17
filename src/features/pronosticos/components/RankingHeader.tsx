"use client";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal } from "lucide-react";

export function RankingHeader() {
  return (
    <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
      <div className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-2xl text-slate-950">
          <Medal className="h-6 w-6" />
          Ranking del Prode
        </CardTitle>

        <CardDescription className="text-sm text-slate-500">
          Seguí tu posición, tus puntos acumulados y el historial de pronósticos ya calificados.
        </CardDescription>
      </div>
    </CardHeader>
  );
}
