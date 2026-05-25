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
        <div className="flex min-w-[112px] flex-col items-center justify-center rounded-2xl border border-[#008C93]/15 bg-gradient-to-b from-[#E8FBFC] via-white to-[#F7FAFC] px-4 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#008C93]/70">
            {etiquetaSuperior}
          </span>
          <p className="text-3xl font-black leading-none tracking-[-0.04em] text-slate-950 md:text-[2.15rem]">
            {marcador}
          </p>
          {etiquetaInferior ? (
            <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
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
