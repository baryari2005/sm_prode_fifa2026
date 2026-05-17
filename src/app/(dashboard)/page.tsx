// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import {
//   Clock3,
//   CalendarDays,
//   Medal,
//   Target,
//   Trophy,
//   Users,
//   Zap,
// } from "lucide-react";
// import { format } from "date-fns";

// import { useAuth } from "@/stores/auth";
// import { getDisplayName } from "../../features/dashboard/utils/dashboardFormat";
// import { useDashboardRoleFlags } from "@/features/dashboard/hooks/useDashboardRoleFlags";
// import { usePendingUsers } from "@/features/dashboard/hooks/usePendingUsers";
// import { useCountdownNow } from "@/features/pronosticos/hooks/useCountdownNow";
// import { useProdeDashboard } from "@/features/pronosticos/hooks/useProdeDashboard";
// import {
//   getPredictionCountdownLabel,
//   isPredictionClosed,
//   PREDICTION_CLOSE_MINUTES_BEFORE,
// } from "@/features/partidos/utils/partidos-ui.helpers";
// import { resolveBanderaSrc } from "@/lib/flags";
// import Loading from "./loading";

// export default function DashboardPage() {
//   const router = useRouter();
//   const now = useCountdownNow();
//   const user = useAuth((state) => state.user);
//   const displayName = getDisplayName(user);
//   const { isAdmin } = useDashboardRoleFlags(user);
//   const { count: pendingUserCount, loading: pendingUsersLoading } =
//     usePendingUsers(isAdmin);
//   const {
//     loading,
//     miRanking,
//     pronosticosCargados,
//     participantes,
//     totalPartidos,
//     proximoPartido,
//     proximosPartidos,
//     rankingDestacado,
//     loadData,
//   } = useProdeDashboard(user?.id);

//   const proximoPartidoCerrado = proximoPartido
//     ? isPredictionClosed(
//       proximoPartido.fecha,
//       PREDICTION_CLOSE_MINUTES_BEFORE,
//       now
//     )
//     : false;

//   const proximoPartidoCountdown = proximoPartido
//     ? getPredictionCountdownLabel(
//       proximoPartido.fecha,
//       PREDICTION_CLOSE_MINUTES_BEFORE,
//       now
//     )
//     : null;

//   const proximoPartidoFinalizado =
//     proximoPartido?.resultado?.estado === "FINALIZADO";

//   const proximoPartidoBloqueado =
//     proximoPartidoCerrado || proximoPartidoFinalizado;

//   useEffect(() => {
//     loadData();
//   }, [loadData]);

//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <div className="grid gap-6">
//       <section className="relative overflow-hidden rounded-[2rem] bg-[#06111F] p-7 text-white shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(57,169,53,0.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(247,183,49,0.15),transparent_30%)]" />

//         <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
//           <div>
//             <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#F7B731]/30 bg-[#F7B731]/10 px-4 py-2 text-sm text-[#F7B731]">
//               <Trophy className="h-4 w-4" />
//               Prode Mundial 2026
//             </div>

//             <h1 className="tracking-tight md:text-4xl">
//               Hola, {displayName}. ¿Listo para cargar tus pronósticos?
//             </h1>

//             <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-white/65 md:text-base">
//               SeguÍ tus puntos, revisá los próximos partidos y competí en el
//               ranking general del grupo.
//             </p>

//             <div className="mt-6 flex flex-wrap gap-3">
//               <button
//                 onClick={() => router.push("/pronosticos")}
//                 className="rounded-2xl bg-[#39A935] px-5 py-3 text-sm font-black text-white shadow-lg shadow-green-950/20 transition hover:bg-[#247A28]"
//               >
//                 Cargar pronósticos
//               </button>

//               <button
//                 onClick={() => router.push("/ranking")}
//                 className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/15"
//               >
//                 Ver ranking
//               </button>
//             </div>
//           </div>

