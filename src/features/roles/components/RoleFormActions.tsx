"use client";

import { RefreshCw, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatMessage } from "@/utils/formatters";

type Props = {
  saving: boolean;
  onCancel: () => void;
  onSave: () => void | Promise<void>;
};

export function RoleFormActions({ saving, onCancel, onSave }: Props) {
  return (
    <div className="flex justify-end gap-3">
      <Button
        className="h-11 rounded-2xl border border-[#5993B6]/28 bg-[#1E2C46] text-white shadow-[0_12px_28px_rgba(2,6,23,0.16)] transition hover:bg-[#243754] hover:text-[#AEEBFF]"
        variant="outline"
        onClick={onCancel}
      >
        Cancelar
      </Button>

      <Button
        onClick={onSave}
        disabled={saving}
        className="h-11 rounded-2xl border border-[#F7CF74] bg-[#FAB438] text-[0.98rem] font-semibold tracking-[0.02em] text-[#1E2C46] shadow-[0_18px_40px_rgba(250,180,56,0.24)] transition hover:bg-[#FFD166] hover:shadow-[0_22px_46px_rgba(250,180,56,0.3)] disabled:border-[#F7CF74]/60 disabled:bg-[#D9A93A] disabled:text-[#1E2C46]/70"
      >
        {saving ? (
          <span className="inline-flex items-center gap-2">
            <RefreshCw className="animate-spin" size={18} />
            {formatMessage("Guardando...")}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <Save className="h-4 w-4" />
            Guardar cambios
          </span>
        )}
      </Button>
    </div>
  );
}
