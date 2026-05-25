"use client";

import { EstadoPartido } from "@prisma/client";
import { Clock3, RefreshCw, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LiveControlGoalDialog } from "@/features/live-control/components/LiveControlGoalDialog";
import type { LiveAuditEntry, LiveControlMatch } from "@/features/live-control/types/live-control.types";

const STATUS_LABELS: Record<EstadoPartido, string> = {
  PENDIENTE: "Programado",
  EN_JUEGO: "En vivo",
  ENTRETIEMPO: "Entretiempo",
  FINALIZADO: "Finalizado",
  SUSPENDIDO: "Suspendido",
  CANCELADO: "Cancelado",
};

type Props = {
  match: LiveControlMatch;
  syncing: boolean;
  onSync: (partidoId: string) => Promise<void>;
  onManualGoal: (payload: {
    partidoId: string;
    team: "LOCAL" | "VISITANTE";
    minute: number;
    playerId?: string;
    description?: string;
  }) => Promise<void>;
  onStatusChange: (payload: {
    partidoId: string;
    estado: EstadoPartido;
    minuto?: number | null;
    observacion?: string | null;
  }) => Promise<void>;
  onSelectTools: (partidoId: string) => void;
};

export function LiveMatchCard({
  match,
  syncing,
  onSync,
  onManualGoal,
  onStatusChange,
  onSelectTools,
}: Props) {
  return (
    <Card className="overflow-hidden rounded-[28px] border-white/70 bg-gradient-to-br from-white via-white to-sky-50 shadow-sm">
      <CardHeader className="gap-3 border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg text-slate-900">
              {match.seleccionLocal?.nombre} vs {match.seleccionVisitante?.nombre}
            </CardTitle>
            <p className="text-sm text-slate-500">
              {new Date(match.fecha).toLocaleString("es-AR")} · {match.fase?.nombre}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{STATUS_LABELS[match.liveSnapshot.estado]}</Badge>
            <Badge variant="outline">{match.liveSnapshot.source}</Badge>
            <Badge className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">
              <Clock3 className="mr-1 h-3.5 w-3.5" />
              {match.liveSnapshot.tiempoJuego ? `${match.liveSnapshot.tiempoJuego}'` : "Sin minuto"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div className="text-center md:text-right">
            <p className="text-sm text-slate-500">Local</p>
            <p className="text-xl font-semibold text-slate-900">{match.seleccionLocal?.nombre}</p>
          </div>
          <div className="rounded-3xl bg-slate-950 px-5 py-3 text-center text-3xl font-black tracking-tight text-white shadow-sm">
            {match.liveSnapshot.score.local} - {match.liveSnapshot.score.visitante}
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm text-slate-500">Visitante</p>
            <p className="text-xl font-semibold text-slate-900">{match.seleccionVisitante?.nombre}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <LiveControlGoalDialog
            partidoId={match.id}
            triggerLabel="+ Gol local"
            defaultTeam="LOCAL"
            onSubmit={onManualGoal}
          />
          <LiveControlGoalDialog
            partidoId={match.id}
            triggerLabel="+ Gol visitante"
            defaultTeam="VISITANTE"
            onSubmit={onManualGoal}
          />
          <Button type="button" size="sm" variant="outline" onClick={() => void onStatusChange({ partidoId: match.id, estado: EstadoPartido.EN_JUEGO, minuto: match.liveSnapshot.tiempoJuego ?? 1 })}>
            Marcar en vivo
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => void onStatusChange({ partidoId: match.id, estado: EstadoPartido.ENTRETIEMPO, minuto: 45 })}>
            Entretiempo
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => void onStatusChange({ partidoId: match.id, estado: EstadoPartido.FINALIZADO, minuto: 90 })}>
            Finalizar partido
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => onSelectTools(match.id)}>
            Herramientas técnicas
          </Button>
          <Button type="button" size="sm" onClick={() => void onSync(match.id)} disabled={syncing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            Sincronizar ahora
          </Button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/80 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Eventos live
          </div>
          <div className="space-y-2">
            {match.eventosLive.length === 0 ? (
              <p className="text-sm text-slate-500">Sin eventos todavía.</p>
            ) : (
              match.eventosLive.slice(0, 8).map((event) => (
                <div key={event.id} className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
                  <Badge variant="outline">{event.tipo}</Badge>
                  <span>{event.minuto ? `${event.minuto}'` : "s/min"}</span>
                  <span>{event.descripcion ?? "Sin descripción"}</span>
                  <Badge className={event.source === "MANUAL" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-700 hover:bg-slate-100"}>
                    {event.source}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-slate-800">Auditoría reciente</h3>
          <div className="space-y-2">
            {match.liveAudits.length === 0 ? (
              <p className="text-sm text-slate-500">Sin auditoría todavía.</p>
            ) : (
              match.liveAudits.slice(0, 5).map((audit: LiveAuditEntry) => (
                <div key={audit.id} className="text-sm text-slate-700">
                  <span className="font-medium">{audit.user?.email ?? audit.userId}</span> · {audit.accion} ·{" "}
                  {new Date(audit.createdAt).toLocaleString("es-AR")}
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