//           <div className="rounded-[1.7rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs uppercase tracking-[0.18em] text-white/45">
//                   Próximo partido
//                 </p>
//                 <h2 className="mt-1 text-xl font-black">
//                   {proximoPartido
//                     ? `${proximoPartido.seleccionLocal?.nombre ?? "Local"} vs ${proximoPartido.seleccionVisitante?.nombre ?? "Visitante"
//                     }`
//                     : "Sin partidos próximos"}
//                 </h2>
//               </div>

//               <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F7B731] text-[#06111F]">
//                 <CalendarDays className="h-6 w-6" />
//               </div>
//             </div>

//             {proximoPartido ? (
//               <>
//                 <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
//                   <div className="rounded-2xl bg-white/10 p-4 text-center">
//                     <div className="flex items-center justify-center gap-3">
//                       <TeamFlag
//                         bandera={proximoPartido.seleccionLocal?.bandera}
//                         codigo={proximoPartido.seleccionLocal?.codigo}
//                         nombre={proximoPartido.seleccionLocal?.nombre ?? "Local"}
//                       />
//                       <p className="text-sm font-black">
//                         {proximoPartido.seleccionLocal?.nombre ?? "Local"}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex flex-col items-center gap-2 text-sm font-black text-white/45">
//                     <span>VS</span>
//                     <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] tracking-[0.14em] text-white/65">
//                       <Clock3 className="h-3.5 w-3.5" />
//                       {format(new Date(proximoPartido.fecha), "HH:mm")}
//                     </span>
//                   </div>

//                   <div className="rounded-2xl bg-white/10 p-4 text-center">
//                     <div className="flex items-center justify-center gap-3">
//                       <TeamFlag
//                         bandera={proximoPartido.seleccionVisitante?.bandera}
//                         codigo={proximoPartido.seleccionVisitante?.codigo}
//                         nombre={proximoPartido.seleccionVisitante?.nombre ?? "Visitante"}
//                       />
//                       <p className="text-sm font-black">
//                         {proximoPartido.seleccionVisitante?.nombre ?? "Visitante"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-4 flex flex-wrap items-center gap-2">
//                   <span className="rounded-full bg-black/15 px-4 py-2 text-sm text-white/75">
//                     {format(new Date(proximoPartido.fecha), "dd/MM/yyyy")} ·{" "}
//                     {proximoPartido.fase?.nombre ?? "Sin fase"}
//                   </span>

//                   {proximoPartido.resultado?.estado !== "FINALIZADO" &&
//                     proximoPartidoCountdown && (
//                       <span
//                         className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-bold ${proximoPartidoCerrado
//                           ? "bg-amber-500/15 text-amber-200"
//                           : "bg-sky-500/15 text-sky-100"
//                           }`}
//                       >
//                         <Clock3 className="mr-2 h-4 w-4" />
//                         {proximoPartidoCountdown}
//                       </span>
//                     )}

//                   <span
//                     className={`rounded-full px-4 py-2 text-sm font-bold ${proximoPartido.resultado?.estado === "FINALIZADO"
//                       ? "bg-emerald-500/15 text-emerald-200"
//                       : proximoPartido.miPrediccion
//                         ? "bg-[#39A935]/20 text-[#9BE38E]"
//                         : proximoPartidoCerrado
//                           ? "bg-amber-500/15 text-amber-200"
//                           : "bg-[#F7B731]/15 text-[#FFD98A]"
//                       }`}
//                   >
//                     {proximoPartido.resultado?.estado === "FINALIZADO"
//                       ? "Finalizado"
//                       : proximoPartido.miPrediccion
//                         ? "Pronóstico cargado"
//                         : proximoPartidoCerrado
//                           ? "Pronóstico cerrado"
//                           : "Pendiente de cargar"}
//                   </span>
//                 </div>

//                 <button
//                   disabled={proximoPartidoBloqueado}
//                   onClick={() => {
//                     if (proximoPartidoBloqueado) return;

