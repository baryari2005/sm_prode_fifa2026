"use client";

import { Card, CardContent } from "@/components/ui/card";

import { BenchPanel } from "@/features/partidos/components/lineup-editor/BenchPanel";
import { LineupBasicFields } from "@/features/partidos/components/lineup-editor/LineupBasicFields";
import { LineupHeader } from "@/features/partidos/components/lineup-editor/LineupHeader";
import { LineupPitch } from "@/features/partidos/components/lineup-editor/LineupPitch";
import { LineupTabs } from "@/features/partidos/components/lineup-editor/LineupTabs";
import { StartersPanel } from "@/features/partidos/components/lineup-editor/StartersPanel";

import { useLineupEditor } from "@/features/partidos/hooks/useLineupEditor";

import type { TeamLineup } from "@/features/partidos/types/fixture-details";
import type { JugadorSeleccion } from "@/features/partidos/types/types";

type Props = {
  title: string;
  teamCode?: string | null;
  flagUrl?: string | null;
  lineup: TeamLineup;
  squad: JugadorSeleccion[];
  onChange: (lineup: TeamLineup) => void;
  previousLineup?: TeamLineup | null;
  previousMatchLabel?: string | null;
  onApplyPrevious?: () => void;
  compactPlayers?: boolean;
};

export function LineupEditorCard({
  title,
  teamCode,
  flagUrl,
  lineup,
  squad,
  onChange,
  previousLineup,
  previousMatchLabel,
  onApplyPrevious,
  compactPlayers = false,
}: Props) {
  const editor = useLineupEditor({
    lineup,
    squad,
    onChange,
  });

  return (
    <Card className="group relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-[#223553]/90 text-white shadow-[0_20px_55px_rgba(2,8,23,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#7DD3FC]/30 hover:shadow-[0_26px_60px_rgba(2,8,23,0.3)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#5993B6] via-[#AEEBFF] to-[#FAB438]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.08),transparent_30%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <LineupHeader
        title={title}
        flagUrl={flagUrl}
        titularesCount={lineup.titulares.length}
        suplentesCount={lineup.suplentes.length}
        availablePlayersCount={editor.availablePlayers.length}
        previousMatchLabel={previousMatchLabel}
        showApplyPrevious={Boolean(previousLineup && onApplyPrevious)}
        onApplyPrevious={onApplyPrevious}
      />

      <CardContent className="relative space-y-3 p-4 pt-2 md:p-5 md:pt-2">
        <LineupBasicFields
          formacion={lineup.formacion ?? ""}
          entrenador={lineup.entrenador ?? ""}
          onFormacionChange={(value) =>
            onChange({
              ...lineup,
              formacion: value,
            })
          }
          onEntrenadorChange={(value) =>
            onChange({
              ...lineup,
              entrenador: value,
            })
          }
        />

        <LineupTabs
          activeTab={editor.activeTab}
          titularesCount={lineup.titulares.length}
          suplentesCount={lineup.suplentes.length}
          onTabChange={editor.setActiveTab}
        />

        {editor.activeTab === "cancha" ? (
          <LineupPitch
            pitchRef={editor.pitchRef}
            formationPreviewRows={editor.formationPreviewRows}
            startersOnPitch={editor.startersOnPitch}
            draggingStarterId={editor.draggingStarterId}
            hoveredStarterId={editor.hoveredStarterId}
            onApplyFormationLayout={editor.applyFormationLayout}
            applyFormationDisabled={lineup.titulares.length === 0}
            onPitchDrop={editor.handlePitchDrop}
            onPitchDragLeave={() => {
              editor.setHoveredStarterId(null);
            }}
            onStarterDragStart={(jugadorId) => {
              editor.setDraggingStarterId(jugadorId);
            }}
            onStarterDragEnd={() => {
              editor.setDraggingStarterId(null);
              editor.setHoveredStarterId(null);
            }}
            onStarterDragOver={(event, jugadorId) => {
              event.preventDefault();
              editor.setHoveredStarterId(jugadorId);
            }}
            onStarterDrop={(event, jugadorId) => {
              event.preventDefault();
              event.stopPropagation();
              editor.swapStarterPositions(jugadorId);
            }}
          />
        ) : null}

        {editor.activeTab === "titulares" ? (
          <StartersPanel
            teamCode={teamCode}
            teamName={title}
            players={lineup.titulares}
            squad={squad}
            availablePlayers={editor.availablePlayers}
            selectedPlayerId={editor.selectedStarterId}
            onSelectedPlayerChange={editor.setSelectedStarterId}
            addDisabled={
              !editor.selectedStarterId || !editor.canAddMoreStarters
            }
            onAdd={() => {
              if (!editor.selectedStarterId) {
                return;
              }

              editor.addPlayer(editor.selectedStarterId, "titulares");
              editor.setSelectedStarterId("");
            }}
            starterRoles={editor.starterRoles}
            draggingCardStarterId={editor.draggingCardStarterId}
            onDraggingCardStarterIdChange={
              editor.setDraggingCardStarterId
            }
            onReorderStarters={editor.reorderStarters}
            onUpdatePlayer={(index, field, value) => {
              editor.updatePlayer("titulares", index, field, value);
            }}
            onRemovePlayer={(index) => {
              editor.removePlayer("titulares", index);
            }}
            compactPlayers={compactPlayers}
          />
        ) : null}

        {editor.activeTab === "suplentes" ? (
          <BenchPanel
            teamCode={teamCode}
            teamName={title}
            players={lineup.suplentes}
            squad={squad}
            availablePlayers={editor.availablePlayers}
            selectedPlayerId={editor.selectedBenchId}
            onSelectedPlayerChange={editor.setSelectedBenchId}
            addDisabled={!editor.selectedBenchId}
            onAdd={() => {
              if (!editor.selectedBenchId) {
                return;
              }

              editor.addPlayer(editor.selectedBenchId, "suplentes");
              editor.setSelectedBenchId("");
            }}
            onUpdatePlayer={(index, field, value) => {
              editor.updatePlayer("suplentes", index, field, value);
            }}
            onRemovePlayer={(index) => {
              editor.removePlayer("suplentes", index);
            }}
            compactPlayers={compactPlayers}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
