"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

type HeroVisualImageProps = Omit<ImageProps, "fill" | "className"> & {
  baseClassName: string;
  loadedClassName?: string;
  loadingClassName?: string;
};

export function HeroVisualImage({
  src,
  alt,
  sizes,
  baseClassName,
  loadedClassName = "scale-100 opacity-100",
  loadingClassName = "scale-[0.97] opacity-0",
  onError,
  priority,
  quality,
  ...props
}: HeroVisualImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={quality}
      onLoad={() => setIsLoaded(true)}
      onError={onError}
      className={`${baseClassName} transition-all duration-700 ease-out ${
        isLoaded ? loadedClassName : loadingClassName
      }`}
    />
  );
}
