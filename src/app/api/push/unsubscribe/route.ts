import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "@/lib/server-auth";
import { unsubscribePushSchema } from "@/features/push/schemas/push.schemas";
import { deactivatePushSubscription } from "@/features/push/services/push-subscription.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    const body = await req.json();
    const parsed = unsubscribePushSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Datos invalidos",
          errors: parsed.error.flatten(),
        },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store, max-age=0",
          },
        },
      );
    }

    await deactivatePushSubscription({
      userId: loggedInUser.id,
      endpoint: parsed.data.endpoint,
    });

    return NextResponse.json(
      { ok: true },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "UNAUTHORIZED" },
        {
          status: 401,
          headers: {
            "Cache-Control": "no-store, max-age=0",
          },
        },
      );
    }

    console.error("[PUSH_UNSUBSCRIBE_POST]", error);

    return NextResponse.json(
      { message: "Error interno al desuscribir la notificacion push" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  }
}
