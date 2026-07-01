"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import type { RankingRowDTO } from "@/features/pronosticos/services/ranking.service";

type Props = {
  data: RankingRowDTO | null;
  scopeLabel?: string;
};

export function MyRankingSummary({ data, scopeLabel = "Ranking general" }: Props) {
  const resumen = data ?? {
    posicion: null,
    puntosTotales: 0,
    aciertosExactos: 0,
    aciertosTendencia: 0,
    partidosPronosticados: 0,
    partidosCalificados: 0,
    nombre: "Usuario",
    isPublicParticipant: true,
  };
  const hasPublicPosition = resumen.isPublicParticipant !== false;

  const isGeneralScope = scopeLabel === "Ranking general";
  const normalizedScopeLabel = scopeLabel.toLowerCase();
  const isGroupScope = normalizedScopeLabel.includes("grupo");
  const isRoundOf32Scope =
    normalizedScopeLabel.includes("dieciseisavos") ||
    normalizedScopeLabel.includes("16vos");
  const pointsDetail = isGeneralScope
    ? "acumulados"
    : isGroupScope
      ? "solo fase de grupos"
      : isRoundOf32Scope
        ? "solo dieciseisavos"
        : "acumulado desde octavos";

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        title={hasPublicPosition ? "Mi posicion" : "Posicion publica"}
        value={
          hasPublicPosition && resumen.posicion ? `#${resumen.posicion}` : "-"
        }
        detail={
          hasPublicPosition
            ? scopeLabel
            : "Vista privada. No participas del ranking publico."
        }
        tone="gold"
      />
      <SummaryCard
        title="Puntos totales"
        value={`${resumen.puntosTotales}`}
        detail={pointsDetail}
        tone="sky"
      />
      <SummaryCard
        title="Exactos"
        value={`${resumen.aciertosExactos}`}
        detail="aciertos perfectos"
        tone="blue"
      />
      <SummaryCard
        title="Tendencias"
        value={`${resumen.aciertosTendencia}`}
        detail={`${resumen.partidosCalificados}/${resumen.partidosPronosticados} calificados`}
        tone="cyan"
      />
    </div>
  );
}

function SummaryCard({
  title,
  value,
  detail,
  tone,
}: {
  title: string;
  value: string;
  detail: string;
  tone: "sky" | "gold" | "blue" | "cyan";
}) {
  const badgeStyles = {
    sky: "border-sky-100/18 bg-sky-200/10 text-sky-100",
    gold: "border-yellow-300/20 bg-yellow-300/10 text-yellow-200",
    blue: "border-blue-200/18 bg-blue-300/10 text-blue-100",
    cyan: "border-cyan-200/18 bg-cyan-300/10 text-cyan-100",
  };

  return (
    <Card className="group relative overflow-hidden rounded-[24px] border-white/10 bg-[#1E2C46] py-0 text-white shadow-[0_18px_48px_rgba(2,6,23,0.18)]">
      <div className={`${DASHBOARD_TOP_LINE} rounded-t-[24px]`}>
        <div className="h-full w-full bg-gradient-to-r from-[#5993B6] via-[#5993B6] to-[#FAB438] transition-all duration-300 group-hover:brightness-125" />
        <div className={DASHBOARD_TOP_LINE_SWEEP} />
        <div className={DASHBOARD_TOP_LINE_GLOW} />
        <div className={DASHBOARD_TOP_LINE_HAIR} />
      </div>

      <CardContent className="relative z-10 space-y-2.5 p-4 pt-5">
        <Badge
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] hover:bg-transparent ${badgeStyles[tone]}`}
        >
          {title}
        </Badge>
        <p className="text-[2.05rem] font-black leading-none tracking-tight text-white md:text-[2.2rem]">
          {value}
        </p>
        <p className="text-xs font-semibold leading-5 text-white/58">{detail}</p>
      </CardContent>
    </Card>
  );
}
