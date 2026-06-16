"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { buildPlayerBatchIncidents } from "@/features/partidos/components/resultados/incidencias/incident-quick-editor.helpers";
import type { IncidentType, MatchIncident } from "@/features/partidos/types/fixture-details";
import type { JugadorSeleccion } from "@/features/partidos/types/types";

const QUICK_FIELD =
  "border-white/10 bg-white/[0.08] text-white shadow-none placeholder:text-white/30 focus-visible:ring-2 focus-visible:ring-[#5993B6]/40";

type RowDraft = {
  playerId: string;
  minute: string;
  description: string;
  lesionTipo: string;
};

type Props = {
  tipo: Extract<IncidentType, "tarjeta_amarilla" | "tarjeta_roja" | "lesion">;
  teamLabel: string;
  teamSide: "local" | "visitante";
  players: JugadorSeleccion[];
  onAddIncidents: (incidents: MatchIncident[]) => void;
};

function titleForType(tipo: Props["tipo"]) {
  if (tipo === "tarjeta_amarilla") return "Carga rapida de amarillas";
  if (tipo === "tarjeta_roja") return "Carga rapida de rojas";
  return "Carga rapida de lesiones";
}

function descriptionForType(tipo: Props["tipo"]) {
  if (tipo === "lesion") {
    return "Usá una tabla compacta para completar minuto, tipo y detalle solo en los jugadores afectados.";
  }

  return "Completá el minuto de varios jugadores y guardá todas las tarjetas juntas en una sola acción.";
}

export function IncidentQuickPlayerBatchEditor({
  tipo,
  teamLabel,
  teamSide,
  players,
  onAddIncidents,
}: Props) {
  const selectablePlayers = useMemo(
    () => players.filter((player) => player.posicion?.trim().toUpperCase() !== "CT"),
    [players],
  );

  const [drafts, setDrafts] = useState<Record<string, RowDraft>>({});

  const activeRows = useMemo(
    () =>
      selectablePlayers.filter((player) => {
        const draft = drafts[player.id];
        return Boolean(
          draft?.minute.trim() ||
            draft?.description.trim() ||
            (tipo === "lesion" && draft?.lesionTipo.trim()),
        );
      }),
    [drafts, selectablePlayers, tipo],
  );

  function updateDraft(playerId: string, patch: Partial<RowDraft>) {
    setDrafts((current) => ({
      ...current,
      [playerId]: {
        playerId,
        minute: current[playerId]?.minute ?? "",
        description: current[playerId]?.description ?? "",
        lesionTipo: current[playerId]?.lesionTipo ?? "",
        ...patch,
      },
    }));
  }

  function clearDrafts() {
    setDrafts({});
  }

  function submitBatch() {
    const incidents = buildPlayerBatchIncidents({
      tipo,
      equipo: teamSide,
      players: selectablePlayers,
      rows: Object.values(drafts),
    });

    if (incidents.length === 0) {
      toast.error("Cargá al menos un minuto válido para agregar incidencias");
      return;
    }

    onAddIncidents(incidents);
    clearDrafts();
    toast.success(
      `${incidents.length} incidencia${incidents.length === 1 ? "" : "s"} agregada${incidents.length === 1 ? "" : "s"}`,
    );
  }

  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
            {titleForType(tipo)}
          </p>
          <p className="max-w-[760px] text-sm leading-6 text-white/68">
            {descriptionForType(tipo)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-white/72">
          <span className="rounded-full border border-[#5993B6]/18 bg-[#5993B6]/10 px-3 py-1.5 text-[#AEEBFF]">
            {teamLabel}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">
            Marcados: {activeRows.length}
          </span>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.04]">
        <div className="hidden grid-cols-[minmax(0,260px)_110px_minmax(0,1fr)] gap-3 border-b border-white/10 bg-white/[0.05] px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#AEEBFF] md:grid">
          <div>Jugador</div>
          <div>Minuto</div>
          <div>{tipo === "lesion" ? "Tipo y detalle" : "Detalle opcional"}</div>
        </div>

        <ScrollArea className="h-[420px] md:h-[430px]">
          <div className="divide-y divide-white/10">
            {selectablePlayers.map((player) => {
              const draft = drafts[player.id] ?? {
                playerId: player.id,
                minute: "",
                description: "",
                lesionTipo: "",
              };
              const active = Boolean(
                draft.minute.trim() ||
                  draft.description.trim() ||
                  (tipo === "lesion" && draft.lesionTipo.trim()),
              );

              return (
                <div
                  key={player.id}
                  className={cn(
                    "grid items-start gap-3 px-4 py-3 md:grid-cols-[minmax(0,260px)_110px_minmax(0,1fr)]",
                    active ? "bg-[#5993B6]/10" : "bg-transparent",
                  )}
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">{player.nombre}</p>
                    <p className="text-xs text-white/45">
                      {player.posicion || "Sin posicion"}
                      {player.numero ? ` · #${player.numero}` : ""}
                    </p>
                  </div>

                  <Input
                    value={draft.minute}
                    inputMode="numeric"
                    placeholder="Min"
                    onChange={(event) =>
                      updateDraft(player.id, {
                        minute: event.target.value.replace(/\D/g, ""),
                      })
                    }
                    className={`h-10 rounded-xl ${QUICK_FIELD}`}
                  />

                  <div className="space-y-2">
                    {tipo === "lesion" ? (
                      <Input
                        value={draft.lesionTipo}
                        placeholder="Tipo de lesion"
                        onChange={(event) =>
                          updateDraft(player.id, {
                            lesionTipo: event.target.value,
                          })
                        }
                        className={`h-10 rounded-xl ${QUICK_FIELD}`}
                      />
                    ) : null}

                    <Input
                      value={draft.description}
                      placeholder="Detalle opcional"
                      onChange={(event) =>
                        updateDraft(player.id, {
                          description: event.target.value,
                        })
                      }
                      className={`h-10 rounded-xl ${QUICK_FIELD}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={clearDrafts}
          className="rounded-xl border-white/12 bg-white/[0.05] text-white hover:bg-white/[0.1] hover:text-white"
        >
          Limpiar lote
        </Button>
        <Button
          type="button"
          onClick={submitBatch}
          disabled={activeRows.length === 0}
          className="rounded-xl bg-[#5993B6] text-white hover:bg-[#4B84A6] disabled:bg-white/10 disabled:text-white/35"
        >
          Agregar incidencias cargadas
        </Button>
      </div>
    </div>
  );
}
