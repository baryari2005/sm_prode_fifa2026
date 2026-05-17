"use client";

import AccessDenied403Page from "@/app/(dashboard)/403/page";
import { PartidosAdminPanel } from "@/features/partidos/components/PartidosAdminPanel";
import { useCan } from "@/hooks/useCan";

export default function PartidosGestionarPage() {
  const canVerPartidos = useCan("partidos", "ver");
  const canCrearPartidos = useCan("partidos", "crear");
  const canEditarResultados = useCan("resultados", "editar");
  const canCrearResultados = useCan("resultados", "crear");
  const canActualizarResultados = canEditarResultados || canCrearResultados;

  if (!canVerPartidos) {
    return <AccessDenied403Page />;
  }

  return (
    <PartidosAdminPanel
      canCrearPartidos={canCrearPartidos}
      canActualizarResultados={canActualizarResultados}
    />
  );
}
