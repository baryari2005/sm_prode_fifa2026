"use client";

import Link from "next/link";

import { DashboardChromePreview } from "@/components/brand/dashboard-preview/DashboardChromePreview";
import { DashboardPreviewPanel } from "@/components/brand/dashboard-preview/DashboardPreviewPanel";
import {
  dashboardPreviewContent,
  type DashboardPreviewVariant,
} from "@/components/brand/dashboard-preview/dashboard-preview.data";
import { BrandPageShell } from "@/components/brand/BrandPageShell";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function BrandDashboardMock() {
  return (
    <BrandPageShell backgroundVariant="login" contentClassName="space-y-8 pb-16">
      <section className="rounded-[32px] border border-[#5993B6]/16 bg-white/75 px-5 py-4 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5993B6]">
              Mock visual temporal
            </p>
            <p className="mt-1 text-sm text-[#1E2C46]/72">
              Preview aislada del dashboard con variantes Admin y User. Usa solo datos mockeados.
            </p>
          </div>

          <Link
            href="/brand-preview"
            className="text-sm font-semibold text-[#1E2C46] transition hover:text-[#5993B6]"
          >
            Volver a brand preview
          </Link>
        </div>
      </section>

      <Tabs defaultValue="admin" className="space-y-4">
        <div className="flex flex-col gap-3 rounded-[30px] border border-[#1E2C46]/8 bg-white/78 px-5 py-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5993B6]">
              Dashboard preview
            </p>
            <p className="mt-1 text-sm text-[#1E2C46]/70">
              Dos variantes visuales separadas, respetando el comportamiento actual por rol.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge className="border-[#FAB438]/18 bg-[#FAB438]/12 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#8A5A00]">
              No impacta home real
            </Badge>
            <TabsList className="h-auto rounded-full border-[#1E2C46]/8 bg-[#1E2C46] p-1">
              <TabsTrigger value="admin" className="min-w-[108px]">
                Mock Admin
              </TabsTrigger>
              <TabsTrigger value="user" className="min-w-[108px]">
                Mock User
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {(Object.keys(dashboardPreviewContent) as DashboardPreviewVariant[]).map(
          (variant) => (
            <TabsContent key={variant} value={variant} className="mt-0">
              <div className="space-y-8">
                <DashboardPreviewPanel
                  variant={variant}
                  content={dashboardPreviewContent[variant]}
                />
                <DashboardChromePreview variant={variant} />
              </div>
            </TabsContent>
          ),
        )}
      </Tabs>
    </BrandPageShell>
  );
}
