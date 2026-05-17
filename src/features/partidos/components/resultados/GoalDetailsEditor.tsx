"use client";

import { Upload } from "lucide-react";

import { SectionCard } from "./common/SectionCard";
import { GoalTeamEditor } from "./GoalTeamEditor";

import type { GoalDetail } from "@/features/partidos/types/fixture-details";
import type { JugadorSeleccion } from "@/features/partidos/types/types";

type GoalDetailsEditorProps = {
  localNombre: string;
  visitanteNombre: string;
  plantelLocal: JugadorSeleccion[];
  plantelVisitante: JugadorSeleccion[];
  detalleGolesLocal: GoalDetail[];
  detalleGolesVisitante: GoalDetail[];
  importing: boolean;
  onLocalChange: (items: GoalDetail[]) => void;
  onVisitanteChange: (items: GoalDetail[]) => void;
  onImport: (file: File) => Promise<void>;
};

export function GoalDetailsEditor({
  localNombre,
  visitanteNombre,
  plantelLocal,
  plantelVisitante,
  detalleGolesLocal,
  detalleGolesVisitante,
  importing,
  onLocalChange,
  onVisitanteChange,
  onImport,
}: GoalDetailsEditorProps) {
  return (
    <SectionCard
      title="Detalle de goles"
      description="Carga quién hizo cada gol y el minuto. Esto alimenta la tabla de goleadores."
      actions={
        <label className="inline-flex cursor-pointer items-center rounded-md border px-4 py-2 text-sm font-medium">
          <Upload className="mr-2 h-4 w-4" />
          {importing ? "Importando..." : "Importar Excel/JSON"}

          <input
            type="file"
            className="hidden"
            accept=".json,.xlsx,.xls,.csv"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                void onImport(file);
              }
            }}
          />
        </label>
      }
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <GoalTeamEditor
          title={localNombre}
          players={plantelLocal}
          items={detalleGolesLocal}
          onChange={onLocalChange}
        />

        <GoalTeamEditor
          title={visitanteNombre}
          players={plantelVisitante}
          items={detalleGolesVisitante}
          onChange={onVisitanteChange}
        />
      </div>
    </SectionCard>
  );
}