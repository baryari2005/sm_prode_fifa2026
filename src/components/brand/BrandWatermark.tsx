"use client";

import Image from "next/image";

type BrandWatermarkProps = {
  src: string;
  alt?: string;
  className?: string;
  opacityClassName?: string;
};

export function BrandWatermark({
  src,
  alt = "",
  className = "",
  opacityClassName = "opacity-10",
}: BrandWatermarkProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${opacityClassName} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        sizes="400px"
      />
    </div>
  );
}
