import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { SeleccionOption } from "../types";
import { InlineField } from "./FormFields";
import { SeleccionFlag } from "./SeleccionFlag";

type Props = {
  value: string;
  selecciones: SeleccionOption[];
  selectedSeleccion: SeleccionOption | null;
  onChange: (value: string) => void;
};

export function SeleccionSelect({
  value,
  selecciones,
  selectedSeleccion,
  onChange,
}: Props) {
  return (
    <InlineField
      label="Selecci\u00f3n"
      labelClassName="pt-3"
      className="md:grid-cols-[110px_minmax(0,1fr)]"
    >
      <div className="min-w-0">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-white px-4">
            {selectedSeleccion ? (
              <div className="flex min-w-0 items-center gap-3">
                <SeleccionFlag seleccion={selectedSeleccion} />

                <div className="min-w-0 text-left">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {selectedSeleccion.nombre}
                  </p>

                  {selectedSeleccion.codigo ? (
                    <p className="text-xs font-medium uppercase text-slate-500">
                      {selectedSeleccion.codigo}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : (
              <SelectValue placeholder="Seleccion\u00e1 una selecci\u00f3n" />
            )}
          </SelectTrigger>

          <SelectContent>
            {selecciones.map((seleccion) => (
              <SelectItem key={seleccion.id} value={seleccion.id}>
                <div className="flex min-w-0 items-center gap-3">
                  <SeleccionFlag seleccion={seleccion} size="sm" />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {seleccion.nombre}
                    </p>

                    {seleccion.codigo ? (
                      <p className="text-xs uppercase text-slate-500">
                        {seleccion.codigo}
                      </p>
                    ) : null}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </InlineField>
  );
}
