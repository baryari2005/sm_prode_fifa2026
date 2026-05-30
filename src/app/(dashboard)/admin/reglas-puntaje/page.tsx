"use client";

import AccessDenied403Page from "@/app/(dashboard)/403/page";
import DashboardLoading from "@/features/dashboard/components/loading/DashboardLoading";
import { useCan } from "@/hooks/useCan";

import { ReglasPuntajeOverview } from "@/features/reglas-puntaje/components/ReglasPuntajeOverview";
import { useReglasPuntajePage } from "@/features/reglas-puntaje/hooks/useReglasPuntajePage";

export default function ReglasPuntajePage() {
  const canVer = useCan("reglas-puntaje", "ver");
  const canEditar = useCan("reglas-puntaje", "editar");

  const {
    fases,
    values,
    reglaActual,
    selectedFase,
    loadingInicial,
    loadingRegla,
    saving,
    isFormDisabled,
    updateField,
    submit,
  } = useReglasPuntajePage();

  if (!canVer) return <AccessDenied403Page />;

  if (loadingInicial) return <DashboardLoading source="Admin reglas puntaje" />;

  return (
    <ReglasPuntajeOverview
      canEditar={canEditar}
      fases={fases}
      values={values}
      reglaActual={reglaActual}
      selectedFase={selectedFase}
      loadingRegla={loadingRegla}
      saving={saving}
      isFormDisabled={isFormDisabled}
      onChange={updateField}
      onSubmit={submit}
    />
  );
}
