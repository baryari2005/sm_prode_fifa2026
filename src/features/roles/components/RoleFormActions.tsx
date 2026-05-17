"use client";

import { Button } from "@/components/ui/button";
import { formatMessage } from "@/utils/formatters";
import { RefreshCw, Save } from "lucide-react";

type Props = {
    saving: boolean;
    onCancel: () => void;
    onSave: () => void | Promise<void>;
};

export function RoleFormActions({ saving, onCancel, onSave }: Props) {
    return (
        <div className="flex justify-end gap-3">
            <Button className="h-11 rounded-2xl" 
                    variant="outline" onClick={onCancel}>
                Cancelar
            </Button>

            <Button onClick={onSave} disabled={saving} 
            className="h-11 rounded-2xl bg-[#39A935] text-white shadow-lg shadow-green-700/20 transition hover:bg-[#247A28]">
                {saving ? (
                    <span className="inline-flex items-center gap-2">
                        <RefreshCw className="animate-spin" size={18} />
                        {formatMessage("Guardando...")}
                    </span>
                )
                    :
                    (
                        <span className="inline-flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Guardar cambios
                        </span>
                    )
                }
            </Button>
        </div>
    );
}