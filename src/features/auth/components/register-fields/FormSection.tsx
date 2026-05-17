import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export function FormSection({ title, children }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-white/40">
        {title}
      </p>

      {children}
    </div>
  );
}