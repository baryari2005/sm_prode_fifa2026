import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BrandDialogFrameProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export const BRAND_DIALOG_CONTENT_CLASSNAME =
  "max-w-md overflow-hidden rounded-[30px] border border-[#5993B6]/24 bg-transparent p-0 shadow-[0_32px_90px_rgba(2,6,23,0.36)]";

export const BRAND_DIALOG_FOOTER_CLASSNAME =
  "gap-2 border-t border-white/10 bg-[#0B1B2F]/88 px-6 py-4 sm:justify-end";

export const BRAND_DIALOG_CANCEL_BUTTON_CLASSNAME =
  "h-11 rounded-2xl border border-[#5993B6]/24 bg-white/[0.06] px-5 font-bold text-white shadow-none hover:bg-white/[0.1] hover:text-white";

export const BRAND_DIALOG_PRIMARY_BUTTON_CLASSNAME =
  "h-11 rounded-2xl bg-[#FAB438] px-5 font-black text-[#1E2C46] shadow-[0_14px_34px_rgba(250,180,56,0.24)] transition hover:bg-[#F7C45A] hover:shadow-[0_18px_40px_rgba(250,180,56,0.3)] disabled:bg-white/10 disabled:text-white/40 disabled:shadow-none";

export const BRAND_DIALOG_INPUT_CLASSNAME =
  "h-11 rounded-2xl border-white/10 bg-white/[0.08] px-4 text-white placeholder:text-white/32 shadow-none focus-visible:border-[#5993B6]/45 focus-visible:ring-[#5993B6]/35";

export const BRAND_DIALOG_LABEL_CLASSNAME =
  "text-sm font-semibold text-[#EAF7FF]";

export const BRAND_DIALOG_ICON_BUTTON_CLASSNAME =
  "absolute inset-y-0 right-2 my-auto grid h-8 w-8 place-items-center rounded-xl text-white/72 transition hover:bg-white/[0.08] hover:text-white";

export const BRAND_DIALOG_ERROR_CLASSNAME = "text-xs text-[#FFD1D1]";

export function BrandDialogFrame({
  children,
  className,
  contentClassName,
}: BrandDialogFrameProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-[#1E2C46] via-[#253550] to-[#1E2C46] text-white",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-1 overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-[#1E2C46] via-[#5993B6] to-[#FAB438]" />
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,147,182,0.18),transparent_34%),radial-gradient(circle_at_18%_18%,rgba(250,180,56,0.14),transparent_18%),linear-gradient(145deg,rgba(255,255,255,0.03),transparent_30%,transparent_68%,rgba(255,255,255,0.02))]" />
        <div className="absolute -left-14 bottom-[-18%] h-40 w-40 rounded-full bg-[#FAB438]/10 blur-3xl" />
        <div className="absolute right-[-12%] top-[-14%] h-44 w-44 rounded-full bg-[#5993B6]/18 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#071628]/70 via-[#071628]/15 to-transparent" />
      </div>

      <div className={cn("relative z-10", contentClassName)}>{children}</div>
    </div>
  );
}
