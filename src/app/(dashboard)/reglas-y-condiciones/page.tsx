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
  buildRulesSections,
  RULES_EDITABLE_CONTENT,
  RULES_PAGE_INTRO,
} from "@/features/help/constants/rules-content";
import { getHelpScoreRuleSummary } from "@/features/help/lib/help-score-rules";

const RULES_PANEL_CARD =
  "group relative gap-0 overflow-hidden rounded-[24px] border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 py-0 shadow-[0_14px_34px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#12b8c9]/35 hover:shadow-[0_18px_42px_rgba(20,184,166,0.14)]";

const RULES_PANEL_OVERLAY =
  "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,140,147,0.08),transparent_35%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100";

export default async function ReglasYCondicionesPage() {
  const scoreRule = await getHelpScoreRuleSummary();
  const sections = buildRulesSections(scoreRule);

  return (
    <div className="space-y-6">
      <HelpPageHeader
        badge={RULES_PAGE_INTRO.badge}
        title={RULES_PAGE_INTRO.title}
        description={RULES_PAGE_INTRO.description}
        icon={ShieldCheck}
      />

      <section className="grid items-start gap-5 xl:grid-cols-2">
        {sections.map((section) => (
          <HelpSectionCard key={section.title} section={section} />
        ))}
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-slate-950">
            Sistema de puntuación
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            Estos valores corresponden a {scoreRule.faseNombre ?? "la fase actual de referencia"} y pueden variar en otras fases del torneo.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <RulesScoreCard
            title="Resultado exacto"
            points={scoreRule.puntosExacto}
            description="Acertás el marcador exacto del partido."
            icon={Trophy}
          />
          <RulesScoreCard
            title="Tendencia correcta"
            points={scoreRule.puntosParcial}
            description="Acertás ganador o empate, aunque no el marcador exacto."
            icon={Medal}
          />
          <RulesScoreCard
            title="Pronóstico incorrecto"
            points={scoreRule.puntosSinAcierto}
            description="El resultado final no coincide con el pronóstico cargado."
            icon={CircleHelp}
          />
        </div>
      </section>

      <section className="grid items-start gap-5 xl:grid-cols-2">
        <Card className={RULES_PANEL_CARD}>
          <div className="h-1 w-full bg-gradient-to-r from-[#12b8c9] via-[#15aabf] to-[#8de4ee]" />
          <div className={RULES_PANEL_OVERLAY} />
          <CardHeader className="relative px-6 py-5">
            <CardTitle className="flex items-center gap-2 text-xl font-black text-slate-950">
              <Trophy className="h-5 w-5 text-[#008C93]" />
              Premios
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-3 px-6 pb-5 pt-0 text-sm leading-6 text-slate-700">
            <div className="rounded-2xl px-1 py-1 transition-colors duration-300 group-hover:bg-[#f8feff]">
              <p className="font-bold text-slate-900">Primer puesto</p>
              <p>{RULES_EDITABLE_CONTENT.premios.primerPuesto}</p>
            </div>
            <div className="rounded-2xl px-1 py-1 transition-colors duration-300 group-hover:bg-[#f8feff]">
              <p className="font-bold text-slate-900">Segundo puesto</p>
              <p>{RULES_EDITABLE_CONTENT.premios.segundoPuesto}</p>
            </div>
            <div className="rounded-2xl px-1 py-1 transition-colors duration-300 group-hover:bg-[#f8feff]">
              <p className="font-bold text-slate-900">Tercer puesto</p>
              <p>{RULES_EDITABLE_CONTENT.premios.tercerPuesto}</p>
            </div>
            <div className="rounded-2xl px-1 py-1 transition-colors duration-300 group-hover:bg-[#f8feff]">
              <p className="font-bold text-slate-900">Otros premios</p>
              <p>{RULES_EDITABLE_CONTENT.premios.otrosPremios}</p>
            </div>
          </CardContent>
        </Card>

        <Card className={RULES_PANEL_CARD}>
          <div className="h-1 w-full bg-gradient-to-r from-[#12b8c9] via-[#15aabf] to-[#8de4ee]" />
          <div className={RULES_PANEL_OVERLAY} />
          <CardHeader className="relative px-6 py-5">
            <CardTitle className="flex items-center gap-2 text-xl font-black text-slate-950">
              <CheckCircle2 className="h-5 w-5 text-[#008C93]" />
              Condiciones para acceder al premio
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-2 px-6 pb-5 pt-0 text-sm leading-6 text-slate-700">
            {RULES_EDITABLE_CONTENT.condicionesPremio.map((item) => (
              <div
                key={item}
                className="flex gap-2 rounded-2xl px-1 py-1 transition-colors duration-300 group-hover:bg-[#f8feff]"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={RULES_PANEL_CARD}>
          <div className="h-1 w-full bg-gradient-to-r from-[#12b8c9] via-[#15aabf] to-[#8de4ee]" />
          <div className={RULES_PANEL_OVERLAY} />
          <CardHeader className="relative px-6 py-5">
            <CardTitle className="flex items-center gap-2 text-xl font-black text-slate-950">
              <AlertTriangle className="h-5 w-5 text-[#008C93]" />
              Personas que no pueden acceder al premio
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-2 px-6 pb-5 pt-0 text-sm leading-6 text-slate-700">
            {RULES_EDITABLE_CONTENT.participantesExcluidos.map((item) => (
              <div
                key={item}
                className="flex gap-2 rounded-2xl px-1 py-1 transition-colors duration-300 group-hover:bg-[#f8feff]"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={RULES_PANEL_CARD}>
          <div className="h-1 w-full bg-gradient-to-r from-[#12b8c9] via-[#15aabf] to-[#8de4ee]" />
          <div className={RULES_PANEL_OVERLAY} />
          <CardHeader className="relative px-6 py-5">
            <CardTitle className="flex items-center gap-2 text-xl font-black text-slate-950">
              <Medal className="h-5 w-5 text-[#008C93]" />
              Empates, cambios y aceptación
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-4 px-6 pb-5 pt-0 text-sm leading-6 text-slate-700">
            <div className="rounded-2xl px-1 py-1 transition-colors duration-300 group-hover:bg-[#f8feff]">
              <p className="font-bold text-slate-900">Criterios de desempate</p>
              <ul className="mt-2 space-y-2">
                {RULES_EDITABLE_CONTENT.criteriosDesempate.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Medal className="mt-0.5 h-4 w-4 shrink-0 text-[#008C93]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl px-1 py-1 transition-colors duration-300 group-hover:bg-[#f8feff]">
              <p className="font-bold text-slate-900">Cambios en las reglas</p>
              <p>
                La organización podrá actualizar reglas y condiciones, e informar los
                cambios dentro del sistema cuando sea necesario.
              </p>
            </div>

            <div className="rounded-2xl px-1 py-1 transition-colors duration-300 group-hover:bg-[#f8feff]">
              <p className="font-bold text-slate-900">Actualización del ranking</p>
              <p>
                El ranking general se recalcula una vez por día. Si los puntos o posiciones
                todavía no coinciden con un resultado reciente, puede deberse al horario de
                ejecución o a la zona horaria del sistema.
              </p>
            </div>

            <div className="rounded-2xl px-1 py-1 transition-colors duration-300 group-hover:bg-[#f8feff]">
              <p className="font-bold text-slate-900">Aceptación de reglas</p>
              <p>
                La participación en el Prode implica conocer y respetar estas reglas
                informativas y cualquier actualización comunicada por la organización.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
