import Image from "next/image";

type PlayerJerseyAvatarProps = {
  imageUrl?: string | null;
  teamCode?: string | null;
  teamName: string;
  number?: number | null;
  size?: "sm" | "md";
  className?: string;
};

type JerseyKit = {
  frame: string;
  flag: string;
  shirt: string;
  sleeves: string;
  collar: string;
  badge: string;
  badgeText: string;
  accent: string;
  numberColor: string;
  hair: string;
};

const DEFAULT_KIT: JerseyKit = {
  frame: "from-slate-200 via-white to-slate-300",
  flag: "linear-gradient(180deg, #dbeafe 0%, #f8fafc 52%, #dbeafe 100%)",
  shirt:
    "linear-gradient(90deg, #f8fafc 0 24%, #dbeafe 24% 42%, #f8fafc 42% 58%, #dbeafe 58% 76%, #f8fafc 76% 100%)",
  sleeves:
    "linear-gradient(135deg, #e2e8f0 0%, #f8fafc 48%, #cbd5e1 100%)",
  collar: "#111827",
  badge: "#0f172a",
  badgeText: "#f8fafc",
  accent: "#1d4ed8",
  numberColor: "#0f172a",
  hair: "#3f2a1d",
};

const JERSEY_KITS: Record<string, JerseyKit> = {
  ARG: {
    frame: "from-slate-200 via-white to-slate-300",
    flag: "linear-gradient(180deg, #6cb5f2 0%, #f8fafc 48%, #6cb5f2 100%)",
    shirt:
      "linear-gradient(90deg, #f8fafc 0 18%, #7ec6ff 18% 34%, #f8fafc 34% 50%, #7ec6ff 50% 66%, #f8fafc 66% 82%, #7ec6ff 82% 100%)",
    sleeves:
      "linear-gradient(135deg, #dbeafe 0%, #f8fafc 45%, #bfdbfe 100%)",
    collar: "#111827",
    badge: "#f4c542",
    badgeText: "#1f2937",
    accent: "#0f172a",
    numberColor: "#0f172a",
    hair: "#4a2c1f",
  },
  BRA: {
    frame: "from-yellow-200 via-white to-green-200",
    flag: "linear-gradient(180deg, #1fa24a 0%, #f6d94a 50%, #1f7a38 100%)",
    shirt:
      "linear-gradient(180deg, #f8da49 0%, #f4d03f 100%), radial-gradient(circle at 50% 38%, rgba(35,92,180,0.2), transparent 24%)",
    sleeves:
      "linear-gradient(135deg, #2cb35e 0%, #f4d03f 55%, #1f7a38 100%)",
    collar: "#1f4ea3",
    badge: "#1f4ea3",
    badgeText: "#f8fafc",
    accent: "#1f7a38",
    numberColor: "#1f4ea3",
    hair: "#3b2418",
  },
  FRA: {
    frame: "from-slate-300 via-white to-slate-300",
    flag: "linear-gradient(90deg, #1d4ed8 0%, #f8fafc 50%, #dc2626 100%)",
    shirt:
      "linear-gradient(180deg, #1e40af 0%, #2563eb 100%), linear-gradient(90deg, transparent 0 25%, rgba(255,255,255,0.22) 25% 30%, transparent 30% 70%, rgba(239,68,68,0.18) 70% 75%, transparent 75% 100%)",
    sleeves:
      "linear-gradient(135deg, #1d4ed8 0%, #2563eb 45%, #1e3a8a 100%)",
    collar: "#f8fafc",
    badge: "#f8fafc",
    badgeText: "#1e3a8a",
    accent: "#dc2626",
    numberColor: "#f8fafc",
    hair: "#312016",
  },
  NZL: {
    frame: "from-slate-300 via-white to-slate-300",
    flag: "linear-gradient(180deg, #111827 0%, #1f2937 100%)",
    shirt:
      "linear-gradient(180deg, #111827 0%, #1f2937 100%), linear-gradient(90deg, transparent 0 30%, rgba(248,250,252,0.18) 30% 35%, transparent 35% 65%, rgba(248,250,252,0.12) 65% 70%, transparent 70% 100%)",
    sleeves:
      "linear-gradient(135deg, #111827 0%, #1f2937 55%, #374151 100%)",
    collar: "#f8fafc",
    badge: "#f8fafc",
    badgeText: "#111827",
    accent: "#f8fafc",
    numberColor: "#f8fafc",
    hair: "#2a1b12",
  },
  JOR: {
    frame: "from-slate-300 via-white to-red-200",
    flag: "linear-gradient(180deg, #111827 0%, #f8fafc 38%, #166534 38% 70%, #dc2626 70% 100%)",
    shirt:
      "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%), linear-gradient(90deg, transparent 0 30%, rgba(17,24,39,0.18) 30% 35%, transparent 35% 65%, rgba(22,101,52,0.18) 65% 70%, transparent 70% 100%)",
    sleeves:
      "linear-gradient(135deg, #e5e7eb 0%, #f8fafc 48%, #cbd5e1 100%)",
    collar: "#111827",
    badge: "#dc2626",
    badgeText: "#f8fafc",
    accent: "#166534",
    numberColor: "#111827",
    hair: "#302016",
  },
  POR: {
    frame: "from-emerald-200 via-white to-red-200",
    flag: "linear-gradient(90deg, #166534 0%, #166534 42%, #b91c1c 42%, #b91c1c 100%)",
    shirt:
      "linear-gradient(90deg, #166534 0%, #166534 46%, #b91c1c 46%, #b91c1c 100%)",
    sleeves:
      "linear-gradient(135deg, #166534 0%, #14532d 38%, #b91c1c 38%, #991b1b 100%)",
    collar: "#facc15",
    badge: "#facc15",
    badgeText: "#7f1d1d",
    accent: "#facc15",
    numberColor: "#f8fafc",
    hair: "#25160f",
  },
  PAR: {
    frame: "from-blue-200 via-white to-red-200",
    flag: "linear-gradient(180deg, #dc2626 0%, #f8fafc 50%, #1d4ed8 100%)",
    shirt:
      "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%), linear-gradient(90deg, #dc2626 0 24%, #f8fafc 24% 38%, #1d4ed8 38% 62%, #f8fafc 62% 76%, #dc2626 76% 100%)",
    sleeves:
      "linear-gradient(135deg, #dc2626 0%, #f8fafc 45%, #1d4ed8 100%)",
    collar: "#1d4ed8",
    badge: "#facc15",
    badgeText: "#1d4ed8",
    accent: "#dc2626",
    numberColor: "#111827",
    hair: "#2d1d13",
  },
  MEX: {
    frame: "from-emerald-200 via-white to-red-200",
    flag: "linear-gradient(90deg, #166534 0%, #f8fafc 50%, #b91c1c 100%)",
    shirt:
      "linear-gradient(180deg, #166534 0%, #15803d 100%), linear-gradient(90deg, transparent 0 30%, rgba(255,255,255,0.14) 30% 35%, transparent 35% 65%, rgba(220,38,38,0.16) 65% 70%, transparent 70% 100%)",
    sleeves:
      "linear-gradient(135deg, #166534 0%, #15803d 50%, #14532d 100%)",
    collar: "#b91c1c",
    badge: "#f8fafc",
    badgeText: "#166534",
    accent: "#f8fafc",
    numberColor: "#f8fafc",
    hair: "#2e1d13",
  },
  BEL: {
    frame: "from-slate-300 via-white to-red-200",
    flag: "linear-gradient(90deg, #111827 0%, #facc15 50%, #dc2626 100%)",
    shirt:
      "linear-gradient(180deg, #7f1d1d 0%, #dc2626 100%), linear-gradient(90deg, transparent 0 32%, rgba(248,250,252,0.18) 32% 36%, transparent 36% 64%, rgba(250,204,21,0.16) 64% 68%, transparent 68% 100%)",
    sleeves:
      "linear-gradient(135deg, #7f1d1d 0%, #dc2626 55%, #991b1b 100%)",
    collar: "#111827",
    badge: "#facc15",
    badgeText: "#111827",
    accent: "#111827",
    numberColor: "#f8fafc",
    hair: "#281911",
  },
  AUT: {
    frame: "from-slate-200 via-white to-red-200",
    flag: "linear-gradient(180deg, #dc2626 0%, #f8fafc 50%, #dc2626 100%)",
    shirt:
      "linear-gradient(180deg, #dc2626 0%, #b91c1c 100%), linear-gradient(180deg, transparent 0 43%, rgba(248,250,252,0.85) 43% 57%, transparent 57% 100%)",
    sleeves:
      "linear-gradient(135deg, #dc2626 0%, #b91c1c 55%, #991b1b 100%)",
    collar: "#f8fafc",
    badge: "#f8fafc",
    badgeText: "#dc2626",
    accent: "#f8fafc",
    numberColor: "#f8fafc",
    hair: "#382318",
  },
  JPN: {
    frame: "from-slate-200 via-white to-blue-200",
    flag: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
    shirt:
      "linear-gradient(180deg, #1d4ed8 0%, #2563eb 100%), linear-gradient(90deg, transparent 0 28%, rgba(255,255,255,0.22) 28% 32%, transparent 32% 68%, rgba(37,99,235,0.18) 68% 72%, transparent 72% 100%)",
    sleeves:
      "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #1e3a8a 100%)",
    collar: "#f8fafc",
    badge: "#ef4444",
    badgeText: "#f8fafc",
    accent: "#ef4444",
    numberColor: "#f8fafc",
    hair: "#2b1d15",
  },
  RSA: {
    frame: "from-emerald-200 via-white to-yellow-200",
    flag: "linear-gradient(180deg, #166534 0%, #15803d 100%)",
    shirt:
      "linear-gradient(180deg, #facc15 0%, #eab308 100%), linear-gradient(90deg, #111827 0 20%, #166534 20% 50%, #dc2626 50% 70%, #1d4ed8 70% 100%)",
    sleeves:
      "linear-gradient(135deg, #166534 0%, #facc15 50%, #1d4ed8 100%)",
    collar: "#111827",
    badge: "#dc2626",
    badgeText: "#f8fafc",
    accent: "#166534",
    numberColor: "#111827",
    hair: "#302016",
  },
  CPV: {
    frame: "from-slate-200 via-white to-blue-200",
    flag: "linear-gradient(180deg, #1d4ed8 0%, #2563eb 100%)",
    shirt:
      "linear-gradient(180deg, #1d4ed8 0%, #2563eb 100%), linear-gradient(180deg, transparent 0 42%, rgba(220,38,38,0.85) 42% 48%, rgba(250,204,21,0.85) 48% 54%, rgba(220,38,38,0.85) 54% 60%, transparent 60% 100%)",
    sleeves:
      "linear-gradient(135deg, #1d4ed8 0%, #2563eb 55%, #1e3a8a 100%)",
    collar: "#f8fafc",
    badge: "#facc15",
    badgeText: "#1d4ed8",
    accent: "#dc2626",
    numberColor: "#f8fafc",
    hair: "#2c1d14",
  },
  COL: {
    frame: "from-yellow-200 via-white to-blue-200",
    flag: "linear-gradient(180deg, #facc15 0%, #facc15 52%, #1d4ed8 52% 76%, #dc2626 76% 100%)",
    shirt:
      "linear-gradient(180deg, #facc15 0%, #eab308 100%), linear-gradient(90deg, transparent 0 30%, rgba(29,78,216,0.14) 30% 35%, transparent 35% 65%, rgba(220,38,38,0.14) 65% 70%, transparent 70% 100%)",
    sleeves:
      "linear-gradient(135deg, #facc15 0%, #eab308 55%, #ca8a04 100%)",
    collar: "#1d4ed8",
    badge: "#dc2626",
    badgeText: "#f8fafc",
    accent: "#1d4ed8",
    numberColor: "#1d4ed8",
    hair: "#332015",
  },
  KOR: {
    frame: "from-slate-200 via-white to-red-200",
    flag: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
    shirt:
      "linear-gradient(180deg, #dc2626 0%, #b91c1c 100%), linear-gradient(90deg, transparent 0 33%, rgba(255,255,255,0.16) 33% 38%, transparent 38% 62%, rgba(17,24,39,0.16) 62% 67%, transparent 67% 100%)",
    sleeves:
      "linear-gradient(135deg, #dc2626 0%, #b91c1c 55%, #991b1b 100%)",
    collar: "#111827",
    badge: "#f8fafc",
    badgeText: "#dc2626",
    accent: "#111827",
    numberColor: "#f8fafc",
    hair: "#241811",
  },
  CAN: {
    frame: "from-slate-200 via-white to-red-200",
    flag: "linear-gradient(90deg, #dc2626 0%, #f8fafc 25%, #f8fafc 75%, #dc2626 100%)",
    shirt:
      "linear-gradient(180deg, #dc2626 0%, #b91c1c 100%), linear-gradient(90deg, transparent 0 44%, rgba(255,255,255,0.22) 44% 56%, transparent 56% 100%)",
    sleeves:
      "linear-gradient(135deg, #dc2626 0%, #b91c1c 55%, #991b1b 100%)",
    collar: "#f8fafc",
    badge: "#f8fafc",
    badgeText: "#dc2626",
    accent: "#f8fafc",
    numberColor: "#f8fafc",
    hair: "#2d1d14",
  },
  ALG: {
    frame: "from-emerald-200 via-white to-red-200",
    flag: "linear-gradient(90deg, #166534 0%, #f8fafc 50%, #f8fafc 100%)",
    shirt:
      "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%), linear-gradient(90deg, #166534 0 46%, transparent 46% 100%)",
    sleeves:
      "linear-gradient(135deg, #166534 0%, #f8fafc 48%, #d1d5db 100%)",
    collar: "#dc2626",
    badge: "#dc2626",
    badgeText: "#f8fafc",
    accent: "#166534",
    numberColor: "#111827",
    hair: "#2a1b12",
  },
  SUI: {
    frame: "from-slate-200 via-white to-red-200",
    flag: "linear-gradient(180deg, #dc2626 0%, #b91c1c 100%)",
    shirt:
      "linear-gradient(180deg, #dc2626 0%, #b91c1c 100%), radial-gradient(circle at 50% 45%, rgba(255,255,255,0.95) 0 10%, transparent 11%)",
    sleeves:
      "linear-gradient(135deg, #dc2626 0%, #b91c1c 55%, #991b1b 100%)",
    collar: "#f8fafc",
    badge: "#f8fafc",
    badgeText: "#dc2626",
    accent: "#f8fafc",
    numberColor: "#f8fafc",
    hair: "#3a261c",
  },
  GHA: {
    frame: "from-yellow-200 via-white to-red-200",
    flag: "linear-gradient(180deg, #dc2626 0%, #facc15 50%, #166534 100%)",
    shirt:
      "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%), linear-gradient(180deg, transparent 0 30%, rgba(220,38,38,0.85) 30% 40%, rgba(250,204,21,0.85) 40% 52%, rgba(22,101,52,0.85) 52% 64%, transparent 64% 100%)",
    sleeves:
      "linear-gradient(135deg, #f8fafc 0%, #e5e7eb 50%, #d1d5db 100%)",
    collar: "#111827",
    badge: "#111827",
    badgeText: "#f8fafc",
    accent: "#dc2626",
    numberColor: "#111827",
    hair: "#2b1c13",
  },
  CIV: {
    frame: "from-orange-200 via-white to-emerald-200",
    flag: "linear-gradient(90deg, #ea580c 0%, #f8fafc 50%, #166534 100%)",
    shirt:
      "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%), linear-gradient(90deg, #ea580c 0 33%, #f8fafc 33% 66%, #166534 66% 100%)",
    sleeves:
      "linear-gradient(135deg, #ea580c 0%, #f8fafc 48%, #166534 100%)",
    collar: "#166534",
    badge: "#ea580c",
    badgeText: "#f8fafc",
    accent: "#166534",
    numberColor: "#111827",
    hair: "#2f1d14",
  },
  HAI: {
    frame: "from-blue-200 via-white to-red-200",
    flag: "linear-gradient(180deg, #1d4ed8 0%, #1d4ed8 50%, #dc2626 50% 100%)",
    shirt:
      "linear-gradient(180deg, #1d4ed8 0%, #2563eb 100%), linear-gradient(180deg, transparent 0 48%, rgba(220,38,38,0.24) 48% 100%)",
    sleeves:
      "linear-gradient(135deg, #1d4ed8 0%, #2563eb 48%, #dc2626 100%)",
    collar: "#facc15",
    badge: "#facc15",
    badgeText: "#1d4ed8",
    accent: "#dc2626",
    numberColor: "#f8fafc",
    hair: "#2a1b12",
  },
  QAT: {
    frame: "from-rose-200 via-white to-slate-200",
    flag: "linear-gradient(90deg, #f8fafc 0%, #f8fafc 24%, #7f1d1d 24% 100%)",
    shirt:
      "linear-gradient(180deg, #7f1d1d 0%, #6b1524 100%), linear-gradient(90deg, transparent 0 34%, rgba(255,255,255,0.16) 34% 40%, transparent 40% 100%)",
    sleeves:
      "linear-gradient(135deg, #7f1d1d 0%, #6b1524 55%, #4c1020 100%)",
    collar: "#f8fafc",
    badge: "#f8fafc",
    badgeText: "#7f1d1d",
    accent: "#f8fafc",
    numberColor: "#f8fafc",
    hair: "#281810",
  },
  URU: {
    frame: "from-sky-200 via-white to-slate-200",
    flag: "linear-gradient(180deg, #f8fafc 0%, #dbeafe 100%)",
    shirt:
      "linear-gradient(90deg, #f8fafc 0 15%, #7dd3fc 15% 28%, #f8fafc 28% 42%, #7dd3fc 42% 56%, #f8fafc 56% 70%, #7dd3fc 70% 84%, #f8fafc 84% 100%)",
    sleeves:
      "linear-gradient(135deg, #e0f2fe 0%, #f8fafc 50%, #bae6fd 100%)",
    collar: "#111827",
    badge: "#facc15",
    badgeText: "#0f172a",
    accent: "#0ea5e9",
    numberColor: "#111827",
    hair: "#3a251a",
  },
  CRO: {
    frame: "from-slate-200 via-white to-red-200",
    flag: "linear-gradient(180deg, #dc2626 0%, #f8fafc 50%, #1d4ed8 100%)",
    shirt:
      "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%), linear-gradient(45deg, rgba(220,38,38,0.95) 0 12.5%, transparent 12.5% 25%, rgba(220,38,38,0.95) 25% 37.5%, transparent 37.5% 50%, rgba(220,38,38,0.95) 50% 62.5%, transparent 62.5% 75%, rgba(220,38,38,0.95) 75% 87.5%, transparent 87.5% 100%), linear-gradient(-45deg, rgba(220,38,38,0.95) 0 12.5%, transparent 12.5% 25%, rgba(220,38,38,0.95) 25% 37.5%, transparent 37.5% 50%, rgba(220,38,38,0.95) 50% 62.5%, transparent 62.5% 75%, rgba(220,38,38,0.95) 75% 87.5%, transparent 87.5% 100%)",
    sleeves:
      "linear-gradient(135deg, #e5e7eb 0%, #f8fafc 45%, #d1d5db 100%)",
    collar: "#1d4ed8",
    badge: "#1d4ed8",
    badgeText: "#f8fafc",
    accent: "#dc2626",
    numberColor: "#111827",
    hair: "#3b2418",
  },
  MAR: {
    frame: "from-emerald-200 via-white to-red-200",
    flag: "linear-gradient(180deg, #dc2626 0%, #b91c1c 100%)",
    shirt:
      "linear-gradient(180deg, #dc2626 0%, #b91c1c 100%), linear-gradient(90deg, transparent 0 48%, rgba(22,101,52,0.28) 48% 52%, transparent 52% 100%)",
    sleeves:
      "linear-gradient(135deg, #dc2626 0%, #b91c1c 55%, #991b1b 100%)",
    collar: "#166534",
    badge: "#166534",
    badgeText: "#f8fafc",
    accent: "#166534",
    numberColor: "#f8fafc",
    hair: "#2c1b12",
  },
  NED: {
    frame: "from-orange-200 via-white to-sky-200",
    flag: "linear-gradient(180deg, #ea580c 0%, #f8fafc 50%, #2563eb 100%)",
    shirt:
      "linear-gradient(180deg, #fb923c 0%, #ea580c 100%), linear-gradient(90deg, transparent 0 30%, rgba(255,255,255,0.18) 30% 35%, transparent 35% 65%, rgba(37,99,235,0.12) 65% 70%, transparent 70% 100%)",
    sleeves:
      "linear-gradient(135deg, #fb923c 0%, #ea580c 55%, #c2410c 100%)",
    collar: "#f8fafc",
    badge: "#2563eb",
    badgeText: "#f8fafc",
    accent: "#2563eb",
    numberColor: "#f8fafc",
    hair: "#44291f",
  },
  IRQ: {
    frame: "from-slate-300 via-white to-emerald-200",
    flag: "linear-gradient(180deg, #dc2626 0%, #f8fafc 50%, #111827 100%)",
    shirt:
      "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%), linear-gradient(180deg, transparent 0 42%, rgba(22,101,52,0.22) 42% 58%, transparent 58% 100%)",
    sleeves:
      "linear-gradient(135deg, #e5e7eb 0%, #f8fafc 48%, #d1d5db 100%)",
    collar: "#166534",
    badge: "#166534",
    badgeText: "#f8fafc",
    accent: "#dc2626",
    numberColor: "#111827",
    hair: "#2b1b13",
  },
  ENG: {
    frame: "from-slate-300 via-white to-red-200",
    flag: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
    shirt:
      "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%), linear-gradient(90deg, transparent 0 47%, rgba(220,38,38,0.24) 47% 53%, transparent 53% 100%)",
    sleeves:
      "linear-gradient(135deg, #e5e7eb 0%, #f8fafc 45%, #d1d5db 100%)",
    collar: "#1d4ed8",
    badge: "#dc2626",
    badgeText: "#f8fafc",
    accent: "#dc2626",
    numberColor: "#111827",
    hair: "#3c2519",
  },
  COD: {
    frame: "from-sky-200 via-white to-red-200",
    flag: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
    shirt:
      "linear-gradient(180deg, #38bdf8 0%, #0ea5e9 100%), linear-gradient(45deg, transparent 0 34%, rgba(250,204,21,0.95) 34% 42%, rgba(220,38,38,0.95) 42% 48%, transparent 48% 100%)",
    sleeves:
      "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 55%, #0284c7 100%)",
    collar: "#facc15",
    badge: "#dc2626",
    badgeText: "#f8fafc",
    accent: "#facc15",
    numberColor: "#f8fafc",
    hair: "#2f1d14",
  },
  TUR: {
    frame: "from-slate-200 via-white to-red-200",
    flag: "linear-gradient(180deg, #dc2626 0%, #b91c1c 100%)",
    shirt:
      "linear-gradient(180deg, #dc2626 0%, #b91c1c 100%), radial-gradient(circle at 43% 46%, rgba(248,250,252,0.95) 0 9%, transparent 9.5%), radial-gradient(circle at 46% 46%, rgba(185,28,28,1) 0 6%, transparent 6.5%)",
    sleeves:
      "linear-gradient(135deg, #dc2626 0%, #b91c1c 55%, #991b1b 100%)",
    collar: "#f8fafc",
    badge: "#f8fafc",
    badgeText: "#dc2626",
    accent: "#f8fafc",
    numberColor: "#f8fafc",
    hair: "#2e1c13",
  },
  CUR: {
    frame: "from-yellow-200 via-white to-blue-200",
    flag: "linear-gradient(180deg, #1d4ed8 0%, #2563eb 100%)",
    shirt:
      "linear-gradient(180deg, #1d4ed8 0%, #2563eb 100%), linear-gradient(180deg, transparent 0 58%, rgba(250,204,21,0.9) 58% 66%, transparent 66% 100%)",
    sleeves:
      "linear-gradient(135deg, #1d4ed8 0%, #2563eb 55%, #1e3a8a 100%)",
    collar: "#facc15",
    badge: "#f8fafc",
    badgeText: "#1d4ed8",
    accent: "#facc15",
    numberColor: "#f8fafc",
    hair: "#2c1d14",
  },
  CZE: {
    frame: "from-blue-200 via-white to-red-200",
    flag: "linear-gradient(180deg, #f8fafc 0%, #f8fafc 50%, #dc2626 50% 100%)",
    shirt:
      "linear-gradient(180deg, #dc2626 0%, #b91c1c 100%), linear-gradient(45deg, #1d4ed8 0 24%, transparent 24% 100%)",
    sleeves:
      "linear-gradient(135deg, #1d4ed8 0%, #dc2626 48%, #b91c1c 100%)",
    collar: "#f8fafc",
    badge: "#f8fafc",
    badgeText: "#1d4ed8",
    accent: "#1d4ed8",
    numberColor: "#f8fafc",
    hair: "#2f1e15",
  },
  ESP: {
    frame: "from-amber-200 via-white to-red-200",
    flag: "linear-gradient(180deg, #b91c1c 0%, #facc15 30%, #facc15 70%, #b91c1c 100%)",
    shirt:
      "linear-gradient(180deg, #c81e1e 0%, #b91c1c 100%), linear-gradient(90deg, transparent 0 30%, rgba(250,204,21,0.3) 30% 70%, transparent 70% 100%)",
    sleeves:
      "linear-gradient(135deg, #7f1d1d 0%, #dc2626 45%, #991b1b 100%)",
    collar: "#facc15",
    badge: "#facc15",
    badgeText: "#7f1d1d",
    accent: "#facc15",
    numberColor: "#f8fafc",
    hair: "#2f1b12",
  },
  IRN: {
    frame: "from-emerald-200 via-white to-red-200",
    flag: "linear-gradient(180deg, #166534 0%, #f8fafc 50%, #dc2626 100%)",
    shirt:
      "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%), linear-gradient(180deg, transparent 0 28%, rgba(22,101,52,0.85) 28% 40%, transparent 40% 60%, rgba(220,38,38,0.85) 60% 72%, transparent 72% 100%)",
    sleeves:
      "linear-gradient(135deg, #166534 0%, #f8fafc 48%, #dc2626 100%)",
    collar: "#dc2626",
    badge: "#166534",
    badgeText: "#f8fafc",
    accent: "#166534",
    numberColor: "#111827",
    hair: "#2d1d14",
  },
  USA: {
    frame: "from-slate-200 via-white to-red-200",
    flag: "linear-gradient(180deg, #1d4ed8 0%, #f8fafc 32%, #dc2626 32% 44%, #f8fafc 44% 56%, #dc2626 56% 68%, #f8fafc 68% 80%, #dc2626 80% 100%)",
    shirt:
      "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%), linear-gradient(90deg, #1d4ed8 0 28%, transparent 28% 100%), repeating-linear-gradient(180deg, transparent 0 8%, rgba(220,38,38,0.22) 8% 12%)",
    sleeves:
      "linear-gradient(135deg, #e5e7eb 0%, #f8fafc 48%, #cbd5e1 100%)",
    collar: "#1d4ed8",
    badge: "#dc2626",
    badgeText: "#f8fafc",
    accent: "#dc2626",
    numberColor: "#111827",
    hair: "#3b2418",
  },
  ECU: {
    frame: "from-yellow-200 via-white to-blue-200",
    flag: "linear-gradient(180deg, #facc15 0%, #facc15 50%, #1d4ed8 50% 76%, #dc2626 76% 100%)",
    shirt:
      "linear-gradient(180deg, #facc15 0%, #eab308 100%), linear-gradient(90deg, transparent 0 33%, rgba(29,78,216,0.14) 33% 38%, transparent 38% 62%, rgba(220,38,38,0.14) 62% 67%, transparent 67% 100%)",
    sleeves:
      "linear-gradient(135deg, #facc15 0%, #eab308 55%, #ca8a04 100%)",
    collar: "#1d4ed8",
    badge: "#dc2626",
    badgeText: "#f8fafc",
    accent: "#1d4ed8",
    numberColor: "#1d4ed8",
    hair: "#352116",
  },
  AUS: {
    frame: "from-yellow-200 via-white to-blue-200",
    flag: "linear-gradient(180deg, #166534 0%, #15803d 100%)",
    shirt:
      "linear-gradient(180deg, #facc15 0%, #eab308 100%), linear-gradient(90deg, transparent 0 30%, rgba(22,101,52,0.18) 30% 35%, transparent 35% 65%, rgba(29,78,216,0.12) 65% 70%, transparent 70% 100%)",
    sleeves:
      "linear-gradient(135deg, #facc15 0%, #eab308 55%, #ca8a04 100%)",
    collar: "#166534",
    badge: "#166534",
    badgeText: "#facc15",
    accent: "#1d4ed8",
    numberColor: "#166534",
    hair: "#332116",
  },
  SWE: {
    frame: "from-yellow-200 via-white to-blue-200",
    flag: "linear-gradient(180deg, #1d4ed8 0%, #2563eb 100%)",
    shirt:
      "linear-gradient(180deg, #facc15 0%, #eab308 100%), linear-gradient(90deg, transparent 0 30%, rgba(29,78,216,0.85) 30% 36%, transparent 36% 64%, rgba(29,78,216,0.85) 64% 70%, transparent 70% 100%)",
    sleeves:
      "linear-gradient(135deg, #facc15 0%, #eab308 55%, #ca8a04 100%)",
    collar: "#1d4ed8",
    badge: "#1d4ed8",
    badgeText: "#facc15",
    accent: "#1d4ed8",
    numberColor: "#1d4ed8",
    hair: "#342116",
  },
  SEN: {
    frame: "from-emerald-200 via-white to-yellow-200",
    flag: "linear-gradient(90deg, #166534 0%, #f8fafc 50%, #facc15 100%)",
    shirt:
      "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%), linear-gradient(90deg, #166534 0 33%, #f8fafc 33% 66%, #facc15 66% 100%)",
    sleeves:
      "linear-gradient(135deg, #166534 0%, #f8fafc 48%, #facc15 100%)",
    collar: "#166534",
    badge: "#facc15",
    badgeText: "#166534",
    accent: "#dc2626",
    numberColor: "#111827",
    hair: "#2b1b13",
  },
  PAN: {
    frame: "from-blue-200 via-white to-red-200",
    flag: "linear-gradient(180deg, #f8fafc 0%, #f8fafc 50%, #dc2626 50% 100%)",
    shirt:
      "linear-gradient(180deg, #dc2626 0%, #b91c1c 100%), linear-gradient(45deg, #1d4ed8 0 22%, transparent 22% 100%), radial-gradient(circle at 72% 32%, rgba(248,250,252,0.95) 0 6%, transparent 6.5%)",
    sleeves:
      "linear-gradient(135deg, #1d4ed8 0%, #f8fafc 45%, #dc2626 100%)",
    collar: "#f8fafc",
    badge: "#1d4ed8",
    badgeText: "#f8fafc",
    accent: "#dc2626",
    numberColor: "#f8fafc",
    hair: "#2c1c13",
  },
  SCO: {
    frame: "from-slate-200 via-white to-blue-200",
    flag: "linear-gradient(180deg, #1d4ed8 0%, #2563eb 100%)",
    shirt:
      "linear-gradient(180deg, #1d4ed8 0%, #2563eb 100%), linear-gradient(45deg, transparent 0 44%, rgba(248,250,252,0.9) 44% 50%, transparent 50% 100%), linear-gradient(-45deg, transparent 0 44%, rgba(248,250,252,0.9) 44% 50%, transparent 50% 100%)",
    sleeves:
      "linear-gradient(135deg, #1d4ed8 0%, #2563eb 55%, #1e3a8a 100%)",
    collar: "#f8fafc",
    badge: "#f8fafc",
    badgeText: "#1d4ed8",
    accent: "#f8fafc",
    numberColor: "#f8fafc",
    hair: "#332116",
  },
  GER: {
    frame: "from-slate-300 via-white to-slate-300",
    flag: "linear-gradient(180deg, #111827 0%, #dc2626 52%, #f59e0b 100%)",
    shirt:
      "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%), linear-gradient(90deg, transparent 0 30%, #111827 30% 35%, transparent 35% 65%, #111827 65% 70%, transparent 70% 100%)",
    sleeves:
      "linear-gradient(135deg, #e5e7eb 0%, #f8fafc 45%, #d1d5db 100%)",
    collar: "#111827",
    badge: "#111827",
    badgeText: "#f8fafc",
    accent: "#dc2626",
    numberColor: "#111827",
    hair: "#2b211a",
  },
  TUN: {
    frame: "from-slate-200 via-white to-red-200",
    flag: "linear-gradient(180deg, #dc2626 0%, #b91c1c 100%)",
    shirt:
      "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%), radial-gradient(circle at 50% 45%, rgba(220,38,38,0.92) 0 12%, transparent 12.5%)",
    sleeves:
      "linear-gradient(135deg, #f8fafc 0%, #eef2f7 48%, #d1d5db 100%)",
    collar: "#dc2626",
    badge: "#dc2626",
    badgeText: "#f8fafc",
    accent: "#dc2626",
    numberColor: "#111827",
    hair: "#2d1c13",
  },
  EGY: {
    frame: "from-slate-300 via-white to-red-200",
    flag: "linear-gradient(180deg, #dc2626 0%, #f8fafc 50%, #111827 100%)",
    shirt:
      "linear-gradient(180deg, #dc2626 0%, #b91c1c 100%), linear-gradient(180deg, transparent 0 45%, rgba(248,250,252,0.18) 45% 55%, transparent 55% 100%)",
    sleeves:
      "linear-gradient(135deg, #dc2626 0%, #b91c1c 55%, #991b1b 100%)",
    collar: "#111827",
    badge: "#facc15",
    badgeText: "#111827",
    accent: "#facc15",
    numberColor: "#f8fafc",
    hair: "#2d1c13",
  },
  UZB: {
    frame: "from-sky-200 via-white to-emerald-200",
    flag: "linear-gradient(180deg, #38bdf8 0%, #f8fafc 40%, #dc2626 40% 46%, #f8fafc 46% 78%, #166534 78% 100%)",
    shirt:
      "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%), linear-gradient(90deg, transparent 0 30%, rgba(56,189,248,0.2) 30% 35%, transparent 35% 65%, rgba(22,101,52,0.18) 65% 70%, transparent 70% 100%)",
    sleeves:
      "linear-gradient(135deg, #f8fafc 0%, #38bdf8 48%, #166534 100%)",
    collar: "#38bdf8",
    badge: "#facc15",
    badgeText: "#166534",
    accent: "#dc2626",
    numberColor: "#111827",
    hair: "#2b1b13",
  },
  NOR: {
    frame: "from-blue-200 via-white to-red-200",
    flag: "linear-gradient(180deg, #dc2626 0%, #b91c1c 100%)",
    shirt:
      "linear-gradient(180deg, #dc2626 0%, #b91c1c 100%), linear-gradient(90deg, transparent 0 28%, rgba(248,250,252,0.92) 28% 34%, rgba(29,78,216,0.9) 34% 40%, transparent 40% 100%), linear-gradient(180deg, transparent 0 42%, rgba(248,250,252,0.92) 42% 50%, rgba(29,78,216,0.9) 50% 58%, transparent 58% 100%)",
    sleeves:
      "linear-gradient(135deg, #dc2626 0%, #b91c1c 55%, #991b1b 100%)",
    collar: "#f8fafc",
    badge: "#1d4ed8",
    badgeText: "#f8fafc",
    accent: "#1d4ed8",
    numberColor: "#f8fafc",
    hair: "#342218",
  },
  BIH: {
    frame: "from-yellow-200 via-white to-blue-200",
    flag: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 68%, #facc15 68% 100%)",
    shirt:
      "linear-gradient(180deg, #1d4ed8 0%, #2563eb 100%), linear-gradient(45deg, transparent 0 62%, rgba(250,204,21,0.92) 62% 100%)",
    sleeves:
      "linear-gradient(135deg, #1d4ed8 0%, #2563eb 55%, #1e3a8a 100%)",
    collar: "#facc15",
    badge: "#f8fafc",
    badgeText: "#1d4ed8",
    accent: "#facc15",
    numberColor: "#f8fafc",
    hair: "#2d1d14",
  },
  KSA: {
    frame: "from-emerald-200 via-white to-slate-200",
    flag: "linear-gradient(180deg, #166534 0%, #15803d 100%)",
    shirt:
      "linear-gradient(180deg, #166534 0%, #15803d 100%), linear-gradient(180deg, transparent 0 46%, rgba(248,250,252,0.16) 46% 54%, transparent 54% 100%)",
    sleeves:
      "linear-gradient(135deg, #166534 0%, #15803d 55%, #14532d 100%)",
    collar: "#f8fafc",
    badge: "#f8fafc",
    badgeText: "#166534",
    accent: "#f8fafc",
    numberColor: "#f8fafc",
    hair: "#2a1a12",
  },
};

