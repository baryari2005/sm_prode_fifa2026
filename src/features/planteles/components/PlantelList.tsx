"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, ShieldX, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { TableActions } from "@/components/ui/table-actions";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { axiosInstance } from "@/lib/axios";
import {
  DASHBOARD_PANEL,
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import { PlayerJerseyAvatar } from "@/features/partidos/components/detalle/lineups/PlayerJerseyAvatar";

import {
  getPlantelGroupForPosition,
  getPlantelPositionLabel,
  POSITION_GROUPS,
  type PlantelPositionGroupKey,
} from "../helpers/plantel-position.helpers";
import { PlantelRow } from "./plantel-columns";

type PaginatedResponse<T> = {
  data?: T[];
};

const plantelCache = new Map<string, PlantelRow[]>();

type PlantelListProps = {
  seleccionId: string;
  seleccionCodigo?: string | null;
  seleccionNombre: string;
  search?: string;
  refresh?: string | number | boolean | null | undefined;
  onEdit: (player: PlantelRow) => void;
  onDelete: (playerId: string) => void;
  onTotalChange?: (total: number) => void;
  onInitialLoadComplete?: () => void;
};

export function PlantelList({
  seleccionId,
  seleccionCodigo,
  seleccionNombre,
  search = "",
  refresh,
  onEdit,
  onDelete,
  onTotalChange,
  onInitialLoadComplete,
}: PlantelListProps) {
  const cacheKey = `${seleccionId}:${String(refresh ?? "base")}`;
  const [players, setPlayers] = useState<PlantelRow[]>(
    () => plantelCache.get(cacheKey) ?? [],
  );
  const [loading, setLoading] = useState(
    () => !plantelCache.has(cacheKey),
  );
  const [activeTab, setActiveTab] = useState<PlantelPositionGroupKey>("arqueros");
  const [didNotifyInitialLoad, setDidNotifyInitialLoad] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const cachedPlayers = plantelCache.get(cacheKey) ?? null;
    const hasCachedPlayers = cachedPlayers !== null;

    async function loadPlayers() {
      try {
        if (hasCachedPlayers) {
          setPlayers(cachedPlayers);
          onTotalChange?.(cachedPlayers.length);
          setLoading(false);
          return;
        }

        setLoading(true);

        const response = await axiosInstance.get<PaginatedResponse<PlantelRow>>(
          `/paises/${seleccionId}/plantel`,
          {
            headers: {
              "Cache-Control": "no-cache",
            },
          },
        );

        if (cancelled) {
          return;
        }

        const nextPlayers = response.data.data ?? [];
        plantelCache.set(cacheKey, nextPlayers);
        setPlayers(nextPlayers);
        onTotalChange?.(nextPlayers.length);
      } catch (error) {
        console.error(error);
        toast.error("No se pudo cargar el plantel");
      } finally {
        if (!cancelled && !hasCachedPlayers) {
          setLoading(false);
        }
      }
    }

    void loadPlayers();

    return () => {
      cancelled = true;
    };
  }, [cacheKey, onTotalChange, seleccionId]);

  useEffect(() => {
    setDidNotifyInitialLoad(false);
  }, [seleccionId]);

  useEffect(() => {
    if (!loading && !didNotifyInitialLoad) {
      onInitialLoadComplete?.();
      setDidNotifyInitialLoad(true);
    }
  }, [didNotifyInitialLoad, loading, onInitialLoadComplete]);

  const filteredPlayers = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    if (!normalizedQuery) {
      return players;
    }

    return players.filter((player) =>
      [
        player.nombre,
        player.nacionalidad,
        player.posicion,
        player.numero?.toString(),
      ]
        .filter(Boolean)
        .some((value) =>
          value!.toString().toLowerCase().includes(normalizedQuery),
        ),
    );
  }, [players, search]);

  const groupedPlayers = useMemo(() => {
    return filteredPlayers.reduce<Record<PlantelPositionGroupKey, PlantelRow[]>>(
      (accumulator, player) => {
        const key = getPlantelGroupForPosition(player.posicion);
        accumulator[key].push(player);
        return accumulator;
      },
      {
        arqueros: [],
        "cuerpo-tecnico": [],
        defensores: [],
        mediocampo: [],
        delanteros: [],
        otros: [],
      },
    );
  }, [filteredPlayers]);
  const visibleGroups = useMemo(
    () =>
      POSITION_GROUPS.filter(
        (group) => groupedPlayers[group.key].length > 0 || group.key === activeTab,
      ),
    [activeTab, groupedPlayers],
  );

  useEffect(() => {
    if (visibleGroups.length === 0) {
      return;
    }

    const hasCurrentTab = visibleGroups.some((group) => group.key === activeTab);

    if (!hasCurrentTab) {
      setActiveTab(visibleGroups[0].key);
    }
  }, [activeTab, visibleGroups]);

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="h-11 rounded-2xl bg-white/8" />
        <div className="grid gap-3 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-[24px] border border-white/10 bg-white/6"
            />
          ))}
        </div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-white/12 bg-white/[0.03] px-6 py-12 text-center">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
          Plantel vacio
        </p>
        <p className="mt-3 text-sm leading-6 text-white/68">
          Todavía no hay jugadores cargados para esta selección. Podés importar
          desde archivo, desde API o dar de alta manualmente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as PlantelPositionGroupKey)}
        className="space-y-5"
      >
        <div className="overflow-x-auto pb-1">
          <TabsList className="min-w-max justify-start">
            {visibleGroups.map((group) => (
              <TabsTrigger
                key={group.key}
                value={group.key}
                className="min-w-[150px]"
              >
                {group.label} ({groupedPlayers[group.key].length})
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {visibleGroups.map((group) => (
          <TabsContent key={group.key} value={group.key} className="mt-0">
            <section className={`${DASHBOARD_PANEL} rounded-[28px] p-4`}>
              <div className={DASHBOARD_TOP_LINE}>
                <div className={DASHBOARD_TOP_LINE_INNER} />
                <div className={DASHBOARD_TOP_LINE_SWEEP} />
                <div className={DASHBOARD_TOP_LINE_GLOW} />
                <div className={DASHBOARD_TOP_LINE_HAIR} />
              </div>
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sky-400/14 blur-3xl" />

              <div className="relative space-y-4">
                
                {groupedPlayers[group.key].length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-white/12 bg-white/[0.03] px-6 py-10 text-center text-sm text-white/64">
                    No hay jugadores para mostrar en esta posicion con el filtro actual.
                  </div>
                ) : (
                  <div className="grid gap-3 xl:grid-cols-2">
                    {groupedPlayers[group.key].map((player) => (
                      <article
                        key={player.id}
                        className={`rounded-[24px] p-4 ${DASHBOARD_SUBCARD}`}
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex min-w-0 gap-3">
                            <PlayerJerseyAvatar
                              imageUrl={player.fotoUrl}
                              teamCode={seleccionCodigo}
                              teamName={seleccionNombre}
                              number={player.numero}
                              className="h-12 w-12 rounded-2xl"
                            />

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge className="rounded-full border-white/10 bg-white/10 text-[#AEEBFF] hover:bg-white/10">
                                  #{player.numero ?? "-"}
                                </Badge>
                                <Badge className="rounded-full border-white/10 bg-white/10 text-white/76 hover:bg-white/10">
                                  {getPlantelPositionLabel(player.posicion)}
                                </Badge>
                              </div>

                              <h3 className="font-brand mt-3 text-[1.6rem] leading-none tracking-[0.04em] text-white">
                                {player.nombre}
                              </h3>

                              <p className="mt-2 text-sm font-semibold text-white/68">
                                {player.nacionalidad ?? "Nacionalidad sin cargar"}
                              </p>
                            </div>
                          </div>

                          <TableActions
                            id={player.id}
                            actions={[
                              {
                                label: "Editar",
                                icon: <Pencil className="h-4 w-4" />,
                                onClick: () => onEdit(player),
                              },
                              {
                                label: "Eliminar",
                                icon: <Trash2 className="h-4 w-4" />,
                                confirmTitle: "¿Eliminar jugador?",
                                confirmDescription:
                                  "Vas a quitar este jugador del plantel activo de la seleccion.",
                                confirmActionLabel: "Confirmar eliminacion",
                                confirmTone: "danger",
                                confirmIcon: <ShieldX className="h-4 w-4" />,
                                confirmNote:
                                  "Esta accion afecta solo al jugador seleccionado. Revisá antes de confirmar porque puede impactar el plantel cargado.",
                                onConfirm: async () => {
                                  onDelete(player.id);
                                },
                              },
                            ]}
                          />
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                          <div className={`rounded-2xl p-3 ${DASHBOARD_SUBCARD}`}>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                              Edad
                            </p>
                            <p className="mt-2 text-sm font-semibold text-white">
                              {player.edad ?? "--"}
                            </p>
                          </div>

                          <div className={`rounded-2xl p-3 ${DASHBOARD_SUBCARD}`}>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                              Apariciones
                            </p>
                            <p className="mt-2 text-sm font-semibold text-white">
                              {player.apariciones ?? 0}
                            </p>
                          </div>

                          <div className={`rounded-2xl p-3 ${DASHBOARD_SUBCARD}`}>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                              Goles
                            </p>
                            <p className="mt-2 text-sm font-semibold text-white">
                              {player.goles ?? 0}
                            </p>
                          </div>

                          <div className={`rounded-2xl p-3 ${DASHBOARD_SUBCARD}`}>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
                              Tarjetas
                            </p>
                            <p className="mt-2 text-sm font-semibold text-white">
                              {player.amarillas ?? 0} TA / {player.rojas ?? 0} TR
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
