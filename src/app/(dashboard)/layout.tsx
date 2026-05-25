"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Menu, X } from "lucide-react";

import { GoalCelebrationOverlay } from "@/components/goal-celebration-overlay";
import { Sidebar } from "@/components/layout/dashboard-sidebar/Sidebar";
import { Topbar } from "@/components/layout/dashboard-topbar/Topbar";
import { IdleLogoutModal } from "@/features/auth/components/IdleLogoutModal";
import { MustChangePasswordGate } from "@/features/auth/components/MustChangePasswordGate";
import { RequireAuth } from "@/features/auth/components/RequireAuth";
import { useIdleLogout } from "@/features/auth/hooks/useIdleLogout";

type Props = {
  children: ReactNode;
};

type DashboardLayoutStyle = CSSProperties & {
  "--sidebar-w": string;
  "--topbar-h": string;
  "--content-pad": string;
};

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

  return (
    <RequireAuth>
      <MustChangePasswordGate>
        <div
          className="min-h-dvh overflow-x-hidden bg-[#EEF3F0] text-slate-950 transition-all duration-300"
          style={layoutStyle}
        >
          <GoalCelebrationOverlay />

          <aside
            className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block"
            style={{ width: "var(--sidebar-w)" }}
          >
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
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
                <Sidebar collapsed={false} setCollapsed={setCollapsed} />

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

          <div className="min-h-dvh transition-[padding] duration-300 lg:pl-[var(--sidebar-w)]">
            <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
              <div className="flex h-[var(--topbar-h)] items-center">
                <button
                  type="button"
                  aria-label="Abrir menú"
                  onClick={() => setMobileSidebarOpen(true)}
                  className="ml-3 mr-1 grid h-9 w-9 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
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
