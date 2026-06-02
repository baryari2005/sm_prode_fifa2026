"use client";

import { Info, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SeleccionResumen } from "../types/plantel-manager.types";
import { ProdeIcon } from "@/components/icons/Iconos";


type PlantelHeaderProps = {  
  canCreate: boolean;
  selectedSeleccionId: string;
  selectedSeleccion?: SeleccionResumen | null;
  importing?: boolean;
  onBack?: () => void;
  onCreatePlayer: () => void;
  onImport?: (file: File | null) => void;  
  onOpenMassImport: () => void;
};

export function PlantelHeader({  
  canCreate,
  selectedSeleccionId,
  onCreatePlayer,  
}: PlantelHeaderProps) {
  const actionsDisabled = !canCreate;  
  
  return (
    <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
              <ProdeIcon className="h-6 w-6" source="/jersey.ico" />
              Selecciones
            </CardTitle>
          </div>
          <CardDescription className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>Gestioná jugadores, importa planteles disponibles para el fixture.</span>
            <Info className="h-4 w-4 text-slate-400" />
          </CardDescription>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:items-center">
          <Button
            onClick={onCreatePlayer}
            disabled={actionsDisabled || !selectedSeleccionId}
            className="h-11 rounded-2xl bg-[#39A935] px-4 text-sm font-bold text-white shadow-lg shadow-green-700/20 transition hover:bg-[#247A28]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo jugador
          </Button>
        </div>
      </div>
    </CardHeader>
  );
}
