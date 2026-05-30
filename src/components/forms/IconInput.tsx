"use client";

import { ReactNode } from "react";

export function IconInput({
  leftIcon,
  rightAdornment,
  input,
}: {
  id: string;
  leftIcon: ReactNode;
  rightAdornment?: ReactNode;
  input: ReactNode;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-11 items-center justify-center">
        {leftIcon}
      </span>

      {input}

      {rightAdornment}
    </div>
  );
}