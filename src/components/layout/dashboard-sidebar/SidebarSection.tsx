"use client";

type Props = {
  label: string;
  collapsed?: boolean;
};

export function SidebarSection({ label, collapsed }: Props) {
  if (collapsed) return null;

  return (
    <div className="mb-2 mt-4 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/38 transition-opacity duration-200">
      {label}
    </div>
  );
}
