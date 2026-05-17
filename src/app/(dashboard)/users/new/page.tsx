"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useCan } from "@/hooks/useCan";
import AccessDenied403Page from "../../403/page";
import { UserForm } from "@/features/users/components/UserForm";
import { UserHeader } from "@/features/users/components/UserHeader";

export default function NewUserPage() {
  const router = useRouter();
  const canInsert = useCan("usuarios", "crear");

  if (!canInsert) {
    return <AccessDenied403Page />;
  }

  return (
    <div className="grid gap-6">
      <Card className="border-white/70 bg-white shadow-sm">
        <CardContent className="space-y-6 p-4 md:p-6">
          <UserHeader cantCreate={true} title="Alta de usuario" description="Completá los datos principales para registrar un nuevo usuario en el sistema." />
          <UserForm
            mode="create"
            onSuccess={(id) => router.replace(`/users/${id}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
