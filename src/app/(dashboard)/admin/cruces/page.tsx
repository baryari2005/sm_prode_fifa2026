"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { useCan } from "@/hooks/useCan";

import Loading from "../../loading";
import AccessDenied403Page from "../../403/page";

import { useReglasCruce } from "@/features/partidos/hooks/useReglasCruce";
import { useTablaPosiciones } from "@/features/partidos/hooks/useTablaPosiciones";
import { BracketsSchedule } from "@/features/partidos/components/BracketsSchedule";
import type { ReglaCruce } from "@/features/partidos/types/types";

import { CrucesHeader } from "@/features/cruces/CrucesHeader";
import {
  CrucesFilter,
  type CruceFiltro,
} from "@/features/cruces/CrucesFilter";

function normalizeText(value?: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function matchesFaseFilter(regla: ReglaCruce, filtro: CruceFiltro) {
  if (filtro === "todos") return true;

  const fase = normalizeText(regla.fase?.nombre);
  const nombre = normalizeText(regla.nombre);
  const combined = `${fase} ${nombre}`;

  switch (filtro) {
    case "16vos":
      return (
        combined.includes("16vos") ||
        combined.includes("dieciseisavos") ||
        combined.includes("16avos")
      );

    case "8vos":
      return combined.includes("8vos") || combined.includes("octavos");

    case "4to":
      return (
        combined.includes("4to") ||
        combined.includes("cuartos") ||
        combined.includes("cuarto de final") ||
        combined.includes("cuartos de final")
      );

    case "semi":
      return combined.includes("semi");

    case "tercer-puesto":
      return (
        combined.includes("3er puesto") ||
        combined.includes("tercer puesto") ||
        combined.includes("puesto 3") ||
        combined.includes("puesto tercero")
      );

    case "final":
      return (
        fase === "final" ||
        nombre === "final" ||
        combined.includes("gran final")
      );

    default:
      return true;
  }
}

export default function CrucesPage() {
  const router = useRouter();
  const canVer = useCan("partidos", "ver");

  const [filtroActivo, setFiltroActivo] = useState<CruceFiltro>("todos");

  const {
    reglas,
    loading: loadingReglas,
    loadData: loadReglas,
  } = useReglasCruce();

  const {
    tablaPosiciones,
    loading: loadingTabla,
    loadData: loadTabla,
  } = useTablaPosiciones();

  useEffect(() => {
    if (canVer) {
      loadReglas();
      loadTabla();
    }
  }, [canVer, loadReglas, loadTabla]);

  const reglasFiltradas = useMemo(() => {
    return reglas.filter((regla) => matchesFaseFilter(regla, filtroActivo));
  }, [reglas, filtroActivo]);

  if (!canVer) {
    return <AccessDenied403Page />;
  }

  if (loadingReglas || loadingTabla) {
    return <Loading />;
  }

  return (
    <Card className="border-white/70 bg-white shadow-sm">
      <CardContent className="space-y-6 p-4 md:p-6">
        <CrucesHeader
          cantidadPartidos={reglas.length}
          onNuevasReglas={() => router.push("/admin/reglas-cruces")}
        />

        {reglas.length > 0 && (
          <CrucesFilter
            filtroActivo={filtroActivo}
            onFiltroChange={setFiltroActivo}
          />
        )}

        {reglas.length === 0 ? (
          <div className="text-sm text-slate-600">
            No hay reglas de cruces configuradas. Podés crearlas desde el panel
            de reglas.
          </div>
        ) : reglasFiltradas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            No hay cruces configurados para la fase seleccionada.
          </div>
        ) : (
          <BracketsSchedule
            reglas={reglasFiltradas}
            posiciones={tablaPosiciones}
          />
        )}
      </CardContent>
    </Card>
  );
}