const CODE_ALIASES: Record<string, string> = {
  JAP: "JPN",
  NZL: "NZL",
};

function getKit(teamCode?: string | null) {
  if (!teamCode) return DEFAULT_KIT;

  const normalized = CODE_ALIASES[teamCode.toUpperCase()] ?? teamCode.toUpperCase();
  return JERSEY_KITS[normalized] ?? DEFAULT_KIT;
}

export function PlayerJerseyAvatar({
  imageUrl,
  teamCode,
  teamName,
  number,
  size = "md",
  className,
}: PlayerJerseyAvatarProps) {
  const kit = getKit(teamCode);
  const wrapperSize =
    size === "sm" ? "h-8 w-8 rounded-[0.95rem]" : "h-11 w-11 rounded-[1.15rem]";
  const imageDimensions = size === "sm" ? 32 : 48;
  const innerPadding = size === "sm" ? "inset-[2px]" : "inset-[2.5px]";
  const flagInset = size === "sm" ? "inset-[3px]" : "inset-[4px]";
  const faceSize = size === "sm" ? "h-[28%] w-[30%]" : "h-[30%] w-[32%]";
  const hairSize = size === "sm" ? "h-[13%] w-[33%]" : "h-[14%] w-[35%]";
  const badgeText =
    teamCode?.slice(0, 3).toUpperCase() ?? teamName.slice(0, 3).toUpperCase();

  return (
    <div
      className={`relative shrink-0 overflow-hidden border border-white/80 bg-gradient-to-b ${kit.frame} ${wrapperSize} ${className ?? ""}`}
      aria-label={`Avatar de ${teamName}${number ? ` con camiseta ${number}` : ""}`}
    >
      <div className={`absolute ${innerPadding} rounded-[inherit] bg-white/95`} />
      <div className={`absolute ${flagInset} overflow-hidden rounded-[inherit]`}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={teamName}
            width={imageDimensions}
            height={imageDimensions}
            unoptimized
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            <div className="absolute inset-0" style={{ background: kit.flag }} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent_45%),linear-gradient(180deg,transparent_0%,rgba(15,23,42,0.06)_100%)]" />

            <div
              className={`absolute left-1/2 top-[12%] -translate-x-1/2 rounded-full ${hairSize}`}
              style={{ background: kit.hair }}
            />
            <div
              className={`absolute left-1/2 top-[16%] -translate-x-1/2 rounded-[999px] ${faceSize}`}
              style={{
                background:
                  "linear-gradient(180deg, #f7c8a2 0%, #efb287 60%, #e4a078 100%)",
              }}
            />
            <div
              className="absolute left-1/2 top-[39%] h-[10%] w-[10%] -translate-x-1/2 rounded-b-xl"
              style={{ background: "#efb287" }}
            />

            <div
              className="absolute bottom-0 left-1/2 h-[49%] w-[84%] -translate-x-1/2 rounded-t-[38%]"
              style={{ background: kit.shirt }}
            />
            <div
              className="absolute bottom-[12%] left-[2%] h-[28%] w-[30%] rounded-tr-[70%]"
              style={{ background: kit.sleeves }}
            />
            <div
              className="absolute bottom-[12%] right-[2%] h-[28%] w-[30%] rounded-tl-[70%]"
              style={{ background: kit.sleeves }}
            />
            <div
              className="absolute left-1/2 top-[43%] h-[8%] w-[26%] -translate-x-1/2 rounded-b-[999px]"
              style={{ background: kit.collar }}
            />
            <div
              className="absolute right-[19%] top-[54%] flex h-[13%] w-[13%] items-center justify-center rounded-full text-[6px] font-black"
              style={{ background: kit.badge, color: kit.badgeText }}
            >
              {badgeText[0]}
            </div>
            <div
              className="absolute bottom-[7%] left-1/2 -translate-x-1/2 text-[10px] font-black leading-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.35)]"
              style={{ color: kit.numberColor }}
            >
              {number ?? ""}
            </div>
            <div
              className="absolute left-1/2 top-[41.5%] h-[2px] w-[34%] -translate-x-1/2 rounded-full opacity-90"
              style={{ background: kit.accent }}
            />
          </>
        )}
      </div>
    </div>
  );
}
