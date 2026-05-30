"use client";

import { LoaderCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type BrandLoadingStateProps = {
  label: string;
};

export function BrandLoadingState({ label }: BrandLoadingStateProps) {
  return (
    <Card className="brand-card-dark">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/8">
          <LoaderCircle className="h-6 w-6 animate-spin text-[#AEEBFF]" />
        </div>
        <div>
          <p className="brand-heading text-xl text-white">Cargando</p>
          <p className="mt-1 text-sm text-white/68">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
