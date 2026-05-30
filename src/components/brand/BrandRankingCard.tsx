"use client";

import { Medal } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type BrandRankingCardProps = {
  position: string;
  name: string;
  points: string;
  detail: string;
};

export function BrandRankingCard({
  position,
  name,
  points,
  detail,
}: BrandRankingCardProps) {
  return (
    <Card className="brand-card-dark">
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-300/10 text-yellow-200">
            <Medal className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-white/60">{position}</p>
            <p className="text-lg font-bold text-white">{name}</p>
            <p className="text-sm text-white/68">{detail}</p>
          </div>
        </div>
        <p className="brand-number text-3xl text-[#FAB438]">{points}</p>
      </CardContent>
    </Card>
  );
}
