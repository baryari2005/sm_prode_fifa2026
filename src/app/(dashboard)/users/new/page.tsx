"use client";

import { useRouter } from "next/navigation";
import { Star, UserPlus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  DASHBOARD_PANEL,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import { UserForm } from "@/features/users/components/UserForm";
import { useCan } from "@/hooks/useCan";

import AccessDenied403Page from "../../403/page";

export default function NewUserPage() {
  const router = useRouter();
  const canInsert = useCan("usuarios", "crear");

  if (!canInsert) {
    return <AccessDenied403Page />;
  }

  return (
    <div className="grid gap-6">
      <section className={`${DASHBOARD_PANEL} rounded-[32px] p-4 md:p-5`}>
        <div className={DASHBOARD_TOP_LINE}>
          <div className={DASHBOARD_TOP_LINE_INNER} />
          <div className={DASHBOARD_TOP_LINE_SWEEP} />
          <div className={DASHBOARD_TOP_LINE_GLOW} />
          <div className={DASHBOARD_TOP_LINE_HAIR} />
        </div>

        <div className="relative z-10 space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-[#1E2C46] px-5 py-5 text-white shadow-[0_24px_70px_rgba(2,6,23,0.24)] md:px-6">
            <div className="space-y-3">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FAB438]/28 bg-[#FAB438]/12 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#FFE4A3]">
                Administración de usuarios
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="flex items-center gap-3 text-[2rem] font-bold tracking-[-0.04em] text-white md:text-[2.2rem]">
                  <UserPlus className="h-7 w-7 text-[#AEEBFF]" />
                  Crear usuario
                </h1>

                <Badge className="rounded-full border-white/10 bg-white/10 text-[#AEEBFF] hover:bg-white/10">
                  <Star className="mr-1 h-3.5 w-3.5" />
                  Nuevo registro
                </Badge>
              </div>

              <p className="max-w-[760px] text-sm leading-6 text-white/72">
                Completá la información principal para el registro del nuevo usuario.
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#1E2C46]/88 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.18)] md:p-6">
            <UserForm
              mode="create"
              onSuccess={(id) => router.replace(`/users/${id}`)}
              className={[
                "[&_label]:text-white",
                "[&_label_p]:text-white/58",
                "[&_[data-slot=input]]:border-white/10",
                "[&_[data-slot=input]]:bg-[#425675]/55",
                "[&_[data-slot=input]]:text-white",
                "[&_[data-slot=input]]:placeholder:text-white/35",
                "[&_[data-slot=select-trigger]]:border-white/10",
                "[&_[data-slot=select-trigger]]:bg-[#425675]/55",
                "[&_[data-slot=select-trigger]]:text-white",
                "[&_.user-form-divider]:bg-white/10",
                "[&_.text-red-600]:text-rose-300",
                "[&_button[data-slot=button][type='button']]:border-white/10",
                "[&_button[data-slot=button][type='button']]:bg-[#425675]/55",
                "[&_button[data-slot=button][type='button']]:text-white",
                "[&_button[data-slot=button][type='button']]:hover:bg-[#4D6485]",
              ].join(" ")}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
