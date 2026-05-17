"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useCan } from "@/hooks/useCan";
import { useRoles } from "../../../features/roles/hooks/useRoles";
import { RolesHeader } from "../../../features/roles/components/RolesHeader";

import { RefreshCw } from "lucide-react";
import { RolesList } from "../../../features/roles/components/RolesTable";
import AccessDenied403Page from "../403/page";

export default function RolesPage() {
  const canView = useCan("roles", "ver");
  const canCreate = useCan("roles", "crear");

  const { roles, loading } = useRoles(canView);

  if (!canView) {
    return <AccessDenied403Page />;
  }

  return (
    <div className="grid gap-6">
      <Card className="border-white/70 bg-white shadow-sm">
        <CardContent className="space-y-6 p-4 md:p-6">
          <RolesHeader canCreate={canCreate} />
          {loading ? (
            <div className="flex text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 mr-4 animate-spin" />Cargando roles...
            </div>
          ) : roles.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No hay roles creados.
            </div>
          ) : (
            <RolesList />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
