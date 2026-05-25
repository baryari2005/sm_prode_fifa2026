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

export default async function AyudaUsuarioPage() {
  const scoreRule = await getHelpScoreRuleSummary();
  const sections = buildUserHelpSections(scoreRule);

  return (
    <div className="space-y-6">
      <HelpPageHeader
        badge={USER_HELP_INTRO.badge}
        title={USER_HELP_INTRO.title}
        description={USER_HELP_INTRO.description}
        icon={CircleHelp}
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Badge className="h-auto w-full min-w-0 items-start justify-start gap-2 whitespace-normal rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm font-semibold leading-5 text-emerald-800">
          <Target className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="min-w-0 break-words">
            Cargá tus pronósticos antes del cierre.
          </span>
        </Badge>

        <Badge className="h-auto w-full min-w-0 items-start justify-start gap-2 whitespace-normal rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-left text-sm font-semibold leading-5 text-sky-800">
          <Medal className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="min-w-0 break-words">
            El ranking se actualiza con resultados oficiales.
          </span>
        </Badge>

        <Badge className="h-auto w-full min-w-0 items-start justify-start gap-2 whitespace-normal rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm font-semibold leading-5 text-amber-800 sm:col-span-2 xl:col-span-1">
          <Trophy className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="min-w-0 break-words">
            El objetivo es sumar puntos y subir posiciones.
          </span>
        </Badge>
      </section>

      <section className="grid items-start gap-5 xl:grid-cols-2">
        {sections.map((section) => (
          <HelpSectionCard key={section.title} section={section} />
        ))}
      </section>

      <HelpAccordion
        title="Preguntas frecuentes"
        description="Respuestas rápidas a las dudas más comunes de los participantes."
        items={USER_HELP_FAQS}
      />
    </div>
  );
}
