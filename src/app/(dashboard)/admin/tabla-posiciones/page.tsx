"use client";

import { useEffect } from "react";

import { useCan } from "@/hooks/useCan";

import { Card, CardContent } from "@/components/ui/card";
import Loading from "../../loading";

import { useTablaPosiciones } from "@/features/partidos/hooks/useTablaPosiciones";
import { TablaPosiciones } from "@/features/partidos/components/TablaPosiciones";
import AccessDenied403Page from "../../403/page";
import { TablaPosicionesHeader } from "@/features/partidos/components/TablaPosicionesHeader";

export default function TablaPosicionesPage() {    

    const canVerPartidos = useCan("partidos", "ver");

    const {
        loading,        
        gruposDisponibles,
        grupoSeleccionado,
        setGrupoSeleccionado,

        grupoActual,

        loadData,
    } = useTablaPosiciones();

    useEffect(() => {
        if (canVerPartidos) {
            loadData();
        }
    }, [canVerPartidos, loadData]);

    if (!canVerPartidos) {
        return <AccessDenied403Page />;
    }

    if (loading) {
        return <Loading />;
    }

    const gruposValidos = gruposDisponibles.filter(
        (grupo): grupo is string => Boolean(grupo)
    );

    return (
        <Card className="border-white/70 bg-white shadow-sm">
            <CardContent className="space-y-6 p-4 md:p-6">
                <TablaPosicionesHeader />

                <TablaPosiciones
                    grupos={gruposValidos}
                    grupoSeleccionado={grupoSeleccionado}
                    onGrupoChange={setGrupoSeleccionado}
                    tabla={grupoActual}
                />
            </CardContent>
        </Card>
    );
}
