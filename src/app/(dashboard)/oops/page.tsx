"use client";

import { StatusPage } from "@/components/status/StatusPage";

export default function DashboardOopsPage() {
  return (
    <StatusPage
      code="404"
      title="Página no encontrada"
      description="No encontramos esta sección. Puede que la página no exista o que todavía no esté disponible dentro del panel."
      imageSrc="/mascotas/error-404.png"
      imageWrapperClassName="max-w-[860px] lg:max-w-[920px]"
      showBrandHeader
      brandTitle="Pasión mundial"
      brandSubtitle="Oops"
      primaryAction={{ label: "Volver al inicio", href: "/" }}
    />
  );
}
