"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Globe, Star, Users } from "lucide-react";

import AccessDenied403Page from "@/app/(dashboard)/403/page";
import Loading from "@/app/(dashboard)/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCan } from "@/hooks/useCan";
import { PaisForm } from "@/features/paises/components/PaisForm";
import type { Pais } from "@/features/paises/types/types";

export default function EditarPaisPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const canEditarPaises = useCan("paises", "editar");

  const [pais, setPais] = useState<Pais | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canEditarPaises) {
      setLoading(false);
      return;
    }

    const loadPais = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/paises/${params.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          toast.error("Seleccion no encontrada");
          router.push("/admin/paises");
          return;
        }

        const data = await response.json();
        setPais(data);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error al cargar la seleccion");
        router.push("/admin/paises");
      } finally {
        setLoading(false);
      }
    };

    void loadPais();
  }, [canEditarPaises, params.id, router]);

  if (loading) return <Loading />;
  if (!canEditarPaises) return <AccessDenied403Page />;
  if (!pais) return null;

  return (
    <div className="grid gap-6">
      <Card className="border-white/70 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <CardTitle className="flex flex-wrap items-center gap-2 text-2xl text-slate-950">
                <Globe className="h-6 w-6" />
                Editar seleccion
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  <Star className="h-3.5 w-3.5" />
                  {pais.nombre}
                </span>
              </CardTitle>
              <CardDescription className="text-sm text-slate-500">
                Modifica los datos principales de la seleccion y accede a su plantel.
              </CardDescription>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/admin/paises/${params.id}/plantel`)}
            >
              <Users className="mr-2 h-4 w-4" />
              Administrar plantel
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-5 md:p-6">
          <PaisForm
            mode="edit"
            pais={pais}
            onSuccess={() => {
              router.push("/admin/paises");
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
