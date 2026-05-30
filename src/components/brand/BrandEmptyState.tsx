"use client";

import { Flag, Sparkles } from "lucide-react";

import { BrandActionButton } from "@/components/brand/BrandActionButton";
import { Card, CardContent } from "@/components/ui/card";

type BrandEmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
};

export function BrandEmptyState({
  title,
  description,
  actionLabel,
}: BrandEmptyStateProps) {
  return (
    <Card className="brand-card-dark">
      <CardContent className="flex flex-col items-start gap-4 p-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/12 bg-white/8">
          <Flag className="h-7 w-7 text-[#FAB438]" />
        </div>
        <div>
          <h3 className="brand-heading text-2xl text-white">{title}</h3>
          <p className="mt-2 max-w-xl text-sm text-white/70">{description}</p>
        </div>
        {actionLabel ? (
          <BrandActionButton>
            <Sparkles className="h-4 w-4" />
            {actionLabel}
          </BrandActionButton>
        ) : null}
      </CardContent>
    </Card>
  );
}
