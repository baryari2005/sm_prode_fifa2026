"use client";

import AccessDenied403Page from "@/app/(dashboard)/403/page";
import Loading from "@/app/(dashboard)/loading";
import { useCan } from "@/hooks/useCan";

import { ReglaPuntajeForm } from "@/features/reglas-puntaje/components/ReglaPuntajeForm";
import { useReglasPuntajePage } from "@/features/reglas-puntaje/hooks/useReglasPuntajePage";
import { Card, CardContent } from "@/components/ui/card";
import { ReglasPuntajeHeader } from "@/features/reglas-puntaje/components/ReglaPuntajeHeader";

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

  if (loadingInicial) return <Loading />;

  return (
    <div className="grid gap-6">
      <Card className="border-white/70 bg-white shadow-sm">
        <CardContent className="space-y-6 p-4 md:p-6">
          <ReglasPuntajeHeader
            faseNombre={selectedFase?.nombre ?? null}
            bloqueada={Boolean(reglaActual?.bloqueada)}
          />
          <ReglaPuntajeForm
            fases={fases}
            values={values}
            reglaActual={reglaActual}
            loadingRegla={loadingRegla}
            saving={saving}
            isFormDisabled={isFormDisabled || !canEditar}
            onChange={updateField}
            onSubmit={submit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
