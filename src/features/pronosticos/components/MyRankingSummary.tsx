"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RankingRowDTO } from "@/features/pronosticos/services/ranking.service";

type Props = {
  data: RankingRowDTO | null;
};

export function MyRankingSummary({ data }: Props) {
  const resumen = data ?? {
    posicion: null,
    puntosTotales: 0,
    aciertosExactos: 0,
    aciertosTendencia: 0,
    partidosPronosticados: 0,
    partidosCalificados: 0,
    nombre: "Usuario",
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        title="Mi posición"
        value={resumen.posicion ? `#${resumen.posicion}` : "-"}
        detail="ranking general"
        tone="gold"
      />
      <SummaryCard
        title="Puntos totales"
        value={`${resumen.puntosTotales}`}
        detail="acumulados"
        tone="green"
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
        tone="purple"
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
  tone: "green" | "gold" | "blue" | "purple";
}) {
  const badgeStyles = {
    green: "bg-[#EEF6EF] text-[#39A935]",
    gold: "bg-[#FFF7E1] text-[#B77900]",
    blue: "bg-[#EFF6FF] text-[#2563EB]",
    purple: "bg-[#F3E8FF] text-[#7C3AED]",
  };

  return (
    <Card className="border-[#E5EAF0] bg-white shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
      <CardContent className="space-y-3 p-5">
        <Badge className={`rounded-full px-3 py-1 text-xs font-black hover:bg-transparent ${badgeStyles[tone]}`}>
          {title}
        </Badge>
        <p className="text-3xl font-black tracking-tight text-[#172033]">{value}</p>
        <p className="text-sm font-semibold text-[#9CA3AF]">{detail}</p>
      </CardContent>
    </Card>
  );
}
