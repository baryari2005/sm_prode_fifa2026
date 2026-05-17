"use client";

import { useState } from "react";
import { toast } from "sonner";

import AccessDenied403Page from "@/app/(dashboard)/403/page";
import { Card, CardContent } from "@/components/ui/card";
import { PartidosResetImportacion, type ResetPartidosResponse } from "@/features/partidos/components/PartidosResetImportacion";
import { ReimportarPartidosHeader } from "@/features/partidos/components/ReimportarPartidosHeader";
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
    <div className="grid gap-6">
      <Card className="border-rose-200 bg-white shadow-sm">
        <CardContent className="space-y-6 p-4 md:p-6">
          <ReimportarPartidosHeader
            canRun={canCrearPartidos}
            running={running}
            onRun={() => void handleRun()}
          />
          <PartidosResetImportacion summary={summary} />
        </CardContent>
      </Card>
    </div>
  );
}
