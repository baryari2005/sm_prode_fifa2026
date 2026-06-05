"use client";

import { useCan } from "@/hooks/useCan";
import AccessDenied403Page from "../403/page";
import { UsersAdminOverview } from "@/features/users/components/UsersAdminOverview";

export default function UsersPage() {
  const canView = useCan("usuarios", "ver");
  const canCreate = useCan("usuarios", "crear");
  const canEdit = useCan("usuarios", "editar");
  const canExport = useCan("usuarios", "exportar");

  if (!canView) {
    return <AccessDenied403Page />;
  }

  return (
    <UsersAdminOverview
      canCreate={canCreate}
      canApproveAll={canEdit}
      canExport={canExport}
    />
  );
}
