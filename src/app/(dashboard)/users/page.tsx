"use client";


import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useCan } from "@/hooks/useCan";
import AccessDenied403Page from "../403/page";
import { UserList } from "@/features/users/components/UserList";
import { UserHeader } from "@/features/users/components/UserHeader";

export default function UsersPage() {
  const [search] = useState("");
  const canView = useCan("usuarios", "ver");
  const canInsert = useCan("usuarios", "crear");

  if (!canView) {
    return <AccessDenied403Page />;
  }

  return (
    <div className="grid gap-6">
      <Card className="border-white/70 bg-white shadow-sm">
        <CardContent className="space-y-6 p-4 md:p-6">
          <UserHeader cantCreate={!canInsert} />
          <UserList search={search} />
        </CardContent>
      </Card>
    </div>
  );
}
