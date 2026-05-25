import type { LucideIcon } from "lucide-react";

type HelpPageHeaderProps = {
  badge: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export function HelpPageHeader({
  badge,
  title,
  description,
  icon: Icon,
}: HelpPageHeaderProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-[#008C93]/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_34%),linear-gradient(135deg,#ffffff_0%,#f8fdff_50%,#f0fbfb_100%)] shadow-[0_16px_38px_rgba(8,145,178,0.08)]">
      <div className="flex flex-col gap-5 px-6 py-7 md:px-8 md:py-8">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#008C93]/20 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[#008C93]">
          <Icon className="h-3.5 w-3.5" />
          {badge}
        </div>

        <div className="space-y-2">
          <h1 className="max-w-3xl text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
            {title}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
