"use client";

import { Suspense, useEffect, useState } from "react";
import type { CSSProperties, Dispatch, ReactNode, SetStateAction } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

import { BrandPatternBackground } from "@/components/brand/BrandPatternBackground";
import { GoalCelebrationOverlay } from "@/components/goal-celebration-overlay";
import { Sidebar } from "@/components/layout/dashboard-sidebar/Sidebar";
import { Topbar } from "@/components/layout/dashboard-topbar/Topbar";
import { brandImages } from "@/config/brand-images";
import { IdleLogoutModal } from "@/features/auth/components/IdleLogoutModal";
import { MustChangePasswordGate } from "@/features/auth/components/MustChangePasswordGate";
import { RequireAuth } from "@/features/auth/components/RequireAuth";
import { useIdleLogout } from "@/features/auth/hooks/useIdleLogout";
import DashboardLoading from "@/features/dashboard/components/loading/DashboardLoading";

type Props = {
  children: ReactNode;
};

type DashboardLayoutStyle = CSSProperties & {
  "--sidebar-w": string;
  "--topbar-h": string;
  "--content-pad": string;
};

type DashboardChromeProps = {
  children: ReactNode;
  collapsed: boolean;
  mobileSidebarOpen: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  setMobileSidebarOpen: Dispatch<SetStateAction<boolean>>;
  layoutStyle: DashboardLayoutStyle;
};

function DashboardChrome({
  children,
  collapsed,
  mobileSidebarOpen,
  setCollapsed,
  setMobileSidebarOpen,
  layoutStyle,
}: DashboardChromeProps) {
  const sidebarFallback = (
    <div className="h-dvh min-h-dvh w-full border-r border-white/10 bg-[linear-gradient(180deg,#061B33_0%,#071A2F_100%)]" />
  );

  return (
    <div
      className="relative min-h-dvh overflow-x-hidden bg-[#1E2C46] text-slate-950 transition-all duration-300"
      style={layoutStyle}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <BrandPatternBackground
          variant="cover"
          className="opacity-[0.96]"
          overlayClassName="bg-[radial-gradient(circle_at_top_left,rgba(89,147,182,0.16),transparent_24%),radial-gradient(circle_at_83%_18%,rgba(250,180,56,0.12),transparent_18%),linear-gradient(90deg,rgba(30,44,70,0.9)_0%,rgba(30,44,70,0.58)_22%,rgba(30,44,70,0.28)_48%,rgba(30,44,70,0.58)_76%,rgba(30,44,70,0.9)_100%)]"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(174,235,255,0.1),transparent_34%)]" />

        <div className="absolute left-[4%] top-[65%] h-[34%] w-[20%] opacity-[0.08]">
          <Image
            src={brandImages.institucional.masSanMiguelLogo}
            alt=""
            fill
            priority
            aria-hidden="true"
            className="object-contain"
          />
        </div>

        <div className="absolute right-[-6%] top-[-10%] h-[48%] w-[30%] opacity-[0.08]">
          <Image
            src={brandImages.institucional.solArgentino}
            alt=""
            fill
            priority
            aria-hidden="true"
            className="object-contain"
          />
        </div>

        <div className="pointer-events-none absolute bottom-[-12%] left-[10%] h-[28rem] w-[28rem] rounded-full bg-sky-300/8 blur-[160px]" />
        <div className="pointer-events-none absolute right-[8%] top-[10%] h-[20rem] w-[20rem] rounded-full bg-[#FAB438]/10 blur-[140px]" />
      </div>

      <GoalCelebrationOverlay />

      <aside
        className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block"
        style={{ width: "var(--sidebar-w)" }}
      >
        <Suspense fallback={sidebarFallback}>
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </Suspense>
      </aside>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />

          <aside className="relative h-dvh w-[264px] max-w-[84vw] shadow-2xl shadow-black/40">
            <Suspense fallback={sidebarFallback}>
              <Sidebar collapsed={false} setCollapsed={setCollapsed} />
            </Suspense>

            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </aside>
        </div>
      )}

      <div className="relative z-10 min-h-dvh transition-[padding] duration-300 lg:pl-[var(--sidebar-w)]">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#1E2C46]/72 backdrop-blur-xl supports-[backdrop-filter]:bg-[#1E2C46]/64">
          <div className="flex h-[var(--topbar-h)] items-center">
            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setMobileSidebarOpen(true)}
              className="ml-3 mr-1 grid h-9 w-9 place-items-center rounded-2xl border border-white/14 bg-white/8 text-white shadow-sm transition hover:bg-white/14 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0 flex-1">
              <Topbar />
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100dvh-var(--topbar-h))] min-w-0 overflow-x-hidden transition-all duration-300">
          <div className="p-[var(--content-pad)]">
            <div className="mx-auto w-full max-w-[1720px] overflow-x-hidden">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardRootLayout({ children }: Props) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sidebar-collapsed") === "true";
  });

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    if (!mobileSidebarOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileSidebarOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) return;

    if (window.innerWidth < 1440) {
      setCollapsed(true);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const idle = useIdleLogout(logout);

  const layoutStyle: DashboardLayoutStyle = {
    "--sidebar-w": collapsed ? "76px" : "220px",
    "--topbar-h": "72px",
    "--content-pad": "clamp(12px, 1.6vw, 22px)",
  };

  const renderChrome = (content: ReactNode) => (
    <DashboardChrome
      collapsed={collapsed}
      mobileSidebarOpen={mobileSidebarOpen}
      setCollapsed={setCollapsed}
      setMobileSidebarOpen={setMobileSidebarOpen}
      layoutStyle={layoutStyle}
    >
      {content}
    </DashboardChrome>
  );

  return (
    <RequireAuth
      fallback={renderChrome(
        <DashboardLoading
          badgeLabel="Cargando dashboard..."
          source="Auth require auth"
        />,
      )}
    >
      <MustChangePasswordGate>
        {renderChrome(children)}

        <IdleLogoutModal
          open={idle.showModal}
          seconds={idle.seconds}
          onContinue={idle.continueSession}
          onLogout={idle.logoutNow}
        />
      </MustChangePasswordGate>
    </RequireAuth>
  );
}
