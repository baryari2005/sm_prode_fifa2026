"use client";

import { AlertTriangle, ShieldCheck } from "lucide-react";

import AccessDenied403Page from "@/app/(dashboard)/403/page";
import { Badge } from "@/components/ui/badge";
import { HelpAccordion } from "@/features/help/components/HelpAccordion";
import { HelpPageHeader } from "@/features/help/components/HelpPageHeader";
import { HelpSectionCard } from "@/features/help/components/HelpSectionCard";
import {
  ADMIN_HELP_FAQS,
  ADMIN_HELP_INTRO,
  ADMIN_HELP_SECTIONS,
  ADMIN_RECOMMENDATIONS,
} from "@/features/help/constants/admin-help-content";
import { useCan } from "@/hooks/useCan";

export default function AyudaAdminPage() {
  const canVerAyudaAdmin = useCan("ayuda", "ver_admin");

  if (!canVerAyudaAdmin) {
    return <AccessDenied403Page />;
  }

  return (
    <div className="space-y-6">
      <HelpPageHeader
        badge={ADMIN_HELP_INTRO.badge}
        title={ADMIN_HELP_INTRO.title}
        description={ADMIN_HELP_INTRO.description}
        icon={ShieldCheck}
      />

      <section className="grid items-start gap-5 xl:grid-cols-2">
        {ADMIN_HELP_SECTIONS.map((section) => (
          <HelpSectionCard key={section.title} section={section} />
        ))}
      </section>

      <section className="rounded-[24px] border border-amber-200 bg-amber-50/80 px-6 py-6 shadow-[0_14px_34px_rgba(245,158,11,0.08)]">
        <div className="mb-4 flex items-center gap-2 text-lg font-black text-amber-950">
          <AlertTriangle className="h-5 w-5" />
          Recomendaciones para la administración
        </div>

        <div className="flex flex-wrap gap-3">
          {ADMIN_RECOMMENDATIONS.map((item) => (
            <Badge
              key={item}
              className="h-auto max-w-full rounded-2xl border border-amber-300 bg-white/80 px-4 py-3 text-left text-sm font-semibold whitespace-normal text-amber-900"
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
      />
    </div>
  );
}
