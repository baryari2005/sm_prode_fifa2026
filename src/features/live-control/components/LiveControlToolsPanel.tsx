"use client";

import { useEffect, useMemo, useState } from "react";
import { ActivitySquare, TerminalSquare } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  LIVE_CONTROL_SECONDARY_BUTTON_CLASSNAME,
  LIVE_CONTROL_SUBCARD_CLASSNAME,
  LIVE_CONTROL_TEXTAREA_CLASSNAME,
  LiveControlSurface,
} from "@/features/live-control/components/LiveControlSurface";
import {
  buildFormationSlots,
  buildSuggestedLineupFromSlots,
  isValidFormation,
} from "@/features/live-control/helpers/live-lineup.helpers";
import { getPlantelBySeleccion } from "@/features/partidos/services/plantel.service";
import {
  DEFAULT_TEAM_STATS,
  TEAM_STAT_DEFINITIONS,
  type TeamLineup,
  type TeamStats,
} from "@/features/partidos/types/fixture-details";
import type { JugadorSeleccion } from "@/features/partidos/types/types";
import type { LiveActionResponse, LiveControlMatch } from "@/features/live-control/types/live-control.types";
import {
  FIXTURE_PHASE_OPTIONS,
  getFixturePhaseSlugFromText,
  type FixturePhaseSlug,
} from "@/features/partidos/constants/fixture-phase-filter.constants";

const ACTION_OPTIONS = [
  { value: "sync_match", label: "Sincronizar partido especifico" },
  { value: "sync_live", label: "Sincronizar todos los partidos live" },
  { value: "recalculate_score", label: "Recalcular marcador desde eventos" },
  { value: "recalculate_points", label: "Recalcular puntos del Prode" },
  { value: "recalculate_ranking", label: "Recalcular ranking" },
  { value: "cleanup_duplicate_events", label: "Limpiar eventos duplicados" },
  { value: "validate_match", label: "Validar consistencia de partido" },
  { value: "set_live", label: "Marcar partido como en vivo" },
  { value: "set_halftime", label: "Marcar partido como entretiempo" },
  { value: "set_finished", label: "Marcar partido como finalizado" },
  { value: "update_minute", label: "Actualizar minuto actual" },
  { value: "create_manual_goal", label: "Cargar gol manual" },
  { value: "upsert_stats", label: "Cargar estadísticas" },
  { value: "upsert_lineup", label: "Cargar formacion" },
  { value: "upsert_squad_note", label: "Cargar plantel" },
  { value: "upsert_scorer_note", label: "Cargar goleador" },
  { value: "upsert_cards_note", label: "Cargar tarjetas" },
  { value: "upsert_penalties_note", label: "Cargar penales" },
  { value: "simulate_phase_results", label: "Simular resultados aleatorios por fase" },
  { value: "generate_mock_predictions", label: "Generar pronosticos mock por fase" },
  { value: "recalculate_phase_ranking", label: "Recalcular ranking por fase" },
  { value: "bulk_update_selected_matches_metadata", label: "Actualizar sede de varios partidos" },
  { value: "reset_fixture_from_api", label: "Volver a foja cero desde API" },
  { value: "send_test_push", label: "Enviar push de prueba" },
];

const SUPPORTED_FORMATIONS = [
  "4-3-3",
  "4-4-2",
  "4-2-3-1",
  "3-5-2",
  "5-3-2",
  "4-3-1-2",
  "3-4-3",
];

type Props = {
  matches: LiveControlMatch[];
  selectedMatchId: string | null;
  response: LiveActionResponse | Record<string, unknown> | null;
  executing: boolean;
  onSelectMatch: (partidoId: string) => void;
  onRun: (payload: {
    action: string;
    partidoId?: string;
    payload?: Record<string, unknown>;
  }) => Promise<void>;
};

type TeamSide = "LOCAL" | "VISITANTE";

const EMPTY_LINEUP: TeamLineup = {
  formacion: "",
  entrenador: "",
  titulares: [],
  suplentes: [],
};

const EMPTY_STATS: TeamStats = {
  ...DEFAULT_TEAM_STATS,
};

