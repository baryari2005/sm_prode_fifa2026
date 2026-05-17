import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requirePermission } from "@/lib/server-auth";
import { createUserSchema } from "@/features/users/schemas/user.schema";
import { parseUserListParams } from "@/features/users/lib/user.filters";
import { toUserListItem } from "@/features/users/lib/user.mapper";
import {
  listUsers,
  createOrReviveUser,
  handleUserError,
} from "@/features/users/services/user.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "usuarios", "ver");

    const params = parseUserListParams(req.url);
    const { items, meta } = await listUsers(params);

    return NextResponse.json({
      data: items.map(toUserListItem),
      meta,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debés iniciar sesión." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para ver usuarios." },
        { status: 403 }
      );
    }

    console.error("GET /api/users error:", err);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    requirePermission(loggedInUser, "usuarios", "crear");

    const body = await req.json();
    const dto = createUserSchema.parse(body);

    const result = await createOrReviveUser(dto);

    return NextResponse.json(result, {
      status: result.revived ? 200 : 201,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "No autorizado. Debés iniciar sesión." },
        { status: 401 }
      );
    }

    if (err instanceof Error && err.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "No tenés permisos para crear usuarios." },
        { status: 403 }
      );
    }

    const { message, status } = handleUserError(err);

    return NextResponse.json({ message }, { status });
  }
}