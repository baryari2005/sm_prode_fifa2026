"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { PencilLine } from "lucide-react";
import { toast } from "sonner";

import AccessDenied403Page from "@/app/(dashboard)/403/page";
import Loading from "@/app/(dashboard)/loading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCan } from "@/hooks/useCan";
import { axiosInstance } from "@/lib/axios";
import type { JugadorSeleccion } from "@/features/partidos/types/types";
import { JugadorPlantelForm } from "@/features/planteles/components/JugadorPlantelForm";

type SeleccionResumen = {
  id: string;
  nombre: string;
  codigo?: string | null;
  bandera?: string | null;
};

export default function EditarJugadorPlantelPage() {
  const router = useRouter();
  const params = useParams<{ jugadorId: string }>();
  const searchParams = useSearchParams();
  const canEditar = useCan("paises", "editar");

  const [jugador, setJugador] = useState<JugadorSeleccion | null>(null);
  const [selecciones, setSelecciones] = useState<SeleccionResumen[]>([]);
  const [loading, setLoading] = useState(true);

  const returnTo = searchParams.get("returnTo") ?? "/admin/planteles";

  useEffect(() => {
    if (!canEditar) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const [jugadorResponse, seleccionesResponse] = await Promise.all([
          axiosInstance.get<JugadorSeleccion>(`/plantel/${params.jugadorId}`),
          axiosInstance.get<{ data?: SeleccionResumen[] }>(
            "/paises?page=1&pageSize=200&sortBy=nombre&sortDir=asc"
          ),
        ]);

        setJugador(jugadorResponse.data);
        setSelecciones(seleccionesResponse.data.data ?? []);
      } catch (error) {
        console.error(error);
        toast.error("No se pudo cargar el jugador");
        router.push(returnTo);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [canEditar, params.jugadorId, returnTo, router]);

  if (loading) return <Loading />;
  if (!canEditar) return <AccessDenied403Page />;
  if (!jugador) return null;

  return (
    <div className="grid gap-6">
      <Card className="border-white/70 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-2xl text-slate-950">
              <PencilLine className="h-6 w-6" />
              Editar jugador
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Modifica la información general, posición y estadísticas del jugador.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-5 md:p-6">
          <JugadorPlantelForm
            mode="edit"
            jugador={jugador}
            selecciones={selecciones}
            selectedSeleccionId={jugador.seleccionId}
            onSuccess={() => {
              router.push(returnTo);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
