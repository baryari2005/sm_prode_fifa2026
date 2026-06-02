"use client";

import Image from "next/image";
import { ChevronRight, Sparkles, Star, SunMedium } from "lucide-react";

import { BrandPatternBackground } from "@/components/brand/BrandPatternBackground";
import { BrandWatermark } from "@/components/brand/BrandWatermark";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { brandImages } from "@/config/brand-images";
import { cn } from "@/lib/utils";

import type {
  DashboardPreviewVariant,
  PreviewAction,
  PreviewDashboardContent,
  PreviewKpi,
  PreviewMatch,
  PreviewQuickLink,
  PreviewRankingRow,
} from "@/components/brand/dashboard-preview/dashboard-preview.data";
import { LateralSummaryHeader } from "@/components/ui/lateralSummaryHeader";

type DashboardPreviewPanelProps = {
  variant: DashboardPreviewVariant;
  content: PreviewDashboardContent;
};

const HERO_MASCOTS = [
  {
    src: brandImages.mascots.capi,
    alt: "Mascota carpincho del Prode",
  },
  {
    src: brandImages.mascots.condor,
    alt: "Mascota condor del Prode",
  },
  {
    src: brandImages.mascots.yaguarete,
    alt: "Mascota yaguarete del Prode",
  },
] as const;

