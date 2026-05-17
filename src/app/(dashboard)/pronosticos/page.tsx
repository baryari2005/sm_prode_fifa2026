"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import Loading from "../loading";

import { PronosticosHeader } from "@/features/pronosticos/components/PronosticosHeader";
import { usePronosticosPage } from "@/features/pronosticos/hooks/usePronosticosPage";
import { PartidosDateGroup } from "@/features/partidos/components/PartidosDataGroup";
import { PronosticoDialog } from "@/features/pronosticos/components/PronosticoDialog";
import { GrupoFilter } from "@/features/partidos/components/GrupoFilter";

import {  
  getFixturePhaseSlugFromText,
} from "@/features/partidos/constants/fixture-phase-filter.constants";

import {
  getFaseNombre,
  getGrupoNombre,
  type PartidoConRelaciones,
} from "@/features/partidos/utils/partidos-ui.helpers";

const TODOS_LOS_GRUPOS = "Todos";

function getGrupoFilterValue(partido: PartidoConRelaciones) {
  const grupoNombre = getGrupoNombre(partido);

  if (!grupoNombre) return null;

  return grupoNombre.replace(/^grupo\s+/i, "").trim();
}

export default function PronosticosPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPartido, setSelectedPartido] =
    useState<PartidoConRelaciones | null>(null);

  const [grupoSeleccionado, setGrupoSeleccionado] =
    useState<string>(TODOS_LOS_GRUPOS);

  const {
    partidos,
    partidosAgrupados,
    loading,
    busqueda,
    setBusqueda,
    loadData,
  } = usePronosticosPage();

  const partidoIdFromQuery = searchParams.get("partido");

  const faseParam = searchParams.get("fase");
  const faseActiva = getFixturePhaseSlugFromText(faseParam);

  const mostrandoFaseGrupos = faseActiva === "grupos";

  const partidosAgrupadosPorFase = useMemo(() => {
    if (!faseActiva) return partidosAgrupados;

    return partidosAgrupados
      .map((grupo) => ({
        ...grupo,
        partidos: grupo.partidos.filter((partido) => {
          const faseNombre = getFaseNombre(partido, []);
          const partidoFaseSlug = getFixturePhaseSlugFromText(faseNombre);

          return partidoFaseSlug === faseActiva;
        }),
      }))
      .filter((grupo) => grupo.partidos.length > 0);
  }, [partidosAgrupados, faseActiva]);

  const gruposDisponibles = useMemo(() => {
    if (!mostrandoFaseGrupos) return [];

    const grupos = new Set<string>();

    partidosAgrupadosPorFase.forEach((grupoFecha) => {
      grupoFecha.partidos.forEach((partido) => {
        const grupo = getGrupoFilterValue(partido);

        if (grupo) {
          grupos.add(grupo);
        }
      });
    });

    return Array.from(grupos).sort((a, b) =>
      a.localeCompare(b, "es", { numeric: true })
    );
  }, [partidosAgrupadosPorFase, mostrandoFaseGrupos]);

  const partidosAgrupadosVisibles = useMemo(() => {
    if (!mostrandoFaseGrupos) return partidosAgrupadosPorFase;

    if (grupoSeleccionado === TODOS_LOS_GRUPOS) {
      return partidosAgrupadosPorFase;
    }

    return partidosAgrupadosPorFase
      .map((grupoFecha) => ({
        ...grupoFecha,
        partidos: grupoFecha.partidos.filter((partido) => {
          const grupo = getGrupoFilterValue(partido);

          return grupo === grupoSeleccionado;
        }),
      }))
      .filter((grupoFecha) => grupoFecha.partidos.length > 0);
  }, [partidosAgrupadosPorFase, mostrandoFaseGrupos, grupoSeleccionado]);

  const totalPartidosVisibles = useMemo(() => {
    return partidosAgrupadosVisibles.reduce(
      (total, grupo) => total + grupo.partidos.length,
      0
    );
  }, [partidosAgrupadosVisibles]);

  const partidoPreseleccionado = useMemo(() => {
    if (!partidoIdFromQuery) return null;

    return partidos.find((partido) => partido.id === partidoIdFromQuery) ?? null;
  }, [partidoIdFromQuery, partidos]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!mostrandoFaseGrupos) {
      setGrupoSeleccionado(TODOS_LOS_GRUPOS);
      return;
    }

    if (
      grupoSeleccionado !== TODOS_LOS_GRUPOS &&
      !gruposDisponibles.includes(grupoSeleccionado)
    ) {
      setGrupoSeleccionado(TODOS_LOS_GRUPOS);
    }
  }, [mostrandoFaseGrupos, gruposDisponibles, grupoSeleccionado]);

  useEffect(() => {
    if (!partidoPreseleccionado) return;

    setSelectedPartido(partidoPreseleccionado);
    setDialogOpen(true);
  }, [partidoPreseleccionado]);

  useEffect(() => {
    if (!partidoIdFromQuery || loading) return;

    const frame = requestAnimationFrame(() => {
      const element = document.querySelector<HTMLElement>(
        `[data-partido-id="${partidoIdFromQuery}"]`
      );

      element?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [partidoIdFromQuery, loading, partidosAgrupadosVisibles]);

  const clearDialogQuery = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("partido");

    const next = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.replace(next);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Card className="border-white/70 bg-white shadow-sm">
      <CardContent className="space-y-6 p-4 md:p-6">
        <PronosticosHeader
          total={faseActiva ? totalPartidosVisibles : partidos.length}
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          onActualizar={loadData}
        />

        {/* {faseActiva && (
          <div className="flex flex-col gap-3 rounded-2xl border border-[#008C93]/20 bg-[#008C93]/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#008C93]">
                Filtro de pronósticos
              </p>

              <h2 className="text-lg font-black tracking-tight text-slate-950">
                {faseActivaLabel}
              </h2>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Mostrando solamente los partidos de esta fase.
              </p>
            </div>

            <Link
              href="/pronosticos"
              className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-[#008C93]/40 hover:bg-[#008C93]/5 hover:text-[#008C93]"
            >
              Ver todos los pronósticos
            </Link>
          </div>
        )} */}

        {mostrandoFaseGrupos && gruposDisponibles.length > 0 && (
          <GrupoFilter
            grupos={gruposDisponibles}
            grupoSeleccionado={grupoSeleccionado}
            onGrupoChange={(grupo) => {
              setGrupoSeleccionado(grupo ?? TODOS_LOS_GRUPOS);
            }}
          />
        )}

        {partidosAgrupadosVisibles.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/70 px-6 py-16 text-center text-sm font-medium text-slate-500">
            No hay partidos para mostrar con los filtros actuales.
          </div>
        ) : (
          <div className="space-y-6">
            {partidosAgrupadosVisibles.map((grupo) => (
              <PartidosDateGroup
                key={grupo.key}
                titulo={grupo.titulo}
                partidos={grupo.partidos}
                selecciones={[]}
                fases={[]}
                allowPronostico
                onPronosticoSaved={loadData}
                onPronosticarClick={(partido) => {
                  setSelectedPartido(partido);
                  setDialogOpen(true);
                }}
                highlightedPartidoId={partidoIdFromQuery}
              />
            ))}
          </div>
        )}

        <PronosticoDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);

            if (!open) {
              setSelectedPartido(null);
              clearDialogQuery();
            }
          }}
          partido={selectedPartido}
          onSaved={loadData}
        />
      </CardContent>
    </Card>
  );
}