function buildLineupPlayer(player: JugadorSeleccion) {
  return {
    jugadorId: player.id,
    nombre: player.nombre,
    numero: player.numero ?? null,
    posicion: player.posicion,
    x: null,
    y: null,
    goals: 0,
    yellow: false,
    red: false,
    substituted: false,
  };
}

export function LiveControlToolsPanel({
  matches,
  selectedMatchId,
  response,
  executing,
  onSelectMatch,
  onRun,
}: Props) {
  const [action, setAction] = useState("sync_match");
  const [minute, setMinute] = useState("45");
  const [team, setTeam] = useState<"LOCAL" | "VISITANTE">("LOCAL");
  const [cardType, setCardType] = useState<"AMARILLA" | "SEGUNDA_AMARILLA" | "ROJA_DIRECTA">("AMARILLA");
  const [description, setDescription] = useState("");
  const [jsonPayload, setJsonPayload] = useState("");
  const [lineupSide, setLineupSide] = useState<TeamSide>("LOCAL");
  const [lineupFormacion, setLineupFormacion] = useState("4-3-3");
  const [lineupEntrenador, setLineupEntrenador] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [formationAssignments, setFormationAssignments] = useState<Record<TeamSide, Record<string, string>>>({
    LOCAL: {},
    VISITANTE: {},
  });
  const [squad, setSquad] = useState<JugadorSeleccion[]>([]);
  const [loadingSquad, setLoadingSquad] = useState(false);
  const [lineupPlayers, setLineupPlayers] = useState<Record<TeamSide, TeamLineup>>({
    LOCAL: { ...EMPTY_LINEUP },
    VISITANTE: { ...EMPTY_LINEUP },
  });
  const [statsValues, setStatsValues] = useState<{
    LOCAL: TeamStats;
    VISITANTE: TeamStats;
  }>({
    LOCAL: { ...EMPTY_STATS },
    VISITANTE: { ...EMPTY_STATS },
  });
  const [phase, setPhase] = useState<FixturePhaseSlug>("grupos");
  const [mockUserCount, setMockUserCount] = useState("4");
  const [bulkEstadio, setBulkEstadio] = useState("");
  const [bulkCiudad, setBulkCiudad] = useState("");
  const [bulkFecha, setBulkFecha] = useState("");
  const [bulkSelectedMatchIds, setBulkSelectedMatchIds] = useState<string[]>([]);

  const parsedJsonPayload = useMemo(() => {
    if (!jsonPayload.trim()) {
      return { value: undefined, error: null as string | null };
    }

    try {
      return {
        value: JSON.parse(jsonPayload) as Record<string, unknown>,
        error: null as string | null,
      };
    } catch {
      return {
        value: undefined,
        error: "JSON invalido. Revisá comas, llaves y comillas.",
      };
    }
  }, [jsonPayload]);

  const selectedMatch = useMemo(
    () => matches.find((match) => match.id === selectedMatchId) ?? null,
    [matches, selectedMatchId],
  );

  const phaseMatches = useMemo(() => {
    return matches.filter(
      (match) => getFixturePhaseSlugFromText(match.fase?.nombre) === phase,
    );
  }, [matches, phase]);

  const currentFormationSlots = useMemo(
    () => buildFormationSlots(lineupFormacion),
    [lineupFormacion],
  );

  useEffect(() => {
    const needsSquad =
      action === "upsert_lineup" ||
      action === "upsert_cards_note" ||
      action === "create_manual_goal";

    if (!needsSquad || !selectedMatch) {
      setSquad([]);
      setSelectedPlayerId("");
      return;
    }

    const seleccionId =
      action === "upsert_lineup"
        ? lineupSide === "LOCAL"
          ? selectedMatch.seleccionLocalId
          : selectedMatch.seleccionVisitanteId
        : team === "LOCAL"
        ? selectedMatch.seleccionLocalId
        : selectedMatch.seleccionVisitanteId;

    let cancelled = false;

    async function loadSquad() {
      try {
        setLoadingSquad(true);
        const data = await getPlantelBySeleccion(seleccionId);
        if (!cancelled) {
          setSquad(data);
          setSelectedPlayerId((current) =>
            data.some((player) => player.id === current) ? current : "",
          );
        }
      } catch {
        if (!cancelled) {
          setSquad([]);
          setSelectedPlayerId("");
        }
      } finally {
        if (!cancelled) {
          setLoadingSquad(false);
        }
      }
    }

    void loadSquad();

    return () => {
      cancelled = true;
    };
  }, [action, lineupSide, selectedMatch, team]);

  useEffect(() => {
    const current = lineupPlayers[lineupSide];
    setLineupFormacion(current.formacion);
    setLineupEntrenador(current.entrenador);
  }, [lineupPlayers, lineupSide]);

  useEffect(() => {
    if (action !== "upsert_lineup") {
      return;
    }

    const current = lineupPlayers[lineupSide];
    const nextAssignments =
      current.titulares.length > 0
        ? Object.fromEntries(
            buildFormationSlots(current.formacion || lineupFormacion).map((slot, index) => [
              slot.id,
              current.titulares[index]?.jugadorId ?? "",
            ]),
          )
        : {};

    setFormationAssignments((value) => ({
      ...value,
      [lineupSide]: Object.keys(value[lineupSide] ?? {}).length > 0 ? value[lineupSide] : nextAssignments,
    }));
  }, [action, lineupFormacion, lineupPlayers, lineupSide]);

  useEffect(() => {
    if (action !== "upsert_stats") {
      return;
    }

    setStatsValues({
      LOCAL: {
        ...EMPTY_STATS,
        ...(selectedMatch?.resultado?.estadisticasLocal ?? {}),
      },
      VISITANTE: {
        ...EMPTY_STATS,
        ...(selectedMatch?.resultado?.estadisticasVisitante ?? {}),
      },
    });
  }, [action, selectedMatch]);

  function updateCurrentLineup(updater: (current: TeamLineup) => TeamLineup) {
    setLineupPlayers((current) => ({
      ...current,
      [lineupSide]: updater(current[lineupSide]),
    }));
  }

  function syncCurrentMeta(next: { formacion?: string; entrenador?: string }) {
    updateCurrentLineup((current) => ({
      ...current,
      formacion: next.formacion ?? current.formacion,
      entrenador: next.entrenador ?? current.entrenador,
    }));
  }

  function handleAddPlayer(target: "titulares" | "suplentes") {
    const player = squad.find((item) => item.id === selectedPlayerId);
    if (!player) return;

    updateCurrentLineup((current) => {
      const alreadyExists =
        current.titulares.some((item) => item.jugadorId === player.id) ||
        current.suplentes.some((item) => item.jugadorId === player.id);

      if (alreadyExists) {
        return current;
      }

      return {
        ...current,
        [target]: [...current[target], buildLineupPlayer(player)],
      };
    });
  }

  function handleRemovePlayer(target: "titulares" | "suplentes", jugadorId: string) {
    updateCurrentLineup((current) => ({
      ...current,
      [target]: current[target].filter((item) => item.jugadorId !== jugadorId),
    }));
  }

  function handleFormationAssignmentChange(slotId: string, playerId: string) {
    setFormationAssignments((current) => ({
      ...current,
      [lineupSide]: Object.fromEntries(
        Object.entries({
          ...current[lineupSide],
          [slotId]: playerId,
        }).map(([key, value]) => [
          key,
          key !== slotId && value === playerId ? "" : value,
        ]),
      ),
    }));
  }

  function handleBuildFormationLineup() {
    if (!isValidFormation(lineupFormacion)) {
      return;
    }

    const nextLineup = buildSuggestedLineupFromSlots({
      formation: lineupFormacion,
      slotAssignments: formationAssignments[lineupSide] ?? {},
      squad,
      entrenador: lineupEntrenador,
    });

    setLineupPlayers((current) => ({
      ...current,
      [lineupSide]: nextLineup,
    }));
  }

  function handleStatChange(
    side: TeamSide,
    key: keyof TeamStats,
    rawValue: string,
  ) {
    const safeValue = Number.isFinite(Number(rawValue)) ? Math.max(0, Number(rawValue)) : 0;

    setStatsValues((current) => ({
      ...current,
      [side]: {
        ...current[side],
        [key]: safeValue,
      },
    }));
  }

  function toggleBulkMatchSelection(partidoId: string) {
    setBulkSelectedMatchIds((current) =>
      current.includes(partidoId)
        ? current.filter((id) => id !== partidoId)
        : [...current, partidoId],
    );
  }

  const payload = useMemo(() => {
    if (action === "create_manual_goal") {
      return {
        team,
        minute: Number(minute),
        playerId: selectedPlayerId || undefined,
        description: description.trim() || undefined,
      };
    }

    if (
      action === "set_live" ||
      action === "set_halftime" ||
      action === "set_finished" ||
      action === "update_minute"
    ) {
      return {
        minute: Number(minute),
        observacion: description.trim() || undefined,
      };
    }

    if (action === "upsert_lineup") {
      if (jsonPayload.trim()) {
        return parsedJsonPayload.value;
      }

      return {
        side: lineupSide,
        lineup: lineupPlayers[lineupSide],
      };
    }

    if (action === "upsert_cards_note") {
      return {
        team,
        minute: Number(minute),
        playerId: selectedPlayerId || undefined,
        cardType,
        description: description.trim() || undefined,
      };
    }

    if (action === "upsert_stats") {
      return {
        estadisticasLocal: statsValues.LOCAL,
        estadisticasVisitante: statsValues.VISITANTE,
      };
    }

    if (action === "simulate_phase_results") {
      return {
        phase,
      };
    }

    if (action === "generate_mock_predictions") {
      return {
        phase,
        userCount: Number(mockUserCount),
      };
    }

    if (action === "recalculate_phase_ranking") {
      return {
        phase,
      };
    }

    if (action === "bulk_update_selected_matches_metadata") {
      return {
        partidoIds: bulkSelectedMatchIds,
        estadio: bulkEstadio.trim(),
        ciudad: bulkCiudad.trim(),
        ...(bulkFecha ? { fecha: new Date(bulkFecha).toISOString() } : {}),
      };
    }

    if (action === "send_test_push") {
      return {
        title: selectedMatch
          ? `Prueba push: ${selectedMatch.seleccionLocal?.nombre ?? "Local"} vs ${selectedMatch.seleccionVisitante?.nombre ?? "Visitante"}`
          : "Prueba de notificacion",
        body:
          description.trim() ||
          "Esta es una push de prueba enviada desde Live Control.",
        url: selectedMatchId
          ? `/pronosticos/partidos/${selectedMatchId}/detalle`
          : "/inicio",
      };
    }

    if (description.trim()) {
      return {
        note: description.trim(),
      };
    }

    return undefined;
  }, [
    action,
    description,
    jsonPayload,
    lineupPlayers,
    lineupSide,
    minute,
    parsedJsonPayload.value,
    phase,
    selectedMatch,
    selectedPlayerId,
    selectedMatchId,
    statsValues,
    team,
    cardType,
    mockUserCount,
    bulkCiudad,
    bulkEstadio,
    bulkFecha,
    bulkSelectedMatchIds,
  ]);

  const preview = {
    action,
    partidoId: selectedMatchId ?? undefined,
    payload,
  };

  return (
    <LiveControlSurface contentClassName="p-4 md:p-5">
      <div className="space-y-5">
        <div className="space-y-2 border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full border-[#5993B6]/18 bg-[#5993B6]/10 text-[#AEEBFF] hover:bg-[#5993B6]/10">
              Consola privada
            </Badge>
            <Badge className="rounded-full border-[#FAB438]/18 bg-[#FAB438]/10 text-[#FFE4A3] hover:bg-[#FAB438]/10">
              Herramientas tecnicas
            </Badge>
          </div>
          <p className="font-brand text-[1.65rem] leading-none tracking-[0.04em] text-white">
            Herramientas tecnicas
          </p>
          <p className="max-w-3xl text-sm leading-6 text-white/72">
            Consola interna para ejecutar acciones rapidas, ver payload y revisar
            la respuesta tipo API.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
          <div className={`${LIVE_CONTROL_SUBCARD_CLASSNAME} space-y-4 p-4 md:p-5`}>
            <div className="grid gap-2">
              <Label>Partido</Label>
              <Select value={selectedMatchId ?? ""} onValueChange={onSelectMatch}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccioná un partido" />
                </SelectTrigger>
                <SelectContent>
                  {matches.map((match) => (
                    <SelectItem key={match.id} value={match.id}>
                      {match.seleccionLocal?.nombre} vs{" "}
                      {match.seleccionVisitante?.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Accion</Label>
              <Select value={action} onValueChange={setAction}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          {(action === "create_manual_goal" ||
            action === "set_live" ||
            action === "set_halftime" ||
            action === "set_finished" ||
            action === "update_minute") && (
            <div className="grid gap-2">
              <Label>Minuto</Label>
              <Input
                value={minute}
                onChange={(event) => setMinute(event.target.value)}
                inputMode="numeric"
              />
            </div>
          )}

          {action === "create_manual_goal" && (
            <div className="grid gap-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Equipo</Label>
                  <Select
                    value={team}
                    onValueChange={(value) => setTeam(value as "LOCAL" | "VISITANTE")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOCAL">Local</SelectItem>
                      <SelectItem value="VISITANTE">Visitante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Jugador</Label>
                  <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={loadingSquad ? "Cargando plantel..." : "Seleccioná un jugador"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {squad.map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.nombre}
                          {player.numero !== null ? ` #${player.numero}` : ""}
                          {player.posicion ? ` · ${player.posicion}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Observacion</Label>
                <Textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                  className={LIVE_CONTROL_TEXTAREA_CLASSNAME}
                />
              </div>
            </div>
          )}

          {action === "upsert_cards_note" && (
            <div className="grid gap-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Equipo</Label>
                  <Select
                    value={team}
                    onValueChange={(value) => setTeam(value as "LOCAL" | "VISITANTE")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOCAL">Local</SelectItem>
                      <SelectItem value="VISITANTE">Visitante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Minuto</Label>
                  <Input
                    value={minute}
                    onChange={(event) => setMinute(event.target.value)}
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Jugador</Label>
                  <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={loadingSquad ? "Cargando plantel..." : "Seleccioná un jugador"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {squad.map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.nombre}
                          {player.numero !== null ? ` #${player.numero}` : ""}
                          {player.posicion ? ` · ${player.posicion}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Tipo de tarjeta</Label>
                  <Select
                    value={cardType}
                    onValueChange={(value) =>
                      setCardType(value as "AMARILLA" | "SEGUNDA_AMARILLA" | "ROJA_DIRECTA")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AMARILLA">Amarilla</SelectItem>
                      <SelectItem value="SEGUNDA_AMARILLA">Segunda amarilla</SelectItem>
                      <SelectItem value="ROJA_DIRECTA">Roja directa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Observacion</Label>
                <Textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                  className={LIVE_CONTROL_TEXTAREA_CLASSNAME}
                />
              </div>
            </div>
          )}

          {action === "upsert_lineup" ? (
            <div className="grid gap-2">
              <Label>Cargar formacion simple</Label>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Seleccion</Label>
                  <Select
                    value={lineupSide}
                    onValueChange={(value) => setLineupSide(value as TeamSide)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOCAL">
                        Local: {selectedMatch?.seleccionLocal?.nombre ?? "-"}
                      </SelectItem>
                      <SelectItem value="VISITANTE">
                        Visitante: {selectedMatch?.seleccionVisitante?.nombre ?? "-"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Jugador</Label>
                  <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={loadingSquad ? "Cargando plantel..." : "Seleccioná un jugador"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {squad.map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.nombre}
                          {player.numero !== null ? ` #${player.numero}` : ""}
                          {player.posicion ? ` · ${player.posicion}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Formacion</Label>
                  <Select
                    value={lineupFormacion}
                    onValueChange={(value) => {
                      setLineupFormacion(value);
                      syncCurrentMeta({ formacion: value });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_FORMATIONS.map((formation) => (
                        <SelectItem key={formation} value={formation}>
                          {formation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Entrenador</Label>
                  <Input
                    value={lineupEntrenador}
                    onChange={(event) => {
                      const value = event.target.value;
                      setLineupEntrenador(value);
                      syncCurrentMeta({ entrenador: value });
                    }}
                    placeholder="DT"
                  />
                </div>
              </div>

              <div className={`${LIVE_CONTROL_SUBCARD_CLASSNAME} p-3`}>
                <p className="mb-3 text-xs font-semibold text-white/72">Titulares por esquema</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {currentFormationSlots.map((slot) => (
                    <div key={slot.id} className="grid gap-2">
                      <Label>{slot.label}</Label>
                      <Select
                        value={formationAssignments[lineupSide]?.[slot.id] ?? ""}
                        onValueChange={(value) => handleFormationAssignmentChange(slot.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccioná un jugador" />
                        </SelectTrigger>
                        <SelectContent>
                          {squad.map((player) => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.nombre}
                              {player.numero !== null ? ` #${player.numero}` : ""}
                              {player.posicion ? ` · ${player.posicion}` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="default"
                  onClick={handleBuildFormationLineup}
                  disabled={!isValidFormation(lineupFormacion)}
                >
                  Armar titulares y suplentes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={LIVE_CONTROL_SECONDARY_BUTTON_CLASSNAME}
                  onClick={() => handleAddPlayer("titulares")}
                  disabled={!selectedPlayerId}
                >
                  + Titular
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={LIVE_CONTROL_SECONDARY_BUTTON_CLASSNAME}
                  onClick={() => handleAddPlayer("suplentes")}
                  disabled={!selectedPlayerId}
                >
                  + Suplente
                </Button>
              </div>

              <div className={`${LIVE_CONTROL_SUBCARD_CLASSNAME} p-3`}>
                <p className="mb-2 text-xs font-semibold text-white/72">Titulares</p>
                <div className="flex flex-wrap gap-2">
                  {lineupPlayers[lineupSide].titulares.length === 0 ? (
                    <span className="text-xs text-white/52">Sin titulares cargados.</span>
                  ) : (
                    lineupPlayers[lineupSide].titulares.map((player, index) => (
                      <button
                        key={`${player.jugadorId}-${index}`}
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0E1D30]/72 px-3 py-1 text-xs text-white/82"
                        onClick={() => handleRemovePlayer("titulares", player.jugadorId)}
                      >
                        <Badge className="rounded-full border-white/12 bg-white/[0.08] text-white/82 hover:bg-white/[0.08]">
                          {player.numero ?? "S/N"}
                        </Badge>
                        {player.nombre}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className={`${LIVE_CONTROL_SUBCARD_CLASSNAME} p-3`}>
                <p className="mb-2 text-xs font-semibold text-white/72">Suplentes</p>
                <div className="flex flex-wrap gap-2">
                  {lineupPlayers[lineupSide].suplentes.length === 0 ? (
                    <span className="text-xs text-white/52">Sin suplentes cargados.</span>
                  ) : (
                    lineupPlayers[lineupSide].suplentes.map((player, index) => (
                      <button
                        key={`${player.jugadorId}-${index}`}
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0E1D30]/72 px-3 py-1 text-xs text-white/82"
                        onClick={() => handleRemovePlayer("suplentes", player.jugadorId)}
                      >
                        <Badge className="rounded-full border-white/12 bg-white/[0.08] text-white/82 hover:bg-white/[0.08]">
                          {player.numero ?? "S/N"}
                        </Badge>
                        {player.nombre}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <Label>O pegar JSON manual</Label>
              <Textarea
                value={jsonPayload}
                onChange={(event) => setJsonPayload(event.target.value)}
                rows={10}
                placeholder={`{
  "side": "LOCAL",
  "lineup": {
    "formacion": "4-3-3",
    "entrenador": "DT",
    "titulares": [],
    "suplentes": []
  }
}`}
                className={LIVE_CONTROL_TEXTAREA_CLASSNAME}
              />
              <p className="text-xs text-white/52">
                Si dejas este JSON vacio, se usa la carga simple de arriba. Si pegas JSON, tiene prioridad.
              </p>
              {parsedJsonPayload.error ? (
                <p className="text-xs text-rose-200">{parsedJsonPayload.error}</p>
              ) : null}
            </div>
          ) : action === "upsert_stats" ? (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Estadísticas del partido</Label>
                <p className="text-xs text-white/52">
                  Carga valores para local y visitante por cada rubro.
                </p>
              </div>

              <div className={`${LIVE_CONTROL_SUBCARD_CLASSNAME} p-3`}>
                <div className="grid grid-cols-[minmax(0,1fr)_110px_110px] gap-2 text-xs font-semibold text-white/72">
                  <span>Rubro</span>
                  <span className="text-center">Local</span>
                  <span className="text-center">Visitante</span>
                </div>

                <div className="mt-3 space-y-3">
                  {TEAM_STAT_DEFINITIONS.map((stat) => (
                    <div
                      key={stat.key}
                      className="grid grid-cols-[minmax(0,1fr)_110px_110px] items-center gap-2"
                    >
                      <Label className="text-xs text-white/72">{stat.label}</Label>

                      <Input
                        value={String(statsValues.LOCAL[stat.key])}
                        onChange={(event) =>
                          handleStatChange("LOCAL", stat.key, event.target.value)
                        }
                        inputMode="numeric"
                        className="text-center"
                      />

                      <Input
                        value={String(statsValues.VISITANTE[stat.key])}
                        onChange={(event) =>
                          handleStatChange("VISITANTE", stat.key, event.target.value)
                        }
                        inputMode="numeric"
                        className="text-center"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : action === "simulate_phase_results" ||
            action === "generate_mock_predictions" ||
            action === "recalculate_phase_ranking" ||
            action === "bulk_update_selected_matches_metadata" ? (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Fase</Label>
                <Select value={phase} onValueChange={(value) => setPhase(value as FixturePhaseSlug)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIXTURE_PHASE_OPTIONS.map((option) => (
                      <SelectItem key={option.slug} value={option.slug}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {action === "generate_mock_predictions" ? (
                <div className="grid gap-2">
                  <Label>Cantidad de usuarios mock</Label>
                  <Select value={mockUserCount} onValueChange={setMockUserCount}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 usuarios</SelectItem>
                      <SelectItem value="5">5 usuarios</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-white/52">
                    Genera pronosticos aleatorios para usuarios mock y los deja grabados para recalcular despues.
                  </p>
                </div>
              ) : action === "bulk_update_selected_matches_metadata" ? (
                <div className="grid gap-4">
                  <div className={`${LIVE_CONTROL_SUBCARD_CLASSNAME} max-h-64 space-y-2 overflow-y-auto p-3`}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-white/72">
                        Partidos de la fase seleccionada
                      </p>
                      <span className="text-xs text-white/52">
                        {bulkSelectedMatchIds.length} seleccionados
                      </span>
                    </div>
                    {phaseMatches.length === 0 ? (
                      <p className="text-xs text-white/52">
                        No hay partidos visibles para esta fase.
                      </p>
                    ) : (
                      phaseMatches.map((match) => {
                        const checked = bulkSelectedMatchIds.includes(match.id);
                        return (
                          <button
                            key={match.id}
                            type="button"
                            onClick={() => toggleBulkMatchSelection(match.id)}
                            className={`w-full rounded-2xl border px-3 py-2 text-left text-xs transition ${
                              checked
                                ? "border-[#5993B6]/40 bg-[#5993B6]/16 text-white"
                                : "border-white/10 bg-[#0E1D30]/72 text-white/78 hover:bg-white/[0.08]"
                            }`}
                          >
                            {match.seleccionLocal?.nombre ?? "Local"} vs{" "}
                            {match.seleccionVisitante?.nombre ?? "Visitante"}
                          </button>
                        );
                      })
                    )}
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>Estadio</Label>
                      <Input
                        value={bulkEstadio}
                        onChange={(event) => setBulkEstadio(event.target.value)}
                        placeholder="Ej. MetLife Stadium"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Ciudad</Label>
                      <Input
                        value={bulkCiudad}
                        onChange={(event) => setBulkCiudad(event.target.value)}
                        placeholder="Ej. Nueva Jersey"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Fecha y hora opcional</Label>
                    <Input
                      type="datetime-local"
                      value={bulkFecha}
                      onChange={(event) => setBulkFecha(event.target.value)}
                    />
                  </div>
                  <p className="text-xs text-white/52">
                    Aplica los mismos datos solo a los partidos seleccionados. Ideal para tandas con misma sede y localidad.
                  </p>
                </div>
              ) : action === "recalculate_phase_ranking" ? (
                <p className="text-xs text-white/52">
                  Recalcula solo el ranking de la fase elegida a partir de los resultados finales y los pronosticos ya guardados.
                </p>
              ) : (
                <p className="text-xs text-white/52">
                  Borra y vuelve a generar los resultados de la fase elegida dejandolos como finalizados.
                </p>
              )}
              </div>
          ) : action === "reset_fixture_from_api" ? (
            <div className="grid gap-3">
              <div className="rounded-[20px] border border-rose-300/18 bg-rose-300/[0.08] p-4">
                <p className="text-sm font-semibold text-rose-100">Accion destructiva controlada</p>
                <p className="mt-2 text-xs leading-6 text-white/72">
                  Borra partidos, resultados, pronosticos, rankings, eventos live, auditorias, selecciones y planteles actuales.
                  Despues vuelve a cargar el fixture base desde la API oficial.
                </p>
              </div>
              <p className="text-xs text-white/52">
                Usala solo cuando realmente necesites volver el torneo a foja cero para pruebas o reinicio completo.
              </p>
            </div>
          ) : action === "send_test_push" ? (
            <div className="grid gap-2">
              <Label>Mensaje opcional</Label>
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                className={LIVE_CONTROL_TEXTAREA_CLASSNAME}
                placeholder="Si lo dejás vacío, se usa un texto de prueba por defecto."
              />
              <p className="text-xs text-white/52">
                La push se envía al usuario autenticado que esté usando esta consola. Si elegís un partido, el link abre ese detalle.
              </p>
            </div>
          ) : action !== "upsert_cards_note" && action !== "create_manual_goal" ? (
            <div className="grid gap-2">
              <Label>Observacion / nota</Label>
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                className={LIVE_CONTROL_TEXTAREA_CLASSNAME}
              />
            </div>
          ) : null}

            <Button
              type="button"
              className="w-full rounded-2xl"
              disabled={
                executing ||
                (action === "upsert_lineup" && Boolean(parsedJsonPayload.error)) ||
                ((action === "upsert_cards_note" ||
                  action === "create_manual_goal") &&
                  !selectedPlayerId) ||
                (action === "bulk_update_selected_matches_metadata" &&
                  (!bulkEstadio.trim() ||
                    !bulkCiudad.trim() ||
                    bulkSelectedMatchIds.length === 0))
              }
              onClick={() => void onRun(preview)}
            >
              {executing ? "Ejecutando..." : "Ejecutar accion"}
            </Button>
          </div>

          <div className="grid gap-4">
            <div className={`${LIVE_CONTROL_SUBCARD_CLASSNAME} p-4`}>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <ActivitySquare className="h-4 w-4 text-[#AEEBFF]" />
                Preview del payload
              </div>
              <pre className="overflow-x-auto rounded-[20px] border border-white/8 bg-[#0E1D30]/72 p-4 text-xs text-white/78">
                {JSON.stringify(preview, null, 2)}
              </pre>
            </div>

            <div className={`${LIVE_CONTROL_SUBCARD_CLASSNAME} p-4`}>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <TerminalSquare className="h-4 w-4 text-[#FAB438]" />
                API response
              </div>
              <pre className="overflow-x-auto rounded-[20px] border border-white/8 bg-[#07111D] p-4 text-xs text-white/82">
                {JSON.stringify(
                  response ?? { message: "Todavía no se ejecutó ninguna acción." },
                  null,
                  2,
                )}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </LiveControlSurface>
  );
}
