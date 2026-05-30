"use client";

import { Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type BrandFixtureCardProps = {
  match: string;
  phase: string;
  kickoff: string;
  status: string;
};

export function BrandFixtureCard({
  match,
  phase,
  kickoff,
  status,
}: BrandFixtureCardProps) {
  return (
    <Card className="brand-card">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-[var(--brand-text)]">{match}</p>
            <p className="text-sm text-[var(--brand-text-soft)]">{phase}</p>
          </div>
          <Badge className="brand-badge">{status}</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--brand-text-soft)]">
          <Clock3 className="h-4 w-4" />
          {kickoff}
        </div>
      </CardContent>
    </Card>
  );
}
