import { Loader2, Plus, Save } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { JugadorPlantelFormMode } from "../types";

type Props = {
  mode: JugadorPlantelFormMode;
  submitting: boolean;
  uploading: boolean;
  onSubmit: () => void;
};

export function SubmitJugadorButton({
  mode,
  submitting,
  uploading,
  onSubmit,
}: Props) {
  return (
    <Button
      type="button"
      onClick={onSubmit}
      className="h-11 w-full rounded-full bg-[#39A935] text-white shadow-lg shadow-green-700/20 transition hover:bg-[#247A28]"
      disabled={submitting || uploading}
    >
      {submitting || uploading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {uploading
            ? "Subiendo imagen..."
            : mode === "create"
              ? "Creando..."
              : "Guardando..."}
        </span>
      ) : mode === "create" ? (
        <span className="inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Crear jugador
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          <Save className="h-4 w-4" />
          Guardar cambios
        </span>
      )}
    </Button>
  );
}
