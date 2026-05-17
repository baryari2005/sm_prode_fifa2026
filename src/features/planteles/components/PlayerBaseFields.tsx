import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FormInput, InlineField } from "./FormFields";
import { POSITION_OPTIONS } from "../types/constants";
import { JugadorPlantelFormField, JugadorPlantelFormState } from "../types/types";

type Props = {
  form: JugadorPlantelFormState;
  updateField: (key: JugadorPlantelFormField, value: string) => void;
};

export function PlayerBaseFields({ form, updateField }: Props) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.7fr)_minmax(0,1.95fr)]">
      <InlineField
        label="Posición"
        compact
        className="xl:grid-cols-[88px_minmax(0,1fr)]"
      >
        <Select
          value={form.posicion}
          onValueChange={(value) => updateField("posicion", value)}
        >
          <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white">
            <SelectValue placeholder="Seleccioná una posición" />
          </SelectTrigger>

          <SelectContent>
            {POSITION_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </InlineField>

      <FormInput
        label="Número"
        value={form.numero}
        placeholder="Ej: 10"
        type="number"
        onChange={(value) => updateField("numero", value)}
        compact
        className="xl:grid-cols-[78px_minmax(0,1fr)]"
      />

      <FormInput
        label="Nombre y apellido"
        value={form.nombre}
        placeholder="Ej: Lionel Messi"
        onChange={(value) => updateField("nombre", value)}
        compact
        className="xl:grid-cols-[140px_minmax(0,1fr)]"
      />
    </div>
  );
}
