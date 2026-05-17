import { Input } from "@/components/ui/input";

import { STATS_FIELDS } from "../types/constants";
import {
  preventMouseSelectionReset,
  selectAllInputText,
} from "../helpers";
import type {
  JugadorPlantelFormField,
  JugadorPlantelFormState,
} from "../types";
import { InlineField, SectionDivider } from "./FormFields";

type Props = {
  form: JugadorPlantelFormState;
  updateField: (key: JugadorPlantelFormField, value: string) => void;
};

export function PlayerStatsFields({ form, updateField }: Props) {
  return (
    <>
      <SectionDivider />

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Referencias y estadísticas
          </h3>
          <p className="text-xs text-slate-500">
            Esta sección aparece solamente al editar el jugador.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {STATS_FIELDS.map((field) => (
            <InlineField
              key={field.key}
              label={field.shortLabel}
              compact
              helper={field.label}
            >
              <Input
                value={form[field.key]}
                onChange={(event) => updateField(field.key, event.target.value)}
                onFocus={selectAllInputText}
                onMouseUp={preventMouseSelectionReset}
                type="number"
                min={0}
                placeholder={field.label}
                className="h-11 rounded-2xl border-slate-200 bg-white"
              />
            </InlineField>
          ))}
        </div>
      </div>
    </>
  );
}
