import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { TeamLineup } from "@/features/partidos/types/fixture-details";
import { getLineupPositions } from "@/features/partidos/lib/lineup-layout";

import { LineupPlayerMarker } from "./LineupPlayerMarker";

type LineupViewProps = {
  title: string;
  lineup: TeamLineup;
  side: "top" | "bottom";
};

export function LineupView({ title, lineup, side }: LineupViewProps) {
  const players = useMemo(
    () => getLineupPositions(lineup.titulares, side, lineup.formacion),
    [lineup.formacion, lineup.titulares, side]
  );

  return (
    <Card className="border-white/70 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {lineup.formacion || "Formación sin cargar"}
          {lineup.entrenador ? ` · DT ${lineup.entrenador}` : ""}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="relative min-h-[620px] overflow-hidden rounded-[2rem] bg-[#35A94D] p-6 text-white">
          <div className="absolute inset-6 rounded-[1.5rem] border border-white/25" />
          <div className="absolute left-1/2 top-6 h-[calc(100%-3rem)] w-px -translate-x-1/2 bg-white/25" />
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />

          {players.length === 0 ? (
            <div className="relative z-10 flex min-h-[560px] items-center justify-center text-center text-sm font-medium text-white/85">
              No hay alineación cargada para este equipo.
            </div>
          ) : (
            players.map((player) => (
              <LineupPlayerMarker
                key={`${title}-${player.jugadorId}`}
                player={player}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}