"use client";

import { useRouter } from "next/navigation";
import { Flag } from "lucide-react";

import { useCan } from "@/hooks/useCan";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaisForm } from "@/features/paises/components/PaisForm";
import AccessDenied403Page from "../../../403/page";

export default function NuevoPaisPage() {
  const router = useRouter();
  const canCrearPaises = useCan("paises", "crear");

  if (!canCrearPaises) {
    return <AccessDenied403Page />;
  }

  return (
    <div className="grid gap-6">
      <Card className="border-white/70 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 px-5 py-5 md:px-6">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-2xl text-slate-950">
              <Flag className="h-6 w-6" />
              Alta de selección
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Registrá una nueva selección con sus datos básicos, grupo y bandera.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-5 md:p-6">
          <PaisForm
            mode="create"
            onSuccess={() => {
              router.push("/admin/paises");
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
