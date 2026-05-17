import type {
  JugadorPlantelFormField,
  JugadorPlantelFormState,
} from "../types";
import { FormInput } from "./FormFields";

type Props = {
  form: JugadorPlantelFormState;
  updateField: (key: JugadorPlantelFormField, value: string) => void;
};

export function PlayerDetailsFields({ form, updateField }: Props) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <FormInput
        label="Nacionalidad"
        value={form.nacionalidad}
        placeholder="Ej: Argentina"
        onChange={(value) => updateField("nacionalidad", value)}
      />

      <FormInput
        label="Edad"
        value={form.edad}
        placeholder="Ej: 29"
        type="number"
        onChange={(value) => updateField("edad", value)}
        compact
      />

      <FormInput
        label="Estatura"
        value={form.estatura}
        placeholder="Ej: 1.78 m"
        onChange={(value) => updateField("estatura", value)}
        compact
      />

      <FormInput
        label="Peso"
        value={form.peso}
        placeholder="Ej: 75 kg"
        onChange={(value) => updateField("peso", value)}
        compact
      />
    </div>
  );
}
