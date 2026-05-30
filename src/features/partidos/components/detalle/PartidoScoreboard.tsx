import { EquipoResumen } from "./EquipoResumen";
import { getEstadoPartidoLabel } from "@/features/partidos/utils/partidos-ui.helpers";

type PartidoScoreboardProps = {
  local: string;
  visitante: string;
  marcador: string;
  escudoLocalUrl?: string | null;
  escudoVisitanteUrl?: string | null;
  estado?: string;
};

export function PartidoScoreboard({
  local,
  visitante,
  marcador,
  escudoLocalUrl,
  escudoVisitanteUrl,
  estado,
}: PartidoScoreboardProps) {
  const estadoNormalizado = estado?.trim().toUpperCase();
  const estadoLabel = getEstadoPartidoLabel(estado);
  const etiquetaSuperior =
    estadoNormalizado === "FINALIZADO" ? "Resultado" : "Marcador";
  const etiquetaInferior =
    estadoNormalizado === "FINALIZADO"
      ? "Finalizado"
      : estadoNormalizado === "EN_JUEGO"
      ? "En juego"
      : estadoNormalizado === "ENTRETIEMPO"
      ? "Entretiempo"
      : estadoNormalizado === "PENDIENTE"
      ? "Pendiente"
      : estadoLabel;

  return (
    <div className="grid w-full items-center gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-4">
      <EquipoResumen
        nombre={local}
        escudoUrl={escudoLocalUrl}
        align="left"
      />

      <div className="flex items-center justify-center">
        <div className="flex min-w-[168px] flex-col items-center justify-center rounded-[28px] border border-white/10 bg-[#081523] px-5 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/48">
            {etiquetaSuperior}
          </span>
          <p className="font-brand text-[2.55rem] leading-none tracking-[0.05em] text-white md:text-[2.85rem]">
            {marcador}
          </p>
          {etiquetaInferior ? (
            <span className="mt-2 inline-flex rounded-full border border-[#5993B6]/18 bg-[#5993B6]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
              {etiquetaInferior}
            </span>
          ) : null}
        </div>
      </div>

      <EquipoResumen
        nombre={visitante}
        escudoUrl={escudoVisitanteUrl}
        align="right"
      />
    </div>
  );
}
