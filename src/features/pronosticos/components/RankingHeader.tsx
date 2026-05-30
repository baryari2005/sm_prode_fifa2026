"use client";

import { PageHeaderWithBrand } from "@/components/brand/PageHeaderWithBrand";
import { brandImages } from "@/config/brand-images";

export function RankingHeader() {
  return (
    <PageHeaderWithBrand
      title="Ranking del Prode"
      description="El orgullo del barrio se juega fecha a fecha. Seguí tu posición, tus puntos acumulados y el historial de pronósticos ya calificados."
      badge="Pasión mundial"
      imageSrc={brandImages.institucional.masSanMiguelLogo}
      watermarkSrc={brandImages.institucional.solArgentino}
      imageAlt="Branding institucional del ranking"
      density="compact"
      brandVisual="subtle"
    />
  );
}
