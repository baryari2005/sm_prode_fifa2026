"use client";

import { useCan } from "@/hooks/useCan";
import AccessDenied403Page from "../403/page";
import { RolesAdminOverview } from "@/features/roles/components/RolesAdminOverview";

export default function RolesPage() {
  const canView = useCan("roles", "ver");
  const canCreate = useCan("roles", "crear");

  if (!canView) {
    return <AccessDenied403Page />;
  }

  return <RolesAdminOverview canCreate={canCreate} />;
}
