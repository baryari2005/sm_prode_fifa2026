import {
  ArrowDown,
  ArrowUp,
  Bandage,
  Ban,
  CircleDot,
  Goal,
} from "lucide-react";

const LEGEND_ITEMS = [
  {
    label: "Gol",
    icon: <CircleDot className="h-4 w-4 text-[#AEEBFF]" />,
  },
  {
    label: "Gol en contra",
    icon: <Goal className="h-4 w-4 text-red-500" />,
  },
  {
    label: "Tarjeta amarilla",
    icon: <span className="h-4 w-3 rounded-[2px] bg-yellow-400" />,
  },
  {
    label: "Tarjeta roja",
    icon: <span className="h-4 w-3 rounded-[2px] bg-red-500" />,
  },
  {
    label: "Entra",
    icon: (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/16 text-emerald-200">
        <ArrowUp className="h-3 w-3" />
      </span>
    ),
  },
  {
    label: "Sale",
    icon: (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-400/16 text-rose-200">
        <ArrowDown className="h-3 w-3" />
      </span>
    ),
  },
  {
    label: "Con lesión",
    icon: <Bandage className="h-4 w-4 text-red-500" />,
  },
  {
    label: "Con suspensión",
    icon: <Ban className="h-4 w-4 text-red-500" />,
  },
];

export function LineupLegendCard() {
  return (
    <div className="w-full max-w-none rounded-3xl border border-white/10 bg-[#0E1D30]/72 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <p className="mb-3 ml-2 text-xs font-bold uppercase tracking-[0.22em] text-[#AEEBFF]">
        Referencias
      </p>

      <div className="ml-2 grid grid-cols-2 gap-3 text-xs font-medium text-white/68 md:grid-cols-4">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center">
              {item.icon}
            </span>
            <span className="text-white/78">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
