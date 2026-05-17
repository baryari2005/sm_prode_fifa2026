"use client";

import type { ReactNode } from "react";

type LoginPageLayoutProps = {
  hero: ReactNode;
  mascot: ReactNode;
  auth: ReactNode;
};

export function LoginPageLayout({ hero, mascot, auth }: LoginPageLayoutProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#04150F] text-white">
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,239,106,0.2),transparent_26%),radial-gradient(circle_at_85%_18%,rgba(247,183,49,0.14),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(57,169,53,0.2),transparent_28%),linear-gradient(135deg,rgba(4,21,15,0.99),rgba(6,24,19,0.97)_38%,rgba(5,18,34,0.95)_68%,rgba(4,21,15,0.99))]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.3)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/6 to-transparent" />
        <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-[0.92fr_1.05fr_0.9fr]">
          {hero}
          {mascot}
          {auth}
        </div>
      </div>
    </main>
  );
}
