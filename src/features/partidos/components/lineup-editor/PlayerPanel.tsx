"use client";

import type { ReactNode } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { JugadorSeleccion } from "@/features/partidos/types/types";

type PlayersPanelProps = {
  title: string;
  description: string;
  selectLabel: string;
  selectedPlayerId: string;
  onSelectedPlayerChange: (value: string) => void;
  availablePlayers: JugadorSeleccion[];
  onAdd: () => void;
  addDisabled: boolean;
  children: ReactNode;
};

export function PlayersPanel({
  title,
  description,
  selectLabel,
  selectedPlayerId,
  onSelectedPlayerChange,
  availablePlayers,
  onAdd,
  addDisabled,
  children,
}: PlayersPanelProps) {
  return (
    <div className="space-y-4 rounded-[1.6rem] border border-white/10 bg-white/[0.05] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-5">
      <div className="space-y-2">
        <h3 className="font-brand text-[1.45rem] leading-[0.92] tracking-[0.03em] text-white">
          {title}
        </h3>
        <p className="max-w-[620px] text-base leading-7 text-white/72">{description}</p>
      </div>

      <div className="grid items-end gap-3 md:grid-cols-[minmax(0,1fr)_200px]">
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
            {selectLabel}
          </label>

          <Select
            value={selectedPlayerId}
            onValueChange={onSelectedPlayerChange}
            disabled={availablePlayers.length === 0}
          >
            <SelectTrigger className="h-11 rounded-[20px] border-white/10 bg-white/[0.08] px-4 text-base font-semibold text-white shadow-none">
              <SelectValue placeholder="Seleccioná un jugador" />
            </SelectTrigger>

            <SelectContent>
              {availablePlayers.map((player) => (
                <SelectItem key={player.id} value={player.id}>
                  {`${player.nombre}${player.numero ? ` #${player.numero}` : ""}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onAdd}
          disabled={addDisabled}
          className="h-11 rounded-[20px] border-white/10 bg-white/[0.06] text-base font-semibold text-white hover:bg-white/[0.12] hover:text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar
        </Button>
      </div>

      {children}
    </div>
  );
}
