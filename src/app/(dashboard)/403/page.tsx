"use client";

import { StatusPage } from "@/components/status/StatusPage";

export default function AccessDenied403Page() {
  return (
    <StatusPage
      code="403"
      title="Acceso denegado"
      description="No tenés permisos para ver esta sección. Si creés que es un error, pedí acceso a un administrador."
      imageSrc="/robot-403.png"
      primaryAction={{ label: "Volver al inicio", href: "/" }}
    />
  );
}