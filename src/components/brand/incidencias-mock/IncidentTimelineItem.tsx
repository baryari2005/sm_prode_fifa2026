"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { incidentTypeOptions, type IncidentTimelineEntry } from "./incidents-mock.data";

export function IncidentTimelineItem({
  item,
}: {
  item: IncidentTimelineEntry;
}) {
  const option = incidentTypeOptions.find((entry) => entry.key === item.type);
  const Icon = option?.icon;

  return (
    <article className="rounded-[22px] border border-white/10 bg-white/[0.05] p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/[0.08] text-[#AEEBFF]">
            {Icon ? <Icon className="h-4.5 w-4.5" /> : null}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-black text-[#AEEBFF]">{item.minute}</span>
              <span className="text-sm font-bold text-white">{option?.label}</span>
              <span className="text-sm text-white/48">-</span>
              <span className="text-sm font-semibold text-white/76">{item.team}</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-white">{item.player}</p>
            <p className="mt-1 text-sm text-white/62">{item.description}</p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button variant="outline" className="rounded-xl border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.12]">
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="outline" className="rounded-xl border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.12]">
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>
    </article>
  );
}
