"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useCan } from "@/hooks/useCan";
import { Card, CardContent } from "@/components/ui/card";
import { PaisList } from "@/features/paises/components/PaisList";
import AccessDenied403Page from "../../403/page";
import { PaisHeader } from "@/features/paises/components/PaisHeader";
import { axiosInstance } from "@/lib/axios";

export default function PaisesPage() {
  const canVerPaises = useCan("paises", "ver");
  const canCrearPaises = useCan("paises", "crear");
  const canEditarPaises = useCan("paises", "editar");

  const [search] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);
  const [updatingLanguage, setUpdatingLanguage] = useState(false);

  if (!canVerPaises) {
    return <AccessDenied403Page />;
  }

  async function handleUpdateLanguage() {
    try {
      setUpdatingLanguage(true);
      const response = await axiosInstance.post<{
        message?: string;
        meta?: { actualizadas?: number; sinCambios?: number };
      }>("/paises/modificar-idioma");

      toast.success(
        response.data.message ||
          "Los nombres de las selecciones se actualizaron a español"
      );
      setRefreshToken((value) => value + 1);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo modificar el idioma de las selecciones");
    } finally {
      setUpdatingLanguage(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Card className="border-white/70 bg-white shadow-sm">
        <CardContent className="space-y-6 p-4 md:p-6">
          <PaisHeader
            cantCreate={!canCrearPaises}
            updatingLanguage={updatingLanguage}
            onUpdateLanguage={
              canEditarPaises ? () => void handleUpdateLanguage() : undefined
            }
          />
          <PaisList search={search} refresh={refreshToken} />
        </CardContent>
      </Card>
    </div>
  );
}
