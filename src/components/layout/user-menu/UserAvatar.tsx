"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils/initials";

type Props = {
  src?: string;
  name?: string;
  className?: string;
  fallbackBgClass?: string;
  textClass?: string;
};

export function UserAvatar({
  src,
  name,
  className,
  fallbackBgClass = "bg-[#5993B6]/18",
  textClass = "text-white",
}: Props) {
  const display = initials(name);

  return (
    <Avatar className={cn("h-10 w-10 border border-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.18)]", className)}>
      <AvatarImage src={src} alt={name ?? "Avatar"} />
      <AvatarFallback className={cn("font-black", fallbackBgClass, textClass)}>
        {display}
      </AvatarFallback>
    </Avatar>
  );
}
