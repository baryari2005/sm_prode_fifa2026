"use client";

import Image from "next/image";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    <CardHeader className="relative px-4 pb-2 pt-4 md:px-5 md:pb-2">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 space-y-1">
          <CardTitle className="flex min-w-0 items-center gap-3">
            {flagUrl ? (
              <Image
                src={flagUrl}
                alt={title}
                width={40}
                height={28}
                unoptimized
                className="h-7 w-10 shrink-0 rounded-sm object-cover shadow-[0_8px_16px_rgba(2,8,23,0.28)]"
              />
            ) : null}

            <span className="font-brand truncate text-[1.8rem] leading-[0.92] tracking-[0.03em] text-white md:text-[2rem]">
              {title}
            </span>
          </CardTitle>

          <CardDescription className="text-base font-medium text-white/72">
            Cargá formación, titulares, suplentes y ubicación en cancha.
          </CardDescription>

          <div className="flex flex-wrap gap-2 pt-1">
            <SummaryPill label="Titulares" value={titularesCount} />
            <SummaryPill label="Suplentes" value={suplentesCount} />
            <SummaryPill label="Disponibles" value={availablePlayersCount} />
          </div>
        </div>

        {showApplyPrevious && onApplyPrevious ? (
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.12] hover:text-white"
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
