"use client";

import DashboardLoading from "@/features/dashboard/components/loading/DashboardLoading";
import { useCan } from "@/hooks/useCan";
import { useEditRole } from "../../../../features/roles/hooks/useEditRole";
import { EditRoleForm } from "../../../../features/roles/components/EditRoleForm";
import AccessDenied403Page from "../../403/page";



export default function EditRolePage() {
  const canEdit = useCan("roles", "editar");
  const editRole = useEditRole({ enabled: canEdit });

  if (!canEdit) {
    return <AccessDenied403Page />;
  }

  if (editRole.loading) {
    return <DashboardLoading source="Roles detalle" />;
  }

  return <EditRoleForm {...editRole} />;
}
