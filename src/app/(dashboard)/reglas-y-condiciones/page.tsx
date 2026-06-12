import {
  AlertTriangle,
  CheckCircle2,
  CircleHelp,
  Medal,
  ShieldCheck,
  Trophy,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpPageHeader } from "@/features/help/components/HelpPageHeader";
import { HelpSectionCard } from "@/features/help/components/HelpSectionCard";
import { RulesScoreCard } from "@/features/help/components/RulesScoreCard";
import {
  HELP_TOP_ACCENT,
  HELP_TOP_ACCENT_GLOW,
  HELP_TOP_ACCENT_HAIR,
  HELP_TOP_ACCENT_INNER,
} from "@/features/help/components/help-surface.styles";
import {
  buildRulesSections,
  RULES_EDITABLE_CONTENT,
  RULES_PAGE_INTRO,
} from "@/features/help/constants/rules-content";
import { getHelpScoreRuleSummary } from "@/features/help/lib/help-score-rules";
import { brandImages } from "@/config/brand-images";

const RULES_PANEL_CARD =
  "group relative gap-0 overflow-hidden rounded-[24px] border-white/10 bg-[#1E2C46] py-0 text-white shadow-[0_18px_48px_rgba(2,6,23,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-[#5993B6]/42";

const RULES_PANEL_OVERLAY =
  "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.18),transparent_36%)] opacity-70";

