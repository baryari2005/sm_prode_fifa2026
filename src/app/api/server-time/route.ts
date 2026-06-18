import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const ARGENTINA_OFFSET_MINUTES = -180;

export async function GET() {
  const serverDate = new Date();

  return NextResponse.json(
    {
      serverNow: serverDate.toISOString(),
      serverNowMs: serverDate.getTime(),
      serverOffsetMinutes: ARGENTINA_OFFSET_MINUTES,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
