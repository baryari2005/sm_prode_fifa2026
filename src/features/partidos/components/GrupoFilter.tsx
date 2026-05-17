// src/features/partidos/components/GrupoFilter.tsx

import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";

interface GrupoFilterProps {
  grupos: string[];
  grupoSeleccionado: string | null;
  onGrupoChange: (grupo: string | null) => void;
}

export function GrupoFilter({
  grupos,
  grupoSeleccionado,
  onGrupoChange,
}: GrupoFilterProps) {
  return (
    <CardHeader className="border-t border-slate-100 px-5 py-5 md:px-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={grupoSeleccionado === null ? "default" : "outline"}
          onClick={() => onGrupoChange(null)}
          size="sm"
        >
          Todos
        </Button>
        {grupos.map((grupo) => (
          <Button
            key={grupo}
            variant={grupoSeleccionado === grupo ? "default" : "outline"}
            onClick={() => onGrupoChange(grupo)}
            size="sm"
          >
            Grupo {grupo}
          </Button>
        ))}
      </div>
    </CardHeader>
  );
}
