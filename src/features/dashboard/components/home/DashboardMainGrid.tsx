"use client";

import Image from "next/image";
import type { ElementType } from "react";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Goal,
  ListOrdered,
  Network,
  Trophy,  
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { resolveBanderaSrc } from "@/lib/flags";

import {
  getPredictionCountdownLabel,
  isPredictionClosed,
  type PartidoConRelaciones,
  PREDICTION_CLOSE_MINUTES_BEFORE,
} from "@/features/partidos/utils/partidos-ui.helpers";

type RankingDestacadoItem = {
  usuarioId: string;
  posicion?: number | null;
  nombre: string;
  puntosTotales: number;
};

type DashboardMainGridProps = {
  rankingDestacado: RankingDestacadoItem[];
  currentUserId?: string | null;
  proximosPartidos: PartidoConRelaciones[];
  now: number;
  isAdmin: boolean;
  onGoPronosticos: () => void;
  onGoRanking: () => void;
  onGoFixture: () => void;
  onGoTablaPosiciones: () => void;
  onGoGoleadores: () => void;
  onGoSimularCruces: () => void;
  onGoPartido: (partidoId: string) => void;
};

export function DashboardMainGrid({
  rankingDestacado,
  currentUserId,
  proximosPartidos,
  now,
  isAdmin,
  onGoPronosticos,
  onGoRanking,
  onGoFixture,
  onGoTablaPosiciones,
  onGoGoleadores,
  onGoSimularCruces,
  onGoPartido,
}: DashboardMainGridProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.1fr_1.15fr_0.9fr]">
      <RankingPreviewCard
        rankingDestacado={rankingDestacado}
        currentUserId={currentUserId}
        onGoRanking={onGoRanking}
      />

      <UpcomingMatchesCard
        partidos={proximosPartidos}
        now={now}
        isAdmin={isAdmin}
        onGoPartido={onGoPartido}
        onGoFixture={onGoFixture}
      />

      <QuickActionsCard
        isAdmin={isAdmin}
        onGoPronosticos={onGoPronosticos}
        onGoFixture={onGoFixture}
        onGoRanking={onGoRanking}
        onGoTablaPosiciones={onGoTablaPosiciones}
        onGoGoleadores={onGoGoleadores}
        onGoSimularCruces={onGoSimularCruces}
      />
    </section>
  );
}

type RankingPreviewCardProps = {
  rankingDestacado: RankingDestacadoItem[];
  currentUserId?: string | null;
  onGoRanking: () => void;
};

function RankingPreviewCard({
  rankingDestacado,
  currentUserId,
  onGoRanking,
}: RankingPreviewCardProps) {
  return (
    <article className="relative overflow-hidden rounded-[1.6rem] border border-white/80 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#F7B731]/18 blur-3xl" />

      <header className="relative flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#D99A00]" />
            <h2 className="text-lg font-black tracking-[-0.04em] text-slate-950">
              Ranking general
            </h2>
          </div>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            Mejores puntajes del grupo
          </p>
        </div>

        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
          En vivo
        </span>
      </header>

      <div className="relative mt-5 space-y-3">
        {rankingDestacado.length === 0 ? (
          <div className="rounded-[1.4rem] border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 via-white to-[#FFF8E6] px-5 py-8 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#FFF2C2] text-[#D99A00] shadow-inner">
              <Trophy className="h-10 w-10" />
            </div>

            <h3 className="mt-4 text-lg font-black tracking-[-0.04em] text-slate-950">
              Todavía no hay ranking calculado.
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm font-medium leading-6 text-slate-500">
              Los rankings se actualizarán cuando comiencen a cargarse los
              resultados de los partidos.
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={onGoRanking}
              className="mt-5 rounded-2xl border-slate-200 bg-white font-black"
            >
              Ver ranking
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          rankingDestacado.map((row) => {
            const active = row.usuarioId === currentUserId;

            return (
              <RankingRow
                key={row.usuarioId}
                position={`${row.posicion ?? "-"}`}
                name={row.nombre}
                points={`${row.puntosTotales}`}
                medal={getMedal(row.posicion ?? 0, active)}
                active={active}
              />
            );
          })
        )}
      </div>
    </article>
  );
}

