"use client";

import { useState } from "react";
import { toast } from "sonner";

import AccessDenied403Page from "@/app/(dashboard)/403/page";
import { FixtureResetOverview } from "@/features/partidos/components/FixtureResetOverview";
import { type ResetPartidosResponse } from "@/features/partidos/components/PartidosResetImportacion";
import { reimportarPartidosDesdeApi } from "@/features/partidos/services/partidos.service";
import { useCan } from "@/hooks/useCan";

export default function PartidosReimportarPage() {
  const canVerPartidos = useCan("partidos", "ver");
  const canCrearPartidos = useCan("partidos", "crear");
  const [running, setRunning] = useState(false);
  const [summary, setSummary] = useState<ResetPartidosResponse | null>(null);

  if (!canVerPartidos) {
    return <AccessDenied403Page />;
  }

  async function handleRun() {
    try {
      setRunning(true);
      const result = await reimportarPartidosDesdeApi();
      setSummary(result);
      toast.success(result.message);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo reimportar el fixture desde la API"
      );
    } finally {
      setRunning(false);
    }
  }

  return (
    <FixtureResetOverview
      canRun={canCrearPartidos}
      running={running}
      summary={summary}
      onRun={() => void handleRun()}
    />
  );
}
