"use client";

import { EstadoPartido } from "@prisma/client";
import {
  Clock3,
  Radio,
  RefreshCw,
  ShieldCheck,
  Siren,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LiveControlGoalDialog } from "@/features/live-control/components/LiveControlGoalDialog";
import {
  LIVE_CONTROL_CRITICAL_BUTTON_CLASSNAME,
  LIVE_CONTROL_SECONDARY_BUTTON_CLASSNAME,
  LIVE_CONTROL_STATUS_BADGE_CLASSNAME,
  LIVE_CONTROL_SUBCARD_CLASSNAME,
  LiveControlSurface,
} from "@/features/live-control/components/LiveControlSurface";
import type {
  LiveAuditEntry,
  LiveControlMatch,
} from "@/features/live-control/types/live-control.types";

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

function getStatusBadgeClassName(status: EstadoPartido) {
  if (status === EstadoPartido.EN_JUEGO) {
    return "rounded-full border-emerald-300/18 bg-emerald-400/14 text-emerald-100 hover:bg-emerald-400/14";
  }

  if (status === EstadoPartido.ENTRETIEMPO) {
    return "rounded-full border-[#FAB438]/18 bg-[#FAB438]/10 text-[#FFE4A3] hover:bg-[#FAB438]/10";
  }

  if (status === EstadoPartido.FINALIZADO) {
    return "rounded-full border-white/14 bg-white/[0.08] text-white/82 hover:bg-white/[0.08]";
  }

  return LIVE_CONTROL_STATUS_BADGE_CLASSNAME;
}

function getSourceBadgeClassName(source: LiveControlMatch["liveSnapshot"]["source"]) {
  if (source === "MANUAL") {
    return "rounded-full border-emerald-300/18 bg-emerald-400/14 text-emerald-100 hover:bg-emerald-400/14";
  }

  if (source === "MIXTO") {
    return "rounded-full border-[#FAB438]/18 bg-[#FAB438]/10 text-[#FFE4A3] hover:bg-[#FAB438]/10";
  }

  return "rounded-full border-white/14 bg-white/[0.08] text-white/74 hover:bg-white/[0.08]";
}