//                     router.push(
//                       proximoPartido
//                         ? `/pronosticos?partido=${proximoPartido.id}`
//                         : "/pronosticos"
//                     );
//                   }}
//                   className={`mt-4 w-full rounded-2xl bg-white/10 px-4 py-3 text-sm font-black text-white transition ${proximoPartidoBloqueado
//                     ? "cursor-not-allowed opacity-55"
//                     : "hover:bg-white/15"
//                     }`}
//                 >
//                   {proximoPartidoFinalizado
//                     ? "Partido finalizado"
//                     : proximoPartidoCerrado
//                       ? "Pronóstico cerrado"
//                       : proximoPartido.miPrediccion
//                         ? "Editar mi pronóstico"
//                         : "Ir a pronosticar este partido"}
//                 </button>
//               </>
//             ) : (
//               <p className="mt-4 rounded-2xl bg-black/15 px-4 py-3 text-center text-sm text-white/70">
//                 No hay partidos futuros para pronosticar en este momento.
//               </p>
//             )}
//           </div>
//         </div>
//       </section>

//       <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
//         <StatCard
//           icon={Target}
//           title="Pronósticos cargados"
//           value={`${pronosticosCargados}`}
//           detail={`de ${totalPartidos} partidos`}
//           tone="green"
//         />

//         <StatCard
//           icon={Medal}
//           title="Posición actual"
//           value={miRanking?.posicion ? `#${miRanking.posicion}` : "-"}
//           detail="ranking general"
//           tone="gold"
//         />

//         <StatCard
//           icon={Zap}
//           title="Puntos obtenidos"
//           value={`${miRanking?.puntosTotales ?? 0}`}
//           detail={`${miRanking?.aciertosExactos ?? 0} exactos`}
//           tone="blue"
//         />

//         <StatCard
//           icon={Users}
//           title="Participantes"
//           value={`${participantes}`}
//           detail="grupo activo"
//           tone="purple"
//         />

//         {isAdmin ? (
//           <StatCard
//             icon={Users}
//             title="Usuarios pendientes"
//             value={pendingUsersLoading ? "..." : `${pendingUserCount}`}
//             detail="pendientes de aprobación"
//             tone="blue"
//           />
//         ) : null}
//       </section>

//       <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
//         <div className="rounded-[1.5rem] border border-[#E5EAF0] bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
//           <div className="mb-5 flex items-center justify-between">
//             <div>
//               <h2 className="text-xl font-black tracking-tight text-[#172033]">
//                 Ranking general
//               </h2>
//               <p className="text-sm font-medium text-[#6B7280]">
//                 Mejores puntajes del grupo
//               </p>
//             </div>

//             <span className="rounded-full bg-[#EEF6EF] px-3 py-1 text-xs font-black text-[#247A28]">
//               En vivo
//             </span>
//           </div>

//           <div className="space-y-3">
//             {rankingDestacado.length === 0 ? (
//               <div className="rounded-2xl border border-[#E5EAF0] bg-[#F8FAFC] p-4 text-sm font-medium text-[#6B7280]">
//                 Todavía no hay ranking calculado.
//               </div>
//             ) : (
//               rankingDestacado.map((row) => (
//                 <RankingRow
//                   key={row.usuarioId}
//                   position={`${row.posicion ?? "-"}`}
//                   name={row.nombre}
//                   points={`${row.puntosTotales}`}
//                   medal={getMedal(row.posicion ?? 0, row.usuarioId === user?.id)}
//                   active={row.usuarioId === user?.id}
//                 />
//               ))
//             )}
//           </div>
//         </div>

//         <div className="rounded-[1.5rem] border border-[#E5EAF0] bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
//           <div className="mb-5 flex items-center justify-between">
//             <div>
//               <h2 className="text-xl font-black tracking-tight text-[#172033]">
//                 Partidos próximos
//               </h2>
//               <p className="text-sm font-medium text-[#6B7280]">
//                 Cargá tus resultados antes de que empiecen
//               </p>
//             </div>
//           </div>

