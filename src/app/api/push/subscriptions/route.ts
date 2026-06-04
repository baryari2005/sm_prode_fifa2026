import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "@/lib/server-auth";
import { savePushSubscriptionSchema } from "@/features/push/schemas/push.schemas";
import { savePushSubscription } from "@/features/push/services/push-subscription.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const loggedInUser = await requireAuth(req);
    const body = await req.json();
    const parsed = savePushSubscriptionSchema.safeParse(body);

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

    await savePushSubscription({
      userId: loggedInUser.id,
      endpoint: parsed.data.endpoint,
      scope: parsed.data.scope,
      userAgent: parsed.data.userAgent,
      subscription: parsed.data.subscription,
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

    console.error("[PUSH_SUBSCRIPTIONS_POST]", error);

    return NextResponse.json(
      { message: "Error interno al guardar la suscripcion push" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  }
}
