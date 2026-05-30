"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { RefreshCw, ShieldCheck, ShieldPlus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DASHBOARD_PANEL,
  DASHBOARD_TOP_LINE,
  DASHBOARD_TOP_LINE_GLOW,
  DASHBOARD_TOP_LINE_HAIR,
  DASHBOARD_TOP_LINE_INNER,
  DASHBOARD_TOP_LINE_SWEEP,
} from "@/features/dashboard/components/home/dashboard-home.styles";
import { RoleBasicFields } from "@/features/roles/components/RoleBasicFields";
import { useCan } from "@/hooks/useCan";
import { axiosInstance } from "@/lib/axios";
import { formatMessage } from "@/utils/formatters";

import AccessDenied403Page from "../../403/page";

export default function NewRolePage() {
  const router = useRouter();
  const canCreate = useCan("roles", "crear");

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [activo, setActivo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!canCreate) {
    return <AccessDenied403Page />;
  }

  const handleSubmit = async () => {
    setError(null);

    if (nombre.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axiosInstance.post("/roles", {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || null,
        activo,
      });

      const newRoleId = data.data.id;
      router.push(`/roles/${newRoleId}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError("Ya existe un rol con ese nombre.");
      } else {
        setError("Ocurrió un error al crear el rol.");
      }
    } finally {
      setLoading(false);
    }
  };

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
                Gestión de accesos
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="flex items-center gap-3 text-[2rem] font-bold tracking-[-0.04em] text-white md:text-[2.2rem]">
                  <ShieldCheck className="h-7 w-7 text-[#AEEBFF]" />
                  Crear nuevo rol
                </h1>

                <Badge className="rounded-full border-white/10 bg-white/10 text-[#AEEBFF] hover:bg-white/10">
                  <ShieldPlus className="mr-1 h-3.5 w-3.5" />
                  Nuevo rol
                </Badge>
              </div>

              <p className="max-w-[760px] text-sm leading-6 text-white/72">
                Definí el nombre, estado y configuración base del nuevo rol.
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#1E2C46]/88 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.18)] md:p-6">
            <div className="space-y-6">
              <RoleBasicFields
                nombre={nombre}
                descripcion={descripcion}
                activo={activo}
                onNombreChange={setNombre}
                onDescripcionChange={setDescripcion}
                setActivo={setActivo}
              />

              {error ? (
                <div className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              ) : null}

              <div className="flex w-full justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/roles")}
                  disabled={loading}
                  className="h-11 min-w-[160px] rounded-2xl border border-[#5993B6]/28 bg-[#1E2C46] text-white shadow-[0_12px_28px_rgba(2,6,23,0.16)] transition hover:bg-[#243754] hover:text-[#AEEBFF]"
                >
                  Cancelar
                </Button>

                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="h-11 min-w-[180px] rounded-2xl border border-[#F7CF74] bg-[#FAB438] text-[0.98rem] font-semibold tracking-[0.02em] text-[#1E2C46] shadow-[0_18px_40px_rgba(250,180,56,0.24)] transition hover:bg-[#FFD166] hover:shadow-[0_22px_46px_rgba(250,180,56,0.3)] disabled:border-[#F7CF74]/60 disabled:bg-[#D9A93A] disabled:text-[#1E2C46]/70"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <RefreshCw className="animate-spin" size={18} />
                      {formatMessage("Guardando...")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <ShieldPlus className="h-4 w-4" />
                      Crear rol
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
