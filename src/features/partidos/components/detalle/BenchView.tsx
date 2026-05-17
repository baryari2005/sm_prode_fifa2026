import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { TeamLineup } from "@/features/partidos/types/fixture-details";

type BenchViewProps = {
  title: string;
  lineup: TeamLineup;
};

export function BenchView({ title, lineup }: BenchViewProps) {
  return (
    <Card className="border-white/70 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>{`Suplentes de ${title}`}</CardTitle>
        <CardDescription>
          {lineup.entrenador
            ? `Director técnico: ${lineup.entrenador}`
            : "Sin DT cargado"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {lineup.suplentes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay suplentes cargados.
          </p>
        ) : (
          <div className="space-y-3">
            {lineup.suplentes.map((player) => (
              <div
                key={`${title}-bench-${player.jugadorId}`}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-3"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {player.nombre} {player.numero ? `#${player.numero}` : ""}
                  </p>

                  <p className="text-sm text-slate-500">
                    {player.posicion}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  {player.goals > 0 && <span>{`⚽ ${player.goals}`}</span>}
                  {player.yellow && <span>🟨</span>}
                  {player.red && <span>🟥</span>}
                  {player.substituted && <span>↕</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}