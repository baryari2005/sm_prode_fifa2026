"use client";

import { ScoreInput } from "@/features/pronosticos/components/rapido/ScoreInput";
import { TeamFlag } from "@/features/pronosticos/components/rapido/TeamFlag";

type TeamPredictionColumnProps = {
  name: string;
  flag?: string | null;
  code?: string | null;
  value: string;
  disabled: boolean;
  align: "left" | "right";
  onChange: (value: string) => void;
};

export function TeamPredictionColumn({
  name,
  flag,
  code,
  value,
  disabled,
  align,
  onChange,
}: TeamPredictionColumnProps) {
  const isRight = align === "right";

  return (
    <div
      className={[
        "flex min-w-0 flex-col gap-3",
        isRight ? "items-end text-right" : "items-start text-left",
      ].join(" ")}
    >
      <div
        className={[
          "flex min-w-0 items-center gap-3",
          isRight ? "flex-row-reverse" : "flex-row",
        ].join(" ")}
      >
        <ScoreInput value={value} disabled={disabled} onChange={onChange} />

        <TeamFlag flag={flag} code={code} name={name} />

        <p className="truncate text-base font-black text-slate-950 md:text-xl">
          {name}
        </p>
      </div>
    </div>
  );
}
