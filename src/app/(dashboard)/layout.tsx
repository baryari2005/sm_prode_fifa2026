"use client";

import { useEffect, useState } from "react";
import type { ReactNode, CSSProperties } from "react";
import { Menu, X } from "lucide-react";

import { RequireAuth } from "@/features/auth/components/RequireAuth";
import { MustChangePasswordGate } from "@/features/auth/components/MustChangePasswordGate";
import { useIdleLogout } from "@/features/auth/hooks/useIdleLogout";
import { IdleLogoutModal } from "@/features/auth/components/IdleLogoutModal";
import { Sidebar } from "@/components/layout/dashboard-sidebar/Sidebar";
import { Topbar } from "@/components/layout/dashboard-topbar/Topbar";

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

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const idle = useIdleLogout(logout);

  const layoutStyle: DashboardLayoutStyle = {
    "--sidebar-w": collapsed ? "76px" : "240px",
    "--topbar-h": "76px",
    "--content-pad": "clamp(16px, 2vw, 24px)",
    gridTemplateColumns: "var(--sidebar-w) 1fr",
    gridTemplateRows: "var(--topbar-h) 1fr",
  };

  return (
    <RequireAuth>
      <MustChangePasswordGate>
        <div
          className="min-h-screen bg-[#EEF3F0] text-slate-950 transition-all duration-300 lg:grid"
          style={layoutStyle}
        >
          {/* SIDEBAR DESKTOP */}
          <aside className="hidden lg:sticky lg:top-0 lg:row-[1/3] lg:col-[1/2] lg:block lg:h-screen">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          </aside>

          {/* SIDEBAR MOBILE */}
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                aria-label="Cerrar menú"
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                onClick={() => setMobileSidebarOpen(false)}
              />

              <aside className="relative h-full w-[280px] max-w-[85vw] shadow-2xl shadow-black/40">
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

          {/* TOPBAR */}
          <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 lg:col-[2/3] lg:row-[1/2]">
            <div className="flex h-[var(--topbar-h)] items-center">
              <button
                type="button"
                aria-label="Abrir menú"
                onClick={() => setMobileSidebarOpen(true)}
                className="ml-4 mr-2 grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0 flex-1">
                <Topbar />
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <main className="min-w-0 transition-all duration-300 lg:col-[2/3] lg:row-[2/3]">
            <div className="p-[var(--content-pad)]">
              <div className="mx-auto w-full max-w-[1800px]">{children}</div>
            </div>
          </main>
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