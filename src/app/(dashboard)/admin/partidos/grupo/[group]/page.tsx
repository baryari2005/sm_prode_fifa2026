"use client";

import { use, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useCan } from "@/hooks/useCan";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Loading from "../../../../loading";

import { PartidosHeader } from "@/features/partidos/components/PartidosHeader";
import { PartidosEmptyState } from "@/features/partidos/components/PartidosEmptyState";
import { PartidosDateGroup } from "@/features/partidos/components/PartidosDataGroup";


import AccessDenied403Page from "../../../../403/page";
import { usePartidosPorGrupo } from "@/features/partidos/hooks/usePartidosPorGrupo";

interface GrupoPageProps {
  params: Promise<{
    group: string;
  }>;
}

export default function PartidosGrupoPage({ params }: GrupoPageProps) {
    const router = useRouter();
    const { group } = use(params);

    const canVerPartidos = useCan("partidos", "ver");
    const canCrearPartidos = useCan("partidos", "crear");

    const {
        partidos,
        selecciones,
        fases,

        loading,
        cargandoApi,

        busqueda,
        setBusqueda,

        partidosFiltrados,
        partidosAgrupados,

        loadData,
        handleCargarDesdeApi,
    } = usePartidosPorGrupo(group);

    useEffect(() => {
        if (canVerPartidos) {
            loadData();
        }
    }, [canVerPartidos, loadData]);

    const hasVisibleLiveMatches = useMemo(() => {
        return partidosAgrupados.some((grupo) =>
            grupo.partidos.some((partido) => partido.resultado?.estado === "EN_JUEGO")
        );
    }, [partidosAgrupados]);

    useEffect(() => {
        if (!hasVisibleLiveMatches) return;

        const intervalId = window.setInterval(() => {
            void loadData();
        }, 60_000);

        return () => window.clearInterval(intervalId);
    }, [hasVisibleLiveMatches, loadData]);

    if (!canVerPartidos) {
        return <AccessDenied403Page />;
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <Card className="border-white/70 bg-white shadow-sm">
            <CardContent className="space-y-6 p-4 md:p-6">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Grupo {group}</h1>
                </div>

                <PartidosHeader
                    cantidadPartidos={partidos.length}
                    busqueda={busqueda}
                    onBusquedaChange={setBusqueda}
                    onActualizar={loadData}
                />

                {hasVisibleLiveMatches ? (
                    <div className="flex items-center justify-end">
                        <Badge className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 hover:bg-emerald-50">
                            Actualizacion automatica cada 60 segundos
                        </Badge>
                    </div>
                ) : null}

                {partidosFiltrados.length === 0 ? (
                    <PartidosEmptyState
                        hasPartidos={partidos.length > 0}
                        canCrearPartidos={canCrearPartidos}
                        cargandoApi={cargandoApi}
                        onCargarDesdeApi={handleCargarDesdeApi}
                        onNuevoPartido={() => router.push("/admin/partidos/nuevo")}
                    />
                ) : (
                    <div className="space-y-6">
                        {partidosAgrupados.map((grupo) => (
                            <PartidosDateGroup
                                key={grupo.key}
                                titulo={grupo.titulo}
                                partidos={grupo.partidos}
                                selecciones={selecciones}
                                fases={fases}
                                onVerDetalle={(partidoId) =>
                                    router.push(`/admin/partidos/${partidoId}`)
                                }
                                onGestionarResultado={(partidoId) =>
                                    router.push(`/admin/partidos/${partidoId}/resultado`)
                                }
                                onCargarFormaciones={(partidoId) =>
                                    router.push(`/admin/partidos/${partidoId}/formaciones`)
                                }
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
