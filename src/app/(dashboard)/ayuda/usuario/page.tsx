import { CircleHelp, Medal, Target, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { HelpAccordion } from "@/features/help/components/HelpAccordion";
import { HelpPageHeader } from "@/features/help/components/HelpPageHeader";
import { HelpSectionCard } from "@/features/help/components/HelpSectionCard";
import {
  buildUserHelpSections,
  USER_HELP_FAQS,
  USER_HELP_INTRO,
} from "@/features/help/constants/user-help-content";
import { getHelpScoreRuleSummary } from "@/features/help/lib/help-score-rules";
import { brandImages } from "@/config/brand-images";

export default async function AyudaUsuarioPage() {
  const scoreRule = await getHelpScoreRuleSummary();
  const sections = buildUserHelpSections(scoreRule);

  return (
    <main className="w-full overflow-x-hidden px-3 py-4 md:px-5 md:py-5 xl:px-4">
      <div className="mx-auto flex w-full max-w-[1500px] min-w-0 flex-col gap-5 xl:gap-6">
        <HelpPageHeader
          badge={USER_HELP_INTRO.badge}
          title={USER_HELP_INTRO.title}
          description={USER_HELP_INTRO.description}
          icon={CircleHelp}
          variant="dark"
          topAccentVariant="help"
          heroImageSrc={brandImages.mascots.ayuda}
          heroImageAlt="Mascota de ayuda"
          heroEyebrow="atajos, consejos y preguntas frecuentes"
        />

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Badge className="h-auto w-full min-w-0 items-start justify-start gap-2 whitespace-normal rounded-2xl border border-[#5993B6]/24 bg-[#1E2C46] px-4 py-3 text-left text-sm font-semibold leading-5 text-white shadow-[0_14px_34px_rgba(2,6,23,0.16)] hover:bg-[#1E2C46]">
            <Target className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="min-w-0 break-words">
              Cargá tus pronósticos antes del cierre.
            </span>
          </Badge>

          <Badge className="h-auto w-full min-w-0 items-start justify-start gap-2 whitespace-normal rounded-2xl border border-[#5993B6]/24 bg-[#1E2C46] px-4 py-3 text-left text-sm font-semibold leading-5 text-white shadow-[0_14px_34px_rgba(2,6,23,0.16)] hover:bg-[#1E2C46]">
            <Medal className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="min-w-0 break-words">
              El ranking se actualiza con resultados oficiales.
            </span>
          </Badge>

          <Badge className="h-auto w-full min-w-0 items-start justify-start gap-2 whitespace-normal rounded-2xl border border-[#FAB438]/24 bg-[#FAB438]/10 px-4 py-3 text-left text-sm font-semibold leading-5 text-[#FFE4A3] shadow-[0_14px_34px_rgba(2,6,23,0.16)] hover:bg-[#FAB438]/10 sm:col-span-2 xl:col-span-1">
            <Trophy className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="min-w-0 break-words">
              El objetivo es sumar puntos y subir posiciones.
            </span>
          </Badge>
        </section>

        <section className="grid items-start gap-5 xl:grid-cols-2">
          {sections.map((section) => (
            <HelpSectionCard
              key={section.title}
              section={section}
              variant="dark"
              topAccentVariant="help"
            />
          ))}
        </section>

        <HelpAccordion
          title="Preguntas frecuentes"
          description="Respuestas rápidas a las dudas más comunes de los participantes."
          items={USER_HELP_FAQS}
          variant="dark"
          topAccentVariant="help"
        />
      </div>
    </main>
  );
}
