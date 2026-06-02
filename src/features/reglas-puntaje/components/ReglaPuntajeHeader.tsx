import type { ComponentType } from "react";
import { Info, Network, ShieldCheck } from "lucide-react";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ReglasPuntajeHeaderProps = {
  title?: string;
  icon?: ComponentType<{ className?: string }>;
  description?: string;
  faseNombre?: string | null;
  bloqueada?: boolean;
};

export function ReglasPuntajeHeader({
  title = "Reglas de puntaje",
  icon: Icon = Network,
  description = "Defini cuantos puntos recibe cada usuario por acierto en cada fase del torneo.",
  faseNombre,
  bloqueada = false,
}: ReglasPuntajeHeaderProps) {
  return (
    <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <CardTitle className="flex flex-wrap items-center gap-2 text-2xl text-slate-950">
            <Icon className="h-6 w-6" />
            {title}

            {faseNombre ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                <ShieldCheck className="h-3.5 w-3.5" />
                {faseNombre}
              </span>
            ) : null}
          </CardTitle>

          <CardDescription className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>{description}</span>
            <Info className="h-4 w-4 text-slate-400" />
          </CardDescription>
        </div>

        <div
          className={[
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
            bloqueada
              ? "bg-amber-100 text-amber-800"
              : "bg-emerald-100 text-emerald-700",
          ].join(" ")}
        >
          {bloqueada ? "Edición bloqueada" : "Configuración editable"}
        </div>
      </div>
    </CardHeader>
  );
}