export function LiveMatchCard({
  match,
  syncing,
  onSync,
  onManualGoal,
  onStatusChange,
  onSelectTools,
}: Props) {
  return (
    <LiveControlSurface contentClassName="p-5">
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full border-[#5993B6]/18 bg-[#5993B6]/10 text-[#AEEBFF] hover:bg-[#5993B6]/10">
                {match.fase?.nombre ?? "Sin fase"}
              </Badge>
              <Badge className={getStatusBadgeClassName(match.liveSnapshot.estado)}>
                {STATUS_LABELS[match.liveSnapshot.estado]}
              </Badge>
              <Badge className={getSourceBadgeClassName(match.liveSnapshot.source)}>
                {match.liveSnapshot.source}
              </Badge>
            </div>

            <div>
              <h3 className="font-brand text-[1.65rem] leading-none tracking-[0.04em] text-white">
                {match.seleccionLocal?.nombre} vs {match.seleccionVisitante?.nombre}
              </h3>
              <p className="mt-2 text-sm text-white/64">
                {new Date(match.fecha).toLocaleString("es-AR")} ·{" "}
                {match.fase?.nombre ?? "Sin fase"}
              </p>
            </div>
          </div>

          <div className={`${LIVE_CONTROL_SUBCARD_CLASSNAME} flex items-center gap-2 px-4 py-2.5`}>
            <Clock3 className="h-4 w-4 text-[#FAB438]" />
            <span className="text-sm font-semibold text-white/72">Minuto</span>
            <span className="font-brand text-[1.45rem] leading-none tracking-[0.03em] text-white">
              {match.liveSnapshot.tiempoJuego
                ? `${match.liveSnapshot.tiempoJuego}'`
                : "S/M"}
            </span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div className={`${LIVE_CONTROL_SUBCARD_CLASSNAME} p-4 text-center md:text-right`}>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
              Local
            </p>
            <p className="mt-2 text-lg font-semibold text-white md:text-xl">
              {match.seleccionLocal?.nombre}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#081523] px-5 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/46">
              Marcador
            </p>
            <p className="mt-2 font-brand text-[2.55rem] leading-none tracking-[0.05em] text-white">
              {match.liveSnapshot.score.local} - {match.liveSnapshot.score.visitante}
            </p>
          </div>

          <div className={`${LIVE_CONTROL_SUBCARD_CLASSNAME} p-4 text-center md:text-left`}>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
              Visitante
            </p>
            <p className="mt-2 text-lg font-semibold text-white md:text-xl">
              {match.seleccionVisitante?.nombre}
            </p>
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
          <Button
            type="button"
            size="sm"
            variant="outline"
            className={LIVE_CONTROL_SECONDARY_BUTTON_CLASSNAME}
            onClick={() =>
              void onStatusChange({
                partidoId: match.id,
                estado: EstadoPartido.EN_JUEGO,
                minuto: match.liveSnapshot.tiempoJuego ?? 1,
              })
            }
          >
            Marcar en vivo
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className={LIVE_CONTROL_SECONDARY_BUTTON_CLASSNAME}
            onClick={() =>
              void onStatusChange({
                partidoId: match.id,
                estado: EstadoPartido.ENTRETIEMPO,
                minuto: 45,
              })
            }
          >
            Entretiempo
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className={LIVE_CONTROL_CRITICAL_BUTTON_CLASSNAME}
            onClick={() =>
              void onStatusChange({
                partidoId: match.id,
                estado: EstadoPartido.FINALIZADO,
                minuto: 90,
              })
            }
          >
            <Siren className="h-4 w-4" />
            Finalizar partido
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className={LIVE_CONTROL_SECONDARY_BUTTON_CLASSNAME}
            onClick={() => onSelectTools(match.id)}
          >
            Herramientas tecnicas
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => void onSync(match.id)}
            disabled={syncing}
            className="rounded-2xl"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            Sincronizar ahora
          </Button>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className={`${LIVE_CONTROL_SUBCARD_CLASSNAME} p-4`}>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <ShieldCheck className="h-4 w-4 text-[#AEEBFF]" />
              Eventos live
            </div>
            <div className="space-y-2">
              {match.eventosLive.length === 0 ? (
                <p className="text-sm text-white/58">Sin eventos todavia.</p>
              ) : (
                match.eventosLive.slice(0, 8).map((event) => (
                  <div
                    key={event.id}
                    className="rounded-2xl border border-white/8 bg-[#0E1D30]/72 px-3 py-2 text-sm text-white/76"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="rounded-full border-white/12 bg-white/[0.08] text-white/82 hover:bg-white/[0.08]">
                        {event.tipo}
                      </Badge>
                      <span>{event.minuto ? `${event.minuto}'` : "s/min"}</span>
                      <Badge className={getSourceBadgeClassName(event.source)}>
                        {event.source}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-white/68">
                      {event.descripcion ?? "Sin descripcion"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={`${LIVE_CONTROL_SUBCARD_CLASSNAME} p-4`}>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <Radio className="h-4 w-4 text-[#FAB438]" />
              Auditoria reciente
            </div>
            <div className="space-y-2">
              {match.liveAudits.length === 0 ? (
                <p className="text-sm text-white/58">Sin auditoria todavia.</p>
              ) : (
                match.liveAudits.slice(0, 5).map((audit: LiveAuditEntry) => (
                  <div
                    key={audit.id}
                    className="rounded-2xl border border-white/8 bg-[#0E1D30]/72 px-3 py-2 text-sm text-white/74"
                  >
                    <span className="font-semibold text-white">
                      {audit.user?.email ?? audit.userId}
                    </span>{" "}
                    · {audit.accion} ·{" "}
                    {new Date(audit.createdAt).toLocaleString("es-AR")}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </LiveControlSurface>
  );
}
