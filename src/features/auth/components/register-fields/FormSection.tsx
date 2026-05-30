import type { ReactNode } from "react";

type Props = {
  title?: string | null;
  children: ReactNode;
};

export function FormSection({ title, children }: Props) {
  return (
    <div className="space-y-4 first:pt-0">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#AEEBFF]">
        {title}
      </p>

      {children}
    </div>
  );
}