//           <div className="grid gap-3">
//             {proximosPartidos.length === 0 ? (
//               <div className="rounded-2xl border border-[#E5EAF0] bg-[#F8FAFC] p-4 text-sm font-medium text-[#6B7280]">
//                 No hay partidos próximos disponibles.
//               </div>
//             ) : (
//               proximosPartidos.map((partido) => {
//                 const partidoCerrado = isPredictionClosed(
//                   partido.fecha,
//                   PREDICTION_CLOSE_MINUTES_BEFORE,
//                   now
//                 );

//                 return (
//                   <MatchRow
//                     key={partido.id}
//                     banderaLocal={partido.seleccionLocal?.bandera}
//                     codigoLocal={partido.seleccionLocal?.codigo}
//                     banderaVisitante={partido.seleccionVisitante?.bandera}
//                     codigoVisitante={partido.seleccionVisitante?.codigo}
//                     local={partido.seleccionLocal?.nombre ?? "Local"}
//                     away={partido.seleccionVisitante?.nombre ?? "Visitante"}
//                     fecha={partido.fecha}
//                     countdown={getPredictionCountdownLabel(
//                       partido.fecha,
//                       PREDICTION_CLOSE_MINUTES_BEFORE,
//                       now
//                     )}
//                     status={
//                       partido.miPrediccion
//                         ? "Cargado"
//                         : partidoCerrado
//                           ? "Cerrado"
//                           : "Pendiente"
//                     }
//                   />
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// type StatCardProps = {
//   icon: React.ElementType;
//   title: string;
//   value: string;
//   detail: string;
//   tone: "green" | "gold" | "blue" | "purple";
// };

// function StatCard({ icon: Icon, title, value, detail, tone }: StatCardProps) {
//   const styles = {
//     green: "bg-[#EEF6EF] text-[#39A935]",
//     gold: "bg-[#FFF7E1] text-[#B77900]",
//     blue: "bg-[#EFF6FF] text-[#2563EB]",
//     purple: "bg-[#F3E8FF] text-[#7C3AED]",
//   };

//   return (
//     <div className="rounded-[1.5rem] border border-[#E5EAF0] bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
//       <div
//         className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl ${styles[tone]}`}
//       >
//         <Icon className="h-6 w-6" />
//       </div>

//       <p className="text-sm text-[#6B7280]">{title}</p>
//       <p className="mt-2 text-3xl font-black tracking-tight text-[#172033]">
//         {value}
//       </p>
//       <p className="mt-1 text-sm font-semibold text-[#9CA3AF]">{detail}</p>
//     </div>
//   );
// }

// type RankingRowProps = {
//   position: string;
//   name: string;
//   points: string;
//   medal: string;
//   active?: boolean;
// };

// function RankingRow({
//   position,
//   name,
//   points,
//   medal,
//   active,
// }: RankingRowProps) {
//   return (
//     <div
//       className={`flex items-center justify-between rounded-2xl border p-4 ${active
//         ? "border-[#39A935]/30 bg-[#EEF6EF]"
//         : "border-[#E5EAF0] bg-[#F8FAFC]"
//         }`}
//     >
//       <div className="flex items-center gap-3">
//         <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-lg shadow-sm">
//           {medal}
//         </div>

//         <div>
//           <p className="font-black text-[#172033]">
//             #{position} {name}
//           </p>
//           <p className="text-xs text-[#6B7280]">Participante</p>
//         </div>
//       </div>

//       <p className="text-lg font-black text-[#39A935]">{points} pts</p>
//     </div>
//   );
// }

// type MatchRowProps = {
//   banderaLocal?: string | null;
//   codigoLocal?: string | null;
//   banderaVisitante?: string | null;
//   codigoVisitante?: string | null;
//   local: string;
//   away: string;
//   fecha: string | Date;
//   countdown: string;
//   status: string;
// };

// function MatchRow({
//   banderaLocal,
//   codigoLocal,
//   banderaVisitante,
//   codigoVisitante,
//   local,
//   away,
//   fecha,
//   countdown,
//   status,
// }: MatchRowProps) {
//   const loaded = status === "Cargado";
//   const closed = status === "Cerrado";

