import Image from "next/image";

import { cn } from "@/lib/utils";

type ProdeIconProps = {
  className?: string;
  source?: string;
  alt?: string;
  mode?: "image" | "mask";
};

export function ProdeIcon({
  className = "h-6 w-6",
  source,
  alt = "Prode Mundial 2026",
  mode = "image",
}: ProdeIconProps) {
  if (!source) return null;

  if (mode === "mask") {
    return (
      <span
        role="img"
        aria-label={alt}
        className={cn("inline-block shrink-0 bg-current", className)}
        style={{
          WebkitMask: `url(${source}) center / contain no-repeat`,
          mask: `url(${source}) center / contain no-repeat`,
        }}
      />
    );
  }

  return (
    <Image
      src={source}
      alt={alt}
      width={24}
      height={24}
      unoptimized
      className={cn(className, "object-contain")}
    />
  );
}