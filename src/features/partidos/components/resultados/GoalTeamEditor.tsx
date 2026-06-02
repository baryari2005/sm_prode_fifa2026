"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CircleDot, Trash2, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { GoalDetail } from "@/features/partidos/types/fixture-details";
import type { JugadorSeleccion } from "@/features/partidos/types/types";

type GoalTeamEditorProps = {
  title: string;
  flagUrl?: string | null;
  players: JugadorSeleccion[];
  items: GoalDetail[];
  onChange: (items: GoalDetail[]) => void;
};

type GoalDetailView = GoalDetail & {
  jugadorId?: string | null;
  jugadorNombre?: string | null;
  nombreJugador?: string | null;
  minuto?: number | string | null;
  penal?: boolean | null;
  esPenal?: boolean | null;
};

export function GoalTeamEditor({
  title,
  flagUrl,
  players,
  items,
  onChange,
}: GoalTeamEditorProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [minute, setMinute] = useState("");
  const [isPenalty, setIsPenalty] = useState(false);

  const playersById = useMemo(() => {
    return new Map(players.map((player) => [player.id, player]));
  }, [players]);

  const selectedPlayer = selectedPlayerId
    ? playersById.get(selectedPlayerId)
    : null;

  const canAddGoal = Boolean(selectedPlayer) && minute.trim() !== "";

  const handleAddGoal = () => {
    if (!selectedPlayer || !canAddGoal) return;

    const newGoal = {
      nombre: selectedPlayer.nombre,
      jugadorId: selectedPlayer.id,
      jugadorNombre: selectedPlayer.nombre,
      minuto: Number(minute),
      penal: isPenalty,
      esPenal: isPenalty,
    } as GoalDetail;

    onChange([...items, newGoal]);

    setSelectedPlayerId("");
    setMinute("");
    setIsPenalty(false);
  };

  const handleRemoveGoal = (indexToRemove: number) => {
    onChange(items.filter((_, index) => index !== indexToRemove));
  };

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-950">{title}</h3>
            <div className="flex h-6 w-8 shrink-0 items-center justify-center overflow-hidden ">
              {flagUrl ? (
                <Image
                  src={flagUrl}
                  alt={`Bandera de ${title}`}
                  width={32}
                  height={24}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-semibold text-slate-400">--</span>
              )}
            </div>

          </div>

        </div>

        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
          {items.length} gol{items.length === 1 ? "" : "es"}
        </span>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-3 shadow-sm">
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Quien hizo el gol
            </p>
            <p className="text-sm text-slate-500">
              Elegi jugador, minuto y si el tanto fue de penal. Este detalle se guarda junto al resultado oficial.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {players.map((player) => {
              const isSelected = selectedPlayerId === player.id;

              return (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => setSelectedPlayerId(player.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    isSelected
                      ? "border-[#008C93]/40 bg-[#008C93]/10 text-[#006A70]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#008C93]/25 hover:text-slate-900"
                  }`}
                >
                  {player.nombre}
                </button>
              );
            })}
          </div>

          <div className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_110px] xl:grid-cols-[minmax(220px,1fr)_110px_110px_150px]">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Jugador
              </label>
              <Select
                value={selectedPlayerId}
                onValueChange={setSelectedPlayerId}
                disabled={players.length === 0}
              >
                <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white text-base shadow-sm">
                  <SelectValue placeholder="Seleccioná un jugador" />
                </SelectTrigger>

                <SelectContent>
                  {players.map((player) => (
                    <SelectItem
                      key={player.id}
                      value={player.id}
                      className="py-2 text-base"
                    >
                      {player.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Minuto
              </label>
              <Input
                type="text"
                inputMode="numeric"
                value={minute}
                placeholder="12"
                onFocus={(event) => {
                  event.currentTarget.select();
                }}
                onMouseUp={(event) => {
                  event.preventDefault();
                }}
                onChange={(event) => {
                  const onlyNumbers = event.target.value.replace(/\D/g, "");

                  setMinute(onlyNumbers);
                }}
                onPaste={(event) => {
                  event.preventDefault();

                  const pastedText = event.clipboardData.getData("text");
                  const onlyNumbers = pastedText.replace(/\D/g, "");

                  setMinute(onlyNumbers);
                }}
                className="h-10 rounded-xl border-slate-200 bg-white text-center font-semibold text-slate-950 shadow-sm focus-visible:ring-2 focus-visible:ring-[#008C93]/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Tipo
              </label>
              <label className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm">
                <input
                  type="checkbox"
                  checked={isPenalty}
                  onChange={(event) => {
                    setIsPenalty(event.target.checked);
                  }}
                  className="h-4 w-4 rounded border-slate-300 accent-[#008C93]"
                />

                <span>Penal</span>
              </label>
            </div>

            <Button
              type="button"
              onClick={handleAddGoal}
              disabled={!canAddGoal}
              className="h-10 rounded-xl bg-[#008C93] px-6 text-sm font-semibold text-white shadow-sm hover:bg-[#00757B]"
            >
              <CircleDot className="mr-2 h-4 w-4" />
              Agregar gol
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/75 shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Goles cargados
          </p>
        </div>

        {items.length === 0 ? (
          <div className="px-4 py-4 text-sm text-slate-500">
            Sin goles cargados.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item, index) => {
              const goal = item as GoalDetailView;

              const playerName =
                goal.nombre ??
                goal.jugadorNombre ??
                goal.nombreJugador ??
                playersById.get(goal.jugadorId ?? "")?.nombre ??
                "Jugador sin identificar";

              const goalMinute = goal.minuto ?? "-";
              const goalIsPenalty = Boolean(goal.penal ?? goal.esPenal);
              const playerData = goal.jugadorId
                ? playersById.get(goal.jugadorId)
                : null;
              const playerImageUrl = playerData?.fotoUrl ?? null;
              const playerNumber = playerData?.numero;

              return (
                <div
                  key={`${playerName}-${goalMinute}-${index}`}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 text-sm font-black text-slate-700">
                      {playerImageUrl ? (
                        <Image
                          src={playerImageUrl}
                          alt={playerName}
                          width={32}
                          height={32}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      ) : playerNumber ? (
                        <span>{playerNumber}</span>
                      ) : (
                        <UserRound className="h-5 w-5 text-slate-500" />
                      )}
                    </div>

                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-950">
                        {playerName}
                      </p>

                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-600">
                        {goalMinute}&apos;
                      </span>

                      {goalIsPenalty ? (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                          Penal
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveGoal(index)}
                    className="h-9 w-9 shrink-0 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Eliminar gol de ${playerName}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
