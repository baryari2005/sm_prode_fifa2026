// components/MenuItemWithSubtitle.tsx
"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils"; // si no tenés cn, podés omitirlo

export function MenuItemWithSubtitle({
  icon: Icon,
  title,
  subtitle,
  onClick,
  className,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <DropdownMenuItem
      onClick={onClick}
      className={cn(
        "items-start gap-3 rounded-none px-3 py-3 text-white transition focus:bg-white/[0.06] focus:text-white",
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-white/56" />
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-xs text-white/54">{subtitle}</span>
      </div>
    </DropdownMenuItem>
  );
}
