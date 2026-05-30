"use client";

export type LineupTabValue = "cancha" | "titulares" | "suplentes";

type LineupTabsProps = {
  activeTab: LineupTabValue;
  titularesCount: number;
  suplentesCount: number;
  onTabChange: (tab: LineupTabValue) => void;
};

export function LineupTabs({
  activeTab,
  titularesCount,
  suplentesCount,
  onTabChange,
}: LineupTabsProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="grid grid-cols-3 gap-1.5">
        <TabButton
          label="Cancha"
          count={titularesCount}
          active={activeTab === "cancha"}
          onClick={() => onTabChange("cancha")}
        />

        <TabButton
          label="Titulares"
          count={titularesCount}
          active={activeTab === "titulares"}
          onClick={() => onTabChange("titulares")}
        />

        <TabButton
          label="Suplentes"
          count={suplentesCount}
          active={activeTab === "suplentes"}
          onClick={() => onTabChange("suplentes")}
        />
      </div>
    </div>
  );
}

function TabButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-0 items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-sm font-bold transition ${
        active
          ? "bg-[#5993B6] text-white shadow-sm"
          : "bg-white/[0.08] text-white/72 hover:bg-white/[0.12] hover:text-white"
      }`}
    >
      <span className="truncate">{label}</span>
      <span
        className={`rounded-full px-2 py-0.5 text-xs ${
          active ? "bg-white/20 text-white" : "bg-white/10 text-white/72"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
