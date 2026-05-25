"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Loader2,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { axiosInstance } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DialogFormSection,
  DialogHero,
  DialogHighlightCard,
  DialogMutedNote,
  DialogShell,
} from "@/components/ui/dialog-shell";

export function DeleteUserButton({
  userId,
  onDeleted,
}: {
  userId: string;
  onDeleted?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/users/${userId}`);
      onDeleted?.();
    } catch (e) {
      console.error("Error al eliminar usuario:", e);
      toast.error("No se pudo eliminar el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive" disabled={loading}>
          {loading ? "Eliminando..." : "Eliminar"}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-0 shadow-2xl">
        <DialogShell>
          <AlertDialogHeader className="sr-only">
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Confirmación para eliminar un usuario.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <DialogHero
            icon={<Trash2 className="h-6 w-6 text-white" />}
            title={
              <AlertDialogTitle className="text-xl font-black leading-tight text-white">
                Eliminar usuario
              </AlertDialogTitle>
            }
            description={
              <AlertDialogDescription className="mt-2 text-sm leading-5 text-white/80">
                Vas a desactivar este usuario y quitarlo de los listados activos
                del sistema.
              </AlertDialogDescription>
            }
            className="from-rose-500 via-red-600 to-slate-900"
          />

          <DialogFormSection>
            <DialogHighlightCard
              icon={<AlertTriangle className="h-5 w-5 text-rose-600" />}
              title="¿Querés continuar con la eliminación?"
              description="El usuario dejará de estar disponible para operar en el Prode. Revisá bien antes de confirmar."
              className="border-rose-100 bg-rose-50"
              titleClassName="text-rose-900"
              descriptionClassName="text-rose-700"
            />

            <DialogMutedNote>
              Esta acción impacta solo sobre el usuario seleccionado. Si después
              necesitás restaurarlo, eso requerirá una gestión aparte.
            </DialogMutedNote>
          </DialogFormSection>

          <AlertDialogFooter className="gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:justify-end">
            <AlertDialogCancel
              disabled={loading}
              className="h-11 rounded-xl border-slate-200 px-5 font-bold"
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="h-11 rounded-xl bg-rose-600 px-5 font-black text-white shadow-lg shadow-rose-600/20 hover:bg-rose-700"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Eliminando...
                </span>
              ) : (
                <>
                  <ShieldAlert className="h-4 w-4" />
                  Confirmar eliminación
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </DialogShell>
      </AlertDialogContent>
    </AlertDialog>
  );
}
