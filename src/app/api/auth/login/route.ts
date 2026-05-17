import { NextRequest, NextResponse } from "next/server";
import { UsersRepo } from "@/lib/repos/users";
import { checkPassword } from "@/lib/passwords";
import { signJwt } from "@/lib/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    console.log("[AUTH_LOGIN] Inicio");

    const body = await req.json();
    const { email, userId, password } = body || {};

    console.log("[AUTH_LOGIN] Body recibido", {
      hasEmail: Boolean(email),
      hasUserId: Boolean(userId),
      hasPassword: Boolean(password),
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasDirectUrl: Boolean(process.env.DIRECT_URL),
      hasJwtSecret: Boolean(process.env.JWT_SECRET),
      hasJwtExpires: Boolean(process.env.JWT_EXPIRES),
      nodeEnv: process.env.NODE_ENV,
    });

    if ((!email && !userId) || !password) {
      return NextResponse.json(
        { error: "email o userId y password son requeridos" },
        { status: 400 }
      );
    }

    console.log("[AUTH_LOGIN] Buscando usuario");

    const user = await UsersRepo.findByEmailOrUserId(email, userId);

    console.log("[AUTH_LOGIN] Usuario encontrado", {
      exists: Boolean(user),
      userId: user?.id,
      hasPassword: Boolean(user?.password),
      aprobado: user?.aprobado,
      rol: user?.rol?.nombre,
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    console.log("[AUTH_LOGIN] Validando password");

    const ok = await checkPassword(password, user.password);

    console.log("[AUTH_LOGIN] Password válido", {
      ok,
    });

    if (!ok) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    if (!user.aprobado) {
      return NextResponse.json(
        { error: "Su cuenta está pendiente de aprobación por un administrador." },
        { status: 403 }
      );
    }

    console.log("[AUTH_LOGIN] Firmando JWT");

    const token = await signJwt({
      uid: user.id,
      rid: user.rol?.id,
      rname: user.rol?.nombre,
    });

    console.log("[AUTH_LOGIN] Login exitoso");

    return NextResponse.json({ token });
  } catch (error) {
    console.error("[AUTH_LOGIN_ERROR]", {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasDirectUrl: Boolean(process.env.DIRECT_URL),
      hasJwtSecret: Boolean(process.env.JWT_SECRET),
      hasJwtExpires: Boolean(process.env.JWT_EXPIRES),
      nodeEnv: process.env.NODE_ENV,
    });

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}