const RULES_PANEL_ITEM =
  "rounded-2xl border border-white/10 bg-[#425675]/55 px-4 py-3";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ReglasYCondicionesPage() {
  const scoreRule = await getHelpScoreRuleSummary();
  const sections = buildRulesSections(scoreRule);

  return (
    <main className="w-full overflow-x-hidden px-3 py-4 md:px-5 md:py-5 xl:px-4">
      <div className="mx-auto flex w-full max-w-[1500px] min-w-0 flex-col gap-5 xl:gap-6">
        <HelpPageHeader
          badge={RULES_PAGE_INTRO.badge}
          title={RULES_PAGE_INTRO.title}
          description={RULES_PAGE_INTRO.description}
          icon={ShieldCheck}
          variant="dark"
          topAccentVariant="help"
          heroImageSrc={brandImages.mascots.bases}
          heroImageAlt="Mascota de bases y condiciones"
          heroEyebrow="premios, puntaje y condiciones generales"
        />

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

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="font-brand text-[2rem] leading-none tracking-[0.04em] text-white">
              Sistema de puntuación
            </h2>
            <p className="text-sm leading-6 text-white/70">
              Estos valores corresponden a {scoreRule.faseNombre ?? "la fase actual de referencia"} y pueden variar en otras fases del torneo.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <RulesScoreCard
              title="Resultado exacto"
              points={scoreRule.puntosExacto}
              description="Acertás el marcador exacto del partido."
              icon={Trophy}
              variant="dark"
            />
            <RulesScoreCard
              title="Tendencia correcta"
              points={scoreRule.puntosParcial}
              description="Acertás ganador o empate, aunque no el marcador exacto."
              icon={Medal}
              variant="dark"
            />
            <RulesScoreCard
              title="Pronóstico incorrecto"
              points={scoreRule.puntosSinAcierto}
              description="El resultado final no coincide con el pronóstico cargado."
              icon={CircleHelp}
              variant="dark"
            />
          </div>
        </section>

        <section className="grid items-start gap-5 xl:grid-cols-2">
          <Card className={RULES_PANEL_CARD}>
            <div className={HELP_TOP_ACCENT}>
              <div className={HELP_TOP_ACCENT_INNER} />
              <div className={HELP_TOP_ACCENT_GLOW} />
              <div className={HELP_TOP_ACCENT_HAIR} />
            </div>
            <div className={RULES_PANEL_OVERLAY} />
            <CardHeader className="relative px-6 py-5">
              <CardTitle className="flex items-center gap-2 text-xl font-black text-white">
                <Trophy className="h-5 w-5 text-[#FFE4A3]" />
                Premios
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-3 px-6 pb-5 pt-0 text-sm leading-6 text-white/72">
              <div className={RULES_PANEL_ITEM}>
                <p className="font-bold text-white">Instancia De Premiacion</p>
                <p>{RULES_EDITABLE_CONTENT.premios.InstanciasDePremiacion}</p>
              </div>
              <div className={RULES_PANEL_ITEM}>
                <p className="font-bold text-white">Fase De Grupos</p>
                <p>{RULES_EDITABLE_CONTENT.premios.FaseDeGrupos}</p>
              </div>
              <div className={RULES_PANEL_ITEM}>
                <p className="font-bold text-white">Fase De Eliminatorias</p>
                <p>{RULES_EDITABLE_CONTENT.premios.FaseDeEliminatorias}</p>
              </div>
            </CardContent>
          </Card>

          <Card className={RULES_PANEL_CARD}>
            <div className={HELP_TOP_ACCENT}>
              <div className={HELP_TOP_ACCENT_INNER} />
              <div className={HELP_TOP_ACCENT_GLOW} />
              <div className={HELP_TOP_ACCENT_HAIR} />
            </div>
            <div className={RULES_PANEL_OVERLAY} />
            <CardHeader className="relative px-6 py-5">
              <CardTitle className="flex items-center gap-2 text-xl font-black text-white">
                <CheckCircle2 className="h-5 w-5 text-[#AEEBFF]" />
                Condiciones para acceder al premio
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-2 px-6 pb-5 pt-0 text-sm leading-6 text-white/72">
              {RULES_EDITABLE_CONTENT.condicionesPremio.map((item) => (
                <div
                  key={item}
                  className="flex gap-2 rounded-2xl border border-white/10 bg-[#425675]/55 px-4 py-3"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#AEEBFF]" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className={RULES_PANEL_CARD}>
            <div className={HELP_TOP_ACCENT}>
              <div className={HELP_TOP_ACCENT_INNER} />
              <div className={HELP_TOP_ACCENT_GLOW} />
              <div className={HELP_TOP_ACCENT_HAIR} />
            </div>
            <div className={RULES_PANEL_OVERLAY} />
            <CardHeader className="relative px-6 py-5">
              <CardTitle className="flex items-center gap-2 text-xl font-black text-white">
                <AlertTriangle className="h-5 w-5 text-[#FFE4A3]" />
                Personas que no pueden acceder al premio
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-2 px-6 pb-5 pt-0 text-sm leading-6 text-white/72">
              {RULES_EDITABLE_CONTENT.participantesExcluidos.map((item) => (
                <div
                  key={item}
                  className="flex gap-2 rounded-2xl border border-white/10 bg-[#425675]/55 px-4 py-3"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#FFE4A3]" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className={RULES_PANEL_CARD}>
            <div className={HELP_TOP_ACCENT}>
              <div className={HELP_TOP_ACCENT_INNER} />
              <div className={HELP_TOP_ACCENT_GLOW} />
              <div className={HELP_TOP_ACCENT_HAIR} />
            </div>
            <div className={RULES_PANEL_OVERLAY} />
            <CardHeader className="relative px-6 py-5">
              <CardTitle className="flex items-center gap-2 text-xl font-black text-white">
                <Medal className="h-5 w-5 text-[#AEEBFF]" />
                Empates, cambios y aceptación
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-4 px-6 pb-5 pt-0 text-sm leading-6 text-white/72">
              <div className={RULES_PANEL_ITEM}>
                <p className="font-bold text-white">Criterios de desempate</p>
                <ul className="mt-2 space-y-2">
                  {RULES_EDITABLE_CONTENT.criteriosDesempate.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Medal className="mt-0.5 h-4 w-4 shrink-0 text-[#AEEBFF]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={RULES_PANEL_ITEM}>
                <p className="font-bold text-white">Cambios en las reglas</p>
                <p>
                  La organización podrá actualizar reglas y condiciones, e informar los
                  cambios dentro del sistema cuando sea necesario.
                </p>
              </div>

              <div className={RULES_PANEL_ITEM}>
                <p className="font-bold text-white">Actualización del ranking</p>
                <p>
                  El ranking general se recalcula una vez por día. Si los puntos o posiciones
                  todavía no coinciden con un resultado reciente, puede deberse al horario de
                  ejecución o a la zona horaria del sistema.
                </p>
              </div>

              <div className={RULES_PANEL_ITEM}>
                <p className="font-bold text-white">Aceptación de reglas</p>
                <p>
                  La participación en el Prode implica conocer y respetar estas reglas
                  informativas y cualquier actualización comunicada por la organización.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
