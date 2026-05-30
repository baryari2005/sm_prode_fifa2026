import type { LucideIcon } from "lucide-react";

import {
  HELP_TOP_ACCENT,
  HELP_TOP_ACCENT_GLOW,
  HELP_TOP_ACCENT_HAIR,
  HELP_TOP_ACCENT_INNER,
} from "./help-surface.styles";

type HelpPageHeaderProps = {
  badge: string;
  title: string;
  description: string;
  icon: LucideIcon;
  variant?: "light" | "dark";
  topAccentVariant?: "default" | "help";
};

export function HelpPageHeader({
  badge,
  title,
  description,
  icon: Icon,
  variant = "light",
  topAccentVariant = "default",
}: HelpPageHeaderProps) {
  const isDark = variant === "dark";
  const useHelpAccent = isDark && topAccentVariant === "help";

  return (
    <section
      className={
        isDark
          ? "relative overflow-hidden rounded-[30px] border border-white/10 bg-[#1E2C46] shadow-[0_24px_70px_rgba(2,6,23,0.24)]"
          : "overflow-hidden rounded-[28px] border border-[#008C93]/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_34%),linear-gradient(135deg,#ffffff_0%,#f8fdff_50%,#f0fbfb_100%)] shadow-[0_16px_38px_rgba(8,145,178,0.08)]"
      }
    >
      {isDark ? (
        <div className="pointer-events-none absolute inset-0">
          {useHelpAccent ? (
            <div className={HELP_TOP_ACCENT}>
              <div className={HELP_TOP_ACCENT_INNER} />
              <div className={HELP_TOP_ACCENT_GLOW} />
              <div className={HELP_TOP_ACCENT_HAIR} />
            </div>
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,44,70,0.96)_0%,rgba(30,44,70,0.88)_46%,rgba(37,53,80,0.72)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(89,147,182,0.26),transparent_30%),radial-gradient(circle_at_12%_8%,rgba(250,180,56,0.16),transparent_22%)]" />
          {!useHelpAccent ? (
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FAB438] to-transparent opacity-80" />
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-5 px-6 py-7 md:px-8 md:py-8">
        <div
          className={
            isDark
              ? "relative inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-4 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-[#FFE4A3]"
              : "inline-flex w-fit items-center gap-2 rounded-full border border-[#008C93]/20 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[#008C93]"
          }
        >
          <Icon className="h-3.5 w-3.5" />
          {badge}
        </div>

        <div className="relative space-y-2">
          <h1
            className={
              isDark
                ? "max-w-3xl text-3xl font-black tracking-tight text-white md:text-4xl"
                : "max-w-3xl text-3xl font-black tracking-tight text-slate-950 md:text-4xl"
            }
          >
            {title}
          </h1>
          <p
            className={
              isDark
                ? "max-w-3xl text-sm leading-6 text-white/76 md:text-base"
                : "max-w-3xl text-sm leading-6 text-slate-600 md:text-base"
            }
          >
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
