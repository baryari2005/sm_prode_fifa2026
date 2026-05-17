"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserPlus } from "lucide-react";

import AccessDenied403Page from "@/app/(dashboard)/403/page";
import Loading from "@/app/(dashboard)/loading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCan } from "@/hooks/useCan";
import { axiosInstance } from "@/lib/axios";
import { JugadorPlantelForm } from "@/features/planteles/components/JugadorPlantelForm";

type SeleccionResumen = {
  id: string;
  nombre: string;
  codigo?: string | null;
  bandera?: string | null;
};

export default function NuevoJugadorPlantelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const canCrear = useCan("paises", "editar");
  const [selecciones, setSelecciones] = useState<SeleccionResumen[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedSeleccionId = searchParams.get("seleccionId") ?? "";
  const returnTo = searchParams.get("returnTo") ?? "/admin/planteles";

  useEffect(() => {
    if (!canCrear) {
      setLoading(false);
      return;
    }

    const loadSelecciones = async () => {
      try {
        const response = await axiosInstance.get<{ data?: SeleccionResumen[] }>(
          "/paises?page=1&pageSize=200&sortBy=nombre&sortDir=asc"
        );
        setSelecciones(response.data.data ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void loadSelecciones();
  }, [canCrear]);

  if (loading) return <Loading />;
  if (!canCrear) return <AccessDenied403Page />;

  return (
    <div className="grid gap-6">
      <Card className="border-white/70 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-2xl text-slate-950">
              <UserPlus className="h-6 w-6" />
              Alta de jugador
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Registrá un nuevo jugador y vinculalo a la selección correspondiente.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-5 md:p-6">
          <JugadorPlantelForm
            mode="create"
            selecciones={selecciones}
            selectedSeleccionId={selectedSeleccionId}
            onSuccess={() => {
              router.push(returnTo);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
