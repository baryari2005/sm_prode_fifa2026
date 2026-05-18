"use client";

import { Suspense } from "react";

import Loading from "@/app/(dashboard)/loading";
import { PronosticoRapidoContent } from "@/features/pronosticos/components/rapido/PronosticoRapidoContent";

export default function PronosticoRapidoPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PronosticoRapidoContent />
    </Suspense>
  );
}
