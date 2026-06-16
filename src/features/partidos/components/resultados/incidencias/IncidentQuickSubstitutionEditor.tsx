"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { buildSubstitutionBatchIncidents } from "@/features/partidos/components/resultados/incidencias/incident-quick-editor.helpers";
import type { MatchIncident, TeamLineup } from "@/features/partidos/types/fixture-details";

const QUICK_FIELD =
  "border-white/10 bg-white/[0.08] text-white shadow-none placeholder:text-white/30 focus-visible:ring-2 focus-visible:ring-[#5993B6]/40";

type DraftRow = {
  jugadorSaleId: string;
  jugadorEntraId: string;
  minuto: string;
  descripcion: string;
};

type Props = {
  teamLabel: string;
  teamSide: "local" | "visitante";
  lineup: TeamLineup;
  onAddIncidents: (incidents: MatchIncident[]) => void;
};

export function IncidentQuickSubstitutionEditor({
  teamLabel,
  teamSide,
  lineup,
  onAddIncidents,
}: Props) {
  const [selectedSaleId, setSelectedSaleId] = useState("");
  const [selectedEntraId, setSelectedEntraId] = useState("");
  const [minute, setMinute] = useState("1");
  const [description, setDescription] = useState("");
  const [draftRows, setDraftRows] = useState<DraftRow[]>([]);

  const starters = lineup.titulares;
  const bench = lineup.suplentes;

  const usedSaleIds = useMemo(
    () => new Set(draftRows.map((row) => row.jugadorSaleId)),
    [draftRows],
  );
  const usedEntraIds = useMemo(
    () => new Set(draftRows.map((row) => row.jugadorEntraId)),
    [draftRows],
  );

  function resetCurrentSelection() {
    setSelectedSaleId("");
    setSelectedEntraId("");
    setMinute("1");
    setDescription("");
  }

  const canAddDraftRow = Boolean(
    selectedSaleId &&
      selectedEntraId &&
      selectedSaleId !== selectedEntraId &&
      Number.isFinite(Number(minute)) &&
      Number(minute) >= 0 &&
      Number(minute) <= 130,
  );

  function addDraftRow() {
    const parsedMinute = Number(minute);
    if (
      !selectedSaleId ||
      !selectedEntraId ||
      selectedSaleId === selectedEntraId ||
      !Number.isFinite(parsedMinute) ||
      parsedMinute < 0 ||
      parsedMinute > 130
    ) {
      toast.error("Seleccioná quién sale, quién entra y un minuto válido");
      return;
    }

    setDraftRows((current) => [
      ...current,
      {
        jugadorSaleId: selectedSaleId,
        jugadorEntraId: selectedEntraId,
        minuto: minute,
        descripcion: description,
      },
    ]);
    resetCurrentSelection();
  }

  function removeDraftRow(index: number) {
    setDraftRows((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  function submitBatch() {
    const incidents = buildSubstitutionBatchIncidents({
      equipo: teamSide,
      lineup,
      rows: draftRows,
    });

    if (incidents.length === 0) {
      toast.error("Agregá al menos un cambio válido a la tanda");
      return;
    }

    onAddIncidents(incidents);
    setDraftRows([]);
    resetCurrentSelection();
    toast.success(`${incidents.length} cambio${incidents.length === 1 ? "" : "s"} agregado${incidents.length === 1 ? "" : "s"}`);
  }

  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
            Carga rapida de cambios
          </p>
          <p className="max-w-[760px] text-sm leading-6 text-white/68">
            Marcá quién sale desde titulares y quién entra desde suplentes. Podés dejar varios cambios en cola y guardarlos juntos.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-white/72">
          <span className="rounded-full border border-[#5993B6]/18 bg-[#5993B6]/10 px-3 py-1.5 text-[#AEEBFF]">
            {teamLabel}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">
            En cola: {draftRows.length}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <SelectionPanel
          title="Titulares · salen"
          players={starters}
          selectedId={selectedSaleId}
          usedIds={usedSaleIds}
          onSelect={setSelectedSaleId}
        />
        <SelectionPanel
          title="Suplentes · entran"
          players={bench}
          selectedId={selectedEntraId}
          usedIds={usedEntraIds}
          onSelect={setSelectedEntraId}
        />
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-[120px_minmax(0,1fr)_auto]">
        <Input
          value={minute}
          inputMode="numeric"
          placeholder="Minuto"
          onChange={(event) => setMinute(event.target.value.replace(/\D/g, ""))}
          className={`h-10 rounded-xl ${QUICK_FIELD}`}
        />
        <Textarea
          value={description}
          placeholder="Detalle opcional del cambio"
          onChange={(event) => setDescription(event.target.value)}
          className={`min-h-[72px] rounded-xl ${QUICK_FIELD}`}
        />
        <Button
          type="button"
          onClick={addDraftRow}
          disabled={!canAddDraftRow}
          className="rounded-xl bg-[#5993B6] text-white hover:bg-[#4B84A6]"
        >
          Agregar cambio
        </Button>
      </div>

      {draftRows.length > 0 ? (
        <div className="mt-4 space-y-3">
          {draftRows.map((row, index) => {
            const sale = starters.find((player) => player.jugadorId === row.jugadorSaleId);
            const entra = bench.find((player) => player.jugadorId === row.jugadorEntraId);

            return (
              <div
                key={`${row.jugadorSaleId}-${row.jugadorEntraId}-${index}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-white/10 bg-white/[0.05] px-4 py-3"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">
                    {row.minuto}' · Sale {sale?.nombre ?? "Jugador"} / Entra {entra?.nombre ?? "Jugador"}
                  </p>
                  {row.descripcion ? (
                    <p className="text-xs text-white/52">{row.descripcion}</p>
                  ) : null}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeDraftRow(index)}
                  className="rounded-xl border-white/12 bg-white/[0.05] text-white hover:bg-white/[0.1] hover:text-white"
                >
                  Quitar
                </Button>
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setDraftRows([]);
            resetCurrentSelection();
          }}
          className="rounded-xl border-white/12 bg-white/[0.05] text-white hover:bg-white/[0.1] hover:text-white"
        >
          Limpiar cambios
        </Button>
        <Button
          type="button"
          onClick={submitBatch}
          disabled={draftRows.length === 0}
          className="rounded-xl bg-[#5993B6] text-white hover:bg-[#4B84A6] disabled:bg-white/10 disabled:text-white/35"
        >
          Guardar cambios cargados
        </Button>
      </div>
    </div>
  );
}

function SelectionPanel({
  title,
  players,
  selectedId,
  usedIds,
  onSelect,
}: {
  title: string;
  players: TeamLineup["titulares"];
  selectedId: string;
  usedIds: Set<string>;
  onSelect: (playerId: string) => void;
}) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-3">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#AEEBFF]">
        {title}
      </p>
      <ScrollArea className="h-[220px] pr-3">
        <div className="space-y-2">
          {players.map((player) => {
            const selected = selectedId === player.jugadorId;
            const used = usedIds.has(player.jugadorId) && !selected;

            return (
              <button
                key={player.jugadorId}
                type="button"
                disabled={used}
                onClick={() => onSelect(player.jugadorId)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition-colors",
                  selected
                    ? "border-[#84F0C8]/45 bg-[#84F0C8]/12 text-white"
                    : used
                      ? "cursor-not-allowed border-white/8 bg-white/[0.03] text-white/30"
                      : "border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.1]",
                )}
              >
                <span className="text-sm font-medium">{player.nombre}</span>
                <span className="text-xs text-white/45">
                  {player.posicion}
                  {player.numero ? ` · #${player.numero}` : ""}
                </span>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
