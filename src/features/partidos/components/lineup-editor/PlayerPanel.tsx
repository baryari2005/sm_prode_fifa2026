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
    <div className="space-y-3 rounded-[1.6rem] border border-slate-200/90 bg-white/90 p-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:p-4">
      <div className="space-y-1">
        <h3 className="text-base font-black text-slate-950">{title}</h3>

        <p className="text-sm text-slate-500">{description}</p>
      </div>

      <div className="grid items-end gap-2 md:grid-cols-[minmax(0,1fr)_auto]">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            {selectLabel}
          </label>

          <Select
            value={selectedPlayerId}
            onValueChange={onSelectedPlayerChange}
            disabled={availablePlayers.length === 0}
          >
            <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white shadow-sm">
              <SelectValue placeholder="Seleccioná un jugador" />
            </SelectTrigger>

            <SelectContent>
              {availablePlayers.map((player) => (
                <SelectItem key={player.id} value={player.id}>
                  {`${player.nombre}${
                    player.numero ? ` #${player.numero}` : ""
                  }`}
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
          className="h-10 rounded-xl border-slate-200"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar
        </Button>
      </div>

      {children}
    </div>
  );
}