//   return (
//     <div className="flex items-center justify-between rounded-2xl border border-[#E5EAF0] bg-[#F8FAFC] p-4">
//       <div>
//         <div className="mb-2 flex items-center gap-2">
//           <TeamFlag bandera={banderaLocal} codigo={codigoLocal} nombre={local} small />
//           <TeamFlag bandera={banderaVisitante} codigo={codigoVisitante} nombre={away} small />
//         </div>
//         <p className="mt-1 font-black text-[#172033]">
//           {local} vs {away}
//         </p>
//         <p className="text-xs text-[#6B7280]">
//           {format(new Date(fecha), "dd/MM HH:mm")} · Fixture del prode
//         </p>
//       </div>

//       <div className="flex flex-col items-end gap-2">
//         <p
//           className={`inline-flex items-center gap-1 text-xs font-bold ${closed ? "text-amber-700" : "text-sky-700"
//             }`}
//         >
//           <Clock3 className="h-3.5 w-3.5" />
//           {countdown}
//         </p>

//         <span
//           className={`rounded-full px-3 py-1 text-xs font-black ${loaded
//             ? "bg-[#EEF6EF] text-[#247A28]"
//             : closed
//               ? "bg-amber-100 text-amber-700"
//               : "bg-[#FFF7E1] text-[#9A6500]"
//             }`}
//         >
//           {status}
//         </span>
//       </div>
//     </div>
//   );
// }

// function getMedal(position: number, isCurrentUser: boolean) {
//   if (position === 1) return "🥇";
//   if (position === 2) return "🥈";
//   if (position === 3) return "🥉";
//   if (isCurrentUser) return "🔥";
//   return "•";
// }

// function TeamFlag({
//   bandera,
//   codigo,
//   nombre,
//   small = false,
// }: {
//   bandera?: string | null;
//   codigo?: string | null;
//   nombre: string;
//   small?: boolean;
// }) {
//   const value = bandera?.trim();
//   const src = resolveBanderaSrc(value, codigo);

//   if (!value) {
//     return (
//       <span
//         className={`flex items-center justify-center overflow-hidden rounded-lg bg-white/10 ${small ? "h-7 w-9 text-sm" : "h-9 w-11 text-lg"
//           }`}
//       >
//         🏳️
//       </span>
//     );
//   }

//   if (src) {
//     return (
//       <span
//         className={`flex items-center justify-center overflow-hidden rounded-lg bg-white/10 ${small ? "h-7 w-9" : "h-9 w-11"
//           }`}
//       >
//         <Image
//           src={src}
//           alt={`Bandera de ${nombre}`}
//           width={small ? 28 : 36}
//           height={small ? 20 : 26}
//           unoptimized
//           className="object-contain"
//         />
//       </span>
//     );
//   }

//   return (
//     <span
//       className={`flex items-center justify-center overflow-hidden rounded-lg bg-white/10 ${small ? "h-7 w-9 text-sm" : "h-9 w-11 text-lg"
//         }`}
//     >
//       {value}
//     </span>
//   );
// }


"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { DashboardHero } from "@/features/dashboard/components/home/DashboardHero";
import { DashboardMainGrid } from "@/features/dashboard/components/home/DashboardMainGrid";
import { DashboardStatsGrid } from "@/features/dashboard/components/home/DashboardStatsGrid";

import { useAuth } from "@/stores/auth";
import { getDisplayName } from "../../features/dashboard/utils/dashboardFormat";
import { useDashboardRoleFlags } from "@/features/dashboard/hooks/useDashboardRoleFlags";
import { usePendingUsers } from "@/features/dashboard/hooks/usePendingUsers";
import { useCountdownNow } from "@/features/pronosticos/hooks/useCountdownNow";
import { useProdeDashboard } from "@/features/pronosticos/hooks/useProdeDashboard";

