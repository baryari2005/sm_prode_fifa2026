"use client";

import Image from "next/image";
import {
    ArrowRight,
    CalendarDays,
    Clock3,
    Trophy,    
} from "lucide-react";
import { format } from "date-fns";

import { resolveBanderaSrc } from "@/lib/flags";
import type { PartidoConRelaciones } from "@/features/partidos/utils/partidos-ui.helpers";
import { ProdeIcon } from "@/components/icons/Iconos";

type DashboardHeroProps = {
    displayName: string;
    pronosticosCargados: number;
    totalPartidos: number;
    proximoPartido: PartidoConRelaciones | null;
    proximoPartidoCountdown: string | null;
    proximoPartidoCerrado: boolean;
    proximoPartidoFinalizado: boolean;
    proximoPartidoBloqueado: boolean;
    onGoPronosticos: () => void;
    onGoRanking: () => void;
    onGoProximoPartido: () => void;
};

export function DashboardHero({
    displayName,
    pronosticosCargados,
    totalPartidos,
    proximoPartido,
    proximoPartidoCountdown,
    proximoPartidoCerrado,
    proximoPartidoFinalizado,
    proximoPartidoBloqueado,
    onGoPronosticos,
    onGoRanking,
    onGoProximoPartido,
}: DashboardHeroProps) {
    const porcentaje =
        totalPartidos > 0
            ? Math.round((pronosticosCargados / totalPartidos) * 100)
            : 0;

    return (
        <section
            className="
        relative
        overflow-hidden
        rounded-[2rem]
        border
        border-white/80
        bg-gradient-to-br
        from-[#F7FFF8]
        via-white
        to-[#EAF8FA]
        p-5
        shadow-[0_22px_70px_rgba(15,23,42,0.12)]
        md:p-7
      "
        >
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#39A935]/16 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#008C93]/14 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#39A935]/8 to-transparent" />

            <div className="relative grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-stretch">
                <div
                    className="
            relative
            overflow-hidden
            rounded-[1.7rem]
            bg-gradient-to-br
            from-[#052b1c]
            via-[#082033]
            to-[#06111F]
            p-6
            text-white
            shadow-[0_18px_50px_rgba(15,23,42,0.22)]
            md:p-7
          "
                >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(57,169,53,0.36),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(0,140,147,0.32),transparent_35%)]" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(90deg,rgba(57,169,53,0.18),rgba(247,183,49,0.10),rgba(0,140,147,0.16))]" />

                    <div className="relative">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#F7B731]/35 bg-[#F7B731]/12 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#F7B731]">
                            <ProdeIcon
                                source="/trofeo.ico"
                                mode="mask"
                                className="h-6 w-6 text-[#F7B731]"
                            />
                            Prode Mundial 2026
                        </div>

                        <div className="grid gap-6 lg:grid-cols-[1fr_190px] lg:items-center">
                            <div>
                                <h1 className="max-w-3xl text-3xl font-black leading-[1.08] tracking-[-0.045em] md:text-4xl 2xl:text-5xl">
                                    Hola, {displayName}
                                    <span className="block text-white/90">
                                        ¿Listo para jugar el prode?
                                    </span>
                                </h1>

                                <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-white/68 md:text-base">
                                    Seguí tus puntos, revisá los próximos partidos y competí en el
                                    ranking general del grupo.
                                </p>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={onGoPronosticos}
                                        className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-2xl
                      bg-[#39A935]
                      px-5
                      py-3
                      text-sm
                      font-black
                      text-white
                      shadow-lg
                      shadow-green-950/25
                      transition
                      hover:-translate-y-0.5
                      hover:bg-[#247A28]
                    "
                                    >
                                        <Trophy className="h-4 w-4" />
                                        Cargar pronósticos
                                    </button>

                                    <button
                                        type="button"
                                        onClick={onGoRanking}
                                        className="inline-flex items-center gap-2 rounded-2xl border border-white/18 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
                                    >
                                        <Trophy className="h-4 w-4" />
                                        Ver ranking
                                    </button>
                                </div>
                            </div>

                            <div className="hidden lg:flex lg:justify-end">
                                <div className="relative grid h-44 w-44 place-items-center rounded-full border border-white/10 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur">
                                    <div className="absolute inset-4 rounded-full border border-white/10" />

                                    <div className="text-center">
                                        <p className="text-xs font-black uppercase tracking-[0.18em] text-white/55">
                                            Pronósticos
                                        </p>

                                        <p className="mt-2 text-4xl font-black tracking-[-0.08em]">
                                            {pronosticosCargados}
                                            <span className="text-white/40">/{totalPartidos}</span>
                                        </p>

                                        <p className="mt-1 text-sm font-bold text-white/65">
                                            {porcentaje}% completo
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <NextMatchHeroCard
                    partido={proximoPartido}
                    countdown={proximoPartidoCountdown}
                    cerrado={proximoPartidoCerrado}
                    finalizado={proximoPartidoFinalizado}
                    bloqueado={proximoPartidoBloqueado}
                    onGoProximoPartido={onGoProximoPartido}
                />
            </div>
        </section>
    );
}

type NextMatchHeroCardProps = {
    partido: PartidoConRelaciones | null;
    countdown: string | null;
    cerrado: boolean;
    finalizado: boolean;
    bloqueado: boolean;
    onGoProximoPartido: () => void;
};

function NextMatchHeroCard({
    partido,
    countdown,
    cerrado,
    finalizado,
    bloqueado,
    onGoProximoPartido,
}: NextMatchHeroCardProps) {
    if (!partido) {
        return (
            <div className="rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.10)]">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                        Próximo partido
                    </p>

                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FFF7E1] text-[#B77900]">
                        <CalendarDays className="h-5 w-5" />
                    </div>
                </div>

                <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm font-semibold text-slate-500">
                    No hay partidos futuros para pronosticar en este momento.
                </div>
            </div>
        );
    }

    const local = partido.seleccionLocal;
    const visitante = partido.seleccionVisitante;

    const statusLabel = finalizado
        ? "Partido finalizado"
        : partido.miPrediccion
            ? "Pronóstico cargado"
            : cerrado
                ? "Pronóstico cerrado"
                : "Pendiente de cargar";

    const statusClassName = finalizado
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : partido.miPrediccion
            ? "border-green-200 bg-green-50 text-green-700"
            : cerrado
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : "border-[#F7B731]/30 bg-[#FFF7E1] text-[#9A6500]";

    return (
        <div
            className="
        rounded-[1.7rem]
        border
        border-slate-200
        bg-white
        p-5
        shadow-[0_18px_50px_rgba(15,23,42,0.10)]
        md:p-6
      "
        >
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#008C93]">
                        Próximo partido
                    </p>

                    <h2 className="mt-1 text-xl font-black tracking-[-0.04em] text-slate-950">
                        {local?.nombre ?? "Local"} vs {visitante?.nombre ?? "Visitante"}
                    </h2>
                </div>

                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#FFF7E1] text-[#B77900]">
                    <CalendarDays className="h-5 w-5" />
                </div>
            </div>

            <div className="rounded-[1.4rem] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-[#F4FBFC] p-4">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <TeamPreview
                        nombre={local?.nombre ?? "Local"}
                        bandera={local?.bandera}
                        codigo={local?.codigo}
                    />

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase text-slate-500">
                        VS
                    </span>

                    <TeamPreview
                        nombre={visitante?.nombre ?? "Visitante"}
                        bandera={visitante?.bandera}
                        codigo={visitante?.codigo}
                        right
                    />
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <InfoPill
                        icon={CalendarDays}
                        label={format(new Date(partido.fecha), "dd/MM/yyyy")}
                        detail={partido.fase?.nombre ?? "Sin fase"}
                    />

                    <InfoPill
                        icon={Clock3}
                        label={format(new Date(partido.fecha), "HH:mm")}
                        detail="Hora del partido"
                    />

                    <div
                        className={`flex items-center justify-center rounded-2xl border px-3 py-3 text-center text-xs font-black ${statusClassName}`}
                    >
                        {statusLabel}
                    </div>
                </div>

                {partido.resultado?.estado !== "FINALIZADO" && countdown && (
                    <div
                        className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black ${cerrado
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-sky-200 bg-sky-50 text-sky-700"
                            }`}
                    >
                        <Clock3 className="h-4 w-4" />
                        {countdown}
                    </div>
                )}
            </div>

            <button
                type="button"
                disabled={bloqueado}
                onClick={() => {
                    if (bloqueado) return;
                    onGoProximoPartido();
                }}
                className={`
          mt-4
          inline-flex
          h-12
          w-full
          items-center
          justify-center
          gap-2
          rounded-2xl
          px-5
          text-sm
          font-black
          transition
          ${bloqueado
                        ? "cursor-not-allowed bg-slate-200 text-slate-500"
                        : "bg-[#39A935] text-white shadow-lg shadow-green-700/20 hover:-translate-y-0.5 hover:bg-[#247A28]"
                    }
        `}
            >
                {finalizado
                    ? "Partido finalizado"
                    : cerrado
                        ? "Pronóstico cerrado"
                        : partido.miPrediccion
                            ? "Editar mi pronóstico"
                            : "Pronosticar ahora"}

                {!bloqueado && <ArrowRight className="h-4 w-4" />}
            </button>
        </div>
    );
}

type InfoPillProps = {
    icon: React.ElementType;
    label: string;
    detail: string;
};

function InfoPill({ icon: Icon, label, detail }: InfoPillProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
            <div className="flex items-center gap-2 text-sm font-black text-slate-950">
                <Icon className="h-4 w-4 text-[#008C93]" />
                {label}
            </div>

            <p className="mt-1 text-xs font-semibold text-slate-500">{detail}</p>
        </div>
    );
}

type TeamPreviewProps = {
    nombre: string;
    bandera?: string | null;
    codigo?: string | null;
    right?: boolean;
};

function TeamPreview({ nombre, bandera, codigo, right = false }: TeamPreviewProps) {
    return (
        <div
            className={`flex min-w-0 items-center gap-2 ${right ? "flex-row-reverse text-right" : ""
                }`}
        >
            <TeamFlag bandera={bandera} codigo={codigo} nombre={nombre} />

            <p className="min-w-0 truncate text-sm font-black text-slate-950">
                {nombre}
            </p>
        </div>
    );
}

function TeamFlag({
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
            <span className="flex h-9 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-lg">
                🏳️
            </span>
        );
    }

    if (src) {
        return (
            <span className="flex h-9 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                <Image
                    src={src}
                    alt={`Bandera de ${nombre}`}
                    width={36}
                    height={26}
                    unoptimized
                    className="object-contain"
                />
            </span>
        );
    }

    return (
        <span className="flex h-9 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-lg">
            {value}
        </span>
    );
}