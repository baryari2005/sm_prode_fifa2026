import { AlertTriangle, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ReglaCruce } from "@/features/partidos/types/types";
import type { PosicionEquipo } from "@/features/partidos/services/tabla-posiciones.service";

import { CruceMatchCard } from "./CruceMatchCard";

type CrucesFaseGroupProps = {
    faseNombre: string;
    reglas: ReglaCruce[];
    posiciones: PosicionEquipo[];
};

export function CrucesFaseGroup({
    faseNombre,
    reglas,
    posiciones,
}: CrucesFaseGroupProps) {
    return (
        <section className="rounded-[1.9rem] border border-slate-200/90 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.07)] md:p-5">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#008C93]/10 text-[#008C93]">
                        <Trophy className="h-5 w-5" />
                    </div>

                    <div className="flex min-w-0 items-center gap-2">
                        <h2 className="truncate text-lg font-extrabold tracking-[-0.02em] text-slate-950 md:text-xl">
                            {faseNombre}
                        </h2>
                        <Badge
                            variant="secondary"
                            className="rounded-full bg-[#008C93]/10 px-3 py-1 text-sm font-semibold text-[#008C93] hover:bg-[#008C93]/10"
                        >
                            {reglas.length} {reglas.length === 1 ? "partido" : "partidos"}
                        </Badge>
                    </div>
                </div>
                <div className="flex min-w-0 items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-[#008C93]" />
                    <span className="text-sm font-medium text-slate-500">
                        Los equipos se determinan según las posiciones finales de cada grupo.
                    </span>

                </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                {reglas.map((regla) => (
                    <CruceMatchCard
                        key={regla.id}
                        regla={regla}
                        posiciones={posiciones}
                    />
                ))}
            </div>
        </section>
    );
}