export function DashboardPreviewPanel({
  variant,
  content,
}: DashboardPreviewPanelProps) {
  return (
    <div className="space-y-5">
      <section className="group relative overflow-hidden rounded-[32px] border border-[#1E2C46]/10 bg-gradient-to-br from-[#1E2C46] via-[#24334F] to-[#1E2C46] p-3 shadow-[0_14px_35px_rgba(30,44,70,0.16)] md:p-4">
        <BrandPatternBackground
          variant="cover"
          className="opacity-[0.1]"
          overlayClassName="opacity-[0.14]"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.16),transparent_35%),radial-gradient(circle_at_15%_15%,rgba(250,180,56,0.18),transparent_18%)]" />
        <BrandWatermark
          src={brandImages.prode.solMark}
          className="right-[-4%] top-[-18%] left-auto h-44 w-44"
          opacityClassName="opacity-[0.08]"
        />
        <div className="grid w-full min-w-0 gap-4 2xl:grid-cols-[minmax(0,2.12fr)_minmax(340px,0.88fr)] 2xl:items-stretch">
          <CompactHero variant={variant} content={content} />
          <ImportantActionsPreview variant={variant} content={content} />
        </div>
      </section>

      <section className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,292px),1fr))] gap-4">
        {content.kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-2 2xl:grid-cols-[1.42fr_1.16fr_0.9fr] 2xl:gap-5">
        <PanelCard
          eyebrow={variant === "admin" ? "Partidos en juego" : "Próximos partidos"}
          title={content.primaryPanelTitle}
          actionLabel={variant === "admin" ? "Ver fixture completo" : "Ver todos los pronosticos"}
        >
          <div className="space-y-3">
            {content.primaryMatches.map((match) => (
              <MatchRow key={match.id} match={match} />
            ))}
          </div>
        </PanelCard>

        <PanelCard
          eyebrow={variant === "admin" ? "Seguimiento" : "Mi participacion"}
          title={variant === "admin" ? "Resumen operativo" : "Cierre, puntos y estado"}
          actionLabel={variant === "admin" ? "Ir a resultados" : "Ver mis pronosticos"}
        >
          <div className="space-y-3">
            {content.heroStats.map((stat) => (
              <SummaryRow key={stat.label} stat={stat} />
            ))}
            <div className="rounded-[22px] border border-white/10 bg-white/[0.06] px-4 py-3.5 text-sm leading-5 text-white/76">
              {content.statusBody}
            </div>
          </div>
        </PanelCard>

        <PanelCard eyebrow="Ranking rapido" title="Top participantes" actionLabel="Ver ranking completo">
          <div className="space-y-3">
            {content.ranking.map((row) => (
              <RankingRow key={`${row.position}-${row.name}`} row={row} />
            ))}
          </div>
        </PanelCard>
      </section>

      <section className="group relative min-w-0 overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-[#1E2C46] via-[#253550] to-[#1E2C46] p-4 shadow-[0_16px_38px_rgba(30,44,70,0.16)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-[#1E2C46] via-[#5993B6] to-[#FAB438] transition-all duration-300 group-hover:brightness-125" />
          <div className="absolute inset-y-0 left-[-24%] w-[26%] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.88)_50%,transparent_100%)] opacity-0 blur-[1px] transition-all duration-500 group-hover:left-[78%] group-hover:opacity-100" />
          <div className="absolute inset-x-[18%] top-[-3px] h-[8px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.72)_0%,rgba(174,235,255,0.34)_36%,transparent_74%)] opacity-0 blur-[5px] transition-all duration-300 group-hover:opacity-100" />
          <div className="absolute inset-x-0 top-0 h-px bg-white/0 transition-all duration-300 group-hover:bg-white/55" />
        </div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
              Accesos rapidos
            </p>
            <h2 className="mt-1 text-lg font-black tracking-[-0.04em] text-white">
              Entradas directas
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-white/58">
            <SunMedium className="h-3.5 w-3.5 text-[#FAB438]" />
            misma estructura, nueva piel visual
          </div>
        </div>

        <div className="grid min-w-0 gap-3 md:grid-cols-2 2xl:grid-cols-4">
          {content.quickLinks.map((item) => (
            <QuickLink key={item.label} item={item} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden rounded-[26px] border-white/10 bg-gradient-to-br from-[#1E2C46] via-[#253550] to-[#1E2C46] py-0 shadow-[0_14px_30px_rgba(30,44,70,0.16)]">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#5993B6]" />
              <p className="text-sm font-black text-white">Que se conserva del dashboard real</p>
            </div>
            <ul className="grid gap-2 text-sm text-white/74 md:grid-cols-2">
              <li>Hero superior compacto con panel lateral derecho</li>
              <li>Fila de KPIs cortos y visibles arriba</li>
              <li>Bloques de partidos, resumen y ranking en una sola franja</li>
              <li>Accesos rapidos al final del home</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-[26px] border-[#1E2C46]/8 bg-[#1E2C46] py-0 shadow-[0_12px_28px_rgba(30,44,70,0.12)]">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-[#FAB438]" />
              <p className="text-sm font-black text-white">Que cambia visualmente</p>
            </div>
            <ul className="space-y-2 text-sm text-white/74">
              {content.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function CompactHero({
  variant,
  content,
}: {
  variant: DashboardPreviewVariant;
  content: PreviewDashboardContent;
}) {
  const selectedMascot = HERO_MASCOTS[variant === "admin" ? 1 : 2];

  return (
    <section className="relative h-full min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-[#1E2C46] px-4 py-5 text-white shadow-[0_16px_40px_rgba(15,23,42,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(15,23,42,0.28)] md:px-5 md:py-5 2xl:min-h-[360px]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,rgba(30,44,70,0.96)_0%,rgba(30,44,70,0.92)_42%,rgba(89,147,182,0.24)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(174,235,255,0.12),transparent_24%),radial-gradient(circle_at_18%_18%,rgba(250,180,56,0.14),transparent_16%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.06)_42%,transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 flex h-full min-w-0 flex-col justify-between gap-5 xl:max-w-[62%]">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-[#FAB438]/24 bg-[#FAB438]/12 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#FFE4A3]">
              {content.badge}
            </Badge>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
              <Image
                src={brandImages.prode.masSMLogo}
                alt="Mas San Miguel"
                width={60}
                height={20}
                className="h-auto w-[54px] object-contain opacity-90"
              />
              dashboard preview
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#AEEBFF]">
              {variant === "admin" ? "Hola, Admin" : "Hola, Sergio"}
            </p>
            <h1 className="brand-heading text-[2.1rem] font-black leading-[0.92] tracking-[-0.04em] md:text-[2.45rem] 2xl:text-[2.7rem]">
              {content.title}
            </h1>
            <p className="text-[1rem] font-semibold text-[#FFE4A3]">{content.subtitle}</p>
            <p className="max-w-[640px] text-sm leading-5 text-white/74">
              {content.description}
            </p>
          </div>
        </div>

        <div className="flex max-w-[900px] flex-wrap gap-2">
          {content.heroStats.map((stat) => (
            <HeroChip key={stat.label} stat={stat} />
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-[-58px] right-[-12px] hidden h-[340px] w-[300px] xl:block 2xl:bottom-[-84px] 2xl:right-[-6px] 2xl:h-[420px] 2xl:w-[360px]">
        <div className="absolute inset-3 rounded-full bg-[#5993B6]/20 blur-3xl" />
        <Image
          src={selectedMascot.src}
          alt={selectedMascot.alt}
          fill
          className="object-contain object-bottom drop-shadow-[0_34px_70px_rgba(0,0,0,0.42)]"
        />
      </div>
    </section>
  );
}

function ImportantActionsPreview({
  variant,
  content,
}: {
  variant: DashboardPreviewVariant;
  content: PreviewDashboardContent;
}) {
  return (
    <aside className="group relative min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#1E2C46] via-[#253550] to-[#1E2C46] p-4 shadow-[0_16px_36px_rgba(30,44,70,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_58px_rgba(30,44,70,0.26)] 2xl:min-h-[360px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-[#1E2C46] via-[#5993B6] to-[#FAB438] transition-all duration-300 group-hover:brightness-125" />
        <div className="absolute inset-y-0 left-[-24%] w-[26%] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.88)_50%,transparent_100%)] opacity-0 blur-[1px] transition-all duration-500 group-hover:left-[78%] group-hover:opacity-100" />
        <div className="absolute inset-x-[18%] top-[-3px] h-[8px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.72)_0%,rgba(174,235,255,0.34)_36%,transparent_74%)] opacity-0 blur-[5px] transition-all duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/0 transition-all duration-300 group-hover:bg-white/55" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.05)_42%,transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <LateralSummaryHeader
        title="Acciones importantes"
        description={variant === "admin"
          ? "Accesos directos para administrar el torneo."
          : "Entradas rapidas para jugar y seguir tu avance."}
      />

      <div className="space-y-2.5">
        {content.importantActions.map((action) => (
          <ActionRow key={action.title} action={action} variant={variant} />
        ))}
      </div>
    </aside>
  );
}

function PanelCard({
  eyebrow,
  title,
  actionLabel,
  children,
}: {
  eyebrow: string;
  title: string;
  actionLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="group relative min-w-0 overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-[#1E2C46] via-[#253550] to-[#1E2C46] p-4 shadow-[0_16px_36px_rgba(30,44,70,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_58px_rgba(30,44,70,0.26)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-[#1E2C46] via-[#5993B6] to-[#FAB438] transition-all duration-300 group-hover:brightness-125" />
        <div className="absolute inset-y-0 left-[-24%] w-[26%] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.88)_50%,transparent_100%)] opacity-0 blur-[1px] transition-all duration-500 group-hover:left-[78%] group-hover:opacity-100" />
        <div className="absolute inset-x-[18%] top-[-3px] h-[8px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.72)_0%,rgba(174,235,255,0.34)_36%,transparent_74%)] opacity-0 blur-[5px] transition-all duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/0 transition-all duration-300 group-hover:bg-white/55" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.05)_42%,transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#AEEBFF]">
            {eyebrow}
          </p>
          <h2 className="brand-heading text-lg font-black tracking-[-0.02em] text-white xl:text-xl">
            {title}
          </h2>
        </div>
        {actionLabel ? (
          <span className="inline-flex items-center gap-2 text-sm font-black text-white/62">
            {actionLabel}
            <ChevronRight className="h-4 w-4" />
          </span>
        ) : null}
      </div>
      {children}
    </article>
  );
}

function HeroChip({ stat }: { stat: PreviewKpi }) {
  return (
    <div className={cn("inline-flex min-w-[150px] max-w-full items-center gap-2.5 rounded-full border px-3.5 py-2.5", toneHeroChip(stat.tone))}>
      <span className={cn("h-2.5 w-2.5 rounded-full", toneDot(stat.tone))} />
      <span className="min-w-0">
        <span className="block text-sm font-black leading-none text-white">{stat.value}</span>
        <span className="mt-1 block text-[11px] font-semibold leading-4 text-white/78">
          {stat.label}
        </span>
      </span>
    </div>
  );
}

function KpiCard({ kpi }: { kpi: PreviewKpi }) {
  return (
    <article className="group relative min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#1E2C46] via-[#253550] to-[#1E2C46] p-4 shadow-[0_14px_30px_rgba(30,44,70,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(30,44,70,0.24)] min-h-[168px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-[#1E2C46] via-[#5993B6] to-[#FAB438] transition-all duration-300 group-hover:brightness-125" />
        <div className="absolute inset-y-0 left-[-24%] w-[26%] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.88)_50%,transparent_100%)] opacity-0 blur-[1px] transition-all duration-500 group-hover:left-[78%] group-hover:opacity-100" />
        <div className="absolute inset-x-[18%] top-[-3px] h-[8px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.72)_0%,rgba(174,235,255,0.34)_36%,transparent_74%)] opacity-0 blur-[5px] transition-all duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/0 transition-all duration-300 group-hover:bg-white/55" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.05)_42%,transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-bold leading-5 text-white/70">
            {kpi.label}
          </p>
          <div className="mt-2 flex items-end gap-1.5">
            <p className="text-[2rem] font-black leading-none tracking-[-0.07em] text-white">
              {kpi.value}
            </p>
          </div>
        </div>
        <span className={cn("mt-1 h-10 w-10 shrink-0 rounded-2xl", toneSoftBlock(kpi.tone))} />
      </div>
      <p className="mt-4 line-clamp-2 text-sm font-semibold text-white/68">
        {kpi.detail}
      </p>
    </article>
  );
}

function ActionRow({
  action,
  variant,
}: {
  action: PreviewAction;
  variant: DashboardPreviewVariant;
}) {
  return (
    <div className="group flex w-full min-w-0 items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.06] px-3 py-3 text-left shadow-[0_12px_24px_rgba(30,44,70,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.1] hover:shadow-[0_18px_34px_rgba(30,44,70,0.18)]">
      <span
        className={cn(
          "grid h-10 w-10 shrink-0 place-items-center rounded-2xl",
          variant === "admin" ? "bg-[#5993B6]/18 text-[#AEEBFF]" : "bg-[#FAB438]/16 text-[#FFE4A3]",
        )}
      >
        <Sparkles className="h-4.5 w-4.5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="line-clamp-2 text-[13px] font-black leading-4 text-white">
            {action.title}
          </span>
          {action.badge ? (
            <span className="rounded-full bg-[#FAB438]/12 px-2.5 py-1 text-[11px] font-black text-[#8A5A00]">
              {action.badge}
            </span>
          ) : null}
        </span>
        <span className="mt-0.5 block line-clamp-2 text-[11px] font-semibold leading-4 text-white/64">
          {action.description}
        </span>
      </span>

      <ChevronRight className="h-4 w-4 shrink-0 text-[#5993B6]" />
    </div>
  );
}

function MatchRow({ match }: { match: PreviewMatch }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.06] px-4 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.1] hover:shadow-[0_16px_30px_rgba(30,44,70,0.16)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-white">
            {match.local} vs {match.visitante}
          </p>
          <p className="mt-1 truncate text-xs font-semibold text-white/62">
            {match.fase} · {match.dateLabel}
          </p>
        </div>
        <Badge className={cn("px-2.5 py-1 text-[11px] font-black", toneBadge(match.tone))}>
          {match.status}
        </Badge>
      </div>
    </div>
  );
}

function SummaryRow({ stat }: { stat: PreviewKpi }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[22px] border border-white/10 bg-white/[0.06] px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.1] hover:shadow-[0_16px_30px_rgba(30,44,70,0.16)]">
      <div>
        <p className="text-sm font-black text-white">{stat.label}</p>
        <p className="text-xs font-semibold text-white/60">{stat.detail}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className={cn("h-2.5 w-2.5 rounded-full", toneDot(stat.tone))} />
        <span className="text-sm font-black text-white">{stat.value}</span>
      </div>
    </div>
  );
}

function RankingRow({ row }: { row: PreviewRankingRow }) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center justify-between gap-3 rounded-[22px] border px-3.5 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(30,44,70,0.16)]",
        row.highlighted
          ? "border-[#FAB438]/25 bg-[#16233a]"
          : "border-white/10 bg-white/[0.06] hover:bg-white/[0.1]",
      )}
    >
      <div className="flex min-w-0 items-center gap-3 overflow-hidden">
        <span
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-sm font-black",
            row.highlighted ? "bg-white/10 text-white" : "bg-[#5993B6]/18 text-white",
          )}
        >
          {row.position.replace("#", "")}
        </span>

        <div className="min-w-0">
          <p className={cn("truncate text-sm font-black", row.highlighted ? "text-white" : "text-white")}>
            {row.name}
          </p>
          <p className={cn("text-xs font-semibold", row.highlighted ? "text-white/66" : "text-white/60")}>
            {row.detail}
          </p>
        </div>
      </div>

      <span className={cn("shrink-0 text-sm font-black", row.highlighted ? "text-[#FAB438]" : "text-white")}>
        {row.points} pts
      </span>
    </div>
  );
}

