"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, UserPen } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCan } from "@/hooks/useCan";
import AccessDenied403Page from "../../403/page";
import { UserForm } from "@/features/users/components/UserForm";
import { UserFormValues } from "@/features/users/types/types";
import Loading from "../../loading";

type EditUserInitialValues = Partial<UserFormValues> & {
  id?: string;
  rol?: { id: number };
};

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const canEdit = useCan("usuarios", "editar");

  if (!canEdit) {
    return <AccessDenied403Page />;
  }

  return <EditUserContent id={id} />;
}

function EditUserContent({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [initial, setInitial] = useState<EditUserInitialValues | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const t = localStorage.getItem("token");
      const res = await fetch(`/api/users/${id}`, {
        headers: t ? { Authorization: `Bearer ${t}` } : {},
        cache: "no-store",
      });

      const data = await res.json();

      setInitial({
        id,
        userId: data.userId,
        email: data.email,
        nombre: data.nombre ?? "",
        apellido: data.apellido ?? "",
        avatarUrl: data.avatarUrl ?? "",
        rol: data.rol?.id ? { id: data.rol.id } : undefined,
        tipoDocumento: data.tipoDocumento ?? undefined,
        documento: data.documento ?? "",
        cuil: data.cuil ?? "",
        celular: data.celular ?? "",
        domicilio: data.domicilio ?? "",
        localidad: data.localidad ?? "",
        codigoPostal: data.codigoPostal ?? "",
        fechaNacimiento: data.fechaNacimiento ?? null,
        genero: data.genero ?? undefined,
        estadoCivil: data.estadoCivil ?? undefined,
        nacionalidad: data.nacionalidad ?? undefined,
      });

      setLoading(false);
    })();
  }, [id]);

  if (loading || !initial) {
    return <Loading />;
  }

  return (
    <div className="grid gap-6">
      <Card className="border-white/70 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
          <div className="space-y-2">
            <CardTitle className="flex flex-wrap items-center gap-2 text-2xl text-slate-950">
              <UserPen className="h-6 w-6" />
              Editar usuario
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                <Star className="h-3.5 w-3.5" />
                {initial.userId}
              </span>
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Actualizá la información del usuario y conservá la consistencia de sus datos de acceso.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-5 md:p-6">
          <UserForm
            mode="edit"
            defaultValues={initial}
            onSuccess={(uid) => router.replace(`/users/${uid}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
