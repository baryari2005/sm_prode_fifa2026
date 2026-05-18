"use client";

type ScoreInputProps = {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
};

export function ScoreInput({ value, disabled, onChange }: ScoreInputProps) {
  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      disabled={disabled}
      onFocus={(event) => event.currentTarget.select()}
      onChange={(event) => onChange(event.target.value)}
      className="h-8 w-10 rounded-xl border border-slate-200 bg-white text-center text-lg font-black text-slate-950 shadow-sm outline-none transition focus:border-[#008C93] focus:ring-4 focus:ring-[#008C93]/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 md:h-10 md:w-12 md:text-xl"
      placeholder="0"
    />
  );
}
