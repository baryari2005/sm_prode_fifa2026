"use client";

import { AlertTriangle, ShieldCheck } from "lucide-react";

import AccessDenied403Page from "@/app/(dashboard)/403/page";
import { Badge } from "@/components/ui/badge";
import { HelpAccordion } from "@/features/help/components/HelpAccordion";
import { HelpPageHeader } from "@/features/help/components/HelpPageHeader";
import { HelpSectionCard } from "@/features/help/components/HelpSectionCard";
import {
  HELP_TOP_ACCENT,
  HELP_TOP_ACCENT_GLOW,
  HELP_TOP_ACCENT_HAIR,
  HELP_TOP_ACCENT_INNER,
} from "@/features/help/components/help-surface.styles";
import {
  ADMIN_HELP_FAQS,
  ADMIN_HELP_INTRO,
  ADMIN_HELP_SECTIONS,
  ADMIN_RECOMMENDATIONS,
} from "@/features/help/constants/admin-help-content";
import { useCan } from "@/hooks/useCan";
import { brandImages } from "@/config/brand-images";

export default function AyudaAdminPage() {
  const canVerAyudaAdmin = useCan("ayuda", "ver_admin");

  if (!canVerAyudaAdmin) {
    return <AccessDenied403Page />;
  }

  return (
    <main className="w-full overflow-x-hidden px-3 py-4 md:px-5 md:py-5 xl:px-4">
      <div className="mx-auto flex w-full max-w-[1500px] min-w-0 flex-col gap-5 xl:gap-6">
        <HelpPageHeader
          badge={ADMIN_HELP_INTRO.badge}
          title={ADMIN_HELP_INTRO.title}
          description={ADMIN_HELP_INTRO.description}
          icon={ShieldCheck}
          variant="dark"
          topAccentVariant="help"
          heroImageSrc={brandImages.mascots.ayuda}
          heroImageAlt="Mascota de ayuda administrativa"
          heroEyebrow="operacion, permisos y buenas practicas"
        />

        <section className="grid items-start gap-5 xl:grid-cols-2">
          {ADMIN_HELP_SECTIONS.map((section) => (
            <HelpSectionCard
              key={section.title}
              section={section}
              variant="dark"
              topAccentVariant="help"
            />
          ))}
        </section>

        <section className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#1E2C46] px-6 py-6 text-white shadow-[0_18px_48px_rgba(2,6,23,0.2)]">
          <div className={HELP_TOP_ACCENT}>
            <div className={HELP_TOP_ACCENT_INNER} />
            <div className={HELP_TOP_ACCENT_GLOW} />
            <div className={HELP_TOP_ACCENT_HAIR} />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.18),transparent_36%)] opacity-70" />
          <div className="relative mb-4 flex items-center gap-2 text-lg font-black text-white">
            <AlertTriangle className="h-5 w-5 text-[#FFE4A3]" />
            Recomendaciones para la administración
          </div>

          <div className="relative flex flex-wrap gap-3">
            {ADMIN_RECOMMENDATIONS.map((item) => (
              <Badge
                key={item}
                className="h-auto max-w-full whitespace-normal rounded-2xl border border-[#FAB438]/24 bg-[#FAB438]/10 px-4 py-3 text-left text-sm font-semibold text-[#FFE4A3] hover:bg-[#FAB438]/10"
              >
                {item}
              </Badge>
            ))}
          </div>
        </section>

        <HelpAccordion
          title="Preguntas frecuentes de administración"
          description="Consultas comunes para operar el panel sin perder consistencia en los datos."
          items={ADMIN_HELP_FAQS}
          variant="dark"
          topAccentVariant="help"
        />
      </div>
    </main>
  );
}
