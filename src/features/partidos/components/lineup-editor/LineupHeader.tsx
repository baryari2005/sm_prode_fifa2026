"use client";

import Image from "next/image";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SummaryPill } from "./SummaryPill";

type LineupHeaderProps = {
  title: string;
  flagUrl?: string | null;

  titularesCount: number;
  suplentesCount: number;
  availablePlayersCount: number;

  previousMatchLabel?: string | null;
  showApplyPrevious?: boolean;
  onApplyPrevious?: () => void;
};

export function LineupHeader({
  title,
  flagUrl,
  titularesCount,
  suplentesCount,
  availablePlayersCount,
  previousMatchLabel,
  showApplyPrevious,
  onApplyPrevious,
}: LineupHeaderProps) {
  return (
    <CardHeader className="relative border-b border-slate-200/70 px-4 py-4 md:px-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 space-y-1">
          <CardTitle className="flex min-w-0 items-center gap-3 text-xl font-black text-slate-950">
            {flagUrl ? (
              <Image
                src={flagUrl}
                alt={title}
                width={40}
                height={28}
                unoptimized
                className="h-7 w-10 shrink-0 rounded-sm object-cover shadow-sm"
              />
            ) : null}

            <span className="truncate">{title}</span>
          </CardTitle>

          <CardDescription>
            Cargá formación, titulares, suplentes y ubicación en cancha.
          </CardDescription>

          <div className="flex flex-wrap gap-2 pt-2">
            <SummaryPill label="Titulares" value={titularesCount} />
            <SummaryPill label="Suplentes" value={suplentesCount} />
            <SummaryPill label="Disponibles" value={availablePlayersCount} />
          </div>
        </div>

        {showApplyPrevious && onApplyPrevious ? (
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-slate-200"
            onClick={onApplyPrevious}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {previousMatchLabel
              ? `Usar formación anterior (${previousMatchLabel})`
              : "Usar formación anterior"}
          </Button>
        ) : null}
      </div>
    </CardHeader>
  );
}