function QuickLink({ item }: { item: PreviewQuickLink }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-[24px] border border-white/10 bg-white/[0.06] px-4 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.1] hover:shadow-[0_18px_34px_rgba(30,44,70,0.16)]">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#5993B6]/18 text-white">
        <SunMedium className="h-4.5 w-4.5 text-[#FAB438]" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-black text-white">{item.label}</span>
        <span className="block text-xs font-semibold text-white/60">{item.caption}</span>
      </span>
    </div>
  );
}

function toneDot(tone: PreviewKpi["tone"]) {
  if (tone === "gold") return "bg-[#FAB438]";
  if (tone === "sky") return "bg-[#5993B6]";
  if (tone === "mint") return "bg-emerald-500";
  return "bg-[#1E2C46]";
}

function toneSoftBlock(tone: PreviewKpi["tone"]) {
  if (tone === "gold") return "bg-[#FAB438]/14";
  if (tone === "sky") return "bg-[#5993B6]/14";
  if (tone === "mint") return "bg-emerald-500/12";
  return "bg-[#1E2C46]/10";
}

function toneHeroChip(tone: PreviewKpi["tone"]) {
  if (tone === "gold") return "border-[#FAB438]/24 bg-[#FAB438]/10";
  if (tone === "sky") return "border-[#5993B6]/24 bg-[#5993B6]/10";
  if (tone === "mint") return "border-emerald-300/20 bg-emerald-300/10";
  return "border-white/10 bg-white/[0.06]";
}

function toneBadge(tone: PreviewMatch["tone"]) {
  if (tone === "gold") return "border-[#FAB438]/18 bg-[#FAB438]/12 text-[#8A5A00]";
  if (tone === "mint") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  return "border-[#5993B6]/18 bg-[#5993B6]/12 text-[#1E2C46]";
}
