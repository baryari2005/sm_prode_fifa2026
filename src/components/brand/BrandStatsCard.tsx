"use client";

import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type BrandStatsCardProps = {
  icon: LucideIcon;
  title: string;
  value: string;
  detail: string;
};

export function BrandStatsCard({
  icon: Icon,
  title,
  value,
  detail,
}: BrandStatsCardProps) {
  return (
    <Card className="brand-card">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5993B6]/12 text-[#1E2C46]">
            <Icon className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-[var(--brand-text-soft)]">{title}</p>
        </div>
        <div>
          <p className="brand-number text-4xl text-[var(--brand-text)]">{value}</p>
          <p className="mt-2 text-sm text-[var(--brand-text-soft)]">{detail}</p>
        </div>
      </CardContent>
    </Card>
  );
}
