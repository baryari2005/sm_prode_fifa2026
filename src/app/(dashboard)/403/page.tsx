"use client";

import { StatusPage } from "@/components/status/StatusPage";

export default function AccessDenied403Page() {
  return (
    <StatusPage
      code="403"
      title="Acceso denegado"
      description="No tenes permisos para entrar a esta seccion del panel. Si pensas que deberias verla, pedi acceso a un administrador."
      imageSrc="/mascotas/error-403.png"
      imageWrapperClassName="max-w-[920px] lg:max-w-[980px]"
      showBrandHeader
      brandTitle="Pasión mundial"
      brandSubtitle="Acceso restringido"
      primaryAction={{ label: "Volver al inicio", href: "/" }}
    />
  );
}
