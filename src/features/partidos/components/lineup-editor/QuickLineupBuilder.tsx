"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, RotateCcw, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  buildAssignmentsFromLineup,
  buildLineupFromQuickAssignments,
  buildQuickFormationGroups,
  isQuickFormationValid,
  resolveExpectedRoleForGroup,
  resolveQuickLineupRole,
} from "@/features/partidos/helpers/quick-lineup-builder.helpers";
import type { TeamLineup } from "@/features/partidos/types/fixture-details";
import type { JugadorSeleccion } from "@/features/partidos/types/types";

type Props = {
  lineup: TeamLineup;
  squad: JugadorSeleccion[];
  onApply: (lineup: TeamLineup) => void;
};

export function QuickLineupBuilder({ lineup, squad, onApply }: Props) {
  const groups = useMemo(
    () => buildQuickFormationGroups(lineup.formacion),
    [lineup.formacion],
  );

  const formationIsValid = useMemo(
    () => isQuickFormationValid(lineup.formacion),
    [lineup.formacion],
  );

  const [assignments, setAssignments] = useState<Record<string, string[]>>({});
  const [showAllByGroup, setShowAllByGroup] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!formationIsValid) {
      setAssignments({});
      setShowAllByGroup({});
      return;
    }

    setAssignments(buildAssignmentsFromLineup(lineup, groups));
  }, [formationIsValid, groups, lineup]);

  const assignedByGroup = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(assignments).map(([groupId, playerIds]) => [
          groupId,
          new Set(playerIds),
        ]),
      ) as Record<string, Set<string>>,
    [assignments],
  );

  const assignedElsewhere = useMemo(() => {
    const map = new Map<string, string>();

    Object.entries(assignments).forEach(([groupId, playerIds]) => {
      playerIds.forEach((playerId) => {
        map.set(playerId, groupId);
      });
    });

    return map;
  }, [assignments]);

  const selectedCount = useMemo(
    () => Object.values(assignments).reduce((sum, playerIds) => sum + playerIds.length, 0),
    [assignments],
  );

  const playersByGroup = useMemo(() => {
    return Object.fromEntries(
      groups.map((group) => {
        const expectedRole = resolveExpectedRoleForGroup(group);
        const suggested = squad.filter((player) => resolveQuickLineupRole(player.posicion) === expectedRole);
        const optional = squad.filter((player) => resolveQuickLineupRole(player.posicion) !== expectedRole);

        return [
          group.id,
          {
            suggested,
            optional,
            expectedRole,
          },
        ];
      }),
    ) as Record<string, { suggested: JugadorSeleccion[]; optional: JugadorSeleccion[]; expectedRole: string }>;
  }, [groups, squad]);

  function togglePlayer(groupId: string, playerId: string, maxCount: number) {
    setAssignments((current) => {
      const currentGroup = current[groupId] ?? [];
      const isSelectedHere = currentGroup.includes(playerId);

      if (isSelectedHere) {
        return {
          ...current,
          [groupId]: currentGroup.filter((id) => id !== playerId),
        };
      }

      if (currentGroup.length >= maxCount) {
        return current;
      }

      const next = Object.fromEntries(
        Object.entries(current).map(([id, playerIds]) => [
          id,
          id === groupId ? playerIds : playerIds.filter((idValue) => idValue !== playerId),
        ]),
      ) as Record<string, string[]>;

      return {
        ...next,
        [groupId]: [...(next[groupId] ?? []), playerId],
      };
    });
  }

  function resetAssignments() {
    setAssignments({});
  }

  function toggleShowAll(groupId: string) {
    setShowAllByGroup((current) => ({
      ...current,
      [groupId]: !current[groupId],
    }));
  }

  function applyQuickLineup() {
    if (!lineup.formacion || !formationIsValid) {
      return;
    }

    onApply(
      buildLineupFromQuickAssignments({
        formation: lineup.formacion,
        entrenador: lineup.entrenador,
        squad,
        assignments,
        groups,
      }),
    );
  }

  if (!formationIsValid) {
    return (
      <div className="rounded-[1.6rem] border border-dashed border-white/12 bg-white/[0.04] p-4 text-sm text-white/60">
        Escribí una formación válida de 11 jugadores, por ejemplo `4-4-2` o `4-3-3`, para habilitar la carga rápida.
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-[1.6rem] border border-white/10 bg-white/[0.05] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-5">
      <div className="space-y-2">
        <h3 className="font-brand text-[1.45rem] leading-[0.92] tracking-[0.03em] text-white">
          Carga rápida por bloques
        </h3>
        <p className="max-w-[720px] text-base leading-7 text-white/72">
          Marcá varios jugadores por línea según la formación elegida. Al aplicar, se completan los suplentes automáticamente con los no seleccionados.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-white/72">
        <span className="rounded-full border border-[#5993B6]/18 bg-[#5993B6]/10 px-3 py-1.5 text-[#AEEBFF]">
          Formación: {lineup.formacion}
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">
          Seleccionados: {selectedCount}/11
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">
          Suplentes automáticos: {Math.max(squad.length - selectedCount, 0)}
        </span>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {groups.map((group) => {
          const selectedIds = assignedByGroup[group.id] ?? new Set<string>();
          const showAll = showAllByGroup[group.id] ?? false;
          const suggestedPlayers = playersByGroup[group.id]?.suggested ?? [];
          const optionalPlayers = playersByGroup[group.id]?.optional ?? [];
          const visiblePlayers = showAll
            ? [...suggestedPlayers, ...optionalPlayers]
            : suggestedPlayers;

          return (
            <div
              key={group.id}
              className="rounded-[1.4rem] border border-white/10 bg-[#1E2C46]/70 p-4"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
                    {group.label}
                  </p>
                  <p className="text-sm text-white/58">
                    Elegí {group.count} jugador{group.count === 1 ? "" : "es"}.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white/72">
                    {selectedIds.size}/{group.count}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleShowAll(group.id)}
                    className="rounded-full border border-[#5993B6]/18 bg-[#5993B6]/10 px-3 py-1 text-xs font-semibold text-[#AEEBFF] transition hover:bg-[#5993B6]/18"
                  >
                    {showAll ? "Solo sugeridos" : "Mostrar todos"}
                  </button>
                </div>
              </div>

              <p className="mb-3 text-xs text-white/48">
                {showAll
                  ? "Viendo sugeridos por posición y el resto del plantel para asignaciones excepcionales."
                  : "Mostrando sugeridos por posición. Si querés ubicar un jugador fuera de su rol, usá 'Mostrar todos'."}
              </p>

              <div className="flex max-h-56 flex-wrap gap-2 overflow-y-auto pr-1">
                {visiblePlayers.map((player) => {
                  const selected = selectedIds.has(player.id);
                  const lockedByOtherGroup =
                    !selected &&
                    assignedElsewhere.has(player.id) &&
                    assignedElsewhere.get(player.id) !== group.id;
                  const groupIsFull = selectedIds.size >= group.count;
                  const disabled = lockedByOtherGroup || (groupIsFull && !selected);

                  return (
                    <button
                      key={`${group.id}-${player.id}`}
                      type="button"
                      onClick={() => togglePlayer(group.id, player.id, group.count)}
                      disabled={disabled}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        selected
                          ? "border-[#84F0C8]/45 bg-[#84F0C8]/12 text-white"
                          : disabled
                            ? "cursor-not-allowed border-white/8 bg-white/[0.04] text-white/28"
                            : resolveQuickLineupRole(player.posicion) === playersByGroup[group.id]?.expectedRole
                              ? "border-white/10 bg-white/[0.06] text-white/78 hover:bg-white/[0.12]"
                              : "border-[#FAB438]/18 bg-[#FAB438]/10 text-[#FFE3A1] hover:bg-[#FAB438]/16"
                      }`}
                    >
                      {selected ? <Check className="h-3.5 w-3.5 text-[#84F0C8]" /> : null}
                      <span>{player.nombre}</span>
                      {player.numero ? <span className="text-white/48">#{player.numero}</span> : null}
                      {player.posicion ? <span className="text-white/40">· {player.posicion}</span> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={resetAssignments}
          className="rounded-[20px] border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.12] hover:text-white"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Limpiar selección rápida
        </Button>
        <Button
          type="button"
          onClick={applyQuickLineup}
          disabled={selectedCount !== 11}
          className="rounded-[20px] bg-[#5993B6] text-white hover:bg-[#4B84A6] disabled:bg-white/10 disabled:text-white/35"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          Aplicar titulares y completar suplentes
        </Button>
      </div>
    </div>
  );
}
