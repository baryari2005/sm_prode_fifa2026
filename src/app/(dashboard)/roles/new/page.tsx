"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { RefreshCw, ShieldCheck, ShieldPlus } from "lucide-react";

import { axiosInstance } from "@/lib/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCan } from "@/hooks/useCan";
import { Switch } from "@/components/ui/switch";
import AccessDenied403Page from "../../403/page";
import { formatMessage } from "@/utils/formatters";
import { Label } from "@/components/ui/label";

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
    <div className="w-full space-y-6">
      <Card className="border-white/70 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-2xl text-slate-950">
              <ShieldCheck className="h-6 w-6" />
              Crear nuevo rol
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Definí el nombre, estado y configuración base del nuevo rol.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-5 md:p-6">
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Nombre</Label>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Supervisor"
                className="h-11 w-full rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Descripción</Label>
              <Input
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción opcional"
                className="h-11 w-full rounded-2xl"
              />
            </div>

            <div className="flex min-h-[76px] items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-4 md:col-span-2">
              <div>
                <p className="text-sm font-semibold text-slate-800">Rol activo</p>
                <p className="text-xs text-slate-500">
                  Si está inactivo no podrá asignarse a usuarios.
                </p>
              </div>

              <Switch checked={activo} onCheckedChange={setActivo} />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">
                {error}
              </div>
            )}

            <div className="flex w-full justify-end gap-3 md:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/roles")}
                disabled={loading}
                className="h-11 min-w-[160px] rounded-2xl"
              >
                Cancelar
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="h-11 min-w-[180px] rounded-2xl bg-[#39A935] text-white shadow-lg shadow-green-700/20 transition hover:bg-[#247A28]"
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
        </CardContent>
      </Card>
    </div>
  );
}
