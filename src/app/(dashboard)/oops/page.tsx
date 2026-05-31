"use client";

import { StatusPage } from "@/components/status/StatusPage";

export default function DashboardOopsPage() {
  return (
    <StatusPage
      code="404"
      title="Pagina no encontrada"
      description="No encontramos esta seccion. Puede que la pagina no exista o que todavia no este disponible dentro del panel."
      imageSrc="/mascotas/error-404.png"
      imageWrapperClassName="max-w-[860px] lg:max-w-[920px]"
      showBrandHeader
      brandTitle="Pasion mundial"
      brandSubtitle="Oops"
      primaryAction={{ label: "Volver al inicio", href: "/" }}
      secondaryAction={{ label: "Ir a ayuda", href: "/ayuda/usuario" }}
    />
  );
}
