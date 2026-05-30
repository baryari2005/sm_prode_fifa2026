"use client";

import { toast } from "sonner";

import { useCan } from "@/hooks/useCan";
import AccessDenied403Page from "../../403/page";
import DashboardLoading from "@/features/dashboard/components/loading/DashboardLoading";
import { PaisesOverview } from "@/features/paises/components/PaisesOverview";
import { axiosInstance } from "@/lib/axios";
import { useState } from "react";

export default function PaisesPage() {
  const canVerPaises = useCan("paises", "ver");
  const canCrearPaises = useCan("paises", "crear");
  const canEditarPaises = useCan("paises", "editar");

  const [refreshToken, setRefreshToken] = useState(0);
  const [updatingLanguage, setUpdatingLanguage] = useState(false);
  const [updatingConfederations, setUpdatingConfederations] = useState(false);

  if (canVerPaises === false && canCrearPaises === false && canEditarPaises === false) {
    return <DashboardLoading badgeLabel="Loading paises" />;
  }

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

  async function handleUpdateConfederations() {
    try {
      setUpdatingConfederations(true);
      const response = await axiosInstance.post<{
        message?: string;
        meta?: {
          actualizadas?: number;
          sinCambios?: number;
          sinMapeo?: number;
        };
      }>("/paises/completar-confederaciones");

      toast.success(
        response.data.message || "Las confederaciones se completaron correctamente",
      );
      setRefreshToken((value) => value + 1);
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron completar las confederaciones");
    } finally {
      setUpdatingConfederations(false);
    }
  }

  return (
    <PaisesOverview
      canEdit={canEditarPaises}
      refreshToken={refreshToken}
      updatingConfederations={updatingConfederations}
      updatingLanguage={updatingLanguage}
      onUpdateConfederations={
        canEditarPaises ? () => void handleUpdateConfederations() : undefined
      }
      onUpdateLanguage={
        canEditarPaises ? () => void handleUpdateLanguage() : undefined
      }
    />
  );
}
