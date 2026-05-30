"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SvgIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type Props = {
  Icon: SvgIcon;
  href?: string;
  title?: string;
  active?: boolean;
  collapsed?: boolean;
  badgeCount?: number;
  highlight?: boolean;
  onClick?: () => void;
};

export function SidebarNavIcon({
  Icon,
  href,
  title,
  active,
  collapsed,
  badgeCount,
  highlight,
  onClick,
}: Props) {
  const iconSize = collapsed ? 22 : 18;
  const hasBadge = Boolean(badgeCount && badgeCount > 0);

  const content = (
    <div
      className={`
        relative flex w-full items-center
        ${collapsed ? "justify-center" : "gap-3"}
      `}
    >
      <Icon
        style={{ width: iconSize, height: iconSize }}
        strokeWidth={2}
      />

      {!collapsed && (
        <span className="whitespace-nowrap text-sm font-semibold">
          {title}
        </span>
      )}

      {hasBadge && (
        <span
          className={`
            absolute
            ${collapsed ? "-right-1 -top-1" : "right-2.5"}
            rounded-full
            border border-[#FAB438]/18
            bg-[#FAB438]/14
            text-[#FFE4A3]
            text-[10px]
            px-1.5
            py-0.5
            font-black
          `}
        >
          {badgeCount}
        </span>
      )}
    </div>
  );

  const button = (
    <Button
      variant="ghost"
      onClick={onClick}
      asChild={!!href}
      className={`
        relative w-full rounded-xl text-white transition-all duration-200
        ${collapsed
          ? "flex h-12 items-center justify-center px-0"
          : "flex h-11 items-center justify-start px-3"}
        ${active ? "bg-[#5993B6]/18 text-white shadow-[0_10px_22px_rgba(89,147,182,0.12)]" : "border border-transparent"}
        ${highlight
          ? "bg-red-500/20 hover:bg-red-500/30"
          : "hover:bg-white/[0.06] hover:text-[#AEEBFF]"}
      `}
    >
      {href ? <Link href={href}>{content}</Link> : content}
    </Button>
  );

  if (!collapsed) return button;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          className="rounded-md border border-white/10 bg-[#061B33] px-2 py-1 text-xs text-white shadow-md"
        >
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