function RankingRow({
  position,
  name,
  points,
  medal,
  active,
}: {
  position: string;
  name: string;
  points: string;
  medal: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl border p-4 ${
        active
          ? "border-[#39A935]/30 bg-[#EEF6EF]"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-lg shadow-sm">
          {medal}
        </div>

        <div className="min-w-0">
          <p className="truncate font-black text-slate-950">
            #{position} {name}
          </p>
          <p className="text-xs font-semibold text-slate-500">
            Participante
          </p>
        </div>
      </div>

      <p className="shrink-0 text-lg font-black text-[#39A935]">
        {points} pts
      </p>
    </div>
  );
}

type UpcomingMatchesCardProps = {
  partidos: PartidoConRelaciones[];
  now: number;
  isAdmin: boolean;
  onGoPartido: (partidoId: string) => void;
  onGoFixture: () => void;
};

function UpcomingMatchesCard({
  partidos,
  now,
  isAdmin,
  onGoPartido,
  onGoFixture,
}: UpcomingMatchesCardProps) {
  const visibles = partidos.slice(0, 4);

  return (
    <article className="relative overflow-hidden rounded-[1.6rem] border border-white/80 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
      <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[#008C93]/14 blur-3xl" />

      <header className="relative flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-[#008C93]" />
            <h2 className="text-lg font-black tracking-[-0.04em] text-slate-950">
              Partidos próximos
            </h2>
          </div>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            Cargá tus pronósticos antes de que empiecen
          </p>
        </div>
      </header>

      <div className="relative mt-5 space-y-3">
        {visibles.length === 0 ? (
          <div className="rounded-[1.4rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm font-semibold text-slate-500">
            No hay próximos partidos disponibles.
          </div>
        ) : (
          visibles.map((partido) => (
            <UpcomingMatchRow
              key={partido.id}
              partido={partido}
              now={now}
              onClick={() => onGoPartido(partido.id)}
            />
          ))
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onGoFixture}
        className="mt-4 h-11 w-full rounded-2xl border-slate-200 bg-white font-black text-slate-700 hover:bg-slate-50"
      >
        {isAdmin ? "Ver fixture completo" : "Ver todos los pronósticos"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </article>
  );
}

function UpcomingMatchRow({
  partido,
  now,
  onClick,
}: {
  partido: PartidoConRelaciones;
  now: number;
  onClick: () => void;
}) {
  const local = partido.seleccionLocal;
  const visitante = partido.seleccionVisitante;

  const cerrado = isPredictionClosed(
    partido.fecha,
    PREDICTION_CLOSE_MINUTES_BEFORE,
    now
  );

  const finalizado = partido.resultado?.estado === "FINALIZADO";

  const countdown = getPredictionCountdownLabel(
    partido.fecha,
    PREDICTION_CLOSE_MINUTES_BEFORE,
    now
  );

  const estado = finalizado
    ? "Finalizado"
    : partido.miPrediccion
    ? "Cargado"
    : cerrado
    ? "Cerrado"
    : "Pendiente";

  const estadoClassName = finalizado
    ? "bg-emerald-50 text-emerald-700"
    : partido.miPrediccion
    ? "bg-green-50 text-green-700"
    : cerrado
    ? "bg-amber-50 text-amber-700"
    : "bg-[#FFF7E1] text-[#9A6500]";

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex
        w-full
        items-center
        gap-3
        rounded-[1.2rem]
        border
        border-slate-200
        bg-gradient-to-br
        from-white
        to-slate-50/80
        px-4
        py-3
        text-left
        transition
        hover:-translate-y-0.5
        hover:border-[#008C93]/30
        hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]
      "
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <MiniFlag
          bandera={local?.bandera}
          codigo={local?.codigo}
          nombre={local?.nombre ?? "Local"}
        />

        <MiniFlag
          bandera={visitante?.bandera}
          codigo={visitante?.codigo}
          nombre={visitante?.nombre ?? "Visitante"}
        />

        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-950">
            {local?.nombre ?? "Local"} vs {visitante?.nombre ?? "Visitante"}
          </p>

          <p className="mt-0.5 text-xs font-semibold text-slate-500">
            {format(new Date(partido.fecha), "dd/MM HH:mm")} ·{" "}
            {partido.fase?.nombre ?? "Sin fase"}
          </p>
        </div>
      </div>

      <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
        {!finalizado && (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-black text-sky-700">
            <Clock3 className="h-3 w-3" />
            {countdown}
          </span>
        )}

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-black ${estadoClassName}`}
        >
          {estado}
        </span>
      </div>

      <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#008C93]" />
    </button>
  );
}

type QuickActionsCardProps = {
  isAdmin: boolean;
  onGoPronosticos: () => void;
  onGoFixture: () => void;
  onGoRanking: () => void;
  onGoTablaPosiciones: () => void;
  onGoGoleadores: () => void;
  onGoSimularCruces: () => void;
};

function QuickActionsCard({
  isAdmin,
  onGoPronosticos,
  onGoFixture,
  onGoRanking,
  onGoTablaPosiciones,
  onGoGoleadores,
  onGoSimularCruces,
}: QuickActionsCardProps) {
  return (
    <article className="relative overflow-hidden rounded-[1.6rem] border border-white/80 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple-400/12 blur-3xl" />

      <header className="relative">
        <h2 className="text-lg font-black tracking-[-0.04em] text-slate-950">
          Accesos rápidos
        </h2>

        <p className="mt-1 text-sm font-semibold text-slate-500">
          Entrá directo a las secciones principales.
        </p>
      </header>

      <div className="relative mt-5 grid grid-cols-2 gap-3">
        <QuickActionButton
          icon={CalendarDays}
          label="Mis pronósticos"
          tone="green"
          onClick={onGoPronosticos}
        />

        <QuickActionButton
          icon={Trophy}
          label="Mi ranking"
          tone="gold"
          onClick={onGoRanking}
        />

        {isAdmin && (
          <>
            <QuickActionButton
              icon={CalendarDays}
              label="Fixture"
              tone="blue"
              onClick={onGoFixture}
            />

            <QuickActionButton
              icon={ListOrdered}
              label="Tabla posiciones"
              tone="purple"
              onClick={onGoTablaPosiciones}
            />

            <QuickActionButton
              icon={Goal}
              label="Goleadores"
              tone="cyan"
              onClick={onGoGoleadores}
            />

            <QuickActionButton
              icon={Network}
              label="Simular cruces"
              tone="red"
              onClick={onGoSimularCruces}
            />
          </>
        )}
      </div>
    </article>
  );
}

type QuickActionTone = "green" | "blue" | "gold" | "purple" | "cyan" | "red";

function QuickActionButton({
  icon: Icon,
  label,
  tone,
  onClick,
}: {
  icon: ElementType;
  label: string;
  tone: QuickActionTone;
  onClick: () => void;
}) {
  const toneClassName: Record<QuickActionTone, string> = {
    green: "bg-green-50 text-green-700 group-hover:bg-green-100",
    blue: "bg-blue-50 text-blue-700 group-hover:bg-blue-100",
    gold: "bg-amber-50 text-amber-700 group-hover:bg-amber-100",
    purple: "bg-purple-50 text-purple-700 group-hover:bg-purple-100",
    cyan: "bg-cyan-50 text-cyan-700 group-hover:bg-cyan-100",
    red: "bg-red-50 text-red-700 group-hover:bg-red-100",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex
        min-h-[96px]
        flex-col
        items-center
        justify-center
        gap-2
        rounded-2xl
        border
        border-slate-200
        bg-gradient-to-br
        from-white
        to-slate-50
        p-3
        text-center
        transition
        hover:-translate-y-0.5
        hover:border-[#008C93]/30
        hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]
      "
    >
      <span
        className={`grid h-11 w-11 place-items-center rounded-2xl transition ${toneClassName[tone]}`}
      >
        <Icon className="h-5 w-5" />
      </span>

      <span className="text-xs font-black text-slate-700">{label}</span>
    </button>
  );
}

function MiniFlag({
  bandera,
  codigo,
  nombre,
}: {
  bandera?: string | null;
  codigo?: string | null;
  nombre: string;
}) {
  const value = bandera?.trim();
  const src = resolveBanderaSrc(value, codigo);

  if (!value) {
    return (
      <span className="flex h-8 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100 text-base">
        🏳️
      </span>
    );
  }

  if (src) {
    return (
      <span className="flex h-8 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100">
        <Image
          src={src}
          alt={`Bandera de ${nombre}`}
          width={32}
          height={22}
          unoptimized
          className="object-contain"
        />
      </span>
    );
  }

  return (
    <span className="flex h-8 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100 text-base">
      {value}
    </span>
  );
}

function getMedal(position: number, isCurrentUser: boolean) {
  if (position === 1) return "🥇";
  if (position === 2) return "🥈";
  if (position === 3) return "🥉";
  if (isCurrentUser) return "🔥";
  return "•";
}