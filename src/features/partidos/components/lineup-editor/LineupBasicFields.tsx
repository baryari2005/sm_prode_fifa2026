"use client";

import { TextField } from "./TextField";

type LineupBasicFieldsProps = {
  formacion: string;
  entrenador: string;
  onFormacionChange: (value: string) => void;
  onEntrenadorChange: (value: string) => void;
};

export function LineupBasicFields({
  formacion,
  entrenador,
  onFormacionChange,
  onEntrenadorChange,
}: LineupBasicFieldsProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(180px,220px)_minmax(0,1fr)] lg:items-end">
      <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <TextField
          label="Formación"
          value={formacion}
          onChange={onFormacionChange}
          placeholder="Ej: 4-3-3"
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <TextField
          label="Director técnico"
          value={entrenador}
          onChange={onEntrenadorChange}
          placeholder="Nombre del entrenador"
        />
      </div>
    </div>
  );
}
