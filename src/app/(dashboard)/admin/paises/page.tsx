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

  const [search] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);
  const [syncingApi, setSyncingApi] = useState(false);

  if (!canVerPaises) {
    return <AccessDenied403Page />;
  }

  async function handleSyncFromApi() {
    try {
      setSyncingApi(true);
      const response = await axiosInstance.post<{
        message?: string;
        meta?: { updated?: number; created?: number };
      }>("/paises/import-api");

      toast.success(
        response.data.message ||
          "Selecciones sincronizadas correctamente desde la API"
      );
      setRefreshToken((value) => value + 1);
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron sincronizar las selecciones desde la API");
    } finally {
      setSyncingApi(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Card className="border-white/70 bg-white shadow-sm">
        <CardContent className="space-y-6 p-4 md:p-6">
          <PaisHeader
            cantCreate={!canCrearPaises}
            syncingApi={syncingApi}
            onSyncFromApi={() => void handleSyncFromApi()}
          />
          <PaisList search={search} refresh={refreshToken} />
        </CardContent>
      </Card>
    </div>
  );
}