import {
  getPredictionCountdownLabel,
  isPredictionClosed,
  PREDICTION_CLOSE_MINUTES_BEFORE,
} from "@/features/partidos/utils/partidos-ui.helpers";

import Loading from "./loading";

export default function DashboardPage() {
  const router = useRouter();
  const now = useCountdownNow();

  const user = useAuth((state) => state.user);
  const displayName = getDisplayName(user);

  const { isAdmin } = useDashboardRoleFlags(user);

  const { count: pendingUserCount, loading: pendingUsersLoading } =
    usePendingUsers(isAdmin);

  const {
    loading,
    miRanking,
    pronosticosCargados,
    participantes,
    totalPartidos,
    proximoPartido,
    proximosPartidos,
    rankingDestacado,
    loadData,
  } = useProdeDashboard(user?.id);

  const proximoPartidoCerrado = proximoPartido
    ? isPredictionClosed(
        proximoPartido.fecha,
        PREDICTION_CLOSE_MINUTES_BEFORE,
        now
      )
    : false;

  const proximoPartidoCountdown = proximoPartido
    ? getPredictionCountdownLabel(
        proximoPartido.fecha,
        PREDICTION_CLOSE_MINUTES_BEFORE,
        now
      )
    : null;

  const proximoPartidoFinalizado =
    proximoPartido?.resultado?.estado === "FINALIZADO";

  const proximoPartidoBloqueado =
    proximoPartidoCerrado || proximoPartidoFinalizado;

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="space-y-6 pb-8">
      <DashboardHero
        displayName={displayName}
        pronosticosCargados={pronosticosCargados}
        totalPartidos={totalPartidos}
        proximoPartido={proximoPartido}
        proximoPartidoCountdown={proximoPartidoCountdown}
        proximoPartidoCerrado={proximoPartidoCerrado}
        proximoPartidoFinalizado={proximoPartidoFinalizado}
        proximoPartidoBloqueado={proximoPartidoBloqueado}
        onGoPronosticos={() => router.push("/pronosticos")}
        onGoRanking={() => router.push("/ranking")}
        onGoProximoPartido={() => {
          if (!proximoPartido || proximoPartidoBloqueado) return;

          router.push(`/pronosticos?partido=${proximoPartido.id}`);
        }}
      />

      <DashboardStatsGrid
        pronosticosCargados={pronosticosCargados}
        totalPartidos={totalPartidos}
        posicion={miRanking?.posicion}
        puntosTotales={miRanking?.puntosTotales ?? 0}
        aciertosExactos={miRanking?.aciertosExactos ?? 0}
        participantes={participantes}
        isAdmin={isAdmin}
        pendingUserCount={pendingUserCount}
        pendingUsersLoading={pendingUsersLoading}
      />

      <DashboardMainGrid
        rankingDestacado={rankingDestacado}
        currentUserId={user?.id}
        proximosPartidos={proximosPartidos}
        now={now}
        isAdmin={isAdmin}
        onGoPronosticos={() => router.push("/pronosticos")}
        onGoRanking={() => router.push("/ranking")}
        onGoFixture={() =>
          router.push(isAdmin ? "/admin/partidos" : "/pronosticos")
        }
        onGoTablaPosiciones={() => router.push("/admin/tabla-posiciones")}
        onGoGoleadores={() => router.push("/admin/goleadores")}
        onGoSimularCruces={() => router.push("/admin/cruces")}
        onGoPartido={(partidoId) => {
          router.push(`/pronosticos?partido=${partidoId}`);
        }}
      />

      <footer className="flex flex-col items-center justify-between gap-2 rounded-2xl border border-white/70 bg-white/70 px-5 py-4 text-center text-xs font-semibold text-slate-500 shadow-sm backdrop-blur sm:flex-row">
        <span>Prode Mundial 2026 © 2026</span>

        <span className="text-slate-400">
          Competí, pronosticá y seguí tu ranking en tiempo real.
        </span>
      </footer>
    </main>
  );
}