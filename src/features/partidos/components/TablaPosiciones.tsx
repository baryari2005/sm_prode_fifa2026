import { Trophy } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlagImage } from "@/components/ui/flag-image";
import { GroupStandingsInsightPanel } from "@/features/partidos/components/GroupStandingsInsightPanel";
import { PosicionEquipo } from "@/features/partidos/services/tabla-posiciones.service";
import { Seleccion } from "@/features/partidos/types/types";
import {
  DASHBOARD_SUBCARD,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import { PartidoConRelaciones } from "@/features/partidos/utils/partidos-ui.helpers";

interface TablaPosicionesProps {
  grupos: string[];
  grupoSeleccionado: string | null;
  onGrupoChange: (grupo: string | null) => void;
  tabla: PosicionEquipo[];
  partidos: PartidoConRelaciones[];
  selecciones: Seleccion[];
  searchQuery: string;
}

export function TablaPosiciones({
  grupos,
  grupoSeleccionado,
  onGrupoChange,
  tabla,
  partidos,
  selecciones,
  searchQuery,
}: TablaPosicionesProps) {
  const query = searchQuery.trim().toLowerCase();
  const equiposFiltrados = query
    ? tabla.filter((equipo) => {
        const nombre = equipo.nombre.toLowerCase();
        const codigo = equipo.codigo.toLowerCase();
        return nombre.includes(query) || codigo.includes(query);
      })
    : tabla;

  const grupoActivo = grupoSeleccionado ?? grupos[0] ?? "";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2 text-white">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEEBFF]">
            Tabla por grupo
          </p>
          <h2 className="brand-heading text-[2.65rem] uppercase !tracking-[0.02em] text-white md:text-[3.25rem]">
            Explorador de posiciones
          </h2>
          <p className="max-w-[760px] text-base leading-relaxed text-white/76">
            uscá una selección puntual o recorré cada grupo para ver puntos, diferencia, goles y el estado de clasificación.
          </p>
        </div>
        
      </div>

      <Tabs value={grupoActivo} onValueChange={onGrupoChange} className="w-full space-y-5">
        <TabsList className="h-auto w-fit flex-wrap rounded-full border border-white/10 bg-white/[0.05] p-1">
          {grupos.map((grupo) => (
            <TabsTrigger
              key={grupo}
              value={grupo}
              className="rounded-full px-5 py-2 text-sm font-semibold text-white/72 data-[state=active]:bg-[#5993B6] data-[state=active]:text-white"
            >
              Grupo {grupo}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {equiposFiltrados.length === 0 ? (
        <div
          className={`${DASHBOARD_SUBCARD} rounded-[28px] border border-white/10 bg-white/[0.04] px-5 py-12 text-center text-white/68`}
        >
          No hay selecciones para mostrar con ese filtro.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <TablaGrupoCard grupo={grupoActivo} equipos={equiposFiltrados} />
          <GroupStandingsInsightPanel
            grupoSeleccionado={grupoActivo}
            partidos={partidos}
            selecciones={selecciones}
          />
        </div>
      )}
    </div>
  );
}

function TablaGrupoCard({
  grupo,
  equipos,
}: {
  grupo: string;
  equipos: PosicionEquipo[];
}) {
  return (
    <section
      className={`${DASHBOARD_SUBCARD} group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] text-white`}
    >
      <div className={DASHBOARD_TOP_LINE}>
        <div className={DASHBOARD_TOP_LINE_INNER} />
        <div className={DASHBOARD_TOP_LINE_SWEEP} />
        <div className={DASHBOARD_TOP_LINE_GLOW} />
        <div className={DASHBOARD_TOP_LINE_HAIR} />
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#AEEBFF]/10 text-[#AEEBFF]">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold tracking-[-0.02em] text-white">
              Grupo {grupo}
            </h3>
            <p className="text-sm text-white/62">
              {equipos.length} {equipos.length === 1 ? "seleccion" : "selecciones"} en carrera
            </p>
          </div>
        </div>
          <div className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
          Corte top 2
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.04]">
              {["Pos", "Equipo", "PJ", "G", "E", "P", "GF", "GC", "DIF", "PTS"].map(
                (label, index) => (
                  <th
                    key={label}
                    className={`px-4 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-[#AEEBFF]/88 ${
                      index >= 2 ? "text-center" : ""
                    }`}
                  >
                    {label}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {equipos.map((equipo, index) => (
              <tr
                key={equipo.seleccionId}
                className="border-b border-white/8 transition-colors hover:bg-white/[0.05]"
              >
                <td className="px-4 py-3 font-extrabold text-white">
                  <span className={index < 2 ? "text-[#FFE4A3]" : "text-white"}>
                    {equipo.posicion || index + 1}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <FlagImage
                      bandera={equipo.bandera}
                      codigo={equipo.codigo}
                      nombre={equipo.nombre}
                      widthClassName="w-12"
                      heightClassName="h-8"
                      fallbackMode="emoji"
                      fallbackTextClassName="text-lg"
                    />
                    <div>
                      <div className="font-semibold text-white">{equipo.nombre}</div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/48">
                        {equipo.codigo}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-center font-medium text-white/78">
                  {equipo.partidosJugados}
                </td>
                <td className="px-3 py-3 text-center font-medium text-white/78">
                  {equipo.ganancias}
                </td>
                <td className="px-3 py-3 text-center font-medium text-white/78">
                  {equipo.empates}
                </td>
                <td className="px-3 py-3 text-center font-medium text-white/78">
                  {equipo.derrotas}
                </td>
                <td className="px-3 py-3 text-center font-medium text-white/78">
                  {equipo.golesAFavor}
                </td>
                <td className="px-3 py-3 text-center font-medium text-white/78">
                  {equipo.golesEnContra}
                </td>
                <td className="px-3 py-3 text-center font-bold">
                  <span
                    className={
                      equipo.diferencial >= 0 ? "text-emerald-300" : "text-rose-300"
                    }
                  >
                    {equipo.diferencial > 0 ? "+" : ""}
                    {equipo.diferencial}
                  </span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className="brand-heading text-[1.65rem] text-white">
                    {equipo.puntos}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
