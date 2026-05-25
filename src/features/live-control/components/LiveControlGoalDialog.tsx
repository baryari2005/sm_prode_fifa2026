"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  partidoId: string;
  triggerLabel: string;
  defaultTeam: "LOCAL" | "VISITANTE";
  onSubmit: (payload: {
    partidoId: string;
    team: "LOCAL" | "VISITANTE";
    minute: number;
    playerId?: string;
    description?: string;
  }) => Promise<void>;
};

export function LiveControlGoalDialog({
  partidoId,
  triggerLabel,
  defaultTeam,
  onSubmit,
}: Props) {
  const [open, setOpen] = useState(false);
  const [team, setTeam] = useState<"LOCAL" | "VISITANTE">(defaultTeam);
  const [minute, setMinute] = useState("45");
  const [playerId, setPlayerId] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    const minuteValue = Number(minute);
    if (Number.isNaN(minuteValue)) {
      return;
    }

    try {
      setSaving(true);
      await onSubmit({
        partidoId,
        team,
        minute: minuteValue,
        playerId: playerId.trim() || undefined,
        description: description.trim() || undefined,
      });
      setOpen(false);
      setDescription("");
      setPlayerId("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" className="rounded-full">
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cargar gol manual</DialogTitle>
          <DialogDescription>
            El evento queda protegido como manual y entra en la reconciliación del próximo sync.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Equipo</Label>
            <Select value={team} onValueChange={(value) => setTeam(value as "LOCAL" | "VISITANTE")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOCAL">Local</SelectItem>
                <SelectItem value="VISITANTE">Visitante</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Minuto</Label>
            <Input value={minute} onChange={(event) => setMinute(event.target.value)} inputMode="numeric" />
          </div>

          <div className="grid gap-2">
            <Label>Jugador ID opcional</Label>
            <Input value={playerId} onChange={(event) => setPlayerId(event.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Observación</Label>
            <Textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={() => void handleSubmit()} disabled={saving}>
            {saving ? "Guardando..." : "Guardar gol"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
