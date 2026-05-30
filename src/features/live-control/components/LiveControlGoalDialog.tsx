"use client";

import { useState } from "react";
import { Save, ShieldCheck, TimerReset, X } from "lucide-react";

import {
  BrandDialogFrame,
  BRAND_DIALOG_CANCEL_BUTTON_CLASSNAME,
  BRAND_DIALOG_CONTENT_CLASSNAME,
  BRAND_DIALOG_FOOTER_CLASSNAME,
  BRAND_DIALOG_LABEL_CLASSNAME,
  BRAND_DIALOG_PRIMARY_BUTTON_CLASSNAME,
} from "@/components/ui/brand-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DialogFormSection,
  DialogHero,
  DialogHighlightCard,
  DialogMutedNote,
} from "@/components/ui/dialog-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  LIVE_CONTROL_TEXTAREA_CLASSNAME,
} from "@/features/live-control/components/LiveControlSurface";

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
        <Button type="button" size="sm" className="rounded-2xl">
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className={BRAND_DIALOG_CONTENT_CLASSNAME}>
        <DialogTitle className="sr-only">Cargar gol manual</DialogTitle>
        <DialogDescription className="sr-only">
          Dialog para registrar un gol manual sobre el partido seleccionado.
        </DialogDescription>

        <BrandDialogFrame>
          <DialogHero
            icon={<ShieldCheck className="h-6 w-6 text-[#FAB438]" />}
            title={
              <span className="font-brand text-[1.85rem] leading-[0.94] tracking-[0.03em] text-white">
                Cargar gol manual
              </span>
            }
            description="El evento queda protegido como manual y entra en la reconciliacion del proximo sync."
            className="border-b border-white/10 from-[#1E2C46] via-[#243754] to-[#10233B] px-6 py-6"
            iconClassName="border border-white/10 bg-white/[0.08] ring-0 shadow-[0_12px_30px_rgba(2,6,23,0.28)]"
          />

          <DialogFormSection>
            <DialogHighlightCard
              icon={<TimerReset className="h-5 w-5 text-[#FFE4A3]" />}
              title="Carga protegida"
              description="Mantene minuto, equipo y observacion consistentes para que la reconciliacion posterior no pierda contexto."
              className="border border-[#FAB438]/22 bg-[#FAB438]/10"
              titleClassName="text-[#FFF2C8]"
              descriptionClassName="text-white/74"
            />

            <div className="grid gap-4 py-1">
              <div className="grid gap-2">
                <Label className={BRAND_DIALOG_LABEL_CLASSNAME}>Equipo</Label>
                <Select
                  value={team}
                  onValueChange={(value) =>
                    setTeam(value as "LOCAL" | "VISITANTE")
                  }
                >
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
                <Label className={BRAND_DIALOG_LABEL_CLASSNAME}>Minuto</Label>
                <Input
                  value={minute}
                  onChange={(event) => setMinute(event.target.value)}
                  inputMode="numeric"
                />
              </div>

              <div className="grid gap-2">
                <Label className={BRAND_DIALOG_LABEL_CLASSNAME}>
                  Jugador ID opcional
                </Label>
                <Input
                  value={playerId}
                  onChange={(event) => setPlayerId(event.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label className={BRAND_DIALOG_LABEL_CLASSNAME}>Observacion</Label>
                <Textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                  className={LIVE_CONTROL_TEXTAREA_CLASSNAME}
                />
              </div>
            </div>

            <DialogMutedNote className="border border-white/8 bg-white/[0.05]">
              La carga manual conserva el mismo payload y el mismo handler que
              ya usa el panel.
            </DialogMutedNote>
          </DialogFormSection>

          <DialogFooter className={BRAND_DIALOG_FOOTER_CLASSNAME}>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className={BRAND_DIALOG_CANCEL_BUTTON_CLASSNAME}
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={saving}
              className={BRAND_DIALOG_PRIMARY_BUTTON_CLASSNAME}
            >
              <Save className="h-4 w-4" />
              {saving ? "Guardando..." : "Guardar gol"}
            </Button>
          </DialogFooter>
        </BrandDialogFrame>
      </DialogContent>
    </Dialog>
  );
}
