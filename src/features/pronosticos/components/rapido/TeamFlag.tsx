"use client";

import { FlagImage } from "@/components/ui/flag-image";

type TeamFlagProps = {
  flag?: string | null;
  code?: string | null;
  name: string;
};

export function TeamFlag({ flag, code, name }: TeamFlagProps) {
  return (
    <FlagImage
      bandera={flag}
      codigo={code}
      nombre={name}
      widthClassName="w-9"
      heightClassName="h-7"
      fallbackTextClassName="text-[0.6rem]"
    />
  );
}
