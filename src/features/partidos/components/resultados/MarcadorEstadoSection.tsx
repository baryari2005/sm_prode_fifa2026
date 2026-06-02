"use client";

import { EstadoPartido } from "@prisma/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import { SectionCard } from "./common/SectionCard";
import { NumberField } from "./common/NumberField";
import { TextField } from "./common/TextField";

import type { ResultadoFormState } from "@/features/partidos/types/resultado-manual.types";
import { ESTADO_PARTIDO_OPTIONS } from "@/features/partidos/utils/partidos-ui.helpers";

type MarcadorEstadoSectionProps = {
  localNombre: string;
  visitanteNombre: string;
  form: ResultadoFormState;
  onChange: (patch: Partial<ResultadoFormState>) => void;
};

export function MarcadorEstadoSection({
  localNombre,
  visitanteNombre,
  form,
  onChange,
}: MarcadorEstadoSectionProps) {
  return (
    <SectionCard
      title="Marcador y estado"
      description="Carga el resultado final, el tiempo de juego y observaciones del partido."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <NumberField
          label={`Goles ${localNombre}`}
          value={form.golesLocal}
          onChange={(value) => onChange({ golesLocal: value })}
        />

        <NumberField
          label={`Goles ${visitanteNombre}`}
          value={form.golesVisitante}
          onChange={(value) => onChange({ golesVisitante: value })}
        />

        <TextField
          label={`Penales ${localNombre}`}
          value={form.penalesLocal}
          placeholder="Opcional"
          onChange={(value) => onChange({ penalesLocal: value })}
        />

        <TextField
          label={`Penales ${visitanteNombre}`}
          value={form.penalesVisitante}
          placeholder="Opcional"
          onChange={(value) => onChange({ penalesVisitante: value })}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Estado</label>

          <Select
            value={form.estado}
            onValueChange={(value) =>
              onChange({
                estado: value as EstadoPartido,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccioná un estado" />
            </SelectTrigger>

            <SelectContent>
              {ESTADO_PARTIDO_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <TextField
          label="Tiempo de juego"
          value={form.tiempoJuego}
          placeholder="Ej: 90"
          onChange={(value) => onChange({ tiempoJuego: value })}
        />

        <div className="space-y-2 md:col-span-2 xl:col-span-2">
          <label className="text-sm font-medium">Observaciones</label>

          <Textarea
            value={form.observaciones}
            placeholder="Comentarios del partido, incidencias o contexto"
            onChange={(event) =>
              onChange({
                observaciones: event.target.value,
              })
            }
          />
        </div>
      </div>
    </SectionCard>
  );
}
